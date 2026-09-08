import JSZip from 'jszip';
import { SlideData, SlideShape } from '../types';

/**
 * High-Fidelity Parser for PPTX and PDF files.
 * Extracts:
 * 1. Exact Slide count and natural ordering
 * 2. Exact bounding box coordinates for each shape, text box, title, and image
 * 3. Exact font styling, alignments, colors, and bullet points
 * 4. Exact relationships for images per slide (ppt/slides/_rels/slide{N}.xml.rels -> ppt/media/...)
 * 5. Speaker notes from ppt/notesSlides/
 */
export async function parsePptxFile(file: File): Promise<SlideData[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. Find all slide files: ppt/slides/slide1.xml, slide2.xml...
    const slideFileNames: string[] = [];
    zip.forEach((relativePath) => {
      const match = relativePath.match(/^ppt\/slides\/slide(\d+)\.xml$/i);
      if (match) {
        slideFileNames.push(relativePath);
      }
    });

    // Sort naturally by slide number: slide1, slide2, slide10...
    slideFileNames.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });

    if (slideFileNames.length === 0) {
      throw new Error('No slides found inside PPTX');
    }

    // 2. Read slide width & height in EMUs from ppt/presentation.xml (typically 12192000 x 6858000 for 16:9)
    let slideWidthEmu = 12192000;
    let slideHeightEmu = 6858000;
    const presXml = await zip.file('ppt/presentation.xml')?.async('text');
    if (presXml) {
      const sldSzMatch = presXml.match(/<p:sldSz[^>]*cx="(\d+)"[^>]*cy="(\d+)"/i);
      if (sldSzMatch) {
        slideWidthEmu = parseInt(sldSzMatch[1], 10) || slideWidthEmu;
        slideHeightEmu = parseInt(sldSzMatch[2], 10) || slideHeightEmu;
      }
    }

    // 3. Cache media files (ppt/media/...) into data URLs
    const mediaFiles: { [filename: string]: string } = {};
    for (const relativePath of Object.keys(zip.files)) {
      if (relativePath.startsWith('ppt/media/')) {
        try {
          const mediaZip = zip.file(relativePath);
          if (mediaZip) {
            const base64 = await mediaZip.async('base64');
            const ext = relativePath.split('.').pop()?.toLowerCase() || 'png';
            const mime =
              ext === 'jpg' || ext === 'jpeg'
                ? 'image/jpeg'
                : ext === 'svg'
                ? 'image/svg+xml'
                : ext === 'gif'
                ? 'image/gif'
                : 'image/png';
            const fileName = relativePath.split('/').pop() || '';
            mediaFiles[fileName] = `data:${mime};base64,${base64}`;
          }
        } catch {
          // ignore
        }
      }
    }

    const slides: SlideData[] = [];

    for (let index = 0; index < slideFileNames.length; index++) {
      const slidePath = slideFileNames[index];
      const slideNum = index + 1;
      const slideXmlContent = await zip.file(slidePath)?.async('text');

      // Read per-slide relationship mapping: ppt/slides/_rels/slide{N}.xml.rels
      const relsPath = `ppt/slides/_rels/${slidePath.split('/').pop()}.rels`;
      const relsXml = await zip.file(relsPath)?.async('text');
      const rIdToMedia: { [rId: string]: string } = {};

      if (relsXml) {
        const relMatches = relsXml.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/gi);
        for (const match of relMatches) {
          const rId = match[1];
          const target = match[2];
          const targetFileName = target.split('/').pop() || '';
          if (mediaFiles[targetFileName]) {
            rIdToMedia[rId] = mediaFiles[targetFileName];
          }
        }
      }

      // Read speaker notes
      let notes = '';
      const notesPath = `ppt/notesSlides/notesSlide${slideNum}.xml`;
      const notesFile = zip.file(notesPath);
      if (notesFile) {
        try {
          const notesXml = await notesFile.async('text');
          const noteMatches = notesXml.match(/<a:t[^>]*>(.*?)<\/a:t>/gi);
          if (noteMatches) {
            notes = noteMatches
              .map((m) => m.replace(/<\/?[^>]+(>|$)/g, ''))
              .filter((t) => !t.match(/^\d+$/) && t.trim().length > 0)
              .join(' ');
          }
        } catch {
          // ignore
        }
      }

      if (!notes) {
        notes = `Slide ${slideNum} of ${file.name}`;
      }

      if (!slideXmlContent) {
        slides.push({
          id: slideNum,
          category: `Slide ${slideNum}`,
          title: `Slide ${slideNum}`,
          graphicType: 'custom',
          notes,
          backgroundColor: '#ffffff',
          textColor: '#1b3832',
          isRealSlide: true,
        });
        continue;
      }

      // Detect background color
      let slideBg = '#ffffff';
      let slideText = '#1b3832';
      const bgClrMatch = slideXmlContent.match(/<p:bg>.*?<a:srgbClr val="([A-Fa-f0-9]{6})"/i);
      if (bgClrMatch && bgClrMatch[1]) {
        slideBg = `#${bgClrMatch[1]}`;
        slideText = isDarkColor(slideBg) ? '#f8faf8' : '#1b3832';
      }

      // Extract all visual shapes & pictures with exact coordinates
      const shapes: SlideShape[] = [];

      // A) Extract <p:sp> (Text boxes, titles, callouts)
      const spMatches = slideXmlContent.matchAll(/<p:sp\b[\s\S]*?<\/p:sp>/gi);
      for (const sp of spMatches) {
        const spXml = sp[0];

        // Coordinates from <a:off x="..." y="..."/> and <a:ext cx="..." cy="..."/>
        const offMatch = spXml.match(/<a:off[^>]*x="(-?\d+)"[^>]*y="(-?\d+)"/i);
        const extMatch = spXml.match(/<a:ext[^>]*cx="(\d+)"[^>]*cy="(\d+)"/i);

        let xPercent = 10;
        let yPercent = 20;
        let widthPercent = 80;
        let heightPercent = 25;

        if (offMatch && extMatch) {
          const x = parseInt(offMatch[1], 10);
          const y = parseInt(offMatch[2], 10);
          const cx = parseInt(extMatch[1], 10);
          const cy = parseInt(extMatch[2], 10);

          xPercent = Math.max(0, Math.min(100, (x / slideWidthEmu) * 100));
          yPercent = Math.max(0, Math.min(100, (y / slideHeightEmu) * 100));
          widthPercent = Math.max(5, Math.min(100, (cx / slideWidthEmu) * 100));
          heightPercent = Math.max(4, Math.min(100, (cy / slideHeightEmu) * 100));
        }

        // Paragraphs & text runs
        const pXmlMatches = spXml.matchAll(/<a:p\b[\s\S]*?<\/a:p>/gi);
        const paragraphs: {
          text: string;
          isBullet?: boolean;
          fontSize?: number;
          isBold?: boolean;
          color?: string;
          align?: 'left' | 'center' | 'right';
        }[] = [];

        for (const p of pXmlMatches) {
          const paragraphXml = p[0];
          const tMatches = paragraphXml.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/gi);
          if (tMatches) {
            const fullText = tMatches
              .map((t) => t.replace(/<\/?[^>]+(>|$)/g, ''))
              .join('')
              .trim();

            if (fullText.length > 0) {
              const isBold = /<a:rPr[^>]*b="1"/i.test(paragraphXml);
              const szMatch = paragraphXml.match(/<a:rPr[^>]*sz="(\d+)"/i);
              const fontSize = szMatch ? Math.round(parseInt(szMatch[1], 10) / 100) : undefined;

              const clrMatch = paragraphXml.match(/<a:solidFill><a:srgbClr val="([A-Fa-f0-9]{6})"/i);
              const color = clrMatch ? `#${clrMatch[1]}` : undefined;

              const algnMatch = paragraphXml.match(/<a:pPr[^>]*algn="([a-z]+)"/i);
              const align =
                algnMatch?.[1] === 'ctr'
                  ? 'center'
                  : algnMatch?.[1] === 'r'
                  ? 'right'
                  : 'left';

              const isBullet = /<a:buChar|<a:buAutoNum/i.test(paragraphXml);

              paragraphs.push({
                text: fullText,
                isBullet,
                fontSize,
                isBold,
                color,
                align,
              });
            }
          }
        }

        if (paragraphs.length > 0) {
          shapes.push({
            id: `sp_${shapes.length}`,
            type: 'text',
            xPercent,
            yPercent,
            widthPercent,
            heightPercent,
            paragraphs,
          });
        }
      }

      // B) Extract <p:pic> (Images, logos, diagrams)
      const picMatches = slideXmlContent.matchAll(/<p:pic\b[\s\S]*?<\/p:pic>/gi);
      for (const pic of picMatches) {
        const picXml = pic[0];
        const offMatch = picXml.match(/<a:off[^>]*x="(-?\d+)"[^>]*y="(-?\d+)"/i);
        const extMatch = picXml.match(/<a:ext[^>]*cx="(\d+)"[^>]*cy="(\d+)"/i);
        const blipMatch = picXml.match(/<a:blip[^>]*r:embed="([^"]+)"/i);

        if (blipMatch) {
          const rId = blipMatch[1];
          const imgUrl = rIdToMedia[rId];
          if (imgUrl) {
            let xPercent = 65;
            let yPercent = 45;
            let widthPercent = 25;
            let heightPercent = 40;

            if (offMatch && extMatch) {
              const x = parseInt(offMatch[1], 10);
              const y = parseInt(offMatch[2], 10);
              const cx = parseInt(extMatch[1], 10);
              const cy = parseInt(extMatch[2], 10);

              xPercent = Math.max(0, Math.min(100, (x / slideWidthEmu) * 100));
              yPercent = Math.max(0, Math.min(100, (y / slideHeightEmu) * 100));
              widthPercent = Math.max(5, Math.min(100, (cx / slideWidthEmu) * 100));
              heightPercent = Math.max(5, Math.min(100, (cy / slideHeightEmu) * 100));
            }

            shapes.push({
              id: `pic_${shapes.length}`,
              type: 'image',
              xPercent,
              yPercent,
              widthPercent,
              heightPercent,
              imageUrl: imgUrl,
            });
          }
        }
      }

      // Fallback title / content from shapes if needed
      let mainTitle = `Slide ${slideNum}`;
      const textShapes = shapes.filter((s) => s.type === 'text' && s.paragraphs && s.paragraphs.length > 0);
      if (textShapes.length > 0) {
        // Top-most text box is usually the title
        textShapes.sort((a, b) => a.yPercent - b.yPercent);
        mainTitle = textShapes[0].paragraphs?.[0]?.text || mainTitle;
      }

      slides.push({
        id: slideNum,
        category: slideNum === 1 ? 'Title Slide' : `Slide ${slideNum}`,
        title: mainTitle,
        graphicType: 'custom',
        notes,
        backgroundColor: slideBg,
        textColor: slideText,
        isRealSlide: true,
        shapes: shapes.length > 0 ? shapes : undefined,
        meta: {
          sourceFile: file.name,
        },
      });
    }

    return slides;
  } catch (err) {
    console.warn('Direct PPTX extraction error:', err);
    throw err;
  }
}

/**
 * Render a real PDF file page-by-page to high-res slide images using PDF.js
 */
export async function parsePdfFile(file: File): Promise<SlideData[]> {
  const pdfjsLib = (window as any).pdfjsLib || (await import('pdfjs-dist'));
  if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${
      pdfjsLib.version || '3.11.174'
    }/pdf.worker.min.js`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const slides: SlideData[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (context) {
      await page.render({ canvasContext: context, viewport }).promise;
      const imageUrl = canvas.toDataURL('image/png');

      slides.push({
        id: pageNum,
        category: `Page ${pageNum}`,
        title: `Slide ${pageNum}`,
        graphicType: 'image',
        imageUrl,
        notes: `Page ${pageNum} of ${file.name}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        isRealSlide: true,
      });
    }
  }

  return slides;
}

function isDarkColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}
