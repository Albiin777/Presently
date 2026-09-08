import { Device } from '../types';
import { realtimeService } from './realtimeService';

export interface DiscoveryListener {
  (devices: Device[], scanning: boolean): void;
}

class DeviceDiscoveryService {
  private discoveredDevices: Device[] = [];
  private listeners: Set<DiscoveryListener> = new Set();
  private isScanning = false;

  constructor() {
    this.initDefaultDevices();

    // Listen to real-time presence announcements across the local Wi-Fi / hotspot
    realtimeService.subscribe((msg) => {
      if (msg.type === 'ANNOUNCE_HOST' && msg.payload) {
        const hostDevice = msg.payload as Device;
        this.addOrUpdateDevice(hostDevice);
      } else if (msg.type === 'DISCOVER_HOSTS') {
        // If this client is a host, it could announce itself; otherwise ignore
      }
    });
  }

  private initDefaultDevices() {
    // Determine the real host IP or hostname from current browser location
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const isLocalNetwork = currentHost !== 'localhost' && currentHost !== '127.0.0.1';
    
    const hostLaptopName = isLocalNetwork ? "Albin's Laptop" : "Albin's Laptop (Host)";
    const networkHint = isLocalNetwork
      ? `Wi-Fi Host (${currentHost})`
      : 'Local Network / Hotspot';

    this.discoveredDevices = [
      {
        id: 'laptop_host_primary',
        name: hostLaptopName,
        type: 'laptop',
        platform: 'macOS',
        available: true,
        batteryLevel: 96,
        ipHint: networkHint,
      },
    ];
  }

  private addOrUpdateDevice(device: Device) {
    const existingIndex = this.discoveredDevices.findIndex((d) => d.id === device.id || d.name === device.name);
    if (existingIndex >= 0) {
      this.discoveredDevices[existingIndex] = { ...this.discoveredDevices[existingIndex], ...device, available: true };
    } else {
      this.discoveredDevices.push(device);
    }
    this.notify();
  }

  public subscribe(listener: DiscoveryListener): () => void {
    this.listeners.add(listener);
    listener(this.discoveredDevices, this.isScanning);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async scanForDevices(): Promise<Device[]> {
    this.isScanning = true;
    this.notify();

    // Broadcast discovery probe to real active peers on same Wi-Fi / hotspot
    realtimeService.broadcast('DISCOVER_HOSTS', { timestamp: Date.now() });

    // Refresh devices based on current network configuration
    this.initDefaultDevices();

    // Scan delay for smooth UI feedback
    await new Promise((res) => setTimeout(res, 600));
    this.isScanning = false;
    this.notify();
    return this.discoveredDevices;
  }

  public getDevices(): Device[] {
    return this.discoveredDevices;
  }

  public getPrimaryLaptop(): Device {
    return this.discoveredDevices[0];
  }

  private notify() {
    this.listeners.forEach((listener) => {
      listener(this.discoveredDevices, this.isScanning);
    });
  }
}

export const deviceDiscoveryService = new DeviceDiscoveryService();

