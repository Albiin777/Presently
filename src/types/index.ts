export type DeviceRole = 'laptop' | 'phone';

export interface Device {
  id: string;
  name: string;
  type: 'laptop' | 'phone' | 'tablet';
  available: boolean;
  platform?: 'macOS' | 'Windows' | 'iOS' | 'Android' | 'Display';
  batteryLevel?: number;
  ipHint?: string;
}

export type ConnectionState =
  | 'IDLE'
  | 'DISCOVERING'
  | 'DEVICES_FOUND'
  | 'WAITING_FOR_APPROVAL'
  | 'CONNECTED';

export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  bulletPoints?: string[];
  graphicType?: 'hero' | 'comparison' | 'architecture' | 'stats' | 'quote' | 'flow' | 'summary';
  notes: string;
  highlightText?: string;
  meta?: {
    statValue?: string;
    statLabel?: string;
    author?: string;
  };
}

export interface PresentationFile {
  name: string;
  size: string;
  type: 'pptx' | 'ppt' | 'pdf';
  totalSlides: number;
  loadedAt: number;
}

export interface PresentationState {
  title?: string;
  file: PresentationFile | null;
  currentSlide: number;
  totalSlides: number;
  presenting: boolean;
  blackout: boolean;
  elapsedSeconds: number;
  slides: SlideData[];
}

export interface ExternalDisplayState {
  connected: boolean;
  active: boolean;
  mode: 'presentation' | 'mirrored' | 'extended';
}

export type ViewOrientation = 'auto' | 'portrait' | 'landscape' | 'tablet';
