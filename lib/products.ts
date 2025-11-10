// Утилиты для работы с товарами и ценами
// Преобразование данных из products-prices.ts в формат для Catalog

import { productInfo, getProductPrice, ProductInfo, getProductPricesForAllRegions, productPrices } from '@/data/products-prices';
import type { Product } from '@/components/Catalog';
import type { ProductBase, ProductRegionalPrice, RegionSlug, ProductWithRegion } from '@/types/product';

export interface ProductDensityOption {
  density: string;
  slug: string | null;
  available: boolean;
}

export interface ProductThicknessOption {
  thickness: number;
  slug: string | null;
  available: boolean;
  inStock: boolean;
}

export type ProductPurpose = 'Перегородочные блоки' | 'Стеновые блоки';

function getProductPurpose(thickness: number): ProductPurpose {
  return thickness <= 150 ? 'Перегородочные блоки' : 'Стеновые блоки';
}

const USE_CASE_LABELS = {
  loadBearing: 'Для несущих стен дома',
  externalWithoutInsulation: 'Для наружных стен дома без утепления',
  garageOrBath: 'Для бани или гаража',
  utility: 'Для хоз.построек',
  infill: 'Для заполнения проемов',
} as const;

function getProductUseCases(info: ProductInfo): string[] {
  const cases = new Set<string>();
  const thickness = info.thickness;

  if (thickness >= 350) {
    cases.add(USE_CASE_LABELS.externalWithoutInsulation);
  }

  if (thickness >= 250) {
    cases.add(USE_CASE_LABELS.loadBearing);
    cases.add(USE_CASE_LABELS.garageOrBath);
  }

  if (thickness >= 200) {
    cases.add(USE_CASE_LABELS.utility);
  }

  if (thickness <= 150) {
    cases.add(USE_CASE_LABELS.infill);
  }

  return Array.from(cases);
}

function isProductPopular(info: ProductInfo): boolean {
  return (
    (info.density === 'D500' && (info.thickness === 300 || info.thickness === 400)) ||
    info.thickness === 100
  );
}

/**
 * Универсальный путь к изображению товара по бренду и толщине
 */
export function getProductImagePath(brandSlug: string, thickness: number): string {
  const isPartitionBlock = thickness <= 150;
  const imageVariant = isPartitionBlock ? 'partition' : 'wall';
  const version = '20241109';
  return `/products/${brandSlug}/${imageVariant}.jpg?v=${version}`;
}

interface ProductCatalogOptions {
  price?: number;
  inStock?: boolean;
  regionsAvailable?: RegionSlug[];
}

/**
 * Преобразовать ProductInfo в формат Product для Catalog
 */
function productInfoToCatalogProduct(
  info: ProductInfo,
  options: ProductCatalogOptions = {}
): Product {
  const { price = 0, inStock = false, regionsAvailable = [] } = options;
  const size = `${info.length}×${info.thickness}×${info.height}`;
  const purpose = getProductPurpose(info.thickness);
  const description = `Газобетонный блок ${info.brand} ${info.density} толщиной ${info.thickness} мм. Размер: ${size} мм. ${purpose === 'Стеновые блоки' ? 'Идеален для наружных и несущих стен.' : 'Подходит для внутренних перегородок и лёгких конструкций.'}`;
  const useCases = getProductUseCases(info);
  const popular = isProductPopular(info);

  return {
    id: info.productId,
    name: info.name,
    brand: info.brandSlug,
    brandName: info.brand,
    thickness: info.thickness,
    density: info.density,
    price,
    pricePerM3: price,
    size,
    length: info.length,
    height: info.height,
    image: getProductImagePath(info.brandSlug, info.thickness),
    inStock,
    description,
    slug: info.slug,
    purpose,
    regionsAvailable,
    useCases,
    isPopular: popular,
  };
}

/**
 * Получить все товары для региона с региональными ценами
 */
export function getRegionalProducts(regionSlug: RegionSlug): Product[] {
  const products: Product[] = [];
  
  // Проходим по всем товарам из productInfo
  Object.values(productInfo).forEach((info) => {
    // Получаем цену для региона
    const priceData = getProductPrice(info.productId, regionSlug);
    
    // Если цена есть, добавляем товар
    if (priceData) {
      products.push(
        productInfoToCatalogProduct(info, {
          price: priceData.price,
          inStock: priceData.inStock,
          regionsAvailable: priceData.inStock ? [regionSlug] : [],
        })
      );
    }
  });
  
  // Сортируем по productId для стабильности
  return products.sort((a, b) => a.id - b.id);
}

/**
 * Получить товары для региона с фильтрацией по наличию
 */
export function getRegionalProductsInStock(regionSlug: RegionSlug): Product[] {
  return getRegionalProducts(regionSlug).filter(p => p.inStock);
}

/**
 * Найти товар по productId в регионе
 */
export function getProductById(productId: number, regionSlug: RegionSlug): Product | null {
  const info = productInfo[productId];
  if (!info) return null;
  
  const priceData = getProductPrice(productId, regionSlug);
  if (!priceData) return null;
  
  return productInfoToCatalogProduct(info, {
    price: priceData.price,
    inStock: priceData.inStock,
    regionsAvailable: priceData.inStock ? [regionSlug] : [],
  });
}

/**
 * Получить базовую информацию о товаре по slug
 */
