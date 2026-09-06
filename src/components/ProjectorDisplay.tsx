import React from 'react';
import { SlideRenderer } from './SlideRenderer';
import { PresentationState, SlideData } from '../types';
import { Monitor, Maximize2, Minimize2 } from 'lucide-react';

interface ProjectorDisplayProps {
  presentation: PresentationState;
  currentSlideData: SlideData;
  onExit?: () => void;
  isPopout?: boolean;
}

export const ProjectorDisplay: React.FC<ProjectorDisplayProps> = ({
  presentation,
  currentSlideData,
  onExit,
  isPopout = false,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative p-2 sm:p-6 select-none overflow-hidden">
      {/* Top Subtle Audience Indicator Bar */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-40 opacity-30 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 text-xs text-white/70 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audience Projector View</span>
          <span className="font-mono text-white/50">•</span>
          <span className="font-mono">
            Slide {presentation.currentSlide} of {presentation.totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full bg-black/60 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="text-xs px-3 py-1 rounded-full bg-black/60 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              Close Display
            </button>
          )}
        </div>
      </div>

      {/* Main High-Fidelity Slide Canvas */}
      <div className="w-full max-w-6xl aspect-[16/9] shadow-2xl relative">
        <SlideRenderer
          slide={currentSlideData}
          isBlackout={presentation.blackout}
          showSlideNumber={false}
          totalSlides={presentation.totalSlides}
        />
      </div>
    </div>
  );
};
