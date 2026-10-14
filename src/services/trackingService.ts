import { Parcel, TrackingCheckpoint } from '../types';
import { detectCarrier } from '../data/carriers';

// Initial seed parcel matching the user's screenshots exactly
export const SEED_PARCELS: Parcel[] = [
  {
    id: 'ao-229592092-kz',
    trackingNumber: 'AO229592092KZ',
    title: 'Три товара кофта и т д',
    carrierId: 'kazpost',
    carrierName: 'Kaz Post',
    status: 'in_transit',
    statusLabel: {
      ru: 'В пути',
      kz: 'Жолда',
      en: 'In transit',
    },
    currentLocation: {
      ru: 'Павлодарская Область, Город областного значения Павлодар, Площадь Привокзальная, строение 1',
      kz: 'Павлодар облысы, Павлодар қаласы, Привокзальная алаңы, 1-ғимарат',
      en: 'Pavlodar Region, Pavlodar City, Privokzalnaya Square, bldg 1',
    },
    lastUpdate: '16 ч назад',
    createdAt: '2026-10-02T09:00:00Z',
    isDelivered: false,
    daysInTransit: 11,
    checkpoints: [
      {
        id: 'cp-1',
        timestamp: 'октября 13, 2026 6:46 PM',
        isoDate: '2026-10-13T18:46:00Z',
        isCurrent: true,
        code: 'ARRIVED_SORTING_CENTER',
        status: {
          ru: 'Прибытие в сортировочный центр',
          kz: 'Сұрыптау орталығына келу',
          en: 'Arrival at sorting center',
        },
        location: {
          ru: 'Павлодарская Область, Город областного значения Павлодар, Площадь Привокзальная, строение 1',
          kz: 'Павлодар облысы, Павлодар қаласы, Привокзальная алаңы, 1-ғимарат',
          en: 'Pavlodar Region, Pavlodar City, Privokzalnaya Square, building 1',
        },
      },
      {
        id: 'cp-2',
        timestamp: 'октября 10, 2026 9:28 AM',
        isoDate: '2026-10-10T09:28:00Z',
        code: 'CUSTOMS_CLEARED',
        status: {
          ru: 'Прошёл таможенную обработку',
          kz: 'Кедендік ресімдеуден өтті',
          en: 'Customs clearance completed',
        },
        location: {
          ru: 'Алматинская Область, Илийский Район, Казциковский Сельский округ, Село Казцик, улица Бережинский Алексей Федорович, корпус 2, строение 4',
          kz: 'Алматы облысы, Іле ауданы, Қазцик ауылдық округі, Қазцик ауылы, Бережинский көшесі, 2-корпус, 4-ғимарат',
          en: 'Almaty Region, Ili District, Kaztsik Rural District, Kaztsik Village, Berezhinsky Street, bldg 4',
        },
      },
      {
        id: 'cp-3',
        timestamp: 'октября 8, 2026 2:14 PM',
        isoDate: '2026-10-08T14:14:00Z',
        code: 'ARRIVED_EXCHANGE_OFFICE',
        status: {
          ru: 'Поступило на участок международного обмена',
          kz: 'Халықаралық алмасу бөлімшесіне түсті',
          en: 'Arrived at international exchange office',
        },
        location: {
          ru: 'Алматы УМО, Международный аэропорт Алматы, Почтовый логистический терминал',
          kz: 'Алматы ХАБ, Алматы халықаралық әуежайы, Пошталық логистикалық терминал',
          en: 'Almaty Hub, Almaty International Airport, Postal Logistics Terminal',
        },
      },
      {
        id: 'cp-4',
        timestamp: 'октября 5, 2026 11:30 AM',
        isoDate: '2026-10-05T11:30:00Z',
        code: 'EXPORT_DEPARTURE',
        status: {
          ru: 'Экспорт международной почты из страны отправления',
          kz: 'Жөнелтуші елден халықаралық пошта экспорты',
          en: 'International export dispatched from transit hub',
        },
        location: {
          ru: 'Сортировочный хаб Урумчи, СУАР, Китай',
          kz: 'Үрімжі сұрыптау хабы, ШҰАР, Қытай',
          en: 'Urumqi Sorting Hub, Xinjiang, China',
        },
      },
      {
        id: 'cp-5',
        timestamp: 'октября 2, 2026 9:00 AM',
        isoDate: '2026-10-02T09:00:00Z',
        code: 'ACCEPTED_BY_CARRIER',
        status: {
          ru: 'Принято в отделении связи',
          kz: 'Байланыс бөлімшесінде қабылданды',
          en: 'Accepted by origin postal office',
        },
        location: {
          ru: 'Отделение связи Иу, Провинция Чжэцзян, Китай',
          kz: 'Иу байланыс бөлімшесі, Чжэцзян провинциясы, Қытай',
          en: 'Yiwu Postal Office, Zhejiang, China',
        },
      },
    ],
  },
];

