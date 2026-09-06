import { PresentationState, PresentationFile, SlideData } from '../types';
import { DEMO_SLIDES } from '../data/slides';
import { realtimeService } from './realtimeService';

export type PresentationChangeListener = (state: PresentationState) => void;

class PresentationService {
  private state: PresentationState = {
    file: null,
    currentSlide: 12,
    totalSlides: DEMO_SLIDES.length,
    presenting: false,
    blackout: false,
    elapsedSeconds: 0,
    slides: DEMO_SLIDES,
  };

  private listeners: Set<PresentationChangeListener> = new Set();
  private timerInterval: NodeJS.Timeout | null = null;

  constructor() {
    realtimeService.subscribe((msg) => {
      if (msg.type === 'LOAD_PRESENTATION') {
        const payload = msg.payload as PresentationFile;
        this.state.file = payload;
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

  public loadPresentation(name: string, totalSlides = 28): void {
    const file: PresentationFile = {
      name,
      size: '14.2 MB',
      type: name.endsWith('.pdf') ? 'pdf' : 'pptx',
      totalSlides,
      loadedAt: Date.now(),
    };
    this.state.file = file;
    // Default to slide 12 for the INCINERATE keynote demonstration
    this.state.currentSlide = name.includes('INCINERATE') ? 12 : 1;
    this.state.totalSlides = totalSlides;
    this.notify(true, 'LOAD_PRESENTATION', file);
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
