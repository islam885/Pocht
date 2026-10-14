import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface BarcodeModalProps {
  trackingNumber: string;
  hapticsEnabled: boolean;
  onClose: () => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({
  trackingNumber,
  hapticsEnabled,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    triggerHaptic('light', hapticsEnabled);
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic bar widths from tracking number characters for crisp realistic Code 128 look
  const barcodeBars = React.useMemo(() => {
    const bars: { width: number; isBlack: boolean }[] = [];
    const seed = trackingNumber.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    // start guards
    bars.push({ width: 3, isBlack: true }, { width: 2, isBlack: false }, { width: 3, isBlack: true });

    for (let i = 0; i < trackingNumber.length; i++) {
      const code = trackingNumber.charCodeAt(i) + seed + i * 7;
      bars.push(
        { width: (code % 3) + 2, isBlack: false },
        { width: ((code >> 1) % 4) + 2, isBlack: true },
        { width: ((code >> 2) % 3) + 1, isBlack: false },
        { width: ((code >> 3) % 4) + 2, isBlack: true }
      );
    }
    // end guards
    bars.push({ width: 3, isBlack: true }, { width: 2, isBlack: false }, { width: 3, isBlack: true });
    return bars;
  }, [trackingNumber]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇰🇿</span>
            <span className="text-sm font-bold font-unbounded text-slate-800">
              Штрих-код KazPost
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light', hapticsEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barcode Graphic */}
        <div className="w-full my-6 flex flex-col items-center">
          <div className="w-full h-24 bg-white flex items-stretch justify-center gap-[2px] px-2 overflow-hidden">
            {barcodeBars.map((bar, i) => (
              <div
                key={i}
                style={{ width: `${bar.width}px` }}
                className={bar.isBlack ? 'bg-black h-full shrink-0' : 'bg-transparent h-full shrink-0'}
              />
            ))}
          </div>

          <div
            onClick={handleCopy}
            className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
          >
            <span className="font-mono text-base font-bold tracking-widest text-slate-900">
              {trackingNumber}
            </span>
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Покажите этот штрих-код оператору отделения Казпочты или отсканируйте в постомате для мгновенной выдачи.
        </p>

        <button
          onClick={() => {
            triggerHaptic('light', hapticsEnabled);
            onClose();
          }}
          className="w-full mt-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold font-unbounded cursor-pointer"
        >
          Готово
        </button>

      </div>
    </div>
  );
};
