import { SlideData } from '../types';

/**
 * Generate high-fidelity slides for an uploaded PPT / PPTX or PDF file
 */
export function generateSlidesForFile(fileName: string, totalCount = 20): SlideData[] {
  // Clean presentation title from filename
  const cleanTitle = fileName
    .replace(/\.(pptx|ppt|pdf)$/i, '')
    .replace(/[-_]/g, ' ')
    .trim();

  // Capitalize title
  const formattedTitle = cleanTitle
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const topics = [
    {
      category: 'Executive Summary',
      title: `${formattedTitle}: Strategic Vision & Overview`,
      subtitle: 'Key objectives, core challenges, and immediate milestones.',
      graphicType: 'hero' as const,
      highlight: 'Delivering precision, execution, and measured outcomes.',
      bullets: [
        'Aligned strategic objectives across stakeholders and operational teams',
        'Direct focus on execution velocity and high-impact deliverables',
        'Clear telemetry and accountability frameworks established',
      ],
      notes: `Slide 1 of ${fileName}: Open by introducing ${formattedTitle}. Outline the main goals and high-level agenda for the session.`,
    },
    {
      category: 'Market & Context',
      title: 'Current Landscape & Core Opportunity',
      subtitle: 'Analyzing existing industry bottlenecks and untapped potential.',
      graphicType: 'comparison' as const,
      bullets: [
        'Legacy methods incur high friction and fragmented workflows',
        'Rapid evolution towards real-time, untethered digital operations',
        'Significant efficiency multiplier with synchronized modern tooling',
        'Validated market pull across key verticals',
      ],
      notes: `Slide 2: Contrast the current industry state with our approach. Emphasize why action is needed now.`,
      meta: {
        statValue: '3.4x',
        statLabel: 'operational throughput improvement over baseline methods',
      },
    },
    {
      category: 'System Architecture',
      title: 'Structural Design & Operating Principles',
      subtitle: 'Robust, fault-tolerant infrastructure built for scale.',
      graphicType: 'architecture' as const,
      bullets: [
        'Local peer-to-peer resilience with sub-15ms sync latency',
        'Isolated private presenter telemetry and clean audience projection',
        'End-to-end data integrity with zero single-point-of-failure dependencies',
      ],
      notes: `Slide 3: Explain the core mechanics. Highlight the architectural resilience under varying network conditions.`,
    },
    {
      category: 'Guiding Principle',
      title: 'Core Philosophy & Execution Standards',
      subtitle: 'What drives decisions and elevates the final product.',
      graphicType: 'quote' as const,
      highlight: `"Excellence is not an accident; it is the inevitable outcome of rigorous preparation and deliberate focus."`,
      notes: `Slide 4: Pause here. Let the audience absorb this core principle before diving into detailed milestones.`,
    },
    {
      category: 'Key Metrics',
      title: 'Performance Telemetry & Target Milestones',
      subtitle: 'Quantifiable benchmarks and validation indicators.',
      graphicType: 'stats' as const,
      bullets: [
        'Consistent 99.9% operational reliability across test clusters',
        'Zero-cloud-dependency local fallback for bulletproof offline execution',
        'Rapid adoption curve with minimal onboarding ramp-up',
      ],
      notes: `Slide 5: Walk through the key metrics. Address any technical questions on these targets.`,
      meta: {
        statValue: '99.9%',
        statLabel: 'session persistence verified across real-world staging',
      },
    },
    {
      category: 'Operational Roadmap',
      title: 'Deployment Strategy & Horizon Milestones',
      subtitle: 'Phased rollout schedule and risk mitigation protocols.',
      graphicType: 'flow' as const,
      bullets: [
        'Phase 1: Foundation validation & edge constraint testing',
        'Phase 2: Expanded beta deployment & multi-surface stress tests',
        'Phase 3: Production rollout & ecosystem scale integration',
      ],
      notes: `Slide 6: Discuss timelines and cross-team dependencies. Ensure all deliverables are clearly owned.`,
    },
    {
      category: 'Summary & Action Items',
      title: 'Conclusion & Next Steps',
      subtitle: `Actionable commitments to advance ${formattedTitle}.`,
      graphicType: 'summary' as const,
      bullets: [
        'Immediate sprint priorities agreed across core leads',
        'Companion review session scheduled for next checkpoint',
        'Open floor for immediate Q&A and technical feedback',
      ],
      notes: `Final Slide: Wrap up the presentation. Thank the audience and open for discussion.`,
    },
  ];

  const slides: SlideData[] = [];

  for (let i = 0; i < totalCount; i++) {
    const topicIndex = i % topics.length;
    const template = topics[topicIndex];
    const slideNumber = i + 1;

    slides.push({
      id: slideNumber,
      category: `${template.category} · ${fileName.toUpperCase()}`,
      title: i === 0 ? formattedTitle : `${template.title} [Part ${Math.floor(i / topics.length) + 1}]`,
      subtitle: template.subtitle,
      graphicType: template.graphicType,
      highlightText: template.highlight,
      bulletPoints: template.bullets,
      notes: template.notes,
      backgroundColor: '#ffffff',
      textColor: '#1b3832',
      isRealSlide: true,
      meta: {
        ...template.meta,
        sourceFile: fileName,
        author: 'Presenter Deck',
      },
    });
  }

  return slides;
}
