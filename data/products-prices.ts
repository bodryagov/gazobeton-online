// Реальные цены товаров по регионам
// Импортировано из data/product-matrix.ts
// Дата обновления: 03.11.2025

import { validRegions } from './regions';
import { allProductsMatrix } from './product-matrix';
import type { ProductBase, ProductRegionalPrice, ProductRegionalPriceMap, RegionSlug } from '@/types/product';

// Базовый тип для цены товара в регионе
export interface ProductPrice extends ProductRegionalPrice {
  productId: number;
}

// Тип для информации о товаре (для маппинга productId -> товар)
export type ProductInfo = ProductBase;

// Функция для создания уникального ключа товара
function createProductKey(item: { brandSlug: string; density: string; thickness: number; length: number; height: number }): string {
  return `${item.brandSlug}_${item.density}_${item.thickness}_${item.length}_${item.height}`;
}

// Функция для генерации названия товара
function generateProductName(brand: string, density: string, thickness: number): string {
  return `${brand} ${density} ${thickness}мм`;
}

// Функция для генерации slug товара
function generateProductSlug(brandSlug: string, density: string, thickness: number): string {
  return `gazobeton-${brandSlug}-${density.toLowerCase()}-${thickness}mm`;
}

// Группируем товары по уникальному ключу и создаем productPrices
const productMap = new Map<string, { productId: number; info: ProductInfo; prices: ProductRegionalPriceMap }>();
let currentProductId = 1;

// Обрабатываем все товары из матрицы
allProductsMatrix.forEach(item => {
  const key = createProductKey(item);
  
  if (!productMap.has(key)) {
    // Создаем новый товар
    const productId = currentProductId++;
    const name = generateProductName(item.brand, item.density, item.thickness);
    
    productMap.set(key, {
      productId,
      info: {
        productId,
        brand: item.brand,
        brandSlug: item.brandSlug,
        density: item.density,
        thickness: item.thickness,
        length: item.length,
        height: item.height,
        name,
        slug: generateProductSlug(item.brandSlug, item.density, item.thickness),
      },
      prices: {},
    });
  }
  
  // Добавляем цену для региона
  const product = productMap.get(key)!;
  product.prices[item.region as RegionSlug] = {
    price: item.pricePerM3,
    inStock: item.inStock,
    lastUpdated: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  };
});

// Создаем объект productPrices
export const productPrices: Record<number, ProductRegionalPriceMap> = {};
const productInfoMap: Record<number, ProductInfo> = {};

productMap.forEach(({ productId, info, prices }) => {
  productPrices[productId] = prices;
  productInfoMap[productId] = info;
});

// Экспортируем маппинг productId -> информация о товаре
export const productInfo: Record<number, ProductInfo> = productInfoMap;

/**
 * Получить цену товара в конкретном регионе
 */
export function getProductPrice(productId: number, regionSlug: string | RegionSlug): ProductPrice | null {
  const product = productPrices[productId];
  if (!product) return null;

  const typedRegionSlug = regionSlug as RegionSlug;
  const regionPrice = product[typedRegionSlug];
  if (!regionPrice) return null;

  return {
    productId,
    regionSlug: typedRegionSlug,
    ...regionPrice,
  };
}

/**
 * Получить все цены товара по всем регионам
 */
export function getProductPricesForAllRegions(productId: number): ProductPrice[] {
  const product = productPrices[productId];
  if (!product) return [];

  return validRegions
    .map((regionSlug) => {
      const typedRegionSlug = regionSlug as RegionSlug;
      const regionPrice = product[typedRegionSlug];
      if (!regionPrice) return null;

      return {
        productId,
        regionSlug: typedRegionSlug,
        ...regionPrice,
      };
    })
    .filter((price): price is ProductPrice => price !== null);
}

/**
 * Получить информацию о товаре по productId
 */
export function getProductInfo(productId: number): ProductInfo | null {
  return productInfo[productId] || null;
}

/**
 * Найти товары по критериям (для фильтрации)
 */
export function findProductsByCriteria(criteria: {
  brandSlug?: string;
  density?: string;
  thickness?: number;
  regionSlug?: RegionSlug;
}): number[] {
  return Object.entries(productInfo)
    .filter(([productId, info]) => {
      if (criteria.brandSlug && info.brandSlug !== criteria.brandSlug) return false;
      if (criteria.density && info.density !== criteria.density) return false;
      if (criteria.thickness && info.thickness !== criteria.thickness) return false;
      if (criteria.regionSlug) {
        const price = productPrices[Number(productId)]?.[criteria.regionSlug];
        if (!price || !price.inStock) return false;
      }
      return true;
    })
    .map(([productId]) => Number(productId));
}

/**
 * Обновить цену товара в регионе (для будущей интеграции с парсером)
 */
export function updateProductPrice(productId: number, regionSlug: string | RegionSlug, data: Omit<ProductPrice, 'productId' | 'regionSlug'>): void {
  if (!productPrices[productId]) {
    productPrices[productId] = {};
  }

  const typedRegionSlug = regionSlug as RegionSlug;
  productPrices[productId][typedRegionSlug] = {
    ...data,
    lastUpdated: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  };
}
