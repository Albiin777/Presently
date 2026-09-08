import React, { useState, useEffect } from 'react';
import { BackdropWaves } from './components/BackdropWaves';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeatureHighlights } from './components/FeatureHighlights';
import { InteractiveConnection } from './components/InteractiveConnection';
import { PresentationPicker } from './components/PresentationPicker';
import { LaptopWorkspace } from './components/LaptopWorkspace';
import { PhoneCompanionView } from './components/PhoneCompanionView';
import { ProjectorDisplay } from './components/ProjectorDisplay';
import { usePresentation } from './hooks/usePresentation';
import { useConnection } from './hooks/useConnection';
import { useDeviceDiscovery } from './hooks/useDeviceDiscovery';
import { useDisplay } from './hooks/useDisplay';
import { useOrientation } from './hooks/useOrientation';
import { DeviceRole } from './types';
import { realtimeService } from './services/realtimeService';
import { presentationService } from './services/presentationService';
import { X, Heart } from 'lucide-react';

export default function App() {
  // Device Role: auto-detect if mobile viewport or URL param, else default to laptop
  const [deviceRole, setDeviceRole] = useState<DeviceRole>('laptop');
  const [isConnectingFlow, setIsConnectingFlow] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);

  // Custom Hooks managing presentation, connection, discovery, display, orientation
  const presentation = usePresentation();
  const connection = useConnection();
  const discovery = useDeviceDiscovery();
  const display = useDisplay();
  const { isLandscape } = useOrientation();

  // URL routing & initial viewport detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      const roleParam = params.get('role');

      if (modeParam === 'projector') {
        setIsProjectorMode(true);
        return;
      }

      if (roleParam === 'phone' || window.innerWidth < 768) {
        setDeviceRole('phone');
      } else {
        setDeviceRole('laptop');
      }
    }
  }, []);

  // Announce laptop host presence across Wi-Fi / hotspot
  useEffect(() => {
    if (deviceRole === 'laptop') {
      const hostname = window.location.hostname;
      const hostLaptop = {
        id: 'laptop_albin_active',
        name: "Albin's Laptop",
        type: 'laptop' as const,
        platform: 'Windows/macOS',
        available: true,
        batteryLevel: 98,
        ipHint: hostname !== 'localhost' ? `${hostname}:3000` : 'Wi-Fi / Hotspot',
      };

      // Periodic announce and listener for probes
      const announce = () => {
        realtimeService.broadcast('ANNOUNCE_HOST', hostLaptop);
        const currentState = presentationService.getState();
        if (currentState.file || (currentState.slides && currentState.slides.length > 0)) {
          realtimeService.broadcast('SYNC_PRESENTATION_STATE', currentState);
        }
      };

      announce();
      const interval = setInterval(announce, 2500);

      const unsubscribe = realtimeService.subscribe((msg) => {
        if (msg.type === 'DISCOVER_HOSTS') {
          announce();
        }
      });

      return () => {
        clearInterval(interval);
        unsubscribe();
      };
    }
  }, [deviceRole]);

  // Keyboard navigation for presentation control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        presentation.nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        presentation.prevSlide();
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        presentation.toggleBlackout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation]);

  const handleStartConnecting = () => {
    setIsConnectingFlow(true);
    if (connection.state === 'IDLE') {
      connection.startDiscovery();
    }
    // Scroll smoothly to connection step
    setTimeout(() => {
      document.getElementById('connection-portal')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleScrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenProjectorWindow = () => {
    display.openExternalProjectorWindow();
  };

  // =========================================================
  // SCENARIO 1: POP-OUT PROJECTOR AUDIENCE WINDOW (?mode=projector)
  // =========================================================
  if (isProjectorMode) {
    return (
      <ProjectorDisplay
        presentation={presentation}
        currentSlideData={presentation.currentSlideData}
        onExit={() => setIsProjectorMode(false)}
        isPopout={true}
      />
    );
  }

  // =========================================================
  // SCENARIO 2: PHYSICAL PHONE / TABLET COMPANION VIEW
  // Only activate the companion discovery/controller view when
  // the user clicks "Start connecting" or has an active connection.
  // Otherwise, phones get the full responsive editorial landing experience!
  // =========================================================
  if (deviceRole === 'phone' && (isConnectingFlow || connection.state !== 'IDLE')) {
    return (
      <PhoneCompanionView
        connectionState={connection.state}
        targetDevice={connection.targetDevice}
        discoveredDevices={discovery.devices}
        presentation={presentation}
        currentSlideData={presentation.currentSlideData}
        isLandscape={isLandscape}
        onBack={() => {
          setIsConnectingFlow(false);
          if (connection.state !== 'CONNECTED') {
            connection.disconnect();
          }
        }}
        onRequestConnect={(dev) => connection.requestConnection(dev)}
        onDeclineRequest={connection.declineConnection}
        onDisconnect={() => {
          connection.disconnect();
          setIsConnectingFlow(false);
        }}
        onNext={presentation.nextSlide}
        onPrev={presentation.prevSlide}
        onToggleBlackout={presentation.toggleBlackout}
        onTogglePresenting={() => {
          if (presentation.presenting) {
            presentation.stopPresenting();
          } else {
            presentation.startPresenting();
          }
        }}
        onGoToSlide={presentation.goToSlide}
      />
    );
  }

  // =========================================================
  // SCENARIO 3: LAPTOP HOST & PRESENTER WORKSPACE
  // =========================================================
  return (
    <div className="min-h-screen bg-[#f5f8f5] flex flex-col justify-between relative selection:bg-[#b1d3b9] selection:text-[#1b3832]">
      <BackdropWaves />

      {/* Editorial Minimal Header */}
      <Header
        connectionInfo={connection}
        onStartConnecting={handleStartConnecting}
        onScrollToSection={handleScrollToSection}
      />

      <main className="flex-1 z-10">
        {/* If presenting on Laptop: Show Private Presenter Workspace */}
        {presentation.presenting ? (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="font-serif-editorial text-2xl text-[#1b3832]">
                  Presenter Workspace
                </h2>
              </div>
              <button
                onClick={() => presentation.stopPresenting()}
                className="text-xs text-[#659287] hover:text-[#1b3832] transition-colors cursor-pointer"
              >
                Exit Workspace
              </button>
            </div>

            <LaptopWorkspace
              presentation={presentation}
              currentSlideData={presentation.currentSlideData}
              connectionInfo={connection}
              onNext={presentation.nextSlide}
              onPrev={presentation.prevSlide}
              onGoToSlide={presentation.goToSlide}
              onToggleBlackout={presentation.toggleBlackout}
              onApproveConnection={connection.approveConnection}
              onDeclineConnection={connection.declineConnection}
              onOpenProjectorWindow={handleOpenProjectorWindow}
              onOpenPhoneCompanion={() => window.open(`${window.location.origin}?role=phone`, '_blank')}
              onExitPresentation={() => presentation.stopPresenting()}
            />
          </div>
        ) : isConnectingFlow ? (
          /* ========================================================= */
          /* CONNECT FIRST WORKFLOW (The Actual Product Sequence) */
          /* ========================================================= */
          <div id="connection-portal" className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setIsConnectingFlow(false)}
                className="inline-flex items-center gap-1.5 text-xs text-[#2d554c] hover:text-[#1b3832] font-medium transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Back to Overview</span>
              </button>
              <div className="text-xs text-[#659287] font-medium">
                {connection.state === 'CONNECTED'
                  ? 'Step 2: Choose Presentation'
                  : 'Step 1: Connect Phone First'}
              </div>
            </div>

            {/* STAGE 1: CONNECT PHONE FIRST */}
            {connection.state !== 'CONNECTED' ? (
              <InteractiveConnection
                deviceRole="laptop"
                state={connection.state}
                targetDevice={connection.targetDevice}
                discoveredDevices={discovery.devices}
                isScanning={discovery.scanning}
                onScan={discovery.scanForDevices}
                onRequestConnect={connection.requestConnection}
                onApprove={connection.approveConnection}
                onDecline={connection.declineConnection}
                onDisconnect={connection.disconnect}
                onClose={() => setIsConnectingFlow(false)}
              />
            ) : (
              /* STAGE 2: CHOOSE PRESENTATION (Only After Phone is Connected!) */
              <PresentationPicker
                loadedFile={presentation.file}
                onSelectFile={(name, total, customSlides) => {
                  presentation.loadPresentation(name, total, customSlides);
                  presentation.startPresenting();
                }}
                onStartPresenting={() => presentation.startPresenting()}
              />
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* THE EDITORIAL LANDING EXPERIENCE */
          /* ========================================================= */
          <>
            {/* HERO SECTION: Closely matching reference image */}
            <HeroSection onStartConnecting={handleStartConnecting} />

            {/* Continuous Journey & Editorial Benefits */}
            <FeatureHighlights onStartConnecting={handleStartConnecting} />
          </>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#b1d3b9]/40 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#659287]">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-center sm:text-left">
          <span className="font-cursive text-xl text-[#1b3832] font-bold">Presently</span>
          <span className="text-neutral-300">•</span>
          <span className="uppercase tracking-widest text-[11px] font-medium text-[#2d554c]">
            Simple to connect. Powerful to present.
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-[#2d554c]">
          <span>Created with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block" />
          <span>by</span>
          <a
            href="https://albiin.me"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#1b3832] hover:text-[#547f74] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Albin
          </a>
        </div>
      </footer>
    </div>
  );
}
