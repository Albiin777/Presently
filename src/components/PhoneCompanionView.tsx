import React, { useRef, useState } from 'react';
import { SlideRenderer } from './SlideRenderer';
import { PresentationState, SlideData, Device, ConnectionState } from '../types';
import { deviceDiscoveryService } from '../services/deviceDiscoveryService';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  EyeOff,
  LogOut,
  Laptop,
  CheckCircle2,
  Loader2,
  RotateCw,
  ExternalLink
} from 'lucide-react';

interface PhoneCompanionViewProps {
  connectionState: ConnectionState;
  targetDevice: Device | null;
  discoveredDevices: Device[];
  presentation: PresentationState;
  currentSlideData: SlideData;
  isLandscape: boolean;
  onBack?: () => void;
  onRequestConnect: (dev: Device) => void;
  onDeclineRequest: () => void;
  onDisconnect: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleBlackout: () => void;
  onTogglePresenting: () => void;
  onGoToSlide?: (num: number) => void;
}

export const PhoneCompanionView: React.FC<PhoneCompanionViewProps> = ({
  connectionState,
  targetDevice,
  discoveredDevices,
  presentation,
  currentSlideData,
  isLandscape: initialLandscape,
  onBack,
  onRequestConnect,
  onDeclineRequest,
  onDisconnect,
  onNext,
  onPrev,
  onToggleBlackout,
  onTogglePresenting,
}) => {
  // Allow manual rotation simulation in demo mode alongside viewport orientation
  const [manualRotation, setManualRotation] = useState<boolean | null>(null);
  const touchStartX = useRef<number | null>(null);

  const effectiveLandscape = manualRotation !== null ? manualRotation : initialLandscape;

  // Touch Swipe Gesture for slides
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 45) {
      onNext();
    } else if (diffX < -45) {
      onPrev();
    }
    touchStartX.current = null;
  };

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      onNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onPrev();
    } else if (e.key.toLowerCase() === 'b') {
      e.preventDefault();
      onToggleBlackout();
    }
  };

  const laptopName = targetDevice?.name || "Albin's Laptop";

  return (
    <div
      className="min-h-screen min-h-[100dvh] h-[100dvh] w-full bg-[#111e1a] text-white flex flex-col justify-between select-none overflow-x-hidden font-sans pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* ========================================================= */}
      {/* 1. STATE: NOT CONNECTED YET (NEARBY LAPTOPS DISCOVERY)    */}
      {/* ========================================================= */}
      {connectionState !== 'CONNECTED' && (
        <div className="flex-1 max-w-md w-full mx-auto px-5 pt-4 sm:pt-6 pb-8 flex flex-col justify-start relative">
          {/* Top Bar: Back to Overview & Network Scan Pill */}
          <div className="w-full flex items-center justify-between pb-4 pt-1">
            {onBack ? (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1b3832] hover:bg-[#23463e] border border-[#2d554c] text-xs text-[#88bda4] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162723] border border-[#2d554c] text-[11px] text-[#88bda4]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Same Wi-Fi / Hotspot</span>
            </div>
          </div>

          {/* Editorial Brand Header - Clean, Left-Aligned Elegance */}
          <div className="pt-2 pb-6 border-b border-[#2d554c]/50 mb-5">
            <h1 className="font-cursive text-3xl sm:text-4xl text-[#b1d3b9] font-bold tracking-tight">
              Presently
            </h1>
            <p className="text-xs text-[#88bda4] mt-0.5 font-medium">
              Phone Companion Remote
            </p>
          </div>

          {/* Body Content based on Discovery / Approval */}
          <div className="flex flex-col">
            {connectionState === 'WAITING_FOR_APPROVAL' ? (
              <div className="p-6 rounded-3xl bg-[#1b3832] border border-[#659287]/50 text-center shadow-xl animate-in fade-in zoom-in-95 my-auto">
                <Loader2 className="w-10 h-10 animate-spin text-[#88bda4] mx-auto mb-4" />
                <h3 className="font-serif-editorial text-2xl text-white">
                  Waiting for approval
                </h3>
                <p className="text-xs text-[#b1d3b9] mt-2 leading-relaxed max-w-xs mx-auto">
                  Approve the connection request on <strong>{laptopName}</strong> to proceed.
                </p>
                <button
                  onClick={onDeclineRequest}
                  className="mt-6 px-5 py-2.5 rounded-full border border-white/20 text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel request
                </button>
              </div>
            ) : (
              /* Nearby Laptops List */
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-end justify-between px-1">
                  <div>
                    <h2 className="font-serif-editorial text-2xl sm:text-3xl text-white">
                      Nearby laptops
                    </h2>
                    <p className="text-xs text-[#88bda4] mt-1">
                      Choose a laptop to connect.
                    </p>
                  </div>
                  <button
                    onClick={() => deviceDiscoveryService.scanForDevices()}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#88bda4] hover:text-white transition-colors cursor-pointer p-1"
                    title="Rescan local network"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Scan</span>
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {discoveredDevices.map((dev) => (
                    <div
                      key={dev.id}
                      className="p-4 rounded-2xl bg-[#1b3832] border border-[#2d554c] hover:border-[#659287] transition-all flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#23463e] text-[#b1d3b9] flex items-center justify-center shrink-0">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{dev.name}</h4>
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span>{dev.ipHint || 'Ready to connect'}</span>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRequestConnect(dev)}
                        className="px-5 py-2.5 rounded-full bg-[#3d5f57] hover:bg-[#2c4740] active:scale-95 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <span>Connect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. STATE: CONNECTED (THE FOCUSED PRESENTATION COMPANION)   */}
      {/* ========================================================= */}
      {connectionState === 'CONNECTED' && (
        <div className="flex-1 flex flex-col justify-between w-full h-full p-3 sm:p-4 max-w-5xl mx-auto">
          {/* ----------------------------------------------------- */}
          {/* PORTRAIT LAYOUT: Slide + controls vertically arranged  */}
          {/* ----------------------------------------------------- */}
          {!effectiveLandscape ? (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-2">
              {/* TOP HEADER: Clean Brand & Connected Status */}
              <div className="text-center pt-1 pb-2">
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="w-8" />
                  <h1 className="font-cursive text-3xl sm:text-4xl text-[#b1d3b9] font-bold tracking-tight">
                    Presently
                  </h1>
                  {/* Rotation simulation toggle */}
                  <button
                    onClick={() => setManualRotation(true)}
                    title="Rotate phone to landscape"
                    className="p-1.5 rounded-full text-[#88bda4] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="inline-flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-xs text-[#88bda4]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Connected to</span>
                  </div>
                  <span className="text-sm font-semibold text-white mt-0.5">
                    {laptopName}
                  </span>
                  {presentation.title && (
                    <span className="text-[11px] text-[#b1d3b9] bg-[#162a24] px-2.5 py-0.5 rounded-full mt-1 border border-[#2d554c] max-w-[220px] truncate">
                      {presentation.title}
                    </span>
                  )}
                </div>
              </div>

              {/* [ LIVE SLIDE ]: OCCUPIES MOST OF THE SCREEN */}
              <div className="flex-1 flex flex-col justify-center my-auto py-2">
                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#659287]/50 relative bg-black transition-all">
                  <SlideRenderer
                    slide={currentSlideData}
                    isBlackout={presentation.blackout}
                    showSlideNumber={false}
                    compact={false}
                  />
                </div>
              </div>

              {/* SLIDE COUNTER: 12 / 28 */}
              <div className="text-center py-2">
                <span className="font-mono text-lg sm:text-xl font-bold text-[#e6f2dd] tracking-wider">
                  {presentation.currentSlide} / {presentation.totalSlides}
                </span>
              </div>

              {/* NAVIGATION CONTROLS: Tactile Previous & Next */}
              <div className="pt-1 pb-3">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={onPrev}
                    disabled={presentation.currentSlide <= 1}
                    className={`flex-1 h-14 sm:h-16 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all cursor-pointer select-none active:scale-95 ${
                      presentation.currentSlide <= 1
                        ? 'bg-white/5 text-neutral-600 opacity-30 cursor-not-allowed'
                        : 'bg-[#1b3832] text-[#e6f2dd] hover:bg-[#23463e] border border-[#659287]/50 shadow-md'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={onNext}
                    disabled={presentation.currentSlide >= presentation.totalSlides}
                    className={`flex-1 h-14 sm:h-16 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer select-none active:scale-95 ${
                      presentation.currentSlide >= presentation.totalSlides
                        ? 'bg-white/5 text-neutral-600 opacity-30 cursor-not-allowed'
                        : 'bg-[#3d5f57] hover:bg-[#2c4740] text-white shadow-lg border border-[#88bda4]/50'
                    }`}
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* UTILITY ROW: Start, Blackout, Exit */}
              <div className="flex items-center justify-around pt-2 px-2 border-t border-white/10 text-xs">
                <button
                  onClick={onTogglePresenting}
                  className="flex items-center gap-1.5 text-neutral-300 hover:text-white py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {presentation.presenting ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-[#88bda4]" />
                      <span>Start</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-[#88bda4]" />
                      <span>Start</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onToggleBlackout}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer transition-colors ${
                    presentation.blackout
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Blackout</span>
                </button>

                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-rose-400 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            </div>
          ) : (
            /* ----------------------------------------------------- */
            /* LANDSCAPE LAYOUT: Slide becomes MUCH larger, controls beside/below */
            /* Preserves 16:9 slide aspect ratio                     */
            /* ----------------------------------------------------- */
            <div className="flex-1 flex flex-col justify-between py-1 px-2 h-full">
              {/* Landscape Header */}
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <h1 className="font-cursive text-2xl text-[#b1d3b9] font-bold tracking-tight">
                    Presently
                  </h1>
                  <span className="text-white/20">•</span>
                  <div className="flex items-center gap-1 text-xs text-[#88bda4]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Connected to <strong>{laptopName}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#e6f2dd]">
                    {presentation.currentSlide} / {presentation.totalSlides}
                  </span>
                  <button
                    onClick={() => setManualRotation(false)}
                    title="Rotate phone to portrait"
                    className="p-1.5 rounded-full text-[#88bda4] hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Portrait</span>
                  </button>
                </div>
              </div>

              {/* Main Landscape Presentation Area: Large 16:9 Slide with Ergonomic Side Controls */}
              <div className="flex-1 flex items-center justify-center gap-4 py-2 overflow-hidden">
                {/* Previous Touch Zone on the Left */}
                <button
                  onClick={onPrev}
                  disabled={presentation.currentSlide <= 1}
                  className={`w-20 sm:w-24 h-full max-h-[340px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                    presentation.currentSlide <= 1
                      ? 'bg-white/5 text-neutral-600 opacity-30 cursor-not-allowed'
                      : 'bg-[#1b3832] text-[#e6f2dd] hover:bg-[#23463e] border border-[#659287]/50 shadow-md'
                  }`}
                >
                  <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Previous</span>
                </button>

                {/* EXPANDED 16:9 SLIDE IN LANDSCAPE */}
                <div className="flex-1 max-w-[850px] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#659287]/60 relative bg-black flex items-center justify-center">
                  <SlideRenderer
                    slide={currentSlideData}
                    isBlackout={presentation.blackout}
                    showSlideNumber={false}
                    compact={false}
                  />
                </div>

                {/* Next Touch Zone on the Right */}
                <button
                  onClick={onNext}
                  disabled={presentation.currentSlide >= presentation.totalSlides}
                  className={`w-24 sm:w-28 h-full max-h-[340px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                    presentation.currentSlide >= presentation.totalSlides
                      ? 'bg-white/5 text-neutral-600 opacity-30 cursor-not-allowed'
                      : 'bg-[#3d5f57] hover:bg-[#2c4740] text-white shadow-lg border border-[#88bda4]/60'
                  }`}
                >
                  <ArrowRight className="w-7 h-7 sm:w-9 sm:h-9" />
                  <span className="text-xs uppercase tracking-wider font-bold">Next</span>
                </button>
              </div>

              {/* Landscape Bottom Utilities */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs px-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onTogglePresenting}
                    className="flex items-center gap-1.5 text-neutral-300 hover:text-white py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#88bda4]" />
                    <span>{presentation.presenting ? 'Pause' : 'Start'}</span>
                  </button>

                  <button
                    onClick={onToggleBlackout}
                    className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg cursor-pointer transition-colors ${
                      presentation.blackout
                        ? 'bg-amber-500 text-black font-semibold'
                        : 'text-neutral-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Blackout</span>
                  </button>
                </div>

                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-rose-400 py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
