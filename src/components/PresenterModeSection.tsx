import React from 'react';
import { Smartphone, Laptop, Monitor, ArrowDown, Wifi, Cable, CheckCircle2, FileText, Globe, BookOpen, Clock, Sparkles } from 'lucide-react';

interface PresenterModeSectionProps {
  onStartConnecting?: () => void;
}

export const PresenterModeSection: React.FC<PresenterModeSectionProps> = ({ onStartConnecting }) => {
  return (
    <section id="presenter-mode" className="w-full py-16 lg:py-24 border-t border-[#b1d3b9]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* SECTION HEADER: Exact user phrasing & editorial tone      */}
        {/* ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#659287] inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f2dd] border border-[#b1d3b9]/60">
            <Sparkles className="w-3.5 h-3.5 text-[#547f74]" />
            <span>Presenter Mode Architecture</span>
          </span>

          <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-[#1b3832] mt-4 font-normal tracking-tight leading-[1.12]">
            Keep your presentation on the big screen{' '}
            <span className="font-serif-editorial italic text-[#547f74] block sm:inline">
              while your laptop stays yours.
            </span>
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#2d554c] mt-5 leading-relaxed max-w-2xl mx-auto">
            Connect your laptop to the room's projector as an extended display. The audience sees only your high-definition slides, while your laptop stays completely private for reference PDFs, speaker notes, and research — driven wirelessly from your phone.
          </p>
        </div>

        {/* ========================================================= */}
        {/* THE PHYSICAL SETUP TOPOLOGY DIAGRAM                        */}
        {/* ========================================================= */}
        <div className="bg-[#1b3832] text-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl border-2 border-[#2d554c] relative overflow-hidden mb-12">
          {/* Subtle ambient lighting */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#659287]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#88bda4]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Subtitle / Context */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10 relative z-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#88bda4]">
                Physical Three-Surface Architecture
              </span>
              <p className="text-sm text-neutral-300 mt-1">
                Zero screen-mirroring clutter. Real physical separation of roles.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#b1d3b9]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10211d] border border-[#2d554c]">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Local Sync</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10211d] border border-[#2d554c]">
                <Cable className="w-3.5 h-3.5 text-emerald-400" />
                <span>Extended Display</span>
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* THE PHYSICAL TOPOLOGY DIAGRAM (Phone -> Laptop -> Projector) */}
          {/* Mobile: Horizontal scroll cards to minimize vertical height! */}
          {/* ========================================================= */}
          <div className="mb-10 p-4 sm:p-8 rounded-2xl bg-[#10211d]/90 border border-[#2d554c] relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#88bda4]">
                  Intended Physical Setup
                </span>
                <h3 className="font-serif-editorial text-lg sm:text-2xl text-white mt-0.5">
                  How the hardware connects in the room
                </h3>
              </div>
              <span className="text-[11px] text-[#88bda4]/70 sm:hidden flex items-center gap-1 font-mono">
                Swipe sideways →
              </span>
            </div>

            {/* Horizontal Scroll Layout on Mobile / Stacked on Large */}
            <div className="overflow-x-auto pb-3 pt-1 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-[#2d554c] scrollbar-track-transparent">
              <div className="flex flex-nowrap lg:flex-row items-center gap-3 min-w-[720px] lg:min-w-0 justify-between">
                
                {/* NODE 1: PHONE */}
                <div className="flex-1 min-w-[220px] p-3.5 rounded-xl bg-[#18312a] border border-[#659287]/50 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#23463e] text-[#b1d3b9] flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">📱 PHONE</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                          In Hand
                        </span>
                      </div>
                      <p className="text-[11px] text-[#b1d3b9] mt-0.5 font-medium">
                        Remote + live preview
                      </p>
                    </div>
                  </div>
                </div>

                {/* HORIZONTAL CONNECTOR 1 */}
                <div className="flex flex-col items-center justify-center shrink-0 px-1 text-center">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#14231f] border border-[#2d554c] text-[10px] text-[#88bda4] font-medium shadow-xs whitespace-nowrap">
                    <Wifi className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Wireless sync · &lt;15ms</span>
                  </div>
                  <span className="text-[#88bda4] text-xs font-mono mt-0.5">➔</span>
                </div>

                {/* NODE 2: LAPTOP */}
                <div className="flex-1 min-w-[240px] p-3.5 rounded-xl bg-[#1c3831] border-2 border-[#88bda4] shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2a5349] text-white flex items-center justify-center shrink-0">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">💻 LAPTOP</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#88bda4] text-[#14231f] font-bold">
                          Private
                        </span>
                      </div>
                      <p className="text-[11px] text-[#e6f2dd] mt-0.5 font-medium leading-snug">
                        Podium workspace (Notes & PDFs)
                      </p>
                    </div>
                  </div>
                </div>

                {/* HORIZONTAL CONNECTOR 2 */}
                <div className="flex flex-col items-center justify-center shrink-0 px-1 text-center">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#14231f] border border-[#2d554c] text-[10px] text-[#88bda4] font-medium shadow-xs whitespace-nowrap">
                    <Cable className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Extended Display</span>
                  </div>
                  <span className="text-[#88bda4] text-xs font-mono mt-0.5">➔</span>
                </div>

                {/* NODE 3: PROJECTOR */}
                <div className="flex-1 min-w-[220px] p-3.5 rounded-xl bg-[#18312a] border border-[#659287]/50 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#23463e] text-[#b1d3b9] flex items-center justify-center shrink-0">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">🖥 PROJECTOR</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                          Screen
                        </span>
                      </div>
                      <p className="text-[11px] text-[#b1d3b9] mt-0.5 font-medium">
                        Pure 16:9 audience presentation
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* THE 3 REAL SURFACES GRID                                  */}
          {/* ========================================================= */}
          {/* THE 3 REAL SURFACES                                       */}
          {/* Mobile: Horizontal scrollable cards to reduce height      */}
          {/* Desktop: 3-Column Grid                                    */}
          {/* ========================================================= */}
          <div className="mb-2 flex items-center justify-between sm:hidden px-1">
            <span className="text-[11px] font-mono text-[#88bda4]">3 Distinct Roles</span>
            <span className="text-[11px] font-mono text-[#88bda4]/70">Swipe sideways →</span>
          </div>
          <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-[#2d554c] scrollbar-track-transparent">
            <div className="flex flex-nowrap lg:grid lg:grid-cols-12 gap-5 sm:gap-8 items-stretch relative z-10 min-w-[840px] lg:min-w-0">
              {/* ------------------------------------------------------- */}
              {/* SURFACE 1: PHONE → CONTROL                              */}
              {/* ------------------------------------------------------- */}
              <div className="w-[280px] sm:w-[320px] lg:w-auto lg:col-span-4 flex flex-col justify-between bg-[#14231f] rounded-2xl p-5 sm:p-6 border border-[#2d554c] shadow-lg hover:border-[#659287] transition-all shrink-0">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#23463e] text-[#b1d3b9] flex items-center justify-center shadow-xs">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#88bda4] block">
                        Surface 01
                      </span>
                      <h3 className="text-lg font-semibold text-white">📱 Phone</h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#23463e] text-[#b1d3b9] font-medium border border-[#659287]/40">
                    Control
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-semibold text-[#e6f2dd]">
                    Remote + live preview
                  </span>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    The pocket companion in your hand. Drives transitions and shows you exactly what's on the screen without looking backward.
                  </p>
                </div>

                {/* Surface Visual Mockup */}
                <div className="p-3 rounded-xl bg-[#0e1916] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span className="text-[#88bda4]">● Connected to Laptop</span>
                    <span>12 / 28</span>
                  </div>

                  {/* Live Slide Mini Preview */}
                  <div className="aspect-[16/9] w-full rounded-lg bg-[#1b3832] border border-[#659287]/40 p-2.5 flex flex-col justify-between relative overflow-hidden shadow-inner">
                    <div className="relative z-10">
                      <span className="text-[8px] uppercase tracking-wider text-[#88bda4]">Live Slide</span>
                      <p className="font-serif-editorial text-xs text-white leading-tight mt-0.5">
                        Igniting the next era of presentation.
                      </p>
                    </div>
                    <div className="relative z-10 flex justify-between items-center text-[7px] text-[#b1d3b9]">
                      <span>INCINERATE.pptx</span>
                      <span className="font-mono">12 / 28</span>
                    </div>
                  </div>

                  {/* Tactile Previous / Next Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 py-1.5 rounded-lg bg-[#1b3832] text-center text-[10px] text-neutral-300 font-semibold border border-white/10">
                      ← Prev
                    </div>
                    <div className="flex-1 py-1.5 rounded-lg bg-[#3d5f57] text-center text-[10px] text-white font-bold border border-[#88bda4]/50">
                      Next →
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Live slide mirroring in your hand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Large touch Previous & Next zones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>One-tap Blackout for stage focus</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* ------------------------------------------------------- */}
            {/* SURFACE 2: LAPTOP → PRIVATE WORKSPACE                   */}
            {/* ------------------------------------------------------- */}
            <div className="w-[290px] sm:w-[330px] lg:w-auto lg:col-span-4 flex flex-col justify-between bg-[#14231f] rounded-2xl p-5 sm:p-6 border-2 border-[#88bda4]/60 shadow-xl relative shrink-0">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#88bda4] text-[#14231f] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Your Screen Remains Yours
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 mt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#23463e] text-[#b1d3b9] flex items-center justify-center shadow-xs">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#88bda4] block">
                        Surface 02
                      </span>
                      <h3 className="text-lg font-semibold text-white">💻 Laptop</h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#254b42] text-emerald-300 font-medium border border-emerald-500/40">
                    Private workspace
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-semibold text-[#e6f2dd]">
                    Private workspace
                  </span>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Used privately by the presenter for notes, research, and references. The audience never sees this screen.
                  </p>
                </div>

                {/* Surface Visual Mockup: Laptop with Multiple Private Tools */}
                <div className="p-3 rounded-xl bg-[#0e1916] border border-white/10 space-y-2.5">
                  {/* Laptop Window Tabs */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[9px]">
                    <div className="flex items-center gap-1 text-[#88bda4]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="font-semibold">Private Cockpit</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400 font-mono">
                      <Clock className="w-3 h-3 text-[#88bda4]" />
                      <span>14:32 remaining</span>
                    </div>
                  </div>

                  {/* Active Speaker Notes Box */}
                  <div className="p-2 rounded-lg bg-[#1b3832] border border-[#2d554c]">
                    <span className="text-[8px] uppercase tracking-wider font-semibold text-[#88bda4] flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      <span>Private Speaker Notes</span>
                    </span>
                    <p className="text-[10px] text-[#e6f2dd] mt-1 leading-snug">
                      "Slide 12: Introduce INCINERATE. Highlight that the phone drives transitions while notes stay right here."
                    </p>
                  </div>

                  {/* Private Multitasking Strip */}
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[9px]">
                    <div className="p-1.5 rounded-md bg-[#162723] border border-white/5 flex items-center gap-1 text-neutral-300">
                      <BookOpen className="w-3 h-3 text-[#88bda4]" />
                      <span className="truncate">Reference PDF</span>
                    </div>
                    <div className="p-1.5 rounded-md bg-[#162723] border border-white/5 flex items-center gap-1 text-neutral-300">
                      <Globe className="w-3 h-3 text-[#88bda4]" />
                      <span className="truncate">Web Research</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>PDF reference material & whitepapers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Speaker notes & timed pacing cues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Browser, research & other applications</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* ------------------------------------------------------- */}
            {/* SURFACE 3: PROJECTOR → AUDIENCE                         */}
            {/* ------------------------------------------------------- */}
            <div className="w-[280px] sm:w-[320px] lg:w-auto lg:col-span-4 flex flex-col justify-between bg-[#14231f] rounded-2xl p-5 sm:p-6 border border-[#2d554c] shadow-lg hover:border-[#659287] transition-all shrink-0">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#23463e] text-[#b1d3b9] flex items-center justify-center shadow-xs">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#88bda4] block">
                        Surface 03
                      </span>
                      <h3 className="text-lg font-semibold text-white">🖥 Projector</h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#23463e] text-[#b1d3b9] font-medium border border-[#659287]/40">
                    Audience
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-semibold text-[#e6f2dd]">
                    Audience presentation
                  </span>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Connected as an extended display. Displays purely the high-resolution slide with no notes, mouse cursor, or notifications.
                  </p>
                </div>

                {/* Surface Visual Mockup: Clean Full-Bleed Projector Screen */}
                <div className="p-3 rounded-xl bg-[#0e1916] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span className="text-[#88bda4]">● External Display (16:9 HDMI/USB-C)</span>
                    <span>1080p / 4K</span>
                  </div>

                  {/* Clean Audience Presentation Canvas */}
                  <div className="aspect-[16/9] w-full rounded-lg bg-gradient-to-br from-[#1c3831] to-[#12231e] border border-white/15 p-3 flex flex-col justify-between relative overflow-hidden shadow-md">
                    <div className="absolute inset-0 opacity-40">
                      <svg viewBox="0 0 300 180" className="w-full h-full" fill="none">
                        <path d="M0 100L75 70L150 105L230 65L300 85V180H0V100Z" fill="#326054" />
                        <path d="M0 130L90 110L180 145L260 105L300 120V180H0V130Z" fill="#122521" />
                      </svg>
                    </div>

                    <div className="relative z-10">
                      <span className="text-[7px] uppercase tracking-widest font-semibold text-[#88bda4]">
                        Keynote Presentation
                      </span>
                      <h4 className="font-serif-editorial text-sm sm:text-base text-white font-normal leading-tight mt-0.5">
                        Igniting the next era <br />
                        of presentation.
                      </h4>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[7px] text-[#b1d3b9] pt-1 border-t border-white/10">
                      <span>INCINERATE · 28 slides</span>
                      <span className="font-mono">12 / 28</span>
                    </div>
                  </div>

                  {/* Clean Status Pill */}
                  <div className="text-center text-[9px] text-[#88bda4] pt-0.5">
                    No speaker notes · No cursor · Zero notifications
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pure audience presentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Preserved 16:9 native aspect ratio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Runs smoothly on TV, monitor, or projector</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

          {/* ========================================================= */}
          {/* SYNCHRONIZATION FLOW EXPLANATION BANNER                   */}
          {/* ========================================================= */}
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-[#2d554c] scrollbar-track-transparent">
              <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-4 text-left min-w-[620px] md:min-w-0">
                <div className="flex-1 p-4 rounded-xl bg-[#10211d] border border-white/5 min-w-[190px]">
                  <span className="text-[11px] font-mono text-[#88bda4] block mb-1">
                    01. Phone Controls
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Tap Next on your phone — slides advance in under 15ms.
                  </p>
                </div>

                <div className="flex-1 p-4 rounded-xl bg-[#10211d] border border-white/5 min-w-[190px]">
                  <span className="text-[11px] font-mono text-[#88bda4] block mb-1">
                    02. Projector Presents
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    External display instantly transitions for the audience.
                  </p>
                </div>

                <div className="flex-1 p-4 rounded-xl bg-[#10211d] border border-white/5 min-w-[190px]">
                  <span className="text-[11px] font-mono text-[#88bda4] block mb-1">
                    03. Laptop Stays Free
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Notes update while PDFs and other applications remain private.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
