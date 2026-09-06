import { useState, useEffect } from 'react';
import { displayService } from '../services/displayService';
import { ExternalDisplayState } from '../types';

export function useDisplay() {
  const [displayState, setDisplayState] = useState<ExternalDisplayState>(displayService.getState());

  useEffect(() => {
    const unsubscribe = displayService.subscribe((newState) => {
      setDisplayState(newState);
    });
    return unsubscribe;
  }, []);

  return {
    ...displayState,
    toggleProjector: () => displayService.toggleProjector(),
    setMode: (mode: 'presentation' | 'mirrored' | 'extended') => displayService.setMode(mode),
    openExternalProjectorWindow: () => displayService.openExternalProjectorWindow(),
  };
}