export function getProductBaseBySlug(slug: string): ProductBase | null {
  try {
    if (!slug) return null;
    
    const entry = Object.values(productInfo).find((info) => info.slug === slug);
    if (!entry || !entry.slug) return null;

    return {
      productId: entry.productId,
      name: entry.name,
      brand: entry.brand,
      brandSlug: entry.brandSlug,
      density: entry.density,
      thickness: entry.thickness,
      length: entry.length,
      height: entry.height,
      slug: entry.slug,
    };
  } catch (error) {
    console.error('Error in getProductBaseBySlug:', error);
    return null;
  }
}

/**
 * Получить все региональные цены товара
 */
export function getRegionalPricesForProduct(productId: number): ProductRegionalPrice[] {
  return getProductPricesForAllRegions(productId).map(({ regionSlug, price, pricePerUnit, inStock, lastUpdated }) => ({
    regionSlug: regionSlug as RegionSlug,
    price,
    pricePerUnit,
    inStock,
    lastUpdated,
  }));
}

/**
 * Получить товар с региональными данными по slug и региону
 */
export function getProductWithRegion(slug: string, regionSlug: RegionSlug): ProductWithRegion | null {
  try {
    if (!slug || !regionSlug) return null;
    
    const base = getProductBaseBySlug(slug);
    if (!base) return null;

    const priceData = getProductPrice(base.productId, regionSlug);
    if (!priceData) return null;

    return {
      ...base,
      regionSlug,
      price: priceData.price,
      pricePerUnit: priceData.pricePerUnit,
      inStock: priceData.inStock,
      lastUpdated: priceData.lastUpdated,
    };
  } catch (error) {
    console.error('Error in getProductWithRegion:', error);
    return null;
  }
}

/**
 * Получить все модификации товара (по бренду/плотности) для переключателя
 */
export function getProductVariants(base: ProductBase): ProductBase[] {
  return Object.values(productInfo)
    .filter((info) => info.brandSlug === base.brandSlug && info.density === base.density)
    .sort((a, b) => a.thickness - b.thickness)
    .map((info) => ({
      productId: info.productId,
      name: info.name,
      brand: info.brand,
      brandSlug: info.brandSlug,
      density: info.density,
      thickness: info.thickness,
      length: info.length,
      height: info.height,
      slug: info.slug,
    }));
}

export function getAllProductSlugs(): string[] {
  try {
    const products = Object.values(productInfo);
    if (!products || products.length === 0) {
      console.warn('productInfo is empty or not initialized');
      return [];
    }
    return products
      .map((info) => info.slug)
      .filter((slug): slug is string => Boolean(slug));
  } catch (error) {
    console.error('Error in getAllProductSlugs:', error);
    return [];
  }
}

function parseDensityValue(density: string): number {
  const match = density.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

export function getDensityOptionsForRegion(brandSlug: string, regionSlug: RegionSlug): ProductDensityOption[] {
  const densityMap = new Map<string, { slug: string | null; available: boolean }>();

  Object.values(productInfo)
    .filter((info) => info.brandSlug === brandSlug)
    .forEach((info) => {
      if (!densityMap.has(info.density)) {
        densityMap.set(info.density, { slug: null, available: false });
      }

      const entry = densityMap.get(info.density)!;
      const priceData = getProductPrice(info.productId, regionSlug);

      if (priceData) {
        entry.available = true;
        entry.slug = info.slug;
      } else if (!entry.slug) {
        entry.slug = info.slug;
      }
    });

  return Array.from(densityMap.entries())
    .sort((a, b) => parseDensityValue(a[0]) - parseDensityValue(b[0]))
    .map(([density, value]) => ({
      density,
      slug: value.available ? value.slug : null,
      available: value.available,
    }));
}

export function getThicknessOptionsForRegion(
  brandSlug: string,
  density: string,
  regionSlug: RegionSlug
): ProductThicknessOption[] {
  return Object.values(productInfo)
    .filter((info) => info.brandSlug === brandSlug && info.density === density)
    .sort((a, b) => a.thickness - b.thickness)
    .map((info) => {
      const priceData = getProductPrice(info.productId, regionSlug);
      return {
        thickness: info.thickness,
        slug: priceData ? info.slug : null,
        available: Boolean(priceData),
        inStock: priceData?.inStock ?? false,
      };
    });
}

function getAllRegionPrices(productId: number): Array<[RegionSlug, Omit<ProductRegionalPrice, 'regionSlug'>]> {
  const prices = productPrices[productId];
  if (!prices) {
    return [];
  }

  return Object.entries(prices).map(([region, data]) => [region as RegionSlug, data]);
}

export function getAllCatalogProducts(): Product[] {
  const products: Product[] = [];

  Object.values(productInfo).forEach((info) => {
    const prices = getAllRegionPrices(info.productId);
    const numericPrices = prices
      .map(([, price]) => price.price)
      .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value) && value > 0);
    const price = numericPrices.length > 0 ? Math.min(...numericPrices) : 0;
    const regionsAvailable = prices
      .filter(([, price]) => Boolean(price.inStock))
      .map(([regionSlug]) => regionSlug);
    const inStock = regionsAvailable.length > 0;

    products.push(
      productInfoToCatalogProduct(info, {
        price,
        inStock,
        regionsAvailable,
      })
    );
  });

  return products.sort((a, b) => {
    const brandCompare = a.brandName.localeCompare(b.brandName, 'ru');
    if (brandCompare !== 0) return brandCompare;

    const densityCompare = parseDensityValue(a.density) - parseDensityValue(b.density);
    if (densityCompare !== 0) return densityCompare;

    return a.thickness - b.thickness;
  });
}

