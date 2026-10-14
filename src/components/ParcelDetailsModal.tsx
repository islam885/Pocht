import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Copy, 
  Check, 
  Navigation, 
  QrCode, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Share2, 
  Info, 
  Truck, 
  Package, 
  Edit3
} from 'lucide-react';
import { Parcel, Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { triggerHaptic } from '../utils/haptics';

interface ParcelDetailsModalProps {
  parcel: Parcel;
  lang: Language;
  hapticsEnabled: boolean;
  onClose: () => void;
  onUpdateParcel: (updated: Parcel) => void;
  onDeleteParcel: (id: string) => void;
  onShowBarcode: (trackingNumber: string) => void;
}

export const ParcelDetailsModal: React.FC<ParcelDetailsModalProps> = ({
  parcel,
  lang,
  hapticsEnabled,
  onClose,
  onUpdateParcel,
  onDeleteParcel,
  onShowBarcode,
}) => {
  const t = getTranslation(lang);
  const [copied, setCopied] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [translatedMode, setTranslatedMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(parcel.title);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active translation language: if translatedMode is on, swap ru <-> kz or ru <-> en
  const activeLang: Language = translatedMode ? (lang === 'ru' ? 'kz' : 'ru') : lang;

  const handleCopy = () => {
    triggerHaptic('light', hapticsEnabled);
    navigator.clipboard.writeText(parcel.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleTranslate = () => {
    triggerHaptic('light', hapticsEnabled);
    setTranslatedMode(!translatedMode);
  };

  const handleRefresh = async () => {
    triggerHaptic('medium', hapticsEnabled);
    setIsRefreshing(true);
    setShowMenu(false);
    
    // Simulate API query and advance status
    const { advanceParcelStatus } = await import('../services/trackingService');
    setTimeout(() => {
      const { updatedParcel, changed } = advanceParcelStatus(parcel);
      setIsRefreshing(false);
      if (changed) {
        onUpdateParcel(updatedParcel);
        triggerHaptic('success', hapticsEnabled);
      } else {
        triggerHaptic('light', hapticsEnabled);
      }
    }, 600);
  };

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;
    triggerHaptic('success', hapticsEnabled);
    onUpdateParcel({
      ...parcel,
      title: editedTitle.trim(),
    });
    setIsEditingTitle(false);
  };

  const handleToggleDelivered = () => {
    triggerHaptic('success', hapticsEnabled);
    setShowMenu(false);
    const newDelivered = !parcel.isDelivered;
    onUpdateParcel({
      ...parcel,
      isDelivered: newDelivered,
      status: newDelivered ? 'delivered' : 'in_transit',
      statusLabel: newDelivered 
        ? { ru: 'Доставлено', kz: 'Жеткізілді', en: 'Delivered' }
        : { ru: 'В пути', kz: 'Жолда', en: 'In transit' },
    });
  };

  const handleShare = async () => {
    triggerHaptic('light', hapticsEnabled);
    setShowMenu(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: parcel.title,
          text: `${parcel.carrierName}: ${parcel.trackingNumber} (${parcel.statusLabel[lang]})`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  // Determine current stepper index (0: info, 1: in_transit, 2: out_for_delivery, 3: delivered)
  const getStepIndex = (status: Parcel['status']) => {
    switch (status) {
      case 'info_received': return 0;
      case 'in_transit':
      case 'customs': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered':
      case 'pickup_ready': return 3;
      default: return 1;
    }
  };

  const currentStep = getStepIndex(parcel.status);

  // Checkpoints to display
  const checkpointsToDisplay = showAllUpdates 
    ? parcel.checkpoints 
    : parcel.checkpoints.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-[#121214] flex flex-col overflow-y-auto pb-12 select-none animate-in fade-in slide-in-from-right duration-250">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-20 bg-[#121214]/90 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-white/[0.04]">
        <button
          onClick={() => {
            triggerHaptic('light', hapticsEnabled);
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-[#1c1c1f] hover:bg-[#28282d] active:scale-95 transition-transform flex items-center justify-center text-white cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <h1 className="text-white text-base font-bold font-unbounded tracking-tight truncate px-2">
          {t.parcelDetails}
        </h1>

        <div className="relative">
          <button
            onClick={() => {
              triggerHaptic('light', hapticsEnabled);
              setShowMenu(!showMenu);
            }}
            className="w-10 h-10 rounded-full bg-[#1c1c1f] hover:bg-[#28282d] active:scale-95 transition-transform flex items-center justify-center text-white cursor-pointer"
            aria-label="Options"
          >
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>

          {/* Context Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 w-56 bg-[#222227] border border-white/[0.08] shadow-2xl rounded-2xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={handleRefresh}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 text-[#ff8a3d] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{t.refreshStatus}</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onShowBarcode(parcel.trackingNumber);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>{t.showBarcode}</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  setIsEditingTitle(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-sky-400" />
                <span>{t.editTitle}</span>
              </button>

              <button
                onClick={handleToggleDelivered}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>{parcel.isDelivered ? t.markAsActive : t.markAsDelivered}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>{t.share}</span>
              </button>

              <div className="h-px bg-white/[0.08] my-1" />

              <button
                onClick={() => {
                  triggerHaptic('delete', hapticsEnabled);
                  setShowMenu(false);
                  if (window.confirm(t.confirmDelete)) {
                    onDeleteParcel(parcel.id);
                    onClose();
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>{t.deleteParcel}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-xl w-full mx-auto px-4 pt-3 flex-1 flex flex-col gap-5">
        
        {/* Warm Terracotta / Caramel Hero Card */}
        <div className="w-full rounded-3xl overflow-hidden shadow-lg border border-[#e28a47]/30">
          
          {/* Upper Section */}
          <div className="bg-gradient-to-b from-[#d58444] to-[#c27536] p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {parcel.statusLabel[lang]}
              </span>

              {/* Barcode / QR icon button */}
              <button
                onClick={() => onShowBarcode(parcel.trackingNumber)}
                className="w-9 h-9 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                title={t.showBarcode}
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              {/* Circular Truck Badge */}
              <div className="w-16 h-16 rounded-full bg-[#e99c5d] ring-4 ring-white/10 flex items-center justify-center shadow-inner shrink-0 text-2xl">
                🚚
              </div>

              <div className="min-w-0 flex-1">
                {isEditingTitle ? (
                  <form onSubmit={handleSaveTitle} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="bg-black/25 border border-white/20 rounded-lg px-2.5 py-1 text-white font-unbounded text-base focus:outline-none focus:ring-2 focus:ring-white/40 flex-1"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-white text-[#c27536] font-bold text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      OK
                    </button>
                  </form>
                ) : (
                  <h2 className="text-xl sm:text-2xl font-bold font-unbounded text-white tracking-tight leading-snug">
                    {parcel.title}
                  </h2>
                )}

                <p className="text-white/80 text-sm font-medium mt-1">
                  {parcel.carrierName}
                </p>

                {/* Tracking number with Copy Button */}
                <div 
                  onClick={handleCopy}
                  role="button"
                  tabIndex={0}
                  className="inline-flex items-center gap-1.5 mt-2 bg-black/15 hover:bg-black/25 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                >
                  <span className="font-mono text-sm font-semibold tracking-wide text-white">
                    {parcel.trackingNumber}
                  </span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/70" />
                  )}
                  {copied && (
                    <span className="text-[11px] text-emerald-200 font-medium ml-1">
                      {t.copiedToClipboard}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lower Stepper Progress Section */}
          <div className="bg-[#78431c] px-4 py-4 text-white">
            <div className="grid grid-cols-4 items-start relative">
              {/* Connecting background bar */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-white/20 z-0" />
              
              {/* Active filled line */}
              <div 
                className="absolute top-4 left-6 h-0.5 bg-[#f69d44] z-0 transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 80}%` }}
              />

              {/* Step 1: Info received */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= 0 ? 'bg-[#ff9436] text-white shadow-md' : 'bg-white/20 text-white/50'
                }`}>
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium mt-1.5 leading-tight text-white/90">
                  {t.stepperInfoReceived}
                </span>
              </div>

              {/* Step 2: In transit */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= 1 ? 'bg-[#ff9436] text-white shadow-md' : 'bg-white/20 text-white/50'
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium mt-1.5 leading-tight text-white/90">
                  {t.stepperInTransit}
                </span>
              </div>

              {/* Step 3: Out for delivery */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= 2 ? 'bg-[#ff9436] text-white shadow-md' : 'bg-white/20 text-white/50'
                }`}>
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium mt-1.5 leading-tight text-white/90">
                  {t.stepperOutForDelivery}
                </span>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= 3 ? 'bg-[#ff9436] text-white shadow-md' : 'bg-white/20 text-white/50'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium mt-1.5 leading-tight text-white/90">
                  {t.stepperDelivered}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Tracking History Card */}
        <div className="w-full bg-[#1c1c1f] border border-white/[0.04] rounded-3xl p-5 shadow-sm">
          
          {/* Header row with "История отслеживания" and "Перевести" Switch */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <h3 className="text-white text-[17px] font-bold font-unbounded tracking-tight">
              {t.trackingHistory}
            </h3>

            {/* Translate Switch Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">
                {t.translateToggle}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={translatedMode}
                onClick={handleToggleTranslate}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  translatedMode ? 'bg-[#ff8a3d]' : 'bg-[#323238]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    translatedMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Checkpoints Timeline */}
          <div className="mt-5 space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
            {checkpointsToDisplay.map((cp, idx) => {
              const isFirst = idx === 0;
              return (
                <div key={cp.id} className="relative">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full flex items-center justify-center ${
                      isFirst
                        ? 'bg-[#ff8a3d] ring-4 ring-[#ff8a3d]/20'
                        : 'bg-[#3b3b42] border-2 border-[#1c1c1f]'
                    }`}
                  >
                    {isFirst && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-slate-400 font-medium tracking-tight">
                    {cp.timestamp}
                  </div>

                  {/* Status Heading in Bold Unbounded font */}
                  <h4 className="text-white text-[15px] font-bold font-unbounded tracking-tight leading-snug mt-1">
                    {cp.status[activeLang]}
                  </h4>

                  {/* Location with Navigation Arrow */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-300 font-normal leading-relaxed mt-1.5">
                    <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 transform rotate-45" />
                    <span>{cp.location[activeLang]}</span>
                  </div>

                  {/* Action Link for First Item if Collapsed */}
                  {isFirst && !showAllUpdates && parcel.checkpoints.length > 2 && (
                    <button
                      onClick={() => {
                        triggerHaptic('light', hapticsEnabled);
                        setShowAllUpdates(true);
                      }}
                      className="mt-3 text-xs font-bold text-[#ff8a3d] hover:text-[#ffa05c] tracking-wide uppercase flex items-center gap-1 cursor-pointer"
                    >
                      {t.showAllUpdates} ({parcel.checkpoints.length})
                    </button>
                  )}
                </div>
              );
            })}

            {/* Collapse button when expanded */}
            {showAllUpdates && parcel.checkpoints.length > 2 && (
              <button
                onClick={() => {
                  triggerHaptic('light', hapticsEnabled);
                  setShowAllUpdates(false);
                }}
                className="mt-2 text-xs font-bold text-slate-400 hover:text-white tracking-wide uppercase cursor-pointer"
              >
                {t.hideUpdates}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
