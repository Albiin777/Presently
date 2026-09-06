import React from 'react';

export const BackdropWaves: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#f5f8f5]">
      {/* Soft ambient gradient orbs */}
      <div
        className="absolute -top-[20%] -right-[15%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full opacity-60 filter blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #b1d3b9 0%, #e6f2dd 40%, rgba(245,248,245,0) 70%)',
        }}
      />
      <div
        className="absolute top-[40%] -left-[20%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full opacity-40 filter blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #88bda4 0%, #e6f2dd 45%, rgba(245,248,245,0) 70%)',
        }}
      />

      {/* Flowing organic SVG wave lines echoing the reference image */}
      <svg
        className="absolute inset-0 w-full h-full opacity-45"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 250C320 280 480 180 820 220C1160 260 1320 140 1440 160V900H0V250Z"
          fill="url(#waveGrad1)"
          opacity="0.35"
        />
        <path
          d="M0 450C280 420 560 520 900 460C1240 400 1360 480 1440 450V900H0V450Z"
          fill="url(#waveGrad2)"
          opacity="0.45"
        />
        <path
          d="M0 320C380 300 620 420 1020 340C1280 290 1380 320 1440 310"
          stroke="#88bda4"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          fill="none"
        />
        <path
          d="M0 580C420 540 760 620 1140 560C1320 530 1400 550 1440 540"
          stroke="#b1d3b9"
          strokeWidth="1"
          strokeOpacity="0.5"
          fill="none"
        />

        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e6f2dd" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#b1d3b9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f5f8f5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#88bda4" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#e6f2dd" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f5f8f5" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
