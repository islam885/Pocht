import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { triggerHaptic } from '../utils/haptics';

interface FilterTabsProps {
  currentTab: 'active' | 'delivered';
  onSelectTab: (tab: 'active' | 'delivered') => void;
  activeCount: number;
  deliveredCount: number;
  lang: Language;
  hapticsEnabled: boolean;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  currentTab,
  onSelectTab,
  activeCount,
  deliveredCount,
  lang,
  hapticsEnabled,
}) => {
  const t = getTranslation(lang);

  return (
    <div className="flex items-center gap-2 p-1 bg-[#161618] rounded-full w-fit max-w-full overflow-x-auto select-none border border-white/[0.04]">
      {/* Active Tab */}
      <button
        onClick={() => {
          triggerHaptic('light', hapticsEnabled);
          onSelectTab('active');
        }}
        className={`px-5 py-2.5 rounded-full text-sm font-bold font-unbounded transition-all flex items-center gap-2 cursor-pointer ${
          currentTab === 'active'
            ? 'bg-[#ff8a3d] text-white shadow-lg shadow-[#ff8a3d]/25'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <span>{t.activeTab}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
            currentTab === 'active' ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-400'
          }`}
        >
          {activeCount}
        </span>
      </button>

      {/* Delivered Tab */}
      <button
        onClick={() => {
          triggerHaptic('light', hapticsEnabled);
          onSelectTab('delivered');
        }}
        className={`px-5 py-2.5 rounded-full text-sm font-bold font-unbounded transition-all flex items-center gap-2 cursor-pointer ${
          currentTab === 'delivered'
            ? 'bg-[#ff8a3d] text-white shadow-lg shadow-[#ff8a3d]/25'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <span>{t.deliveredTab}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
            currentTab === 'delivered' ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-400'
          }`}
        >
          {deliveredCount}
        </span>
      </button>
    </div>
  );
};
