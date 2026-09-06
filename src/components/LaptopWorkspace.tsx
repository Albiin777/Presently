import React, { useState } from 'react';
import { SlideRenderer } from './SlideRenderer';
import { PresentationState, SlideData, Device } from '../types';
import { ConnectionInfo } from '../services/connectionService';
import {
  Monitor,
  Clock,
  Wifi,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Smartphone,
  Maximize2,
  ChevronRight,
  BookOpen,
  Layers
} from 'lucide-react';

interface LaptopWorkspaceProps {
  presentation: PresentationState;
  currentSlideData: SlideData;
  connectionInfo: ConnectionInfo;
  onNext: () => void;
  onPrev: () => void;
  onGoToSlide: (num: number) => void;
  onToggleBlackout: () => void;
  onApproveConnection: () => void;
  onDeclineConnection: () => void;
  isProjectorActive?: boolean;
  onToggleProjector?: () => void;
  onOpenProjectorWindow?: () => void;
  onOpenPhoneCompanion?: () => void;
  onExitPresentation?: () => void;
}

export const LaptopWorkspace: React.FC<LaptopWorkspaceProps> = ({
  presentation,
  currentSlideData,
  connectionInfo,
  onNext,
  onPrev,
  onGoToSlide,
  onToggleBlackout,
  onApproveConnection,
  onDeclineConnection,
  isProjectorActive = true,
  onToggleProjector,
  onOpenProjectorWindow,
  onOpenPhoneCompanion,
  onExitPresentation,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'research'>('notes');

  const nextSlide = presentation.slides[presentation.currentSlide] || null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-[#1b3832] text-white p-4 sm:p-6 shadow-2xl border-4 border-[#2d554c] overflow-hidden">
      {/* Incoming Connection Approval Modal Overlay */}
      {connectionInfo.pendingApproval && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-[#1b3832] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#b1d3b9] animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#e6f2dd] text-[#1b3832] flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Connection Request</h3>
            <p className="text-sm text-[#2d554c] text-center mt-1">
              <span className="font-semibold">{connectionInfo.phoneDevice?.name || "Your phone"}</span> wants to connect and control this presentation.
            </p>
            <div className="mt-2 p-2.5 rounded-lg bg-[#f5f8f5] text-xs text-[#659287] text-center">
              Verified local peer on same network
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={onDeclineConnection}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium hover:bg-neutral-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-neutral-500" />
                <span>Decline</span>
              </button>
              <button
                onClick={onApproveConnection}
                className="flex-1 py-2.5 rounded-xl bg-[#659287] hover:bg-[#52776e] text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Allow</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Laptop Presenter Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#2d554c] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-2">
              <span>{connectionInfo.targetDevice?.name || "Albin's Laptop"}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#254b42] text-[#b1d3b9] border border-[#659287]/40">
                Presenter Workspace
              </span>
            </h3>
            <p className="text-[11px] text-[#88bda4]">
              {presentation.title} · {presentation.totalSlides} slides
            </p>
          </div>
        </div>

        {/* Status Indicators & Projector Controller */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14231f] border border-[#2d554c] text-[#e6f2dd]">
            <Clock className="w-3.5 h-3.5 text-[#88bda4]" />
            <span className="font-mono font-medium">{formatTime(presentation.elapsedSeconds)}</span>
          </div>

          {/* Phone Sync Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14231f] border border-[#2d554c]">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[#b1d3b9]">
              {connectionInfo.state === 'CONNECTED'
                ? connectionInfo.phoneDevice?.name || 'Phone Connected'
                : 'Waiting for Phone'}
            </span>
            {onOpenPhoneCompanion && (
              <button
                onClick={onOpenPhoneCompanion}
                title="Open Phone Companion view in a separate window to test real-time sync"
                className="ml-1 text-[10px] text-[#88bda4] hover:text-white underline cursor-pointer"
              >
                Open ↗
              </button>
            )}
          </div>

          {/* Projector / External Display Toggle */}
          <button
            onClick={onToggleProjector}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              isProjectorActive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60'
                : 'bg-[#14231f] text-neutral-400 border-[#2d554c]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Projector: {isProjectorActive ? 'Live' : 'Muted'}</span>
          </button>

          {onOpenProjectorWindow && (
            <button
              onClick={onOpenProjectorWindow}
              title="Pop out audience projector view into a separate monitor window"
              className="p-1 rounded-full text-[#88bda4] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {onExitPresentation && (
            <button
              onClick={onExitPresentation}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs transition-colors cursor-pointer border border-white/10"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Main Multi-Pane Presenter Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Slide Thumbnails (2 cols on large) */}
        <div className="hidden md:flex lg:col-span-3 flex-col bg-[#14231f] rounded-xl p-3 border border-[#2d554c] max-h-[460px]">
          <div className="flex items-center justify-between text-xs text-[#88bda4] font-semibold uppercase tracking-wider mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Slides Deck</span>
            </span>
            <span className="font-mono text-[10px] text-neutral-400">
              {presentation.currentSlide} / {presentation.totalSlides}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {presentation.slides.map((s) => (
              <button
                key={s.id}
                onClick={() => onGoToSlide(s.id)}
                className={`w-full text-left p-2 rounded-lg transition-all cursor-pointer flex items-center gap-2.5 ${
                  presentation.currentSlide === s.id
                    ? 'bg-[#659287]/30 border border-[#88bda4] text-white shadow-xs'
                    : 'bg-[#1b3832]/60 hover:bg-[#254b42] border border-transparent text-neutral-300'
                }`}
              >
                <span className="font-mono text-xs font-semibold text-[#88bda4] w-4 text-right">
                  {s.id}
                </span>
                <div className="flex-1 truncate">
                  <p className="text-xs font-medium truncate">{s.title}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{s.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center Column: Live Active Presentation Slide (6 cols on large) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#b1d3b9] mb-1.5">
              <span className="font-medium">Current Slide (Live to Audience)</span>
              <span className="font-mono">
                {presentation.currentSlide} of {presentation.totalSlides}
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#88bda4]/40 shadow-lg relative">
              <SlideRenderer
                slide={currentSlideData}
                isBlackout={presentation.blackout}
                showSlideNumber={true}
                totalSlides={presentation.totalSlides}
              />
            </div>
          </div>

          {/* Quick Presenter Workspace Controls */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2d554c]">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={presentation.currentSlide <= 1}
                className="px-3 py-1.5 text-xs font-medium bg-[#254b42] hover:bg-[#2d554c] rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
              >
                ← Prev Slide
              </button>
              <button
                onClick={onNext}
                disabled={presentation.currentSlide >= presentation.totalSlides}
                className="px-3 py-1.5 text-xs font-semibold bg-[#659287] hover:bg-[#52776e] text-white rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
              >
                Next Slide →
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleBlackout}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  presentation.blackout
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-[#254b42] hover:bg-[#2d554c] text-neutral-200'
                }`}
              >
                {presentation.blackout ? 'Muted (Blackout)' : 'Blackout'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Next Slide Preview & Private Speaker Notes (3 cols on large) */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-[#14231f] rounded-xl p-3.5 border border-[#2d554c]">
          {/* Tab Switcher */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('notes')}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'notes' ? 'text-[#e6f2dd]' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Speaker Notes
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'research' ? 'text-[#e6f2dd]' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Reference Doc
              </button>
            </div>
          </div>

          {/* Tab Content: Speaker Notes */}
          {activeTab === 'notes' ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#88bda4] mb-1">
                  Talking Points:
                </div>
                <p className="text-xs text-[#e6f2dd] leading-relaxed bg-[#1b3832]/60 p-2.5 rounded-lg border border-[#2d554c]">
                  {currentSlideData.notes}
                </p>
              </div>

              {/* Next Slide Preview Box */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
                  <span>Up Next</span>
                  {nextSlide && <span className="font-mono">Slide {nextSlide.id}</span>}
                </div>
                {nextSlide ? (
                  <div className="p-2 rounded-lg bg-[#1b3832] border border-[#2d554c]">
                    <p className="text-xs font-medium text-white truncate">{nextSlide.title}</p>
                    <p className="text-[10px] text-[#88bda4] truncate mt-0.5">
                      {nextSlide.subtitle || nextSlide.category}
                    </p>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-[#1b3832] text-[11px] text-neutral-400 text-center">
                    End of Presentation
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Tab Content: Presenter's Private Reference / PDF workspace */
            <div className="flex-1 flex flex-col justify-between text-xs space-y-2">
              <div className="p-2.5 rounded-lg bg-[#1b3832] border border-[#2d554c]">
                <h4 className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#88bda4]" />
                  <span>Key Metrics Cheatsheet</span>
                </h4>
                <ul className="text-[11px] text-neutral-300 space-y-1 mt-1">
                  <li>• Audience engagement +40% with companion display</li>
                  <li>• Sub-15ms local network sync latency</li>
                  <li>• Zero cloud infrastructure dependency</li>
                </ul>
              </div>
              <p className="text-[10px] text-neutral-400 italic">
                The audience on the projector only sees your clean presentation slides, while you freely browse research or notes here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