// Sample realistic Kazakhstan logistics checkpoints generator for any track number
const KZ_LOCATIONS = [
  {
    ru: 'г. Астана, ул. Ауэзова 13, Главпочтамт 010000',
    kz: 'Астана қ., Әуезов к-сі 13, Баспочтамт 010000',
    en: 'Astana, 13 Auezov St, Main Post Office 010000',
  },
  {
    ru: 'г. Алматы, Илийский тракт 12, ИЛЦ Алматы-Юг',
    kz: 'Алматы қ., Іле трактісі 12, Алматы-Оңтүстік ИЛЦ',
    en: 'Almaty, 12 Ili Highway, Logistics Center Almaty-South',
  },
  {
    ru: 'г. Шымкент, Тамерлановское шоссе, СЦ 160000',
    kz: 'Шымкент қ., Темірлан тас жолы, СЦ 160000',
    en: 'Shymkent, Tamerlan Highway, Sorting Hub 160000',
  },
  {
    ru: 'г. Караганда, Бухар-Жырау 45, Магистральный СЦ',
    kz: 'Қарағанды қ., Бұқар-Жырау 45, Бас СЦ',
    en: 'Karaganda, 45 Bukhar-Zhyrau Ave, Main Hub',
  },
  {
    ru: 'г. Актобе, пр. Абулхаир-хана 88, СЦ Казпочта',
    kz: 'Ақтөбе қ., Әбілқайыр хан даңғылы 88, Қазпошта СЦ',
    en: 'Aktobe, 88 Abulkhair Khan Ave, Kazpost Center',
  },
];

