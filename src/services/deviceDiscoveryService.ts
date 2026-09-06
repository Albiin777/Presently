import { Device } from '../types';

export interface DiscoveryListener {
  (devices: Device[], scanning: boolean): void;
}

class DeviceDiscoveryService {
  private discoveredDevices: Device[] = [
    {
      id: 'laptop_albin_pro',
      name: "Albin's Laptop",
      type: 'laptop',
      platform: 'macOS',
      available: true,
      batteryLevel: 94,
      ipHint: 'Same Wi-Fi Network',
    },
    {
      id: 'laptop_conference_air',
      name: 'Studio Display Laptop',
      type: 'laptop',
      platform: 'macOS',
      available: true,
      batteryLevel: 82,
      ipHint: 'Same Wi-Fi Network',
    },
    {
      id: 'laptop_office_pc',
      name: 'Office ThinkPad',
      type: 'laptop',
      platform: 'Windows',
      available: true,
      batteryLevel: 68,
      ipHint: 'Phone Hotspot',
    },
  ];

  private listeners: Set<DiscoveryListener> = new Set();
  private isScanning = false;

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

    // Simulate natural local network mDNS discovery pulse (600ms)
    await new Promise((res) => setTimeout(res, 650));
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
