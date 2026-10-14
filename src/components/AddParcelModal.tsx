import React, { useState } from 'react';
import { X, Search, ChevronRight, Clipboard, Sparkles } from 'lucide-react';
import { Carrier, Language } from '../types';
import { CARRIERS, detectCarrier } from '../data/carriers';
import { CarrierLogo } from './CarrierLogo';
import { getTranslation } from '../utils/i18n';
import { triggerHaptic } from '../utils/haptics';

interface AddParcelModalProps {
  lang: Language;
  hapticsEnabled: boolean;
  onAddParcel: (trackNumber: string, title?: string, carrierId?: string) => Promise<void>;
  onOpenCarrierSelect: () => void;
  selectedCarrier: Carrier;
  setSelectedCarrier: (carrier: Carrier) => void;
  onClose: () => void;
}

export const AddParcelModal: React.FC<AddParcelModalProps> = ({
  lang,
  hapticsEnabled,
  onAddParcel,
  onOpenCarrierSelect,
  selectedCarrier,
  setSelectedCarrier,
  onClose,
}) => {
  const t = getTranslation(lang);
  const [trackNumber, setTrackNumber] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleNumbers = ['AO229592092KZ', 'KZ849102834KZ', 'ADS99301294', 'YT8849102910'];

  const handleTrackChange = (val: string) => {
    setTrackNumber(val);
    setError(null);
    if (val.trim().length >= 4) {
      const detected = detectCarrier(val);
      setSelectedCarrier(detected);
    }
  };

  const handlePaste = async () => {
    triggerHaptic('light', hapticsEnabled);
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleTrackChange(text.trim());
      }
    } catch {
      // clipboard permission denied
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackNumber.trim()) {
      setError('Введите трек-номер отправления');
      triggerHaptic('delete', hapticsEnabled);
      return;
    }

    try {
      setIsLoading(true);
      triggerHaptic('medium', hapticsEnabled);
      await onAddParcel(trackNumber.trim(), title.trim(), selectedCarrier.id);
      triggerHaptic('success', hapticsEnabled);
      onClose();
    } catch {
      setError('Ошибка при поиске трек-номера');
      triggerHaptic('delete', hapticsEnabled);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-[#18181b] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h2 className="text-xl font-bold font-unbounded text-white tracking-tight">
            {t.addParcel}
          </h2>
          <button
            onClick={() => {
              triggerHaptic('light', hapticsEnabled);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#27272c] hover:bg-[#323238] flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Tracking Number Input */}
          <div>
            <label className="block text-xs font-bold font-unbounded text-slate-300 mb-1.5 uppercase tracking-wider">
              {t.trackNumberLabel}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={trackNumber}
                onChange={(e) => handleTrackChange(e.target.value)}
                placeholder={t.trackNumberPlaceholder}
                className="w-full bg-[#222227] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-white font-mono text-base uppercase tracking-wider placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff8a3d]/50 focus:border-[#ff8a3d]"
                autoFocus
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1 font-sans transition-colors cursor-pointer"
                title="Вставить из буфера"
              >
                <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Вставить</span>
              </button>
            </div>

            {/* Quick sample chips */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-slate-500 shrink-0">Пример:</span>
              {sampleNumbers.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleTrackChange(num)}
                  className={`px-2 py-0.5 rounded-lg font-mono text-[11px] shrink-0 transition-colors cursor-pointer ${
                    trackNumber === num 
                      ? 'bg-[#ff8a3d] text-white font-bold' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
            )}
          </div>

          {/* Carrier Selector Row */}
          <div>
            <label className="block text-xs font-bold font-unbounded text-slate-300 mb-1.5 uppercase tracking-wider">
              {t.carrierLabel}
            </label>
            <div
              onClick={() => {
                triggerHaptic('light', hapticsEnabled);
                onOpenCarrierSelect();
              }}
              role="button"
              tabIndex={0}
              className="w-full bg-[#222227] hover:bg-[#2b2b32] active:bg-[#32323a] border border-white/[0.08] rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <CarrierLogo type={selectedCarrier.logoType} size="sm" />
                <div>
                  <div className="text-white text-sm font-bold font-unbounded tracking-tight leading-tight">
                    {selectedCarrier.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {selectedCarrier.countryName[lang]} ({selectedCarrier.countryCode})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <span>Изменить</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Parcel Title / Description */}
          <div>
            <label className="block text-xs font-bold font-unbounded text-slate-300 mb-1.5 uppercase tracking-wider">
              {t.parcelTitleLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.parcelTitlePlaceholder}
              className="w-full bg-[#222227] border border-white/[0.08] rounded-2xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff8a3d]/50 focus:border-[#ff8a3d]"
            />

            {/* Quick title suggestions */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-xs">
              {['Три товара кофта и т д', 'Одежда', 'Кроссовки', 'Kaspi Магазин', 'AliExpress'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light', hapticsEnabled);
                    setTitle(tag);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium shrink-0 cursor-pointer transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff8a3d] to-[#f47b2a] hover:from-[#ffa05c] hover:to-[#ff8a3d] active:scale-[0.99] text-white font-bold font-unbounded text-sm tracking-wide shadow-lg shadow-[#ff8a3d]/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{t.startTracking}</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};
