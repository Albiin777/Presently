import { ExternalDisplayState } from '../types';
import { realtimeService } from './realtimeService';

export type DisplayChangeListener = (state: ExternalDisplayState) => void;

class DisplayService {
  private state: ExternalDisplayState = {
    connected: true,
    active: true,
    mode: 'presentation',
  };

  private listeners: Set<DisplayChangeListener> = new Set();
  private projectorWindow: Window | null = null;

  constructor() {
    realtimeService.subscribe((msg) => {
      if (msg.type === 'DISPLAY_STATE_UPDATE') {
        const payload = msg.payload as ExternalDisplayState;
        if (payload) {
          this.state = { ...payload };
          this.notify(false);
        }
      }
    });
  }

  public getState(): ExternalDisplayState {
    return { ...this.state };
  }

  public subscribe(listener: DisplayChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public toggleProjector(): void {
    this.state.active = !this.state.active;
    this.notify(true);
  }

  public setMode(mode: 'presentation' | 'mirrored' | 'extended'): void {
    this.state.mode = mode;
    this.notify(true);
  }

  public openExternalProjectorWindow(): void {
    if (typeof window !== 'undefined') {
      try {
        const url = `${window.location.origin}${window.location.pathname}?mode=projector`;
        this.projectorWindow = window.open(
          url,
          'Presently_Projector_Output',
          'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
        );
        this.state.active = true;
        this.notify(true);
      } catch {
        // Fallback handled in current UI
      }
    }
  }

  private notify(broadcast = true): void {
    const copy = this.getState();
    this.listeners.forEach((l) => l(copy));
    if (broadcast) {
      realtimeService.broadcast('DISPLAY_STATE_UPDATE', copy);
    }
  }
}

export const displayService = new DisplayService();
