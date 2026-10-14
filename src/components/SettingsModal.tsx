import React, { useState } from 'react';
import { 
  Globe, 
  Palette, 
  Vibrate, 
  Bell, 
  Mail, 
  FileText, 
  ChevronRight, 
  Check, 
  RefreshCw,
  PhoneCall,
  Send
} from 'lucide-react';
import { AppSettings, Language, ThemeMode } from '../types';
import { getTranslation } from '../utils/i18n';
import { triggerHaptic } from '../utils/haptics';
import { requestNotificationPermission, sendBrowserNotification } from '../utils/notifications';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
}) => {
  const t = getTranslation(settings.language);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showAppearancePicker, setShowAppearancePicker] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [toastMessage, setToMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToMessage(msg);
    setTimeout(() => setToMessage(null), 3000);
  };

  const handleLanguageChange = (newLang: Language) => {
    triggerHaptic('success', settings.hapticsEnabled);
    onUpdateSettings({ ...settings, language: newLang });
    setShowLanguagePicker(false);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    triggerHaptic('success', settings.hapticsEnabled);
    onUpdateSettings({ ...settings, theme: newTheme });
    setShowAppearancePicker(false);
  };

  const handleToggleHaptics = () => {
    const nextVal = !settings.hapticsEnabled;
    triggerHaptic('light', nextVal);
    onUpdateSettings({ ...settings, hapticsEnabled: nextVal });
  };

  const handleTogglePush = async () => {
    triggerHaptic('light', settings.hapticsEnabled);
    if (!settings.pushNotificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        onUpdateSettings({ ...settings, pushNotificationsEnabled: true });
        sendBrowserNotification(
          'KazPost Tracker',
          settings.language === 'kz' 
            ? 'Хабарламалар сәтті қосылды! Жөнелтілімдер күйі өзгергенде хабарлаймыз.'
            : 'Push-уведомления включены! Вы будете получать обновления по посылкам.'
        );
        showToast(t.notificationSent);
      } else {
        showToast(t.notificationError);
        onUpdateSettings({ ...settings, pushNotificationsEnabled: false });
      }
    } else {
      onUpdateSettings({ ...settings, pushNotificationsEnabled: false });
    }
  };

  const handleTestNotification = () => {
    triggerHaptic('success', settings.hapticsEnabled);
    const success = sendBrowserNotification(
      'KazPost • AO229592092KZ',
      settings.language === 'kz'
        ? 'Жөнелтілім Павлодар сұрыптау орталығына келді!'
        : 'Посылка прибыла в сортировочный центр г. Павлодар!'
    );
    if (success) {
      showToast(t.notificationSent);
    } else {
      showToast(t.notificationError);
    }
  };

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'ru': return 'русский (Казахстан)';
      case 'kz': return 'қазақша (Қазақстан)';
      case 'en': return 'English (Global)';
    }
  };

  const getThemeLabel = (theme: ThemeMode) => {
    switch (theme) {
      case 'dark': return t.dark;
      case 'light': return t.light;
      case 'system': return t.system;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121214] flex flex-col overflow-y-auto pb-12 select-none animate-in fade-in slide-in-from-bottom-6 duration-200">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#282830] text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/10 shadow-2xl animate-in fade-in duration-150">
          {toastMessage}
        </div>
      )}

      {/* Top Bar with "Готово" */}
      <div className="sticky top-0 z-20 bg-[#121214]/90 backdrop-blur-md px-6 py-4 flex items-center justify-end border-b border-white/[0.04]">
        <button
          onClick={() => {
            triggerHaptic('light', settings.hapticsEnabled);
            onClose();
          }}
          className="px-5 py-2 rounded-full bg-[#1c1c1f] hover:bg-[#28282e] active:scale-95 transition-all text-sm font-bold text-white cursor-pointer"
        >
          {t.done}
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto px-5 pt-2 flex flex-col gap-6">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold font-unbounded text-white tracking-tight">
          {t.settings}
        </h1>

        {/* 1. Общие Section */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-amber-500 text-sm">⚙️</span>
            <span className="text-sm font-bold font-unbounded text-white">
              {t.general}
            </span>
          </div>

          <div className="bg-[#1c1c1f] rounded-3xl overflow-hidden border border-white/[0.04] divide-y divide-white/[0.05]">
            
            {/* Язык (Language) */}
            <div
              onClick={() => {
                triggerHaptic('light', settings.hapticsEnabled);
                setShowLanguagePicker(true);
              }}
              role="button"
              tabIndex={0}
              className="p-4 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.06] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-bold font-unbounded tracking-tight leading-snug">
                    {t.language}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {getLanguageLabel(settings.language)}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </div>

            {/* Внешний вид (Appearance) */}
            <div
              onClick={() => {
                triggerHaptic('light', settings.hapticsEnabled);
                setShowAppearancePicker(true);
              }}
              role="button"
              tabIndex={0}
              className="p-4 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.06] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-bold font-unbounded tracking-tight leading-snug">
                    {t.appearance}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {getThemeLabel(settings.theme)}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </div>

            {/* Тактильная отдача (Haptic Feedback) */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <Vibrate className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-bold font-unbounded tracking-tight leading-snug">
                    {t.haptics}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {t.hapticsDesc}
                  </p>
                </div>
              </div>

              {/* Switch Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.hapticsEnabled}
                onClick={handleToggleHaptics}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  settings.hapticsEnabled ? 'bg-[#ff8a3d]' : 'bg-[#323238]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* 2. Уведомления Section */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-amber-500 text-sm">🔔</span>
            <span className="text-sm font-bold font-unbounded text-white">
              {t.notifications}
            </span>
          </div>

          <div className="bg-[#1c1c1f] rounded-3xl overflow-hidden border border-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-bold font-unbounded tracking-tight leading-snug">
                    {t.pushNotifications}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {t.pushNotificationsDesc} • {settings.pushNotificationsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              {/* Switch Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.pushNotificationsEnabled}
                onClick={handleTogglePush}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  settings.pushNotificationsEnabled ? 'bg-[#ff8a3d]' : 'bg-[#323238]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    settings.pushNotificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Test notification button */}
            {settings.pushNotificationsEnabled && (
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-end">
                <button
                  onClick={handleTestNotification}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Отправить тестовое уведомление</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Поддержка Section */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-amber-500 text-sm">❓</span>
            <span className="text-sm font-bold font-unbounded text-white">
              {t.support}
            </span>
          </div>

          <div className="bg-[#1c1c1f] rounded-3xl overflow-hidden border border-white/[0.04] divide-y divide-white/[0.05]">
            
            {/* Связаться с нами */}
            <div
              onClick={() => {
                triggerHaptic('light', settings.hapticsEnabled);
                setShowContactModal(true);
              }}
              role="button"
              tabIndex={0}
              className="p-4 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.06] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-bold font-unbounded tracking-tight leading-snug">
                    {t.contactUs}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {t.contactUsDesc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </div>

            {/* Политика конфиденциальности */}
            <div
              onClick={() => {
                triggerHaptic('light', settings.hapticsEnabled);
                setShowPrivacyModal(true);
              }}
              role="button"
              tabIndex={0}
              className="p-4 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.06] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-bold font-unbounded tracking-tight leading-snug">
                    {t.privacyPolicy}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {t.privacyPolicyDesc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </div>

            {/* Сбросить кэш */}
            <div
              onClick={() => {
                triggerHaptic('delete', settings.hapticsEnabled);
                if (window.confirm('Сбросить данные приложения и восстановить образцы посылок?')) {
                  onResetData();
                  showToast('Данные успешно сброшены');
                }
              }}
              role="button"
              tabIndex={0}
              className="p-4 flex items-center justify-between hover:bg-rose-500/5 active:bg-rose-500/10 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-rose-400 text-sm font-bold font-unbounded tracking-tight leading-snug">
                    {t.clearData}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {t.clearDataDesc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </div>

          </div>
        </div>

      </div>

      {/* Language Picker Sheet */}
      {showLanguagePicker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1c1c1f] rounded-3xl p-5 border border-white/10 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold font-unbounded text-white mb-4">
              {t.language}
            </h3>
            <div className="space-y-2">
              {[
                { id: 'ru', label: 'Русский (Казахстан)', flag: '🇰🇿' },
                { id: 'kz', label: 'Қазақша (Қазақстан)', flag: '🇰🇿' },
                { id: 'en', label: 'English (Global)', flag: '🌐' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLanguageChange(item.id as Language)}
                  className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
                    settings.language === item.id ? 'bg-[#ff8a3d]/20 border border-[#ff8a3d]' : 'bg-[#27272c] hover:bg-[#323238]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.flag}</span>
                    <span className="text-sm font-bold font-unbounded text-white">
                      {item.label}
                    </span>
                  </div>
                  {settings.language === item.id && <Check className="w-5 h-5 text-[#ff8a3d]" />}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowLanguagePicker(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-[#28282e] text-white text-sm font-bold cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Appearance Theme Picker Sheet */}
      {showAppearancePicker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1c1c1f] rounded-3xl p-5 border border-white/10 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold font-unbounded text-white mb-4">
              {t.appearance}
            </h3>
            <div className="space-y-2">
              {[
                { id: 'dark', label: t.dark, icon: '🌙' },
                { id: 'light', label: t.light, icon: '☀️' },
                { id: 'system', label: t.system, icon: '💻' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleThemeChange(item.id as ThemeMode)}
                  className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
                    settings.theme === item.id ? 'bg-[#ff8a3d]/20 border border-[#ff8a3d]' : 'bg-[#27272c] hover:bg-[#323238]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-bold font-unbounded text-white">
                      {item.label}
                    </span>
                  </div>
                  {settings.theme === item.id && <Check className="w-5 h-5 text-[#ff8a3d]" />}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAppearancePicker(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-[#28282e] text-white text-sm font-bold cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Support / Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1c1c1f] rounded-3xl p-5 border border-white/10 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold font-unbounded text-white mb-3">
              {t.contactUs}
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Официальная справочная служба Казпочта и служба поддержки трекинга:
            </p>
            <div className="space-y-2.5">
              <a
                href="tel:1499"
                className="p-3 rounded-2xl bg-[#27272c] hover:bg-[#323238] flex items-center gap-3 text-white transition-colors"
              >
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400">Единый контакт-центр</div>
                  <div className="text-sm font-bold font-mono">1499 (бесплатно по РК)</div>
                </div>
              </a>
              <a
                href="https://t.me/KazPostBot"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-[#27272c] hover:bg-[#323238] flex items-center gap-3 text-white transition-colors"
              >
                <Send className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="text-xs text-slate-400">Telegram Бот</div>
                  <div className="text-sm font-bold font-mono">@KazpostBot</div>
                </div>
              </a>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-[#28282e] text-white text-sm font-bold cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1c1c1f] rounded-3xl p-6 border border-white/10 shadow-2xl animate-in zoom-in-95 max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-bold font-unbounded text-white mb-3">
              {t.privacyPolicy}
            </h3>
            <div className="flex-1 overflow-y-auto text-xs text-slate-300 space-y-3 leading-relaxed pr-1">
              <p>
                <b>1. Хранение данных:</b> Все введённые трек-номера, названия посылок и пользовательские настройки сохраняются исключительно в локальном хранилище вашего браузера (localStorage).
              </p>
              <p>
                <b>2. Безопасность:</b> Мы не передаём персональные данные третьим лицам. Запросы на отслеживание направляются в почтовые сервисы в зашифрованном виде.
              </p>
              <p>
                <b>3. Push-уведомления:</b> Уведомления используются только для оповещения о смене статуса ваших отправлений в браузере. Вы можете отключить их в любое время.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-[#ff8a3d] text-white text-sm font-bold cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
