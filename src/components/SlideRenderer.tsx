import React from 'react';
import { SlideData } from '../types';

interface SlideRendererProps {
  slide: SlideData;
  isBlackout?: boolean;
  className?: string;
  showSlideNumber?: boolean;
  totalSlides?: number;
  compact?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  isBlackout = false,
  className = '',
  showSlideNumber = false,
  totalSlides = 10,
  compact = false,
}) => {
  return (
    <div
      className={`relative w-full aspect-[16/9] overflow-hidden rounded-lg sm:rounded-xl shadow-inner select-none transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #254b42 0%, #1b3832 50%, #152b27 100%)',
        color: '#f5f8f5',
      }}
    >
      {/* Blackout Overlay */}
      {isBlackout && (
        <div className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 animate-pulse mb-2" />
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            Blackout Active
          </span>
          <span className="text-[10px] text-neutral-500 mt-1">Screen Muted for Speaker</span>
        </div>
      )}

      {/* Slide Visual Background - Mountain/Forest Silhouette Aesthetic from reference */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Distant mountains */}
          <path
            d="M0 240L140 180L280 230L460 140L620 220L750 170L800 200V450H0V240Z"
            fill="#326054"
            opacity="0.5"
          />
          {/* Midground misty ridge */}
          <path
            d="M0 280L180 230L340 300L520 220L680 280L800 240V450H0V280Z"
            fill="#23463e"
            opacity="0.8"
          />
          {/* Foreground pine treeline silhouettes */}
          <path
            d="M0 360 C50 340 100 350 150 330 C220 310 280 340 350 320 C420 300 490 330 560 310 C640 330 720 310 800 330 V450 H0 Z"
            fill="#122521"
          />
          {/* Soft ambient mist glow */}
          <ellipse cx="400" cy="190" rx="360" ry="120" fill="#88bda4" opacity="0.15" />
        </svg>
      </div>

      {/* Slide Content Layout */}
      <div className="relative z-10 w-full h-full p-5 sm:p-7 md:p-8 flex flex-col justify-between">
        {/* Top bar with category / brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#88bda4] px-2.5 py-0.5 rounded-full bg-[#1b3832]/60 border border-[#659287]/40">
              {slide.category}
            </span>
          </div>
          {showSlideNumber && (
            <span className="text-[11px] sm:text-xs font-mono font-medium text-[#b1d3b9]/80">
              {slide.id} / {totalSlides}
            </span>
          )}
        </div>

        {/* Center Content based on graphicType */}
        <div className="my-auto py-1">
          {slide.graphicType === 'hero' && (
            <div className="max-w-xl">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-[1.15]">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#b1d3b9] mt-2 sm:mt-3 font-normal opacity-90">
                  {slide.subtitle}
                </p>
              )}
              {slide.highlightText && !compact && (
                <div className="mt-3 sm:mt-4 inline-block px-3 py-1 rounded bg-[#659287]/20 border border-[#88bda4]/30 text-[11px] sm:text-xs text-[#e6f2dd]">
                  {slide.highlightText}
                </div>
              )}
            </div>
          )}

          {slide.graphicType === 'comparison' && (
            <div>
              <h2 className="font-serif-editorial text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-normal leading-tight">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-xs sm:text-sm text-[#b1d3b9] mt-1 mb-3 opacity-90">
                  {slide.subtitle}
                </p>
              )}
              {slide.bulletPoints && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {slide.bulletPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1b3832]/80 border border-[#659287]/30 rounded-md p-2 text-[10px] sm:text-xs text-neutral-200 flex items-start gap-1.5"
                    >
                      <span className="text-[#88bda4] font-bold">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {slide.graphicType === 'architecture' && (
            <div>
              <h2 className="font-serif-editorial text-xl sm:text-2xl md:text-3xl text-white font-normal">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-xs sm:text-sm text-[#b1d3b9] mt-1 mb-2 opacity-90">
                  {slide.subtitle}
                </p>
              )}
              {/* Architecture visual diagram */}
              <div className="flex items-center justify-around bg-[#122521]/70 border border-[#659287]/40 rounded-lg p-2.5 my-2">
                <div className="flex flex-col items-center text-center">
                  <span className="text-base sm:text-xl">💻</span>
                  <span className="text-[10px] sm:text-xs font-medium text-[#e6f2dd]">Laptop</span>
                  <span className="text-[8px] sm:text-[9px] text-neutral-400">Discoverable</span>
                </div>
                <div className="flex items-center gap-1 text-[#88bda4]">
                  <span className="w-5 sm:w-8 h-[1px] bg-[#88bda4]" />
                  <span className="text-[9px] font-mono">Wi-Fi</span>
                  <span className="w-5 sm:w-8 h-[1px] bg-[#88bda4]" />
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-base sm:text-xl">📱</span>
                  <span className="text-[10px] sm:text-xs font-medium text-[#e6f2dd]">Phone</span>
                  <span className="text-[8px] sm:text-[9px] text-[#88bda4]">Live Remote</span>
                </div>
                <div className="flex items-center gap-1 text-[#88bda4]">
                  <span className="w-5 sm:w-8 h-[1px] bg-[#88bda4]" />
                  <span className="text-[9px] font-mono">HDMI/Air</span>
                  <span className="w-5 sm:w-8 h-[1px] bg-[#88bda4]" />
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-base sm:text-xl">🖥️</span>
                  <span className="text-[10px] sm:text-xs font-medium text-[#e6f2dd]">Projector</span>
                  <span className="text-[8px] sm:text-[9px] text-neutral-400">Audience</span>
                </div>
              </div>
            </div>
          )}

          {slide.graphicType === 'quote' && (
            <div className="max-w-lg">
              <span className="text-2xl sm:text-3xl text-[#88bda4] font-serif">“</span>
              <p className="font-serif-editorial text-lg sm:text-2xl md:text-3xl italic text-white leading-snug">
                {slide.highlightText?.replace(/"/g, '')}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-4 h-[1px] bg-[#88bda4]" />
                <span className="text-xs text-[#b1d3b9]">{slide.title}</span>
              </div>
            </div>
          )}

          {(slide.graphicType === 'stats' || slide.graphicType === 'flow' || slide.graphicType === 'summary') && (
            <div>
              <h2 className="font-serif-editorial text-xl sm:text-2xl md:text-3xl text-white font-normal">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-xs sm:text-sm text-[#b1d3b9] mt-1 mb-2 opacity-90">
                  {slide.subtitle}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {slide.meta?.statValue && (
                  <div className="bg-[#1b3832]/90 border border-[#88bda4]/40 rounded-lg p-2 sm:p-3">
                    <div className="font-serif-editorial text-2xl sm:text-3xl text-[#e6f2dd] font-semibold">
                      {slide.meta.statValue}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-neutral-300 max-w-[140px] leading-tight mt-0.5">
                      {slide.meta.statLabel}
                    </div>
                  </div>
                )}
                {slide.bulletPoints && (
                  <div className="flex-1 min-w-[180px] space-y-1">
                    {slide.bulletPoints.slice(0, 2).map((pt, i) => (
                      <div key={i} className="text-[10px] sm:text-xs text-neutral-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#88bda4]" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] sm:text-[11px] text-neutral-400">
          <span className="font-cursive text-base sm:text-lg text-[#b1d3b9] opacity-90">
            Presently
          </span>
          <span className="tracking-wider uppercase text-[9px] sm:text-[10px] text-neutral-400">
            Build · Present · Create
          </span>
        </div>
      </div>
    </div>
  );
};
