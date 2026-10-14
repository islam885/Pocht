import React, { useState, useEffect, useMemo } from 'react';
import { 
  Parcel, 
  AppSettings, 
  Carrier, 
  Language, 
  ThemeMode 
} from './types';
import { SEED_PARCELS, fetchTrackingInfo } from './services/trackingService';
import { CARRIERS } from './data/carriers';
import { Header } from './components/Header';
import { FilterTabs } from './components/FilterTabs';
import { ParcelCard } from './components/ParcelCard';
import { BottomDock } from './components/BottomDock';
import { ParcelDetailsModal } from './components/ParcelDetailsModal';
import { AddParcelModal } from './components/AddParcelModal';
import { CarrierSelectModal } from './components/CarrierSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { BarcodeModal } from './components/BarcodeModal';
import { getTranslation } from './utils/i18n';
import { triggerHaptic } from './utils/haptics';
import { PackageX, PlusCircle } from 'lucide-react';

const STORAGE_KEY_PARCELS = 'kazpost_parcels_v1';
const STORAGE_KEY_SETTINGS = 'kazpost_settings_v1';

export default function App() {
  // 1. Initialize settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {
      language: 'ru' as Language,
      theme: 'dark' as ThemeMode,
      hapticsEnabled: true,
      pushNotificationsEnabled: true,
    };
  });

  // 2. Initialize parcels from localStorage or seed
  const [parcels, setParcels] = useState<Parcel[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PARCELS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return SEED_PARCELS;
  });

  // 3. UI States
  const [filterTab, setFilterTab] = useState<'active' | 'delivered'>('active');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'carrier' | 'status'>('newest');
  
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [carrierModalOpen, setCarrierModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>(CARRIERS[0]);
  const [activeBottomTab, setActiveBottomTab] = useState<'parcels' | 'settings'>('parcels');
  const [barcodeNumber, setBarcodeNumber] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Sync settings with localStorage and theme classes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (settings.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }, [settings]);

  // Sync parcels with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PARCELS, JSON.stringify(parcels));
    } catch {
      // ignore
    }
  }, [parcels]);

  // Also keep selected parcel in sync if updated
  useEffect(() => {
    if (selectedParcel) {
      const fresh = parcels.find(p => p.id === selectedParcel.id);
      if (fresh) {
        setSelectedParcel(fresh);
      }
    }
  }, [parcels]);

  const t = getTranslation(settings.language);

  const showToast = (text: string) => {
    setToastNotification(text);
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Filtering & Sorting
  const filteredParcels = useMemo(() => {
    return parcels.filter(parcel => {
      // Filter by tab: active vs delivered
      if (filterTab === 'active' && parcel.isDelivered) return false;
      if (filterTab === 'delivered' && !parcel.isDelivered) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTrack = parcel.trackingNumber.toLowerCase().includes(q);
        const matchesTitle = parcel.title.toLowerCase().includes(q);
        const matchesCarrier = parcel.carrierName.toLowerCase().includes(q);
        return matchesTrack || matchesTitle || matchesCarrier;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'carrier') {
        return a.carrierName.localeCompare(b.carrierName);
      }
      if (sortOption === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }, [parcels, filterTab, searchQuery, sortOption]);

  const activeCount = useMemo(() => parcels.filter(p => !p.isDelivered).length, [parcels]);
  const deliveredCount = useMemo(() => parcels.filter(p => p.isDelivered).length, [parcels]);

  // Handlers
  const handleAddParcel = async (trackNumber: string, customTitle?: string, carrierId?: string) => {
    const newParcel = await fetchTrackingInfo(trackNumber, customTitle, carrierId);
    setParcels(prev => [newParcel, ...prev]);
    showToast(t.parcelAdded);
  };

  const handleUpdateParcel = (updated: Parcel) => {
    setParcels(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(t.statusUpdated);
  };

  const handleDeleteParcel = (id: string) => {
    setParcels(prev => prev.filter(p => p.id !== id));
    showToast(t.parcelDeleted);
  };

  const handleResetData = () => {
    setParcels(SEED_PARCELS);
    localStorage.removeItem(STORAGE_KEY_PARCELS);
  };

  return (
    <div className={`min-h-screen ${settings.theme === 'light' ? 'bg-[#f4f4f7] text-slate-900' : 'bg-[#121214] text-white'} transition-colors duration-200 flex flex-col font-sans select-none pb-28`}>
      
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2b2b33] border border-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl animate-in fade-in duration-200">
          {toastNotification}
        </div>
      )}

      {/* Main Responsive Container matching the screenshot mobile aesthetic */}
      <main className="max-w-md w-full mx-auto px-4 pt-4 flex-1 flex flex-col">
        
        {/* Top Header */}
        <Header
          lang={settings.language}
          hapticsEnabled={settings.hapticsEnabled}
          searchOpen={searchOpen}
          onToggleSearch={() => setSearchOpen(!searchOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />

        {/* Filter Pill Tabs (Активные / Доставленные) */}
        <div className="mb-4">
          <FilterTabs
            currentTab={filterTab}
            onSelectTab={setFilterTab}
            activeCount={activeCount}
            deliveredCount={deliveredCount}
            lang={settings.language}
            hapticsEnabled={settings.hapticsEnabled}
          />
        </div>

        {/* Parcels List */}
        <div className="flex-1 space-y-3">
          {filteredParcels.length > 0 ? (
            filteredParcels.map((parcel) => (
              <ParcelCard
                key={parcel.id}
                parcel={parcel}
                lang={settings.language}
                onClick={() => {
                  triggerHaptic('light', settings.hapticsEnabled);
                  setSelectedParcel(parcel);
                }}
              />
            ))
          ) : (
            /* Empty State */
            <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-500 mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold font-unbounded text-white mb-1.5">
                {filterTab === 'active' ? t.noParcelsActive : t.noParcelsDelivered}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
                {t.addFirstParcel}
              </p>
              <button
                onClick={() => {
                  triggerHaptic('medium', settings.hapticsEnabled);
                  setAddModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-[#ff8a3d] hover:bg-[#ffa05c] active:scale-95 text-white text-xs font-bold font-unbounded flex items-center gap-2 cursor-pointer shadow-lg shadow-[#ff8a3d]/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.addParcel}</span>
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Floating Bottom Dock (Island) */}
      <BottomDock
        currentTab={activeBottomTab}
        onSelectTab={(tab) => {
          setActiveBottomTab(tab);
          if (tab === 'parcels') {
            // stays on main screen
          }
        }}
        onOpenAddModal={() => {
          setAddModalOpen(true);
        }}
        hapticsEnabled={settings.hapticsEnabled}
      />

      {/* Details Modal (IMG_6858.png) */}
      {selectedParcel && (
        <ParcelDetailsModal
          parcel={selectedParcel}
          lang={settings.language}
          hapticsEnabled={settings.hapticsEnabled}
          onClose={() => setSelectedParcel(null)}
          onUpdateParcel={handleUpdateParcel}
          onDeleteParcel={handleDeleteParcel}
          onShowBarcode={(num) => setBarcodeNumber(num)}
        />
      )}

      {/* Add Parcel Modal */}
      {addModalOpen && (
        <AddParcelModal
          lang={settings.language}
          hapticsEnabled={settings.hapticsEnabled}
          onAddParcel={handleAddParcel}
          onOpenCarrierSelect={() => setCarrierModalOpen(true)}
          selectedCarrier={selectedCarrier}
          setSelectedCarrier={setSelectedCarrier}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Carrier Select Modal (IMG_6859.png) */}
      {carrierModalOpen && (
        <CarrierSelectModal
          lang={settings.language}
          hapticsEnabled={settings.hapticsEnabled}
          onSelect={(carrier) => {
            setSelectedCarrier(carrier);
            setCarrierModalOpen(false);
          }}
          onClose={() => setCarrierModalOpen(false)}
        />
      )}

      {/* Settings Modal (IMG_6860.png) */}
      {activeBottomTab === 'settings' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onResetData={handleResetData}
          onClose={() => setActiveBottomTab('parcels')}
        />
      )}

      {/* Barcode & QR Code Modal */}
      {barcodeNumber && (
        <BarcodeModal
          trackingNumber={barcodeNumber}
          hapticsEnabled={settings.hapticsEnabled}
          onClose={() => setBarcodeNumber(null)}
        />
      )}

    </div>
  );
}
