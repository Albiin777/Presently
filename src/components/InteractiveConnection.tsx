import React, { useState } from 'react';
import { Device, ConnectionState } from '../types';
import { Laptop, Smartphone, Wifi, CheckCircle2, ArrowRight, ShieldCheck, X, ExternalLink } from 'lucide-react';

interface InteractiveConnectionProps {
  deviceRole: 'laptop' | 'phone';
  state: ConnectionState;
  targetDevice: Device | null;
  discoveredDevices: Device[];
  isScanning: boolean;
  onScan: () => void;
  onRequestConnect: (device: Device) => void;
  onApprove: () => void;
  onDecline: () => void;
  onDisconnect: () => void;
  onClose?: () => void;
}

export const InteractiveConnection: React.FC<InteractiveConnectionProps> = ({
  deviceRole,
  state,
  targetDevice,
  discoveredDevices,
  isScanning,
  onRequestConnect,
  onApprove,
  onDecline,
  onDisconnect,
  onClose,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<Device | null>(null);

  const handleSimulatePhoneConnection = () => {
    const demoPhone: Device = {
      id: 'phone_albin',
      name: "Albin's iPhone",
      type: 'phone',
      available: true,
    };
    onRequestConnect(demoPhone);
  };

  const handleOpenPhoneWindow = () => {
    window.open(`${window.location.origin}?role=phone`, '_blank');
  };

  return (
    <div className="w-full max-w-xl mx-auto my-4 p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-[#b1d3b9] shadow-xl text-[#1b3832] relative animate-in fade-in zoom-in-95 duration-200">
      {/* Top Close Button (if collapsible) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-[#1b3832] hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Close connection panel"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Network Indicator Banner: Clean, Zero IP Addresses */}
      <div className="flex items-center justify-between pb-4 border-b border-[#b1d3b9]/40 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#659287]">
            {deviceRole === 'laptop' ? 'Laptop Host' : 'Phone Companion'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#2d554c]">
          <Wifi className="w-3.5 h-3.5 text-[#659287]" />
          <span>Local Device Discovery</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LAPTOP CONTEXT: Host & Incoming Approval Request          */}
      {/* ========================================================= */}
      {deviceRole === 'laptop' && (
        <div className="space-y-6">
          {/* Waiting for approval takes absolute priority */}
          {state === 'WAITING_FOR_APPROVAL' ? (
            <div className="p-7 rounded-2xl bg-[#e6f2dd] border border-[#b1d3b9] text-center shadow-md animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-[#3d5f57] text-white flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                <Smartphone className="w-7 h-7" />
              </div>

              <h4 className="font-serif-editorial text-3xl text-[#1b3832]">
                Connection request
              </h4>

              <p className="text-sm text-[#2d554c] mt-2 max-w-sm mx-auto leading-relaxed">
                <strong>{targetDevice?.name || "Albin's Phone"}</strong> wants to connect to this laptop.
              </p>

              <div className="mt-7 flex items-center justify-center gap-4">
                <button
                  onClick={onDecline}
                  className="px-6 py-2.5 text-xs font-semibold text-[#2d554c] bg-white border border-[#b1d3b9] rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={onApprove}
                  className="px-8 py-2.5 text-xs font-semibold text-white bg-[#3d5f57] hover:bg-[#2c4740] rounded-full transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Allow & Connect</span>
                </button>
              </div>
            </div>
          ) : state === 'CONNECTED' ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#e6f2dd] text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-[#3d5f57]" />
              </div>
              <h3 className="font-serif-editorial text-3xl font-normal text-[#1b3832]">
                You're connected.
              </h3>
              <p className="text-sm text-[#2d554c] mt-1.5">
                Your phone is ready to control your presentation.
              </p>
              <div className="mt-5">
                <button
                  onClick={onDisconnect}
                  className="text-xs text-[#659287] hover:text-[#1b3832] transition-colors cursor-pointer underline"
                >
                  Disconnect phone
                </button>
              </div>
            </div>
          ) : (
            /* IDLE, DISCOVERING, or DEVICES_FOUND: Laptop is discoverable */
            <div className="text-center py-3">
              <div className="w-16 h-16 rounded-2xl bg-[#e6f2dd] text-[#3d5f57] flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
                <Laptop className="w-8 h-8" />
              </div>

              <h3 className="font-serif-editorial text-3xl font-normal text-[#1b3832]">
                Your laptop is discoverable.
              </h3>

              <p className="text-sm text-[#2d554c] mt-2 max-w-sm mx-auto leading-relaxed">
                Open Presently on your phone and tap <strong>Connect</strong> on this laptop.
              </p>

              {/* Zero-Config Discoverable Badge */}
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4f8f4] border border-[#b1d3b9] text-xs font-medium text-[#2d554c] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Discoverable on Wi-Fi / Hotspot as <strong>Albin's Laptop</strong></span>
              </div>

              {/* Real Device Link / Demo Testing Helpers */}
              <div className="mt-8 pt-5 border-t border-[#b1d3b9]/40 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleSimulatePhoneConnection}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#3d5f57] hover:bg-[#2c4740] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Connect phone (Demo)</span>
                </button>

                <button
                  onClick={handleOpenPhoneWindow}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-[#b1d3b9] bg-white hover:bg-[#f4f8f4] text-xs font-medium text-[#2d554c] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Open phone companion in new window</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PHONE CONTEXT: Nearby Laptops & Pairing Request           */}
      {/* ========================================================= */}
      {deviceRole === 'phone' && (
        <div className="space-y-5">
          <div className="mb-4">
            <h3 className="font-serif-editorial text-2xl font-normal text-[#1b3832]">
              Nearby laptops
            </h3>
            <p className="text-xs text-[#2d554c] mt-0.5">
              Choose a laptop to connect.
            </p>
          </div>

          <div className="space-y-3">
            {discoveredDevices.map((dev) => (
              <div
                key={dev.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#f8faf8] border border-[#b1d3b9] hover:border-[#659287] transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e6f2dd] text-[#1b3832] flex items-center justify-center">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1b3832]">{dev.name}</h4>
                    <span className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Ready to connect
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRequestConnect(dev)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#3d5f57] hover:bg-[#2c4740] text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
  );
};
