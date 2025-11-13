import Link from 'next/link';
import { getRegionConfig, type RegionConfig, validRegions } from '@/data/regions';
import Catalog from '@/components/Catalog';
import { notFound } from 'next/navigation';
import { getRegionalProducts } from '@/lib/products';
import type { RegionSlug } from '@/types/product';
import { getManufacturer, getAllManufacturers } from '@/data/manufacturers';
import { Metadata } from 'next';
import ManufacturerPageClient from './ManufacturerPageClient';

interface ManufacturerPageProps {
  params: Promise<{
    region: string;
    manufacturer: string;
  }>;
}

const BASE_URL = 'https://gazobeton-online.ru';

// Популярные статьи для ссылок
const recommendedArticles = [
  { href: '/construction/vybor-gazobetona', label: 'Как выбрать газобетон: плотность, толщина и производители' },
  { href: '/construction/kladka-gazobetona', label: 'Кладка газобетона: технология тонкошовной кладки' },
  { href: '/construction/uteplenie-gazobetona', label: 'Когда утеплять газобетон и какие материалы выбрать' },
  { href: '/construction/fundament-dlja-gazobetona', label: 'Фундамент под газобетон: плита, лента или сваи?' },
];

function getManufacturerMeta(
  manufacturer: ReturnType<typeof getManufacturer>,
  regionConfig: RegionConfig
): { title: string; description: string } {
  if (!manufacturer) {
    return {
      title: `Газобетон ${regionConfig.nameGenitive} — Газобетон Online`,
      description: `Газобетонные блоки ${regionConfig.nameGenitive}: цены, наличие, доставка.`,
    };
  }

  // SEO-оптимизированные заголовки под популярные запросы
  // Популярные запросы: "газобетонные блоки [бренд]", "[бренд] официальный сайт", "[бренд] цена", "блоки [бренд]"
  // Из high_freq_low_comp.json: "газобетонные блоки bonolit" (226), "bonolit официальный сайт" (207), "газобетон бонолит цена" (156), "блоки bonolit" (125)
  return {
    title: `Газобетонные блоки ${manufacturer.brandName} ${regionConfig.nameGenitive} — купить, цены за м³`,
    description: `Газобетонные блоки ${manufacturer.brandName} ${regionConfig.nameGenitive}: цены за м³, наличие на складе, доставка. ${manufacturer.description} Официальный дилер.`,
  };
}

export async function generateMetadata({ params }: ManufacturerPageProps): Promise<Metadata> {
  const { region, manufacturer } = await params;
  const regionConfig = getRegionConfig(region);
  const manufacturerData = getManufacturer(manufacturer);

  if (!regionConfig || !manufacturerData) {
    return {
      title: 'Производитель газобетона — Газобетон Online',
      description: 'Газобетонные блоки от производителя.',
    };
  }

  const meta = getManufacturerMeta(manufacturerData, regionConfig);
  const url = `${BASE_URL}/${region}/manufacturer/${manufacturer}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: 'Газобетон Online',
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

// Генерация статических путей для всех комбинаций регион + производитель
export async function generateStaticParams() {
  const regions = validRegions;
  const manufacturers = getAllManufacturers();
  const params: Array<{ region: string; manufacturer: string }> = [];

  // Для каждого региона проверяем, какие производители есть в каталоге
  for (const region of regions) {
    const regionConfig = getRegionConfig(region);
    if (!regionConfig) continue;

    const regionalProducts = getRegionalProducts(regionConfig.slug as RegionSlug);
    const brandsInRegion = new Set(regionalProducts.map((p) => p.brand));

    // Генерируем параметры только для производителей, у которых есть товары в регионе
    for (const manufacturer of manufacturers) {
      if (brandsInRegion.has(manufacturer.brandSlug)) {
        params.push({
          region,
          manufacturer: manufacturer.brandSlug,
        });
      }
    }
  }

  return params;
}

export default async function ManufacturerPage({ params }: ManufacturerPageProps) {
  try {
    const { region, manufacturer } = await params;
    const regionConfig = getRegionConfig(region);
    const manufacturerData = getManufacturer(manufacturer);

    if (!regionConfig || !manufacturerData) {
      notFound();
    }

    // Получаем все товары региона и фильтруем по бренду
    const allRegionalProducts = getRegionalProducts(regionConfig.slug as RegionSlug);
    const manufacturerProducts = allRegionalProducts.filter(
      (product) => product.brand === manufacturerData.brandSlug
    );

    // Если товаров нет, показываем 404
    if (manufacturerProducts.length === 0) {
      notFound();
    }

    const breadcrumbs = [
      { label: 'Главная', href: '/' },
      { label: regionConfig.name, href: `/${region}` },
      { label: 'Каталог', href: `/${region}/catalog` },
      { label: manufacturerData.brandName, href: `/${region}/manufacturer/${manufacturer}` },
    ];

    // Schema.org разметка для страницы производителя
    const pageUrl = `${BASE_URL}/${region}/manufacturer/${manufacturer}`;

    // Brand schema
    const brandSchema = {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      name: manufacturerData.brandName,
      description: manufacturerData.description,
      url: manufacturerData.website || pageUrl,
    };

    // Product schema для товаров (первые 10)
    const productSchemas = manufacturerProducts.slice(0, 10).map((product) => ({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      brand: {
        '@type': 'Brand',
        name: manufacturerData.brandName,
      },
      description: product.description,
      image: product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`,
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Плотность',
          value: product.density,
        },
        {
          '@type': 'PropertyValue',
          name: 'Толщина',
          value: `${product.thickness} мм`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Размер',
          value: product.size,
        },
      ],
      offers: product.pricePerM3 > 0
        ? {
            '@type': 'Offer',
            price: product.pricePerM3,
            priceCurrency: 'RUB',
            availability: product.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/PreOrder',
            itemCondition: 'https://schema.org/NewCondition',
          }
        : undefined,
    }));

    // BreadcrumbList schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: `${BASE_URL}${crumb.href}`,
      })),
    };

    return (
      <>
        {/* Schema.org разметка */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
        />
        {productSchemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <ManufacturerPageClient
          region={region}
          regionConfig={regionConfig}
          manufacturerData={manufacturerData}
          manufacturerProducts={manufacturerProducts}
          breadcrumbs={breadcrumbs}
          recommendedArticles={recommendedArticles}
        />
      </>
    );
  } catch (error) {
    console.error('Error in ManufacturerPage:', error);
    notFound();
  }
}
