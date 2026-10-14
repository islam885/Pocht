import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Parcel, Language } from '../types';
import { CarrierLogo } from './CarrierLogo';
import { getCarrierById } from '../data/carriers';

interface ParcelCardProps {
  parcel: Parcel;
  lang: Language;
  onClick: () => void;
}

export const ParcelCard: React.FC<ParcelCardProps> = ({ parcel, lang, onClick }) => {
  const carrier = getCarrierById(parcel.carrierId);
  const currentCheckpoint = parcel.checkpoints.find(cp => cp.isCurrent) || parcel.checkpoints[0];

  const headline = currentCheckpoint ? currentCheckpoint.status[lang] : parcel.statusLabel[lang];
  const statusBadgeText = parcel.statusLabel[lang];

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="w-full bg-[#1c1c1f] hover:bg-[#232328] active:scale-[0.985] transition-all duration-200 rounded-2xl p-4.5 cursor-pointer border border-white/[0.04] shadow-sm select-none"
    >
      {/* Top Row: Carrier Logo + Title & Carrier Name + Status Pill */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CarrierLogo type={carrier.logoType} size="md" />
          <div className="min-w-0">
            <h3 className="text-white text-[15px] font-semibold truncate leading-tight">
              {parcel.title}
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-0.5 truncate">
              {parcel.carrierName}
            </p>
          </div>
        </div>

        {/* Status Pill on the Right */}
        <div className="shrink-0 bg-[#27272d] border border-white/[0.06] px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="text-xs">🚚</span>
          <span className="text-xs font-semibold text-[#f89b38] tracking-tight">
            {statusBadgeText}
          </span>
        </div>
      </div>

      {/* Main Status Headline in Unbounded Font */}
      <div className="mt-3.5">
        <h4 className="text-[17px] font-bold font-unbounded text-white tracking-tight leading-snug">
          {headline}
        </h4>
      </div>

      {/* Bottom Row: Timestamp + Chevron */}
      <div className="mt-2.5 flex items-center justify-between text-slate-400">
        <span className="text-[13px] font-normal">
          {parcel.lastUpdate}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};
