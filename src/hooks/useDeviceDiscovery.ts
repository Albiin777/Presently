import { useState, useEffect } from 'react';
import { deviceDiscoveryService } from '../services/deviceDiscoveryService';
import { Device } from '../types';

export function useDeviceDiscovery() {
  const [devices, setDevices] = useState<Device[]>(deviceDiscoveryService.getDevices());
  const [scanning, setScanning] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = deviceDiscoveryService.subscribe((devs, isScan) => {
      setDevices(devs);
      setScanning(isScan);
    });
    return unsubscribe;
  }, []);

  return {
    devices,
    scanning,
    scanForDevices: () => deviceDiscoveryService.scanForDevices(),
    primaryLaptop: deviceDiscoveryService.getPrimaryLaptop(),
  };
}
