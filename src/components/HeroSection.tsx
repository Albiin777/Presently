import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartConnecting: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartConnecting }) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16 lg:pb-28 overflow-visible">
      {/* Soft atmospheric gradient glow behind the hero composition */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-[#b1d3b9]/30 via-[#e6f2dd]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Large Editorial Headline, Paragraph, ONE CTA */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 z-10 flex flex-col items-start text-left">
          {/* Large Editorial Headline */}
          <h1 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-[#1b3832] tracking-tight leading-[1.05] mb-6">
            Present with{' '}
            <span className="font-serif-editorial italic text-[#547f74] block mt-1">
              greater freedom.
            </span>
          </h1>

          {/* Concise Supporting Text */}
          <p className="font-sans text-base sm:text-lg md:text-[19px] text-[#2d554c] max-w-lg leading-relaxed font-normal mb-8">
            Turn your phone into a live presentation remote and companion display for your laptop. Connect, preview, and present — without breaking your flow.
          </p>

          {/* ONE Primary Button: "Start connecting →" */}
          <div>
            <button
              onClick={onStartConnecting}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#3d5f57] hover:bg-[#2c4740] text-white text-base font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer group"
            >
              <span>Start connecting</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Realistic Laptop + Smartphone Visual Image   */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 relative flex items-center justify-center pt-4 lg:pt-0">
          {/* Ambient Curved Decorative Shape Behind Devices */}
          <div className="absolute -inset-4 sm:-inset-8 bg-radial from-[#e6f2dd]/60 via-[#b1d3b9]/20 to-transparent rounded-full filter blur-2xl pointer-events-none -z-10" />

          {/* Product Illustration Composition */}
          <div className="relative w-full max-w-[580px] aspect-[16/11] flex items-center justify-center select-none">
            {/* -------------------------------------------------- */}
            {/* 1. REALISTIC LAPTOP (Audience Presentation Display) */}
            {/* -------------------------------------------------- */}
            <div className="relative w-[92%] sm:w-[88%] aspect-[16/10] bg-[#162a25] rounded-t-2xl rounded-b-md p-2.5 sm:p-3.5 shadow-2xl border border-neutral-700/50 transform -rotate-1 sm:-rotate-2 transition-transform">
              {/* Laptop Screen Bezel */}
              <div className="relative w-full h-full bg-[#1b3832] rounded-lg overflow-hidden border border-neutral-800 flex flex-col justify-between shadow-inner">
                {/* Laptop Display Top Bezel & Notch */}
                <div className="h-6 bg-[#132520] px-3 flex items-center justify-between border-b border-white/10 text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f56]/90" />
                    <span className="w-2 h-2 rounded-full bg-[#ffbd2e]/90" />
                    <span className="w-2 h-2 rounded-full bg-[#27c93f]/90" />
                    <span className="font-cursive text-sm text-[#b1d3b9] ml-2 font-medium">Presently</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                </div>

                {/* Laptop Presentation Deck View */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Slide Thumbnails Sidebar */}
                  <div className="w-11 sm:w-14 bg-[#101f1b] p-1.5 border-r border-white/10 flex flex-col gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`w-full aspect-[16/10] rounded-xs overflow-hidden border ${
                          i === 1
                            ? 'border-[#88bda4] shadow-xs'
                            : 'border-white/10 opacity-40'
                        } relative bg-[#1b3832]`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2d554c] to-[#12231e]" />
                        <span className="absolute top-0.5 left-1 text-[7px] text-white/80 font-mono">
                          {i}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Main Active Slide Display */}
                  <div className="flex-1 relative p-4 sm:p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1c3831] to-[#142621]">
                    {/* Artistic Mountain Silhouette Artwork */}
                    <div className="absolute inset-0 pointer-events-none opacity-45">
                      <svg
                        viewBox="0 0 400 240"
                        className="w-full h-full object-cover"
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        <path
                          d="M0 120L80 85L150 115L250 65L340 105L400 85V240H0V120Z"
                          fill="#326054"
                          opacity="0.6"
                        />
                        <path
                          d="M0 150L95 125L185 165L290 115L400 135V240H0V150Z"
                          fill="#23463e"
                          opacity="0.85"
                        />
                        <path
                          d="M0 190 C40 180 80 185 120 175 C160 165 200 180 240 170 C290 160 340 175 400 165 V240 H0 Z"
                          fill="#10211d"
                        />
                      </svg>
                    </div>

                    {/* Slide Content Headline */}
                    <div className="relative z-10">
                      <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-widest text-[#88bda4]">
                        Keynote Presentation
                      </span>
                      <h2 className="font-serif-editorial text-xl sm:text-2xl md:text-3xl text-white font-normal leading-tight mt-1">
                        Ideas <br />
                        shape <br />
                        tomorrow.
                      </h2>
                    </div>

                    {/* Slide Footer Information */}
                    <div className="relative z-10 pt-2 flex items-center justify-between text-[8px] sm:text-[10px] text-[#b1d3b9]/80 border-t border-white/10">
                      <span>Build · Present · Create</span>
                      <span className="font-mono">1 / 28</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Metallic Base / Deck Lip */}
              <div className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 transform -translate-x-1/2 w-[104%] h-2.5 sm:h-3 bg-gradient-to-b from-[#2a453e] to-[#14231f] rounded-b-md shadow-md flex justify-center">
                <div className="w-16 h-1 bg-[#0e1a17] rounded-b-xs" />
              </div>
            </div>

            {/* -------------------------------------------------- */}
            {/* 2. REALISTIC SMARTPHONE (Presenter Companion Remote) */}
            {/* -------------------------------------------------- */}
            <div className="absolute -bottom-4 sm:-bottom-6 right-0 sm:right-2 w-[155px] sm:w-[195px] aspect-[9/18.5] bg-[#0d1815] rounded-[28px] sm:rounded-[36px] p-2 sm:p-2.5 shadow-2xl border-2 sm:border-[3px] border-[#2d4942] z-20 transform rotate-2 sm:rotate-3 transition-transform hover:rotate-0 duration-300">
              {/* iPhone Screen Container */}
              <div className="w-full h-full bg-[#f8faf8] rounded-[22px] sm:rounded-[28px] overflow-hidden flex flex-col justify-between p-2.5 sm:p-3 text-[#1b3832]">
                {/* Phone Top Notch & Time */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[8px] sm:text-[9px] font-semibold text-[#1b3832] font-mono">
                    11:01
                  </span>
                  <div className="w-9 sm:w-11 h-2.5 bg-black rounded-full mx-auto" />
                  <div className="flex items-center gap-0.5 text-[8px] text-[#1b3832]">
                    <span className="font-mono font-semibold">5G</span>
                  </div>
                </div>

                {/* Phone Content Interface */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  {/* Brand & Connection Pill */}
                  <div className="text-center pt-0.5">
                    <span className="font-cursive text-base sm:text-xl font-bold text-[#1b3832] block leading-none">
                      Presently
                    </span>
                    <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full bg-[#e6f2dd] text-[8px] sm:text-[9px] font-medium text-[#2d554c]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Connected to Albin's Laptop</span>
                    </div>
                  </div>

                  {/* Live Synchronized Slide Preview Card */}
                  <div className="w-full aspect-[16/10] bg-[#1b3832] rounded-lg p-2 sm:p-2.5 shadow-xs relative overflow-hidden flex flex-col justify-between my-auto">
                    <div className="absolute inset-0 opacity-40">
                      <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
                        <path d="M0 60L50 40L100 65L160 35L200 50V120H0V60Z" fill="#326054" />
                        <path d="M0 80L70 60L130 90L200 70V120H0V80Z" fill="#122521" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <span className="font-serif-editorial text-[9px] sm:text-xs text-white leading-tight block">
                        Ideas <br />
                        shape <br />
                        tomorrow.
                      </span>
                    </div>
                    <div className="relative z-10 flex justify-between items-center text-[7px] text-[#b1d3b9]">
                      <span>Build · Present · Create</span>
                    </div>
                  </div>

                  {/* Slide Counter */}
                  <div className="text-center font-mono text-[9px] sm:text-[10px] font-medium text-[#659287]">
                    1 / 28
                  </div>

                  {/* Circle Navigation Controls */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-[#e6f2dd] text-[#2d554c] flex items-center justify-center text-xs sm:text-sm font-bold shadow-xs">
                      ←
                    </div>
                    <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-[#3d5f57] text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm">
                      →
                    </div>
                  </div>

                  {/* Bottom Remote Utility Row */}
                  <div className="flex items-center justify-around pt-1 border-t border-[#b1d3b9]/40 text-[7px] sm:text-[8px] text-[#2d554c]">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px]">▶</span>
                      <span>Start</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px]">◻</span>
                      <span>Blackout</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px]">⏻</span>
                      <span>Exit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
