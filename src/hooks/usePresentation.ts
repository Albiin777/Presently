import { useState, useEffect } from 'react';
import { presentationService } from '../services/presentationService';
import { PresentationState } from '../types';

export function usePresentation() {
  const [state, setState] = useState<PresentationState>(presentationService.getState());

  useEffect(() => {
    const unsubscribe = presentationService.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    currentSlideData: presentationService.getCurrentSlide(),
    loadPresentation: (name: string, totalSlides?: number) => presentationService.loadPresentation(name, totalSlides),
    startPresenting: () => presentationService.startPresenting(),
    stopPresenting: () => presentationService.stopPresenting(),
    nextSlide: () => presentationService.nextSlide(),
    prevSlide: () => presentationService.prevSlide(),
    goToSlide: (num: number) => presentationService.goToSlide(num),
    toggleBlackout: () => presentationService.toggleBlackout(),
  };
}
