import React from 'react';
import { Package, Plus, Settings } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface BottomDockProps {
  currentTab: 'parcels' | 'settings';
  onSelectTab: (tab: 'parcels' | 'settings') => void;
  onOpenAddModal: () => void;
  hapticsEnabled: boolean;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  hapticsEnabled,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto min-w-[280px] max-w-[340px] select-none">
      <div className="bg-[#1c1c1f]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.6)] rounded-full px-6 py-2.5 flex items-center justify-between gap-6">
        
        {/* Parcels List Tab Button */}
        <button
          onClick={() => {
            triggerHaptic('light', hapticsEnabled);
            onSelectTab('parcels');
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            currentTab === 'parcels'
              ? 'bg-[#6b4728] text-[#ff9e58] shadow-inner'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          aria-label="Parcels"
        >
          <Package className="w-5 h-5" />
        </button>

        {/* Big Orange Concentric Floating Action Button (+) */}
        <div className="relative -my-3">
          {/* Subtle concentric ambient rings */}
          <div className="absolute inset-0 rounded-full bg-[#ff8a3d]/15 animate-ping opacity-40 pointer-events-none" />
          <div className="absolute -inset-1.5 rounded-full border border-[#ff8a3d]/25 pointer-events-none" />
          <div className="absolute -inset-3 rounded-full border border-[#ff8a3d]/10 pointer-events-none" />

          <button
            onClick={() => {
              triggerHaptic('medium', hapticsEnabled);
              onOpenAddModal();
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f47b2a] via-[#ff8a3d] to-[#ffa35f] hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-white shadow-[0_4px_20px_rgba(255,138,61,0.4)] cursor-pointer z-10 relative"
            aria-label="Add parcel"
          >
            <Plus className="w-7 h-7 stroke-[2.75]" />
          </button>
        </div>

        {/* Settings Tab Button */}
        <button
          onClick={() => {
            triggerHaptic('light', hapticsEnabled);
            onSelectTab('settings');
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            currentTab === 'settings'
              ? 'bg-[#6b4728] text-[#ff9e58] shadow-inner'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
