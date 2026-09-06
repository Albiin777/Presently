import { useState, useEffect } from 'react';
import { ViewOrientation } from '../types';

export function useOrientation(initial: ViewOrientation = 'auto') {
  const [orientation, setOrientation] = useState<ViewOrientation>(initial);
  const [windowAspect, setWindowAspect] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkAspect = () => {
      if (typeof window !== 'undefined') {
        setWindowAspect(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
      }
    };
    checkAspect();
    window.addEventListener('resize', checkAspect);
    return () => window.removeEventListener('resize', checkAspect);
  }, []);

  const effectiveOrientation = orientation === 'auto' ? windowAspect : orientation;

  return {
    orientation,
    setOrientation,
    effectiveOrientation,
    isLandscape: effectiveOrientation === 'landscape',
    isTablet: orientation === 'tablet',
  };
}
