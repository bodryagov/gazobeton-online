// ТОВАРНАЯ МАТРИЦА ПО РЕГИОНАМ
// Файл для проверки перед импортом в data/products-prices.ts
// Дата создания: 03.11.2025

/**
 * Структура товарной матрицы:
 * - Регион
 * - Производитель (бренд)
 * - Плотность (D300, D400, D500, D600)
 * - Размеры (толщина x длина x высота)
 * - Цена за м³ (руб)
 * - Наличие (true/false)
 */

export interface ProductMatrixItem {
  region: 'moscow' | 'spb' | 'ufa' | 'samara';
  brand: string; // Название производителя
  brandSlug: string; // slug для фильтрации (например, 'kottezh', 'gras')
  density: string; // D300, D400, D500, D600
  thickness: number; // 100, 150, 200, 250, 300, 350, 375, 400
  length: number; // обычно 625
  height: number; // обычно 200 или 250
  pricePerM3: number; // цена за м³ в рублях
  inStock: boolean;
  source?: string; // источник данных (URL или "ручной ввод")
  notes?: string; // примечания
}

const DEFAULT_LENGTH = 625;
const DEFAULT_HEIGHT = 250;
const UPDATED_SOURCE = 'Ассортимент (обновлено 08.11.2025)';

type ThicknessOverrides = Partial<Record<number, Partial<ProductMatrixItem>>>;

function createProductEntries({
  region,
  brand,
  brandSlug,
  density,
  thicknesses,
  pricePerM3,
  inStock = true,
  source = UPDATED_SOURCE,
  notes,
  height = DEFAULT_HEIGHT,
  overrides = {},
}: {
  region: ProductMatrixItem['region'];
  brand: string;
  brandSlug: string;
  density: string;
  thicknesses: number[];
  pricePerM3: number;
  inStock?: boolean;
  source?: string;
  notes?: string;
  height?: number;
  overrides?: ThicknessOverrides;
}): ProductMatrixItem[] {
  return thicknesses.map((thickness) => {
    const base: ProductMatrixItem = {
      region,
      brand,
      brandSlug,
      density,
      thickness,
      length: DEFAULT_LENGTH,
      height,
      pricePerM3,
      inStock,
      source,
    };

    if (notes) {
      base.notes = notes;
    }

    return {
      ...base,
      ...(overrides[thickness] ?? {}),
    };
  });
}

// ============================================
// САМАРА
// ============================================
export const samaraProducts: ProductMatrixItem[] = [
  ...createProductEntries({
    region: 'samara',
    brand: 'Коттедж',
    brandSlug: 'kottezh',
    density: 'D400',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6800,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
    overrides: {
      200: { inStock: false },
      250: { inStock: false },
    },
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'Коттедж',
    brandSlug: 'kottezh',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6800,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'Коттедж',
    brandSlug: 'kottezh',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6900,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'Новоблок',
    brandSlug: 'novoblock',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 5490,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'Новоблок',
    brandSlug: 'novoblock',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 5590,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'Стенблок',
    brandSlug: 'stenblock',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 5990,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'Стенблок',
    brandSlug: 'stenblock',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6090,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'Теплон',
    brandSlug: 'teplon',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6200,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'Теплон',
    brandSlug: 'teplon',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6300,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D300',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 5990,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D400',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6090,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6090,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'samara',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6190,
    source: 'Самара — ручной ввод (обновлено 08.11.2025)',
  }),
];

// ============================================
// УФА
// ============================================
export const ufaProducts: ProductMatrixItem[] = [
  ...createProductEntries({
    region: 'ufa',
    brand: 'Коттедж',
    brandSlug: 'kottezh',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 5200,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'Коттедж',
    brandSlug: 'kottezh',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 5200,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'Коттедж',
    brandSlug: 'kottezh',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 5300,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D300',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 5000,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 5100,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 5100,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 5200,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'Теплон',
    brandSlug: 'teplon',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 5000,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'Теплон',
    brandSlug: 'teplon',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 5000,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'Теплон',
    brandSlug: 'teplon',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 5100,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 4800,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 4800,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 4900,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'PORITEP',
    brandSlug: 'poritep',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 4900,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'PORITEP',
    brandSlug: 'poritep',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 4900,
    source: 'Уфа — https://ufa.kirpich-centr.com (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'ufa',
    brand: 'PORITEP',
    brandSlug: 'poritep',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 5000,
    source: 'Уфа — https://ufa.kirpич-centr.com (обновлено 08.11.2025)',
  }),
];

