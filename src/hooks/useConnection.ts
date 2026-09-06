import { useState, useEffect } from 'react';
import { connectionService, ConnectionInfo } from '../services/connectionService';
import { Device, ConnectionState } from '../types';

export function useConnection() {
  const [info, setInfo] = useState<ConnectionInfo>(connectionService.getInfo());

  useEffect(() => {
    const unsubscribe = connectionService.subscribe((newInfo) => {
      setInfo(newInfo);
    });
    return unsubscribe;
  }, []);

  return {
    ...info,
    startDiscovery: () => connectionService.startDiscovery(),
    requestConnection: (target: Device) => connectionService.requestConnection(target),
    approveConnection: () => connectionService.approveConnection(),
    declineConnection: () => connectionService.declineConnection(),
    disconnect: () => connectionService.disconnect(),
    reconnect: () => connectionService.reconnect(),
    setConnectionState: (st: ConnectionState) => connectionService.setConnectionState(st),
  };
}
