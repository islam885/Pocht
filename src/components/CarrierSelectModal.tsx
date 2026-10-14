import React, { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { Carrier, Language } from '../types';
import { CARRIERS } from '../data/carriers';
import { CarrierLogo } from './CarrierLogo';
import { getTranslation } from '../utils/i18n';
import { triggerHaptic } from '../utils/haptics';

interface CarrierSelectModalProps {
  lang: Language;
  hapticsEnabled: boolean;
  onSelect: (carrier: Carrier) => void;
  onClose: () => void;
}

export const CarrierSelectModal: React.FC<CarrierSelectModalProps> = ({
  lang,
  hapticsEnabled,
  onSelect,
  onClose,
}) => {
  const t = getTranslation(lang);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const filteredCarriers = CARRIERS.filter(carrier => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      carrier.name.toLowerCase().includes(q) ||
      carrier.countryCode.toLowerCase().includes(q) ||
      carrier.countryName[lang].toLowerCase().includes(q)
    );
  });

  // Group carriers by country
  const kzCarriers = filteredCarriers.filter(c => c.countryCode === 'KZ');
  const uaeCarriers = filteredCarriers.filter(c => c.countryCode === 'AE');
  const otherCarriers = filteredCarriers.filter(c => c.countryCode !== 'KZ' && c.countryCode !== 'AE');

  const handleCarrierClick = (carrier: Carrier) => {
    triggerHaptic('light', hapticsEnabled);
    onSelect(carrier);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121214] flex flex-col pb-8 animate-in fade-in slide-in-from-bottom-6 duration-200 select-none">
      {/* Top Header */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/[0.04]">
        <button
          onClick={() => {
            triggerHaptic('light', hapticsEnabled);
            onClose();
          }}
          className="px-4 py-2 rounded-full bg-[#1c1c1f] hover:bg-[#25252b] active:scale-95 transition-all text-sm font-semibold text-[#ff8a3d] cursor-pointer"
        >
          {t.cancel}
        </button>

        <h2 className="text-white text-base font-bold font-unbounded tracking-tight">
          {t.chooseCarrier}
        </h2>

        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-10 h-10 rounded-full bg-[#1c1c1f] hover:bg-[#25252b] active:scale-95 transition-all flex items-center justify-center text-slate-300 cursor-pointer"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5 text-amber-500" />
        </button>
      </div>

      {/* Help Banner if clicked */}
      {showHelp && (
        <div className="mx-4 mt-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed animate-in fade-in">
          💡 Для номеров формата AO...KZ или с окончанием KZ выберите <b>Kaz Post</b>. Перевозчик также определяется автоматически при вводе трек-номера.
        </div>
      )}

      {/* Search Input Bar */}
      <div className="p-4">
        <div className="w-full bg-[#1c1c1f] border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-300 focus-within:ring-2 focus-within:ring-[#ff8a3d]/50 focus-within:border-[#ff8a3d]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchCarrierPlaceholder}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
        </div>
      </div>

      {/* Carriers List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        
        {/* Kazakhstan Section */}
        {kzCarriers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇰🇿</span>
                <span className="text-sm font-bold font-unbounded text-white">
                  {t.kzHub}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {kzCarriers.length} {t.carriersCount}
              </span>
            </div>

            <div className="space-y-2">
              {kzCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  onClick={() => handleCarrierClick(carrier)}
                  role="button"
                  tabIndex={0}
                  className="w-full bg-[#1c1c1f] hover:bg-[#25252a] active:scale-[0.99] transition-all rounded-2xl p-3 flex items-center gap-3.5 cursor-pointer border border-white/[0.04]"
                >
                  <CarrierLogo type={carrier.logoType} size="md" />
                  <div className="min-w-0">
                    <h4 className="text-white text-sm font-bold font-unbounded tracking-tight truncate">
                      {carrier.name}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400">
                      {carrier.countryCode}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UAE Section */}
        {uaeCarriers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇦🇪</span>
                <span className="text-sm font-bold font-unbounded text-white">
                  {lang === 'kz' ? 'БАӘ' : lang === 'en' ? 'UAE' : 'ОАЭ'}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {uaeCarriers.length} {t.carriersCount}
              </span>
            </div>

            <div className="space-y-2">
              {uaeCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  onClick={() => handleCarrierClick(carrier)}
                  role="button"
                  tabIndex={0}
                  className="w-full bg-[#1c1c1f] hover:bg-[#25252a] active:scale-[0.99] transition-all rounded-2xl p-3 flex items-center gap-3.5 cursor-pointer border border-white/[0.04]"
                >
                  <CarrierLogo type={carrier.logoType} size="md" />
                  <div className="min-w-0">
                    <h4 className="text-white text-sm font-bold font-unbounded tracking-tight truncate">
                      {carrier.name}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400">
                      {carrier.countryCode}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other International Section */}
        {otherCarriers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <span className="text-sm font-bold font-unbounded text-white">
                  {lang === 'kz' ? 'Халықаралық' : lang === 'en' ? 'International' : 'Международные'}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {otherCarriers.length} {t.carriersCount}
              </span>
            </div>

            <div className="space-y-2">
              {otherCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  onClick={() => handleCarrierClick(carrier)}
                  role="button"
                  tabIndex={0}
                  className="w-full bg-[#1c1c1f] hover:bg-[#25252a] active:scale-[0.99] transition-all rounded-2xl p-3 flex items-center gap-3.5 cursor-pointer border border-white/[0.04]"
                >
                  <CarrierLogo type={carrier.logoType} size="md" />
                  <div className="min-w-0">
                    <h4 className="text-white text-sm font-bold font-unbounded tracking-tight truncate">
                      {carrier.name}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400">
                      {carrier.countryName[lang]} ({carrier.countryCode})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
