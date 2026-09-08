import React, { useState, useEffect, useRef } from 'react';
import { Brand } from './Brand';
import { ArrowRight, Wifi, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const isConnected = connectionInfo.state === 'CONNECTED';

  // Smart sticky header:
  // - Always visible at top of page (scrollY < 80)
  // - When scrolling down below hero, smoothly hides
  // - When scrolling up a bit anywhere, smoothly stays/reveals!
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 80) {
        setIsHeaderVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
        if (currentScrollY < lastScrollY.current - 5) {
          // Scrolling upwards: reveal header
          setIsHeaderVisible(true);
        } else if (currentScrollY > lastScrollY.current + 10 && !mobileMenuOpen) {
          // Scrolling downwards: hide header (unless menu is actively open)
          setIsHeaderVisible(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        mobileMenuOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onScrollToSection?.(sectionId);
  };

  const handleConnectClick = () => {
    setMobileMenuOpen(false);
    onStartConnecting?.();
  };

  return (
    <>
      {/* Backdrop overlay when mobile menu is open - clicking closes it */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <header
        ref={headerRef}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-[#f5f8f5]/90 backdrop-blur-md shadow-sm border-b border-[#b1d3b9]/40 py-3 sm:py-4'
            : 'bg-transparent py-4 sm:py-6'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
          {/* Brand Logo */}
          <div className="flex items-center">
            <a href="#" className="focus:outline-none" aria-label="Presently Home">
              <Brand size="md" showDashPrefix={false} />
            </a>
          </div>

          {/* Right Side: Desktop Nav + Mobile Hamburger */}
          <div className="flex items-center gap-3 sm:gap-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-medium text-[#2d554c]">
              <button
                onClick={() => onScrollToSection?.('how-it-works')}
                className="hover:text-[#1b3832] transition-colors cursor-pointer whitespace-nowrap"
              >
                How it works
              </button>
              <button
                onClick={() => onScrollToSection?.('features')}
                className="hover:text-[#1b3832] transition-colors cursor-pointer whitespace-nowrap"
              >
                Features
              </button>
              <button
                onClick={() => onScrollToSection?.('presenter-mode')}
                className="hover:text-[#1b3832] transition-colors cursor-pointer whitespace-nowrap"
              >
                Presenter Mode
              </button>
            </nav>

            {isConnected && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#e6f2dd] border border-[#b1d3b9] text-[11px] sm:text-xs font-semibold text-[#1b3832] animate-in fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                <Wifi className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#659287] shrink-0" />
                <span className="hidden sm:inline">Connected to Phone</span>
                <span className="sm:hidden">Connected</span>
              </div>
            )}

            {/* Mobile Editorial Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden relative w-10 h-10 rounded-full bg-[#e6f2dd]/70 hover:bg-[#e6f2dd] active:scale-95 border border-[#b1d3b9]/70 text-[#1b3832] flex items-center justify-center transition-all shadow-xs cursor-pointer focus:outline-none"
            >
              <div className="w-4 h-3.5 flex flex-col justify-between items-center relative">
                <span
                  className={`w-4 h-[1.75px] bg-[#1b3832] rounded-full transition-all duration-300 transform origin-center ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[5.5px]' : ''
                  }`}
                />
                <span
                  className={`w-3 h-[1.75px] bg-[#1b3832] rounded-full transition-all duration-200 self-end ${
                    mobileMenuOpen ? 'opacity-0 translate-x-2' : ''
                  }`}
                />
                <span
                  className={`w-4 h-[1.75px] bg-[#1b3832] rounded-full transition-all duration-300 transform origin-center ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[5.5px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Drawer Dropdown Menu */}
          {mobileMenuOpen && (
            <div
              ref={menuRef}
              className="absolute top-[calc(100%+12px)] left-3.5 right-3.5 p-5 bg-[#fafcfa]/98 backdrop-blur-xl rounded-3xl border border-[#b1d3b9]/80 shadow-[0_20px_50px_-15px_rgba(27,56,50,0.18)] z-50 md:hidden animate-in fade-in zoom-in-95 slide-in-from-top-3 duration-200"
            >
              <div className="flex flex-col space-y-1 text-left">
                <div className="px-3 pb-2 mb-1 border-b border-[#b1d3b9]/40 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#659287]">
                  <span>Directory</span>
                  <span>Explore</span>
                </div>

                <button
                  onClick={() => handleNavClick('how-it-works')}
                  className="group px-3 py-3 rounded-2xl hover:bg-[#e6f2dd]/60 transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif-editorial text-lg text-[#659287] group-hover:text-[#1b3832] transition-colors">
                      01
                    </span>
                    <span className="font-serif-editorial text-lg text-[#1b3832] font-normal group-hover:translate-x-0.5 transition-transform">
                      How it works
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#659287] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </button>

                <button
                  onClick={() => handleNavClick('features')}
                  className="group px-3 py-3 rounded-2xl hover:bg-[#e6f2dd]/60 transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif-editorial text-lg text-[#659287] group-hover:text-[#1b3832] transition-colors">
                      02
                    </span>
                    <span className="font-serif-editorial text-lg text-[#1b3832] font-normal group-hover:translate-x-0.5 transition-transform">
                      Features
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#659287] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </button>

                <button
                  onClick={() => handleNavClick('presenter-mode')}
                  className="group px-3 py-3 rounded-2xl hover:bg-[#e6f2dd]/60 transition-all text-left flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif-editorial text-lg text-[#659287] group-hover:text-[#1b3832] transition-colors">
                      03
                    </span>
                    <span className="font-serif-editorial text-lg text-[#1b3832] font-normal group-hover:translate-x-0.5 transition-transform">
                      Presenter Mode
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#659287] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </button>

                <div className="pt-3 mt-2 border-t border-[#b1d3b9]/40">
                  <button
                    onClick={handleConnectClick}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#3d5f57] hover:bg-[#2c4740] active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <span>Start connecting</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

