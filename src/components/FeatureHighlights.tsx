import React from 'react';
import { Monitor, Smartphone, Laptop, CheckCircle2, RotateCw } from 'lucide-react';
import { PresenterModeSection } from './PresenterModeSection';

interface FeatureHighlightsProps {
  onStartConnecting: () => void;
}

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({ onStartConnecting }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* ========================================================= */}
      {/* 1. HOW IT WORKS: Continuous 4-Step Journey (Not 4 generic cards!) */}
      {/* ========================================================= */}
      <section id="how-it-works" className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#659287]">
            The Journey
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl text-[#1b3832] mt-2 font-normal">
            How Presently works.
          </h2>
          <p className="text-sm sm:text-base text-[#2d554c] mt-3">
            A seamless bridge between two physical devices on the same Wi-Fi.
          </p>
        </div>

        {/* Continuous Horizontal Journey Flow */}
        <div className="relative">
          {/* Subtle connecting track line behind steps */}
          <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-[1.5px] bg-[#b1d3b9]/60 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 01: CONNECT */}
            <div className="flex flex-col items-start bg-white/70 backdrop-blur-xs p-6 rounded-2xl border border-[#b1d3b9]/50 shadow-xs relative">
              <span className="font-serif-editorial text-3xl font-light text-[#547f74] mb-3">
                01
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#659287]">
                Connect
              </span>
              <h3 className="text-base font-semibold text-[#1b3832] mt-1 mb-2">
                Open on Laptop & Phone
              </h3>
              <p className="text-xs text-[#2d554c] leading-relaxed">
                Open Presently on your laptop and your phone. Both devices stay on the same Wi-Fi or phone hotspot.
              </p>
            </div>

            {/* Step 02: PAIR */}
            <div className="flex flex-col items-start bg-white/70 backdrop-blur-xs p-6 rounded-2xl border border-[#b1d3b9]/50 shadow-xs relative">
              <span className="font-serif-editorial text-3xl font-light text-[#547f74] mb-3">
                02
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#659287]">
                Pair
              </span>
              <h3 className="text-base font-semibold text-[#1b3832] mt-1 mb-2">
                Find & Approve
              </h3>
              <p className="text-xs text-[#2d554c] leading-relaxed">
                Your phone discovers your laptop automatically. Tap connect, and approve the request on your laptop.
              </p>
            </div>

            {/* Step 03: CHOOSE */}
            <div className="flex flex-col items-start bg-white/70 backdrop-blur-xs p-6 rounded-2xl border border-[#b1d3b9]/50 shadow-xs relative">
              <span className="font-serif-editorial text-3xl font-light text-[#547f74] mb-3">
                03
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#659287]">
                Choose
              </span>
              <h3 className="text-base font-semibold text-[#1b3832] mt-1 mb-2">
                Select PPT or PDF
              </h3>
              <p className="text-xs text-[#2d554c] leading-relaxed">
                Select or drop the presentation file you want to deliver. Presently prepares slides in high resolution.
              </p>
            </div>

            {/* Step 04: PRESENT */}
            <div className="flex flex-col items-start bg-white/70 backdrop-blur-xs p-6 rounded-2xl border border-[#b1d3b9]/50 shadow-xs relative">
              <span className="font-serif-editorial text-3xl font-light text-[#547f74] mb-3">
                04
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#659287]">
                Present
              </span>
              <h3 className="text-base font-semibold text-[#1b3832] mt-1 mb-2">
                Control from Your Palm
              </h3>
              <p className="text-xs text-[#2d554c] leading-relaxed">
                Control slides with large touch buttons or swipe gestures while seeing the active slide live on your phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CORE BENEFITS: Editorial Layout (Not four identical cards) */}
      {/* ========================================================= */}
      <section id="features" className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#659287]">
            Crafted for Presenters
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl text-[#1b3832] mt-2 font-normal">
            Designed for human connection.
          </h2>
          <p className="text-sm sm:text-base text-[#2d554c] mt-3">
            Step away from the lectern. Look your audience in the eyes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Benefit 1: Live Slide Preview */}
          <div className="p-8 rounded-3xl bg-[#e6f2dd]/50 border border-[#b1d3b9]/70 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#659287]">
                Live Companion
              </span>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1b3832] mt-2 mb-3">
                See the slide you're presenting, right on your phone.
              </h3>
              <p className="text-sm text-[#2d554c] leading-relaxed">
                Never turn your back on your audience to check what's on the wall. The phone displays the exact high-definition slide running on your laptop.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#b1d3b9]/50 flex items-center gap-2 text-xs text-[#1b3832] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#547f74]" />
              <span>Sub-15ms synchronized frame updates</span>
            </div>
          </div>

          {/* Benefit 2: One-Tap Control */}
          <div className="p-8 rounded-3xl bg-[#e6f2dd]/50 border border-[#b1d3b9]/70 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#659287]">
                Tactile Navigation
              </span>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1b3832] mt-2 mb-3">
                Move through your presentation without returning to your laptop.
              </h3>
              <p className="text-sm text-[#2d554c] leading-relaxed">
                Large, comfortable previous and next zones allow one-handed confidence. Swipe left or right anywhere on your screen to transition.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#b1d3b9]/50 flex items-center gap-2 text-xs text-[#1b3832] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#547f74]" />
              <span>Comfortable swipe gestures & hardware tactile zones</span>
            </div>
          </div>

          {/* Benefit 3: Portrait or Landscape */}
          <div className="p-8 rounded-3xl bg-[#e6f2dd]/50 border border-[#b1d3b9]/70 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#659287]">
                Adaptive Ergonomics
              </span>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1b3832] mt-2 mb-3">
                Rotate your phone or tablet for the view that works best.
              </h3>
              <p className="text-sm text-[#2d554c] leading-relaxed">
                Turn your phone to landscape for an expanded reading canvas with full slide clarity, or use portrait for discreet one-handed thumb control.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#b1d3b9]/50 flex items-center gap-2 text-xs text-[#1b3832] font-medium">
              <RotateCw className="w-4 h-4 text-[#547f74]" />
              <span>Fluid orientation reflow without slide distortion</span>
            </div>
          </div>

          {/* Benefit 4: Private Presenter Workspace */}
          <div className="p-8 rounded-3xl bg-[#e6f2dd]/50 border border-[#b1d3b9]/70 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#659287]">
                Dual-Screen Freedom
              </span>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1b3832] mt-2 mb-3">
                Keep notes, PDFs, and references on your laptop.
              </h3>
              <p className="text-sm text-[#2d554c] leading-relaxed">
                Your audience sees only the pristine presentation on the projector, leaving your laptop screen completely free for private speaker notes, research, and reference material.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#b1d3b9]/50 flex items-center gap-2 text-xs text-[#1b3832] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#547f74]" />
              <span>True extended workspace, not screen mirroring</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PRESENTER MODE & 3-SURFACE ARCHITECTURE EXPLANATION     */}
      {/* ========================================================= */}
      <PresenterModeSection onStartConnecting={onStartConnecting} />
    </div>
  );
};