// ============================================
// МОСКВА
// ============================================
// Источники:
// - https://stroykaskad.ru/category/penobloki/gazobetonnye-bloki/
// - https://stenovoy.ru/catalog/bloki/gazobeton/
export const moscowProducts: ProductMatrixItem[] = [
  ...createProductEntries({
    region: 'moscow',
    brand: 'Istkult (Ytong)',
    brandSlug: 'istkult-ytong',
    density: 'D400',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 7600,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'Istkult (Ytong)',
    brandSlug: 'istkult-ytong',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 7700,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'Istkult (Ytong)',
    brandSlug: 'istkult-ytong',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 7800,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 6000,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6100,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6200,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'Poritep',
    brandSlug: 'poritep',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 6500,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'Poritep',
    brandSlug: 'poritep',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6600,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'Poritep',
    brandSlug: 'poritep',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6700,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D300',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6400,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 6500,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6500,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'moscow',
    brand: 'ГРАС',
    brandSlug: 'gras',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6600,
    source: 'Москва — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
];

// ============================================
// САНКТ-ПЕТЕРБУРГ
// ============================================
// Источники:
// - https://gazosilikatstroy.ru/catalog/
// - https://tskarteco.ru/catalog/stroitelnyie-bloki/gazobeton/
export const spbProducts: ProductMatrixItem[] = [
  ...createProductEntries({
    region: 'spb',
    brand: 'Istkult (Ytong)',
    brandSlug: 'istkult-ytong',
    density: 'D400',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 7600,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'Istkult (Ytong)',
    brandSlug: 'istkult-ytong',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 7700,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'Istkult (Ytong)',
    brandSlug: 'istkult-ytong',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 7800,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 6000,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6100,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'Bonolit',
    brandSlug: 'bonolit',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6200,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'ЛСР',
    brandSlug: 'lsr',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 6500,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'ЛСР',
    brandSlug: 'lsr',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6600,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'ЛСР',
    brandSlug: 'lsr',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6700,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'Poritep',
    brandSlug: 'poritep',
    density: 'D400',
    thicknesses: [300],
    pricePerM3: 6500,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'Poritep',
    brandSlug: 'poritep',
    density: 'D500',
    thicknesses: [200, 250, 300, 350, 375, 400],
    pricePerM3: 6600,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
  ...createProductEntries({
    region: 'spb',
    brand: 'Poritep',
    brandSlug: 'poritep',
    density: 'D600',
    thicknesses: [100, 150, 200, 250, 300, 350, 375, 400],
    pricePerM3: 6700,
    source: 'Санкт-Петербург — ассортименты конкурентов (обновлено 08.11.2025)',
  }),
];

// ============================================
// ВСЕ ТОВАРЫ (объединенный массив)
// ============================================
export const allProductsMatrix: ProductMatrixItem[] = [
  ...samaraProducts,
  ...ufaProducts,
  ...moscowProducts,
  ...spbProducts,
];

// ============================================
// СТАТИСТИКА
// ============================================
export const matrixStats = {
  total: allProductsMatrix.length,
  byRegion: {
    samara: samaraProducts.length,
    ufa: ufaProducts.length,
    moscow: moscowProducts.length,
    spb: spbProducts.length,
  },
  byBrand: (() => {
    const brands: Record<string, number> = {};
    allProductsMatrix.forEach(item => {
      brands[item.brand] = (brands[item.brand] || 0) + 1;
    });
    return brands;
  })(),
  withPrices: allProductsMatrix.filter(p => p.pricePerM3 > 0).length,
  withoutPrices: allProductsMatrix.filter(p => p.pricePerM3 === 0).length,
  // Примечание: все цены заполнены приблизительными значениями на основе рыночных данных
  // Требуется проверка на сайтах конкурентов для уточнения
};

