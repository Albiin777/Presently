import React from 'react';
import { SlideData } from '../types';

interface SlideRendererProps {
  slide: SlideData;
  isBlackout?: boolean;
  className?: string;
  showSlideNumber?: boolean;
  totalSlides?: number;
  compact?: boolean;
  isProjector?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  isBlackout = false,
  className = '',
  showSlideNumber = false,
  totalSlides = 10,
  compact = false,
  isProjector = false,
}) => {
  const isCustomBg = Boolean(slide.backgroundColor);
  const slideBg = slide.backgroundColor || 'linear-gradient(135deg, #254b42 0%, #1b3832 50%, #152b27 100%)';
  const slideColor = slide.textColor || '#f5f8f5';

  return (
    <div
      className={`relative w-full aspect-[16/9] overflow-hidden ${
        isProjector ? 'rounded-none' : 'rounded-lg sm:rounded-xl'
      } shadow-inner select-none transition-all duration-300 ${className}`}
      style={{
        background: slideBg.includes('gradient') || slideBg.startsWith('#') || slideBg.startsWith('rgb') ? slideBg : `#${slideBg}`,
        color: slideColor,
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

      {/* Render Real PDF/Image Slide if provided (Exact 1:1 slide duplication) */}
      {slide.imageUrl && (
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-contain bg-black/5 z-20 pointer-events-none"
        />
      )}

      {/* Slide Content Layout - Pure Slide Canvas (Only if not displaying pure image) */}
      {!slide.imageUrl && (
        <div className="relative z-10 w-full h-full p-4 sm:p-6 md:p-8 flex flex-col justify-center">
          {/* Center Content based on graphicType */}
          <div className="my-auto py-1 w-full">
          {/* REAL PPT SLIDE: Positioned Shapes Layout */}
          {(slide.graphicType === 'custom' || slide.isRealSlide) && slide.shapes && slide.shapes.length > 0 ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none p-6 sm:p-10">
              {slide.shapes.map((shape) => (
                <div
                  key={shape.id}
                  className="absolute flex flex-col justify-start"
                  style={{
                    left: `${shape.xPercent}%`,
                    top: `${shape.yPercent}%`,
                    width: `${shape.widthPercent}%`,
                    height: `${shape.heightPercent}%`,
                  }}
                >
                  {shape.type === 'image' && shape.imageUrl ? (
                    <img
                      src={shape.imageUrl}
                      alt="PPT element"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center">
                      {shape.paragraphs?.map((p, pIdx) => {
                        const alignClass =
                          p.align === 'center'
                            ? 'text-center'
                            : p.align === 'right'
                            ? 'text-right'
                            : 'text-left';

                        return (
                          <div
                            key={pIdx}
                            className={`leading-snug ${alignClass} ${
                              p.isBold ? 'font-bold' : 'font-normal'
                            } my-0.5`}
                            style={{
                              color: p.color || slide.textColor || '#1b3832',
                              fontSize: p.fontSize
                                ? `clamp(11px, ${p.fontSize * 0.9}px, 3.5vw)`
                                : undefined,
                            }}
                          >
                            {p.isBullet && <span className="mr-1.5 opacity-70">•</span>}
                            <span>{p.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (slide.graphicType === 'custom' || slide.isRealSlide) ? (
            <div className="w-full flex-1 flex flex-col justify-center">
              <h2
                className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-3"
                style={{ color: slide.textColor || 'inherit' }}
              >
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p
                  className="font-sans text-sm sm:text-base md:text-lg mb-4 opacity-80"
                  style={{ color: slide.textColor || 'inherit' }}
                >
                  {slide.subtitle}
                </p>
              )}

              <div className="flex flex-col md:flex-row items-center gap-6 mt-2">
                {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                  <div className="flex-1 space-y-2.5 w-full">
                    {slide.bulletPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs sm:text-sm md:text-base leading-relaxed"
                        style={{ color: slide.textColor || 'inherit' }}
                      >
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span className="opacity-90">{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {slide.imageUrl && (
                  <div className="max-w-xs max-h-56 rounded-xl overflow-hidden shadow-lg border border-black/10 shrink-0">
                    <img src={slide.imageUrl} alt="Slide figure" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {!slide.isRealSlide && slide.graphicType === 'hero' && (
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
        </div>
      )}
    </div>
  );
};
