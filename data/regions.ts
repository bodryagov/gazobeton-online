// Конфигурация регионов
// Содержит данные о регионах: цены, доставка, контакты

export interface RegionConfig {
  name: string;
  slug: string;
  nameGenitive: string; // "в Москве", "в Санкт-Петербурге"
  namePrepositional: string; // "по Москве", "по Санкт-Петербургу"
  priceMultiplier: number; // множитель для базовых цен
  delivery: {
    basePrice: number; // базовая цена доставки в рублях
    freeFrom: number; // бесплатная доставка от (м³)
    zones: string[]; // зоны доставки
    minOrder?: number; // минимальный заказ в м³
  };
  contacts: {
    phone: string;
    phoneFormatted: string; // для ссылок tel:
    address: string;
    workingHours?: string;
  };
  seo?: {
    titleSuffix?: string; // дополнение к title
    description?: string; // описание для мета-тегов
  };
}

export const regions: Record<string, RegionConfig> = {
  moscow: {
    name: 'Москва',
    slug: 'moscow',
    nameGenitive: 'в Москве',
    namePrepositional: 'по Москве',
    priceMultiplier: 1.0,
    delivery: {
      basePrice: 3000,
      freeFrom: 20, // м³
      zones: ['Москва (в пределах МКАД)', 'Московская область (до 50 км от МКАД)'],
      minOrder: 1,
    },
    contacts: {
      phone: '+79626093535',
      phoneFormatted: '+7 (962) 609-35-35',
      address: 'Склад в Подмосковье',
      workingHours: 'Пн-Пт: 9:00-18:00, Сб: 10:00-16:00',
    },
    seo: {
      titleSuffix: 'в Москве - купить с доставкой',
      description: 'Газобетонные блоки в Москве. Доставка на следующий день. Большой выбор производителей. Оптовые цены. Работаем с объектами в МО.',
    },
  },
  spb: {
    name: 'Санкт-Петербург',
    slug: 'spb',
    nameGenitive: 'в Санкт-Петербурге',
    namePrepositional: 'по Санкт-Петербургу',
    priceMultiplier: 0.95, // дешевле в СПб
    delivery: {
      basePrice: 2500,
      freeFrom: 25, // м³
      zones: ['Санкт-Петербург', 'Ленинградская область (до 50 км от КАД)'],
      minOrder: 1,
    },
    contacts: {
      phone: '+79626093535',
      phoneFormatted: '+7 (962) 609-35-35',
      address: 'Склад в Санкт-Петербурге',
      workingHours: 'Пн-Пт: 9:00-18:00, Сб: 10:00-16:00',
    },
    seo: {
      titleSuffix: 'в Санкт-Петербурге - купить с доставкой',
      description: 'Газобетонные блоки в Санкт-Петербурге. Доставка по СПб и ЛО. Большой выбор производителей. Работаем с объектами в Ленинградской области.',
    },
  },
  ufa: {
    name: 'Уфа',
    slug: 'ufa',
    nameGenitive: 'в Уфе',
    namePrepositional: 'по Уфе',
    priceMultiplier: 0.90,
    delivery: {
      basePrice: 3500,
      freeFrom: 30,
      zones: ['Уфа', 'Республика Башкортостан'],
      minOrder: 1,
    },
    contacts: {
      phone: '+79626093535',
      phoneFormatted: '+7 (962) 609-35-35',
      address: 'Склад в Уфе',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    seo: {
      titleSuffix: 'в Уфе - купить с доставкой',
      description: 'Газобетонные блоки в Уфе. Доставка по Республике Башкортостан. Большой выбор производителей.',
    },
  },
  samara: {
    name: 'Самара',
    slug: 'samara',
    nameGenitive: 'в Самаре',
    namePrepositional: 'по Самаре',
    priceMultiplier: 0.92,
    delivery: {
      basePrice: 3500,
      freeFrom: 30,
      zones: ['Самара', 'Самарская область'],
      minOrder: 1,
    },
    contacts: {
      phone: '+79626093535',
      phoneFormatted: '+7 (962) 609-35-35',
      address: 'Склад в Самаре',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    seo: {
      titleSuffix: 'в Самаре - купить с доставкой',
      description: 'Газобетонные блоки в Самаре. Доставка по Самарской области. Большой выбор производителей.',
    },
  },
};

// Валидные регионы (для middleware и проверок)
export const validRegions = Object.keys(regions);

// Получить конфиг региона
export function getRegionConfig(slug: string): RegionConfig | null {
  return regions[slug] || null;
}

// Получить региональную цену (базовая цена * множитель)
export function getRegionalPrice(basePrice: number, regionSlug: string): number {
  const region = regions[regionSlug];
  if (!region) return basePrice;
  return Math.round(basePrice * region.priceMultiplier);
}