export async function fetchTrackingInfo(
  trackingNumber: string,
  customTitle?: string,
  chosenCarrierId?: string
): Promise<Parcel> {
  const cleanNumber = trackingNumber.trim().toUpperCase();
  const carrier = chosenCarrierId 
    ? (await import('../data/carriers')).getCarrierById(chosenCarrierId)
    : detectCarrier(cleanNumber);

  // If user entered the exact sample number AO229592092KZ
  if (cleanNumber === 'AO229592092KZ') {
    const seed = SEED_PARCELS[0];
    return {
      ...seed,
      id: `parcel-${Date.now()}`,
      title: customTitle?.trim() || seed.title,
      carrierId: carrier.id,
      carrierName: carrier.name,
    };
  }

  // Artificial short delay to give a realistic network interaction experience
  await new Promise(r => setTimeout(r, 650));

  // Determine realistic status based on track number suffix or random seed
  const hash = cleanNumber.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const isDelivered = hash % 5 === 0;
  const isOutForDelivery = hash % 5 === 1;
  const isCustoms = hash % 5 === 2;

  const locIndex = hash % KZ_LOCATIONS.length;
  const loc = KZ_LOCATIONS[locIndex];

  const now = new Date();
  const dateStr1 = formatRuDate(now);
  const dateStr2 = formatRuDate(new Date(now.getTime() - 2 * 86400000));
  const dateStr3 = formatRuDate(new Date(now.getTime() - 5 * 86400000));

  let status: Parcel['status'] = 'in_transit';
  let statusLabel = { ru: 'В пути', kz: 'Жолда', en: 'In transit' };

  if (isDelivered) {
    status = 'delivered';
    statusLabel = { ru: 'Доставлено', kz: 'Жеткізілді', en: 'Delivered' };
  } else if (isOutForDelivery) {
    status = 'out_for_delivery';
    statusLabel = { ru: 'Курьер в пути', kz: 'Курьер жолда', en: 'Out for delivery' };
  } else if (isCustoms) {
    status = 'customs';
    statusLabel = { ru: 'Таможенное оформление', kz: 'Кедендік рәсімдеу', en: 'Customs processing' };
  }

  const checkpoints: TrackingCheckpoint[] = [
    {
      id: `cp-${Date.now()}-1`,
      timestamp: dateStr1,
      isoDate: now.toISOString(),
      isCurrent: true,
      status: isDelivered 
        ? { ru: 'Вручено получателю', kz: 'Алушыға табысталды', en: 'Delivered to recipient' }
        : isOutForDelivery
        ? { ru: 'Передано курьеру для доставки', kz: 'Жеткізу үшін курьерге берілді', en: 'Handed over to courier' }
        : { ru: 'Прибытие в сортировочный центр', kz: 'Сұрыптау орталығына келу', en: 'Arrival at sorting center' },
      location: loc,
    },
    {
      id: `cp-${Date.now()}-2`,
      timestamp: dateStr2,
      isoDate: new Date(now.getTime() - 2 * 86400000).toISOString(),
      status: {
        ru: 'Прошёл таможенную очистку',
        kz: 'Кедендік тазартудан өтті',
        en: 'Customs cleared',
      },
      location: {
        ru: 'г. Алматы, Таможенный пост «Жетісу», Терминал 1',
        kz: 'Алматы қ., «Жетісу» кеден бекеті, 1-терминал',
        en: 'Almaty, Zhetysu Customs Post, Terminal 1',
      },
    },
    {
      id: `cp-${Date.now()}-3`,
      timestamp: dateStr3,
      isoDate: new Date(now.getTime() - 5 * 86400000).toISOString(),
      status: {
        ru: 'Отправление принято к пересылке',
        kz: 'Жөнелтілім жөнелтуге қабылданды',
        en: 'Package received by carrier',
      },
      location: {
        ru: 'Международный логистический центр',
        kz: 'Халықаралық логистикалық орталық',
        en: 'International Logistics Hub',
      },
    },
  ];

  return {
    id: `parcel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    trackingNumber: cleanNumber,
    title: customTitle?.trim() || `Посылка ${cleanNumber}`,
    carrierId: carrier.id,
    carrierName: carrier.name,
    status,
    statusLabel,
    currentLocation: loc,
    lastUpdate: 'Только что',
    createdAt: now.toISOString(),
    isDelivered,
    daysInTransit: 6,
    checkpoints,
  };
}

function formatRuDate(d: Date): string {
  const monthsRu = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  const month = monthsRu[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
}

// Advances the status of a parcel when "Refresh" is pressed
export function advanceParcelStatus(parcel: Parcel): { updatedParcel: Parcel; changed: boolean } {
  if (parcel.isDelivered) {
    return { updatedParcel: parcel, changed: false };
  }

  const now = new Date();
  const newTimestamp = formatRuDate(now);

  if (parcel.status === 'in_transit') {
    const newCp: TrackingCheckpoint = {
      id: `cp-${Date.now()}`,
      timestamp: newTimestamp,
      isoDate: now.toISOString(),
      isCurrent: true,
      status: {
        ru: 'Курьер назначен на доставку',
        kz: 'Курьер жеткізуге тағайындалды',
        en: 'Out for delivery with courier',
      },
      location: {
        ru: 'Городское курьерское отделение Казпочта EMS',
        kz: 'Қазпошта EMS қалалық курьерлік бөлімшесі',
        en: 'Kazpost EMS City Courier Hub',
      },
    };

    const updatedCheckpoints = [
      newCp,
      ...parcel.checkpoints.map(cp => ({ ...cp, isCurrent: false })),
    ];

    return {
      updatedParcel: {
        ...parcel,
        status: 'out_for_delivery',
        statusLabel: {
          ru: 'Курьер в пути',
          kz: 'Курьер жолда',
          en: 'Out for delivery',
        },
        lastUpdate: 'Только что',
        checkpoints: updatedCheckpoints,
      },
      changed: true,
    };
  }

  if (parcel.status === 'out_for_delivery') {
    const newCp: TrackingCheckpoint = {
      id: `cp-${Date.now()}`,
      timestamp: newTimestamp,
      isoDate: now.toISOString(),
      isCurrent: true,
      status: {
        ru: 'Вручено адресату в отделении / постомате',
        kz: 'Бөлімшеде / постоматта алушыға табысталды',
        en: 'Delivered to recipient at pickup point',
      },
      location: parcel.currentLocation,
    };

    const updatedCheckpoints = [
      newCp,
      ...parcel.checkpoints.map(cp => ({ ...cp, isCurrent: false })),
    ];

    return {
      updatedParcel: {
        ...parcel,
        status: 'delivered',
        isDelivered: true,
        statusLabel: {
          ru: 'Доставлено',
          kz: 'Жеткізілді',
          en: 'Delivered',
        },
        lastUpdate: 'Только что',
        checkpoints: updatedCheckpoints,
      },
      changed: true,
    };
  }

  return { updatedParcel: parcel, changed: false };
}
