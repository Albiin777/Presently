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
  private lastPolledId = 0;
  public readonly clientId: string;

  constructor() {
    this.clientId = 'client_' + Math.random().toString(36).substring(2, 9);

    if (typeof window !== 'undefined') {
      // 1. Cross-tab BroadcastChannel
      if ('BroadcastChannel' in window) {
        try {
          this.channel = new BroadcastChannel('presently_channel_v1');
          this.channel.onmessage = (event) => {
            this.notifyListeners(event.data);
          };
        } catch {
          // fallback
        }
      }

      // 2. Storage event fallback
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

      // 3. Network polling across distinct devices on Wi-Fi / Hotspot
      this.startNetworkPolling();
    }
  }

  private startNetworkPolling() {
    const poll = async () => {
      try {
        const res = await fetch(`/api/sync/poll?since=${this.lastPolledId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.messages && Array.isArray(json.messages)) {
            for (const item of json.messages) {
              this.lastPolledId = Math.max(this.lastPolledId, item.id);
              if (item.data && item.data.senderId !== this.clientId) {
                this.notifyListeners(item.data);
              }
            }
          }
          if (json.latestId !== undefined) {
            this.lastPolledId = Math.max(this.lastPolledId, json.latestId);
          }
        }
      } catch {
        // Network unavailable or server restarting
      }
    };

    // Fast polling (every 350ms) for ultra-low latency presentation remote control across Wi-Fi
    setInterval(poll, 350);
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

    // Mirror to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('presently_sync_event', JSON.stringify(message));
      } catch {
        // Storage limit fallback
      }

      // Send across physical network to server endpoint for other physical devices (phone <-> laptop)
      try {
        fetch('/api/sync/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message),
        }).catch(() => {});
      } catch {
        // Network error fallback
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
