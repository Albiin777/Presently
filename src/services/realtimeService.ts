/**
 * Real-time Bidirectional Communication Service
 * Supports cross-tab BroadcastChannel, window message dispatching,
 * and persistent local peer synchronization.
 */

export interface RealtimeMessage<T = unknown> {
  type: string;
  senderId: string;
  timestamp: number;
  payload?: T;
}

type MessageHandler = (message: RealtimeMessage) => void;

class RealtimeService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<MessageHandler> = new Set();
  public readonly clientId: string;

  constructor() {
    this.clientId = 'client_' + Math.random().toString(36).substring(2, 9);
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('presently_channel_v1');
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch {
        // Fallback handled via storage
      }

      window.addEventListener('storage', (event) => {
        if (event.key === 'presently_sync_event' && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            if (data && data.senderId !== this.clientId) {
              this.notifyListeners(data);
            }
          } catch {
            // ignore
          }
        }
      });
    }
  }

  public subscribe(handler: MessageHandler): () => void {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }

  public broadcast<T = unknown>(type: string, payload?: T): void {
    const message: RealtimeMessage<T> = {
      type,
      senderId: this.clientId,
      timestamp: Date.now(),
      payload,
    };

    // Notify local listeners
    this.notifyListeners(message);

    // Broadcast across tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch {
        // Channel error fallback
      }
    }

    // Mirror to localStorage for cross-tab notification
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('presently_sync_event', JSON.stringify(message));
      } catch {
        // Storage limit or private mode fallback
      }
    }
  }

  private notifyListeners(message: RealtimeMessage): void {
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error('Error in realtime listener:', err);
      }
    });
  }
}

export const realtimeService = new RealtimeService();
