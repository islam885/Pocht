import { Carrier } from '../types';

export const CARRIERS: Carrier[] = [
  // Казахстан (KZ)
  {
    id: 'kazpost',
    name: 'Kaz Post',
    countryCode: 'KZ',
    countryName: { ru: 'Казахстан', kz: 'Қазақстан', en: 'Kazakhstan' },
    logoType: 'kazpost',
    brandColor: '#0054A6',
    trackingRegex: /^([A-Z]{2}\d{9}KZ|\d{13,14})$/i,
    hotline: '1499',
    website: 'https://post.kz',
  },
  {
    id: 'dpd-kz',
    name: 'DPD (KZ)',
    countryCode: 'KZ',
    countryName: { ru: 'Казахстан', kz: 'Қазақстан', en: 'Kazakhstan' },
    logoType: 'dpd',
    brandColor: '#DC0032',
    trackingRegex: /^(KZ\d{8,12}|\d{12,14})$/i,
    hotline: '+7 (727) 355-05-55',
    website: 'https://dpd.kz',
  },
  {
    id: 'alfa-delivery',
    name: 'Alfa Delivery Services',
    countryCode: 'KZ',
    countryName: { ru: 'Казахстан', kz: 'Қазақстан', en: 'Kazakhstan' },
    logoType: 'alfa',
    brandColor: '#EA580C',
    trackingRegex: /^ADS[A-Z0-9]{8,12}$/i,
    hotline: '+7 (727) 250-70-00',
    website: 'https://alfadelivery.kz',
  },
  {
    id: 'eagle-post',
    name: 'Eagle Post',
    countryCode: 'KZ',
    countryName: { ru: 'Казахстан', kz: 'Қазақстан', en: 'Kazakhstan' },
    logoType: 'eagle',
    brandColor: '#EF4444',
    trackingRegex: /^EGL[0-9]{8,10}$/i,
    hotline: '+7 (7172) 79-50-50',
    website: 'https://eaglepost.kz',
  },
  {
    id: 'jana-post',
    name: 'JAŃA POST',
    countryCode: 'KZ',
    countryName: { ru: 'Казахстан', kz: 'Қазақстан', en: 'Kazakhstan' },
    logoType: 'jana',
    brandColor: '#10B981',
    trackingRegex: /^JP\d{9,12}KZ$/i,
    hotline: '+7 (707) 123-45-67',
    website: 'https://janapost.kz',
  },
  {
    id: 'jet-logistic',
    name: 'Jet Logistic',
    countryCode: 'KZ',
    countryName: { ru: 'Казахстан', kz: 'Қазақстан', en: 'Kazakhstan' },
    logoType: 'jet',
    brandColor: '#06B6D4',
    trackingRegex: /^JET\d{9,11}$/i,
    hotline: '+7 (727) 345-00-00',
    website: 'https://jetlogistic.kz',
  },
  {
    id: 'yto-express-kz',
    name: 'YTO Express (KZ)',
    countryCode: 'KZ',
    countryName: { ru: 'Казахстан', kz: 'Қазақстан', en: 'Kazakhstan' },
    logoType: 'yto',
    brandColor: '#8B5CF6',
    trackingRegex: /^YT\d{10,13}$/i,
    hotline: '+7 (727) 312-34-56',
    website: 'https://yto.com.cn',
  },
  {
    id: 'cdek-kz',
    name: 'CDEK Казахстан',
    countryCode: 'KZ',
    countryName: { ru: 'Казахстан', kz: 'Қазақстан', en: 'Kazakhstan' },
    logoType: 'cdek',
    brandColor: '#00A859',
    trackingRegex: /^\d{10,12}$/,
    hotline: '+7 (727) 258-85-88',
    website: 'https://cdek.kz',
  },

  // ОАЭ (AE)
  {
    id: 'emirates-post',
    name: 'Emirates Post',
    countryCode: 'AE',
    countryName: { ru: 'ОАЭ', kz: 'БАӘ', en: 'UAE' },
    logoType: 'generic',
    brandColor: '#0284C7',
    trackingRegex: /^[A-Z]{2}\d{9}AE$/i,
    website: 'https://emiratespost.ae',
  },
  {
    id: 'aramex',
    name: 'Aramex (UAE)',
    countryCode: 'AE',
    countryName: { ru: 'ОАЭ', kz: 'БАӘ', en: 'UAE' },
    logoType: 'generic',
    brandColor: '#E11D48',
    website: 'https://aramex.com',
  },

  // Китай (CN)
  {
    id: 'cainiao',
    name: 'Cainiao / AliExpress',
    countryCode: 'CN',
    countryName: { ru: 'Китай', kz: 'Қытай', en: 'China' },
    logoType: 'generic',
    brandColor: '#FF6000',
    trackingRegex: /^(LP\d{14}|CAINIAO\d{10,14})$/i,
    website: 'https://global.cainiao.com',
  },
  {
    id: 'china-post',
    name: 'China Post',
    countryCode: 'CN',
    countryName: { ru: 'Китай', kz: 'Қытай', en: 'China' },
    logoType: 'generic',
    brandColor: '#15803D',
    trackingRegex: /^[A-Z]{2}\d{9}CN$/i,
    website: 'http://yjcx.chinapost.com.cn',
  },

  // Турция (TR)
  {
    id: 'ptt-post',
    name: 'PTT Post (Турция)',
    countryCode: 'TR',
    countryName: { ru: 'Турция', kz: 'Түркия', en: 'Turkey' },
    logoType: 'generic',
    brandColor: '#EAB308',
    trackingRegex: /^[A-Z]{2}\d{9}TR$/i,
    website: 'https://ptt.gov.tr',
  },

  // Россия (RU)
  {
    id: 'russian-post',
    name: 'Почта России',
    countryCode: 'RU',
    countryName: { ru: 'Россия', kz: 'Ресей', en: 'Russia' },
    logoType: 'generic',
    brandColor: '#1D4ED8',
    trackingRegex: /^(\d{14}|[A-Z]{2}\d{9}RU)$/i,
    website: 'https://pochta.ru',
  },

  // США (US) & Международные
  {
    id: 'dhl-express',
    name: 'DHL Express',
    countryCode: 'DE',
    countryName: { ru: 'Международный', kz: 'Халықаралық', en: 'International' },
    logoType: 'dhl',
    brandColor: '#D97706',
    trackingRegex: /^\d{10}$/,
    website: 'https://dhl.com',
  },
  {
    id: 'fedex',
    name: 'FedEx',
    countryCode: 'US',
    countryName: { ru: 'США', kz: 'АҚШ', en: 'USA' },
    logoType: 'fedex',
    brandColor: '#4F46E5',
    trackingRegex: /^\d{12}$/,
    website: 'https://fedex.com',
  },
];

export function getCarrierById(carrierId: string): Carrier {
  const found = CARRIERS.find(c => c.id === carrierId);
  return found || CARRIERS[0]; // fallback to Kaz Post
}

export function detectCarrier(trackingNumber: string): Carrier {
  const cleaned = trackingNumber.trim().toUpperCase();
  for (const carrier of CARRIERS) {
    if (carrier.trackingRegex && carrier.trackingRegex.test(cleaned)) {
      return carrier;
    }
  }
  // Default to Kaz Post if ends with KZ or is typical format
  if (cleaned.endsWith('KZ')) {
    return CARRIERS[0];
  }
  return CARRIERS[0];
}
