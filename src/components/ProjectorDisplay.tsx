import React, { useState, useEffect, useRef } from 'react';
import { SlideRenderer } from './SlideRenderer';
import { PresentationState, SlideData } from '../types';
import { Monitor, Maximize2, Minimize2, Expand, X } from 'lucide-react';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showFullscreenHint, setShowFullscreenHint] = useState(true);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (active) {
        setShowFullscreenHint(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls and hint when mouse is idle
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    // Initial hide timer
    idleTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
      setShowFullscreenHint(false);
    }, 4000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          setShowFullscreenHint(false);
        })
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  // Keyboard shortcut listener for F or F11
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onDoubleClick={toggleFullscreen}
      className="w-screen h-screen min-h-screen bg-black flex items-center justify-center relative select-none overflow-hidden p-0 m-0"
    >
      {/* Top Audience Indicator & Window Controls - Fades when idle */}
      <div
        className={`fixed top-4 left-6 right-6 flex items-center justify-between z-50 transition-opacity duration-300 pointer-events-auto ${
          showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-white/90 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium">Audience Projector View</span>
          <span className="font-mono text-white/40">•</span>
          <span className="font-mono text-emerald-300">
            Slide {presentation.currentSlide} of {presentation.totalSlides}
          </span>
          {presentation.title && (
            <>
              <span className="font-mono text-white/40">•</span>
              <span className="text-white/70 max-w-xs truncate">{presentation.title}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 text-white/90 hover:text-white border border-white/15 hover:border-emerald-400/50 backdrop-blur-md transition-all cursor-pointer shadow-xl text-xs"
            title="Toggle Fullscreen (Key: F or F11)"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Screen</span>
              </>
            )}
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="p-1.5 rounded-full bg-black/80 text-white/80 hover:text-white border border-white/15 hover:bg-white/10 backdrop-blur-md transition-colors cursor-pointer"
              title="Close Display"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Prominent One-Click Fullscreen Button for Projectors (when not in fullscreen) */}
      {!isFullscreen && showFullscreenHint && (
        <button
          onClick={toggleFullscreen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-700/90 hover:bg-emerald-600 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-emerald-400/40 animate-pulse transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Expand className="w-4 h-4" />
          <span>Click to fill projector screen (16:9 Fullscreen)</span>
        </button>
      )}

      {/* Full-bleed 16:9 Slide Canvas: perfectly scales to 100% of the display window */}
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="w-full h-full max-w-none max-h-none flex items-center justify-center">
          <div className="w-full h-full aspect-[16/9] max-h-[100vh] max-w-[177.78vh] relative">
            <SlideRenderer
              slide={currentSlideData}
              isBlackout={presentation.blackout}
              showSlideNumber={false}
              totalSlides={presentation.totalSlides}
              isProjector={true}
              className="rounded-none sm:rounded-none h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
