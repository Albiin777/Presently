import { PresentationState, PresentationFile, SlideData } from '../types';
import { DEMO_SLIDES } from '../data/slides';
import { realtimeService } from './realtimeService';
import { generateSlidesForFile } from '../utils/slideGenerator';

export type PresentationChangeListener = (state: PresentationState) => void;

class PresentationService {
  private state: PresentationState = {
    title: 'Presentation',
    file: null,
    currentSlide: 1,
    totalSlides: 1,
    presenting: false,
    blackout: false,
    elapsedSeconds: 0,
    slides: [
      {
        id: 1,
        category: 'Slide 1',
        title: 'Ready to present',
        subtitle: 'Upload a presentation PDF or slide images on your laptop to begin.',
        graphicType: 'hero',
        backgroundColor: '#1b3832',
        textColor: '#ffffff',
        notes: '',
        isRealSlide: true,
      },
    ],
  };

  private listeners: Set<PresentationChangeListener> = new Set();
  private timerInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Restore real presentation from storage if available
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('presently_active_presentation');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.slides && parsed.slides.length > 0) {
            this.state = {
              ...this.state,
              ...parsed,
            };
          }
        }
      } catch {
        // ignore
      }
    }

    realtimeService.subscribe((msg) => {
      if (msg.type === 'SYNC_PRESENTATION_STATE' && msg.payload) {
        const payload = msg.payload as PresentationState;
        this.state = {
          ...this.state,
          ...payload,
        };
        this.notify(false);
      } else if (msg.type === 'LOAD_PRESENTATION') {
        const payload = msg.payload as { file: PresentationFile; slides?: SlideData[] } | PresentationFile;
        if ('file' in payload && payload.file) {
          this.state.file = payload.file;
          this.state.title = payload.file.name;
          if (payload.slides && payload.slides.length > 0) {
            this.state.slides = payload.slides;
            this.state.totalSlides = payload.slides.length;
          }
        } else {
          const file = payload as PresentationFile;
          this.state.file = file;
          this.state.title = file.name;
          if (!file.name.includes('INCINERATE')) {
            this.state.slides = generateSlidesForFile(file.name, file.totalSlides || 20);
            this.state.totalSlides = this.state.slides.length;
          } else {
            this.state.slides = DEMO_SLIDES;
            this.state.totalSlides = DEMO_SLIDES.length;
          }
        }
        this.state.currentSlide = 1;
        this.state.presenting = false;
        this.notify(false);
      } else if (msg.type === 'START_PRESENTING') {
        this.state.presenting = true;
        this.state.blackout = false;
        this.startTimer();
        this.notify(false);
      } else if (msg.type === 'STOP_PRESENTING') {
        this.state.presenting = false;
        this.stopTimer();
        this.notify(false);
      } else if (msg.type === 'SLIDE_CHANGE') {
        const target = Number(msg.payload);
        if (target >= 1 && target <= this.state.totalSlides) {
          this.state.currentSlide = target;
          this.state.blackout = false;
          this.notify(false);
        }
      } else if (msg.type === 'TOGGLE_BLACKOUT') {
        this.state.blackout = !this.state.blackout;
        this.notify(false);
      }
    });
  }

  private startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.state.presenting) {
        this.state.elapsedSeconds += 1;
        this.notify(false);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public getState(): PresentationState {
    return { ...this.state };
  }

  public getCurrentSlide(): SlideData {
    return this.state.slides[this.state.currentSlide - 1] || this.state.slides[0];
  }

  public subscribe(listener: PresentationChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public loadPresentation(name: string, totalSlides = 20, customSlides?: SlideData[]): void {
    const isDemo = name.includes('INCINERATE');
    const actualSlides = customSlides || (isDemo ? DEMO_SLIDES : generateSlidesForFile(name, totalSlides));
    const count = actualSlides.length;

    const file: PresentationFile = {
      name,
      size: '14.2 MB',
      type: name.endsWith('.pdf') ? 'pdf' : 'pptx',
      totalSlides: count,
      loadedAt: Date.now(),
    };

    this.state.file = file;
    this.state.title = name;
    this.state.slides = actualSlides;
    this.state.totalSlides = count;
    this.state.currentSlide = 1;
    this.state.presenting = false;

    // Save to localStorage for instant local tab / pop-up window synchronization
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'presently_active_presentation',
          JSON.stringify({
            title: name,
            file,
            slides: actualSlides,
            totalSlides: count,
            currentSlide: 1,
          })
        );
      } catch {
        // storage quota fallback
      }
    }

    this.notify(true, 'LOAD_PRESENTATION', { file, slides: actualSlides });
    realtimeService.broadcast('SYNC_PRESENTATION_STATE', this.getState());
  }

  public startPresenting(): void {
    this.state.presenting = true;
    this.state.blackout = false;
    this.startTimer();
    this.notify(true, 'START_PRESENTING');
  }

  public stopPresenting(): void {
    this.state.presenting = false;
    this.stopTimer();
    this.notify(true, 'STOP_PRESENTING');
  }

  public nextSlide(): void {
    if (this.state.currentSlide < this.state.totalSlides) {
      this.state.currentSlide += 1;
      this.state.blackout = false;
      this.notify(true, 'SLIDE_CHANGE', this.state.currentSlide);
    }
  }

  public prevSlide(): void {
    if (this.state.currentSlide > 1) {
      this.state.currentSlide -= 1;
      this.state.blackout = false;
      this.notify(true, 'SLIDE_CHANGE', this.state.currentSlide);
    }
  }

  public goToSlide(num: number): void {
    if (num >= 1 && num <= this.state.totalSlides) {
      this.state.currentSlide = num;
      this.state.blackout = false;
      this.notify(true, 'SLIDE_CHANGE', num);
    }
  }

  public toggleBlackout(): void {
    this.state.blackout = !this.state.blackout;
    this.notify(true, 'TOGGLE_BLACKOUT');
  }

  private notify(shouldBroadcast = true, broadcastType?: string, payload?: unknown): void {
    const copy = this.getState();
    this.listeners.forEach((l) => l(copy));
    if (shouldBroadcast && broadcastType) {
      realtimeService.broadcast(broadcastType, payload);
    }
  }
}

export const presentationService = new PresentationService();
