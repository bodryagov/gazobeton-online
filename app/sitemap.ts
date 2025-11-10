import type { MetadataRoute } from 'next';
import { validRegions } from '@/data/regions';
import type { RegionSlug } from '@/types/product';
import { productInfo, getProductPrice } from '@/data/products-prices';

const BASE_URL = 'https://gazobeton-online.ru';

const staticRoutes = [
  '/',
  '/catalog',
  '/calculator',
  '/faq',
  '/contacts',
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

      return [...regionEntries, ...productEntries];
    }),
  ];

  return routes;
}

