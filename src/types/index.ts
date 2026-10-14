export type Language = 'ru' | 'kz' | 'en';

export type ThemeMode = 'dark' | 'light' | 'system';

export type ParcelStatus = 
  | 'info_received' 
  | 'in_transit' 
  | 'customs' 
  | 'pickup_ready' 
  | 'out_for_delivery' 
  | 'delivered';

export interface LocalizedText {
  ru: string;
  kz: string;
  en: string;
}

export interface TrackingCheckpoint {
  id: string;
  timestamp: string; // e.g. "октября 13, 2026 6:46 PM"
  isoDate: string;
  status: LocalizedText;
  location: LocalizedText;
  isCurrent?: boolean;
  code?: string;
}

export interface Carrier {
  id: string;
  name: string;
  countryCode: string;
  countryName: LocalizedText;
  logoType: 'kazpost' | 'dpd' | 'eagle' | 'jana' | 'jet' | 'yto' | 'alfa' | 'cdek' | 'dhl' | 'fedex' | 'generic';
  brandColor?: string;
  trackingRegex?: RegExp;
  hotline?: string;
  website?: string;
}

export interface Parcel {
  id: string;
  trackingNumber: string;
  title: string;
  carrierId: string;
  carrierName: string;
  status: ParcelStatus;
  statusLabel: LocalizedText;
  currentLocation: LocalizedText;
  lastUpdate: string;
  createdAt: string;
  isDelivered: boolean;
  checkpoints: TrackingCheckpoint[];
  notes?: string;
  daysInTransit?: number;
}

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
  hapticsEnabled: boolean;
  pushNotificationsEnabled: boolean;
}
