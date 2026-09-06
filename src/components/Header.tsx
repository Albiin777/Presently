import React from 'react';
import { Brand } from './Brand';
import { ArrowRight, Wifi } from 'lucide-react';
import { ConnectionInfo } from '../services/connectionService';

interface HeaderProps {
  connectionInfo: ConnectionInfo;
  onStartConnecting?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionInfo,
  onStartConnecting,
  onScrollToSection,
}) => {
  const isConnected = connectionInfo.state === 'CONNECTED';

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex items-center justify-between z-30 relative">
      {/* Brand Logo without dash prefix */}
      <div className="flex items-center">
        <a href="#" className="focus:outline-none" aria-label="Presently Home">
          <Brand size="md" showDashPrefix={false} />
        </a>
      </div>

      {/* Right Side: Navigation Links & Connected Status Indicator */}
      <div className="flex items-center gap-6 sm:gap-8">
        <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium text-[#2d554c]">
          <button
            onClick={() => onScrollToSection?.('how-it-works')}
            className="hover:text-[#1b3832] transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => onScrollToSection?.('features')}
            className="hover:text-[#1b3832] transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => onScrollToSection?.('presenter-mode')}
            className="hover:text-[#1b3832] transition-colors cursor-pointer"
          >
            Presenter Mode
          </button>
        </nav>

        {isConnected && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f2dd] border border-[#b1d3b9] text-xs font-semibold text-[#1b3832] animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <Wifi className="w-3.5 h-3.5 text-[#659287]" />
            <span>Connected to Phone</span>
          </div>
        )}
      </div>
    </header>
  );
};
