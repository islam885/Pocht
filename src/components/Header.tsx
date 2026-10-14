import React from 'react';
import { ArrowUpDown, Search, X } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  lang: Language;
  hapticsEnabled: boolean;
  searchOpen: boolean;
  onToggleSearch: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortOption: 'newest' | 'oldest' | 'carrier' | 'status';
  onSortChange: (opt: 'newest' | 'oldest' | 'carrier' | 'status') => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  hapticsEnabled,
  searchOpen,
  onToggleSearch,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}) => {
  const t = getTranslation(lang);
  const [showSortMenu, setShowSortMenu] = React.useState(false);

  return (
    <div className="w-full">
      {/* Top Main Row */}
      <div className="flex items-center justify-between gap-3 pt-2 pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-unbounded text-white tracking-tight">
          {t.appTitle}
        </h1>

        <div className="flex items-center gap-2.5">
          {/* Sort Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                triggerHaptic('light', hapticsEnabled);
                setShowSortMenu(!showSortMenu);
              }}
              className="w-10 h-10 rounded-full bg-[#1c1c1f] hover:bg-[#25252a] active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer border border-white/[0.04]"
              aria-label="Sort"
            >
              <ArrowUpDown className="w-4 h-4 text-slate-300" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-12 w-48 bg-[#222227] border border-white/[0.08] shadow-2xl rounded-2xl p-1.5 z-30 animate-in fade-in zoom-in-95">
                {[
                  { id: 'newest', label: t.sortNewest },
                  { id: 'oldest', label: t.sortOldest },
                  { id: 'carrier', label: t.sortCarrier },
                  { id: 'status', label: t.sortStatus },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      triggerHaptic('light', hapticsEnabled);
                      onSortChange(item.id as typeof sortOption);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium transition-colors cursor-pointer ${
                      sortOption === item.id ? 'bg-[#ff8a3d] text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => {
              triggerHaptic('light', hapticsEnabled);
              onToggleSearch();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/[0.04] ${
              searchOpen 
                ? 'bg-[#ff8a3d] text-white' 
                : 'bg-[#1c1c1f] hover:bg-[#25252a] active:scale-95 text-slate-300'
            }`}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="w-full bg-[#1c1c1f] border border-white/[0.08] rounded-2xl px-4 py-2.5 flex items-center gap-2.5 focus-within:border-[#ff8a3d]">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
