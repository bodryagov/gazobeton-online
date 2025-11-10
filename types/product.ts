export type RegionSlug = 'moscow' | 'spb' | 'ufa' | 'samara';

export interface ProductBase {
  productId: number;
  name: string;
  brand: string;
  brandSlug: string;
  density: string;
  thickness: number;
  length: number;
  height: number;
  slug: string;
}

export interface ProductRegionalPrice {
  regionSlug: RegionSlug;
  price: number;
  pricePerUnit?: number;
  inStock: boolean;
  lastUpdated?: string;
}

export type ProductRegionalPriceMap = Partial<Record<RegionSlug, Omit<ProductRegionalPrice, 'regionSlug'>>>;

export type ProductWithRegion = ProductBase & ProductRegionalPrice;

