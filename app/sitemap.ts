import type { MetadataRoute } from 'next';
import { validRegions } from '@/data/regions';
import type { RegionSlug } from '@/types/product';
import { productInfo, getProductPrice } from '@/data/products-prices';
import { getAllManufacturers } from '@/data/manufacturers';
import { getRegionalProducts } from '@/lib/products';
import { getRegionConfig } from '@/data/regions';

const BASE_URL = 'https://gazobeton-online.ru';

const staticRoutes = [
  '/',
  '/catalog',
  '/calculator',
  '/faq',
  '/contacts',
  '/delivery',
  '/construction',
  '/privacy',
];

// Список статей из раздела /construction
const constructionArticles = [
  'vybor-gazobetona',
  'gazobeton-v-sravnenii',
  'kladka-gazobetona',
  'uteplenie-gazobetona',
  'fundament-dlja-gazobetona',
  'kalkulyator-gazobetona',
  'proekt-doma-10x10',
  'banja-iz-gazobloka',
  'armirovanie-i-peremychki',
  'dostavka-i-hranenije',
  'hranenie-i-zima',
  'instrumenty-dlja-gazobetona',
  'montazh-bonolit',
  'samovyvoz-i-manipulyator',
  'skolko-blokov-nado',
  'uteplenie-ili-net',
  'zashita-ot-vlagi',
  'hozpostrojki-iz-gazobetona',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    ...staticRoutes.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...validRegions.flatMap((region) => {
      const regionSlug = region as RegionSlug;
      const regionUrl = `${BASE_URL}/${regionSlug}`;
      const regionCatalogUrl = `${regionUrl}/catalog`;
      const regionDeliveryUrl = `${regionUrl}/delivery`;
      const regionCalculatorUrl = `${regionUrl}/calculator`;

      const regionEntries = [
        {
          url: regionUrl,
          lastModified: now,
          changeFrequency: 'daily' as const,
          priority: 0.9,
        },
        {
          url: regionCatalogUrl,
          lastModified: now,
          changeFrequency: 'daily' as const,
          priority: 0.9,
        },
        {
          url: regionDeliveryUrl,
          lastModified: now,
          changeFrequency: 'daily' as const,
          priority: 0.8,
        },
        {
          url: regionCalculatorUrl,
          lastModified: now,
          changeFrequency: 'daily' as const,
          priority: 0.8,
        },
      ];

      const productEntries = Object.values(productInfo)
        .filter((info) => {
          if (!info.slug) {
            return false;
          }
          const priceData = getProductPrice(info.productId, regionSlug);
          return Boolean(priceData);
        })
        .map((info) => ({
          url: `${regionCatalogUrl}/${info.slug}`,
          lastModified: now,
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }));

      // Страницы производителей для региона
      const regionalProducts = getRegionalProducts(regionSlug);
      const brandsInRegion = new Set(regionalProducts.map((p) => p.brand));
      const manufacturers = getAllManufacturers();
      
      const manufacturerEntries = manufacturers
        .filter((m) => brandsInRegion.has(m.brandSlug))
        .map((manufacturer) => ({
          url: `${regionUrl}/manufacturer/${manufacturer.brandSlug}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        }));

      return [...regionEntries, ...productEntries, ...manufacturerEntries];
    }),
    // Статьи из раздела /construction
    ...constructionArticles.map((slug) => ({
      url: `${BASE_URL}/construction/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return routes;
}

