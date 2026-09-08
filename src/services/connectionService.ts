import { ConnectionState, Device } from '../types';
import { realtimeService } from './realtimeService';
import { presentationService } from './presentationService';

export interface ConnectionInfo {
  state: ConnectionState;
  laptopDevice: Device;
  phoneDevice: Device;
  targetDevice: Device | null;
  pendingApproval: boolean;
  approvalMessage?: string;
  connectedAt?: number;
}

export type ConnectionListener = (info: ConnectionInfo) => void;

class ConnectionService {
  private info: ConnectionInfo = {
    state: 'IDLE',
    laptopDevice: {
      id: 'laptop_albin',
      name: "Albin's Laptop",
      type: 'laptop',
      available: true,
    },
    phoneDevice: {
      id: 'phone_albin',
      name: "Albin's iPhone",
      type: 'phone',
      available: true,
    },
    targetDevice: null,
    pendingApproval: false,
  };

  private listeners: Set<ConnectionListener> = new Set();

  constructor() {
    realtimeService.subscribe((msg) => {
      if (msg.type === 'SYNC_CONNECTION') {
        const payload = msg.payload as ConnectionInfo;
        if (payload) {
          this.info = { ...payload };
          this.notify(false);
        }
      } else if (msg.type === 'REQUEST_PAIR') {
        this.info.state = 'WAITING_FOR_APPROVAL';
        this.info.pendingApproval = true;
        this.info.approvalMessage = `${this.info.phoneDevice.name} wants to connect to this laptop.`;
        this.notify(false);
      } else if (msg.type === 'APPROVE_PAIR') {
        this.info.state = 'CONNECTED';
        this.info.pendingApproval = false;
        this.info.connectedAt = Date.now();
        this.notify(false);
      } else if (msg.type === 'DECLINE_PAIR' || msg.type === 'DISCONNECT') {
        this.info.state = 'IDLE';
        this.info.pendingApproval = false;
        this.notify(false);
      }
    });
  }

  public getInfo(): ConnectionInfo {
    return { ...this.info };
  }

  public subscribe(listener: ConnectionListener): () => void {
    this.listeners.add(listener);
    listener(this.getInfo());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public startDiscovery(): void {
    this.info.state = 'DISCOVERING';
    this.info.pendingApproval = false;
    this.notify(true, 'SYNC_CONNECTION', this.info);

    setTimeout(() => {
      this.info.state = 'DEVICES_FOUND';
      this.notify(true, 'SYNC_CONNECTION', this.info);
    }, 600);
  }

  public requestConnection(target: Device): void {
    this.info.targetDevice = target;
    this.info.state = 'WAITING_FOR_APPROVAL';
    this.info.pendingApproval = true;
    this.info.approvalMessage = `${this.info.phoneDevice.name} wants to connect to this laptop.`;
    this.notify(true, 'REQUEST_PAIR', { target, phone: this.info.phoneDevice });
  }

  public approveConnection(): void {
    this.info.state = 'CONNECTED';
    this.info.pendingApproval = false;
    this.info.connectedAt = Date.now();
    this.notify(true, 'APPROVE_PAIR', { state: 'CONNECTED' });
    this.notify(true, 'SYNC_CONNECTION', this.info);
    
    // Broadcast active presentation snapshot so phone syncs to the real loaded presentation immediately
    const presState = presentationService.getState();
    realtimeService.broadcast('SYNC_PRESENTATION_STATE', presState);
  }

  public declineConnection(): void {
    this.info.state = 'IDLE';
    this.info.pendingApproval = false;
    this.notify(true, 'DECLINE_PAIR');
  }

  public disconnect(): void {
    this.info.state = 'IDLE';
    this.info.pendingApproval = false;
    this.notify(true, 'DISCONNECT');
  }

  public reconnect(): void {
    this.startDiscovery();
  }

  public setConnectionState(newState: ConnectionState): void {
    this.info.state = newState;
    this.notify(true, 'SYNC_CONNECTION', this.info);
  }

  private notify(shouldBroadcast = true, broadcastType?: string, payload?: unknown): void {
    const copy = this.getInfo();
    this.listeners.forEach((l) => l(copy));
    if (shouldBroadcast && broadcastType) {
      realtimeService.broadcast(broadcastType, payload ?? copy);
    }
  }
}

export const connectionService = new ConnectionService();
