import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getRegionConfig, validRegions, type RegionConfig } from '@/data/regions';
import { regionQueryData } from '@/data/seo/region-query-data';
import {
  getAllProductSlugs,
  getProductBaseBySlug,
  getProductWithRegion,
  getDensityOptionsForRegion,
  getThicknessOptionsForRegion,
  getProductImagePath,
} from '@/lib/products';
import type { ProductThicknessOption } from '@/lib/products';
import ProductVariantSelector from '@/components/ProductVariantSelector';
import ProductOrderButton from '@/components/ProductOrderButton';
import RelatedProducts from '@/components/RelatedProducts';
import ProductSEOSection from '@/components/ProductSEOSection';
import ProductArticles from '@/components/ProductArticles';
import ProductConsultationCTA from '@/components/ProductConsultationCTA';
import type { RegionSlug, ProductBase, ProductWithRegion } from '@/types/product';
import QuizButton from '@/components/QuizButton';
import RegionalCTABlock from '@/components/RegionalCTABlock';
import ProductTabs from '@/components/ProductTabs';
import Breadcrumbs from '@/components/Breadcrumbs';

interface ProductPageParams {
  region: string;
  productSlug: string;
}

interface SectionLink {
  id: string;
  label: string;
}

const SECTION_LINKS: SectionLink[] = [
  { id: 'characteristics', label: 'Характеристики' },
  { id: 'description', label: 'Описание' },
  { id: 'delivery', label: 'Доставка и разгрузка' },
  { id: 'faq', label: 'FAQ' },
  { id: 'documents', label: 'Документы' },
];

const PALLET_VOLUME_RANGES: Record<'wall' | 'partition', [number, number]> = {
  wall: [1.8, 2.2],
  partition: [1.1, 1.4],
};

function toRegionSlug(region: string): RegionSlug | null {
  if (validRegions.includes(region)) {
    return region as RegionSlug;
  }
  return null;
}

function formatSize(base: ProductBase): string {
  return `${base.length}×${base.thickness}×${base.height} мм`;
}

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU');
}

const BASE_URL = 'https://gazobeton-online.ru';

const DENSITY_HINTS: Record<string, string> = {
  D300: 'D300 — самая тёплая плотность (≈300 кг/м³), подходит для ненагруженных стен и утепления.',
  D350: 'D350 — лёгкий блок с хорошей теплоизоляцией, чаще используется для мансард и перегородок.',
  D400: 'D400 — тёплый блок для наружных стен энергоэффективных домов, требует базового утепления.',
  D500: 'D500 — универсальная плотность для коттеджей и малоэтажных домов, баланс тепла и прочности.',
  D600: 'D600 — повышенная прочность (≈600 кг/м³), выдерживает большие нагрузки, чаще требует утепления.',
  D700: 'D700 — тяжёлый блок для технических и промышленных объектов с высокой несущей способностью.',
};

const STRENGTH_HINTS: Record<string, string> = {
  'B2.5': 'Класс прочности B2.5 — допускает строительство малоэтажных домов с лёгкими перекрытиями.',
  'B3.5': 'Класс прочности B3.5 — выдерживает несущие стены до трёх этажей с перекрытиями из плит или дерева.',
};

const FROST_HINTS: Record<string, string> = {
  F35: 'F35 — до 35 циклов замораживания/оттаивания без потери прочности.',
  F50: 'F50 — до 50 циклов замораживания/оттаивания, подходит для регионов с суровой зимой.',
};

function formatNumeric(value: number, fractionDigits = 0): string {
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function calculateBlockVolume(base: ProductBase | ProductWithRegion): number {
  const volume = (base.length * base.thickness * base.height) / 1_000_000_000;
  return Number.isFinite(volume) && volume > 0 ? volume : 0;
}

function getBlocksPerCubicMeter(blockVolume: number): number | null {
  if (!blockVolume) {
    return null;
  }
  const blocks = 1 / blockVolume;
  return Number.isFinite(blocks) ? Math.round(blocks) : null;
}

function formatVolumeRange(range: [number, number]): string {
  const [min, max] = range;
  if (!min || !max) {
    return '';
  }

  if (Math.abs(min - max) <= 0.05) {
    return `${formatNumeric((min + max) / 2, 1)} м³`;
  }

  return `${formatNumeric(min, 1)}–${formatNumeric(max, 1)} м³`;
}

function calculateBlocksPerPalletRange(blockVolume: number, range: [number, number]): [number, number] | null {
  if (!blockVolume) {
    return null;
  }

  const [min, max] = range;
  const minBlocks = min / blockVolume;
  const maxBlocks = max / blockVolume;

  if (!Number.isFinite(minBlocks) || !Number.isFinite(maxBlocks)) {
    return null;
  }

  return [Math.floor(minBlocks), Math.ceil(maxBlocks)];
}

function calculatePricePerPalletRange(pricePerCubic: number, volumeRange: [number, number]): [number, number] | null {
  if (!pricePerCubic) {
    return null;
  }

  const [minVolume, maxVolume] = volumeRange;
  const minPrice = pricePerCubic * minVolume;
  const maxPrice = pricePerCubic * maxVolume;

  if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) {
    return null;
  }

  return [Math.round(minPrice / 100) * 100, Math.round(maxPrice / 100) * 100];
}

function formatRangeLabel(range: [number, number] | null, suffix = '', fractionDigits = 0): string | null {
  if (!range) {
    return null;
  }

  const [min, max] = range;
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  if (Math.abs(min - max) <= Math.pow(10, -fractionDigits) * 2) {
    return `≈ ${formatNumeric((min + max) / 2, fractionDigits)}${suffix}`;
  }

  return `≈ ${formatNumeric(min, fractionDigits)}–${formatNumeric(max, fractionDigits)}${suffix}`;
}

function formatBlocksRange(range: [number, number] | null): string | null {
  if (!range) {
    return null;
  }
  const [min, max] = range;
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }
  if (Math.abs(min - max) <= 1) {
    return `≈ ${Math.round((min + max) / 2)} блоков`;
  }
  return `≈ ${Math.max(1, Math.floor(min))}–${Math.ceil(max)} блоков`;
}

function buildProductKeywords(
  regionSlug: RegionSlug | null,
  product: ProductBase | ProductWithRegion | null,
  regionConfig?: RegionConfig | null
): string[] {
  if (!product) {
    return [];
  }

  const keywords = new Set<string>();
  const add = (value?: string | null) => {
    const trimmed = (value || '').replace(/\s+/g, ' ').trim();
    if (trimmed) {
      keywords.add(trimmed);
    }
  };

  const brandLower = product.brand.toLowerCase();
  const brandSlugLower = product.brandSlug.toLowerCase();
  const densityLabel = product.density.replace(/\s+/g, '').toLowerCase();

  add(product.name);
  add(`Газобетон ${product.brand} ${product.density}`);
  add(`Газобетонные блоки ${product.brand}`);
  add(`Газоблок ${product.brand}`);
  add(`Газобетон ${product.density}`);
  add(`Газоблок ${product.density} ${product.thickness} мм`);
  add(`Газобетон ${product.thickness} мм`);

  if (regionConfig) {
    add(`Газобетон ${regionConfig.nameGenitive}`);
    add(`Купить газобетон ${regionConfig.namePrepositional}`);
    add(`Газобетон цена ${regionConfig.namePrepositional}`);
    add(`Газоблок ${regionConfig.name}`);
  }

  if (regionSlug) {
    const regionData = regionQueryData[regionSlug];
    if (regionData) {
      const candidates = [
        ...regionData.highFreqLowComp,
        ...regionData.top,
      ];
      for (const query of candidates) {
        const lower = query.toLowerCase();
        if (
          lower.includes(brandLower) ||
          lower.includes(brandSlugLower) ||
          lower.includes(densityLabel) ||
          keywords.size < 16
        ) {
          add(query);
        }
        if (keywords.size >= 28) {
          break;
        }
      }
    }
  }

  return Array.from(keywords).slice(0, 25);
}

export async function generateStaticParams() {
  try {
    const productSlugs = getAllProductSlugs();
    
    if (!productSlugs || productSlugs.length === 0) {
      console.warn('No product slugs found');
      return [];
    }

    return validRegions.flatMap((region) =>
      productSlugs.map((productSlug) => ({
        region,
        productSlug,
      }))
    );
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<ProductPageParams> }): Promise<Metadata> {
  const { region, productSlug } = await params;
  const regionSlug = toRegionSlug(region);
  const regionConfig = regionSlug ? getRegionConfig(regionSlug) : null;
  const product = getProductBaseBySlug(productSlug);

  if (!regionConfig || !product) {
    return {
      title: 'Товар не найден | Газобетон Online',
    };
  }

  const title = `${product.name} ${regionConfig.seo?.titleSuffix || regionConfig.nameGenitive} | Газобетон Online`;
  const description = `Газобетон ${product.brand} ${product.density} толщиной ${product.thickness} мм. Цена, характеристики, доставка ${regionConfig.namePrepositional}.`;
  const canonical = `https://gazobeton-online.ru/${regionConfig.slug}/catalog/${product.slug}`;
  const keywords = buildProductKeywords(regionSlug, product, regionConfig);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Газобетон Online',
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<ProductPageParams> }) {
  try {
    const { region, productSlug } = await params;
    const regionSlug = toRegionSlug(region);
    if (!regionSlug) {
      notFound();
    }

    const regionConfig = getRegionConfig(regionSlug);
    if (!regionConfig) {
      console.warn(`Region config not found for: ${regionSlug}`);
      notFound();
    }

    // Сначала проверяем, существует ли товар вообще
    const productBase = getProductBaseBySlug(productSlug);
    if (!productBase) {
      console.warn(`Product not found by slug: ${productSlug}`);
      notFound();
    }

    // Затем проверяем, есть ли цена для этого региона
    let product = getProductWithRegion(productSlug, regionSlug);
    if (!product) {
      console.warn(`Product ${productSlug} not available in region ${regionSlug}`);
      // Если товар существует, но нет цены для региона, все равно показываем страницу
      // но с информацией о том, что товар недоступен в этом регионе
      product = {
        ...productBase,
        regionSlug,
        price: 0,
        inStock: false,
        lastUpdated: undefined,
      } as ProductWithRegion;
    }

    const productImage = getProductImagePath(product.brandSlug, product.thickness);
    const isWallBlock = product.thickness > 150;
    const blockVolume = calculateBlockVolume(product);
    const blockVolumeLabel = blockVolume
      ? `${formatNumeric(blockVolume, 3)} м³ (≈ ${formatNumeric(blockVolume * 1000, 0)} л)`
      : null;
    const blocksPerCubic = getBlocksPerCubicMeter(blockVolume);
    const palletVolumeRange = PALLET_VOLUME_RANGES[isWallBlock ? 'wall' : 'partition'];
    const palletVolumeLabel = formatVolumeRange(palletVolumeRange);
    const palletHint = palletVolumeLabel
      ? `≈ ${palletVolumeLabel}`
      : isWallBlock
        ? '≈ 1,8–2,2 м³'
        : '≈ 1,1–1,4 м³';
    const blocksPerPalletRange = calculateBlocksPerPalletRange(blockVolume, palletVolumeRange);
    const blocksPerPalletLabel = formatBlocksRange(blocksPerPalletRange);
    const pricePerPalletRange = product.price > 0 ? calculatePricePerPalletRange(product.price, palletVolumeRange) : null;
    const pricePerPalletLabel = formatRangeLabel(pricePerPalletRange, ' ₽');
    const blockVolumeDisplay = blockVolumeLabel ?? 'Уточняйте у менеджера';
    const blocksPerCubicDisplay = blocksPerCubic ? `≈ ${blocksPerCubic} шт.` : 'Уточняйте у менеджера';
    const blocksPerPalletDisplay = blocksPerPalletLabel ?? 'Уточняйте у менеджера';
    const palletVolumeDisplay = palletVolumeLabel ?? 'Уточняйте у менеджера';
    const blocksPerPalletSentence = blocksPerPalletLabel ? `На поддоне ${blocksPerPalletLabel}. ` : '';
    const phoneHref = regionConfig.contacts.phone.replace(/[^+\d]/g, '');
    const freeFromShortLabel = regionConfig.delivery.freeFrom ? `${regionConfig.delivery.freeFrom} м³` : 'по согласованию';
    const priceUpdatedLabel = product.lastUpdated
      ? new Date(product.lastUpdated).toLocaleDateString('ru-RU')
      : null;
    const densityTitle = DENSITY_HINTS[product.density] ?? 'Плотность газобетона в килограммах на кубический метр.';
    const strengthValue = 'B3.5';
    const strengthTitle =
      STRENGTH_HINTS[strengthValue] ?? 'Класс прочности определяет допустимые нагрузки на несущие стены.';
    const frostValue = 'F50';
    const frostTitle =
      FROST_HINTS[frostValue] ?? 'Морозостойкость показывает количество циклов замерзания-оттаивания без потери качества.';

    // Получаем базовую информацию для вариантов
    const densityOptions = getDensityOptionsForRegion(product.brandSlug, regionSlug);
    const thicknessOptionsMap = densityOptions.reduce<Record<string, ProductThicknessOption[]>>((acc, option) => {
      acc[option.density] = getThicknessOptionsForRegion(product.brandSlug, option.density, regionSlug);
      return acc;
    }, {});
    const seoParagraphs = [
      `Поставляем газобетонные блоки ${product.brand} ${product.density} ${regionConfig.namePrepositional}. Самовывоз доступен по адресу ${regionConfig.contacts.address}.`,
      regionConfig.delivery.freeFrom
        ? `Доставка ${regionConfig.namePrepositional} от ${formatPrice(regionConfig.delivery.basePrice)} ₽. Бесплатно от ${regionConfig.delivery.freeFrom} м³ при единовременной поставке.`
        : `Доставка ${regionConfig.namePrepositional} от ${formatPrice(regionConfig.delivery.basePrice)} ₽.`,
    ];

    const productKeywords = buildProductKeywords(regionSlug, product, regionConfig);
    const canonical = `${BASE_URL}/${regionConfig.slug}/catalog/${product.slug}`;
    const productImageUrl = productImage.startsWith('http') ? productImage : `${BASE_URL}${productImage}`;
    const priceValidUntil = product.lastUpdated
      ? new Date(new Date(product.lastUpdated).getTime() + 1000 * 60 * 60 * 24 * 30)
          .toISOString()
          .split('T')[0]
      : undefined;
    const offerAvailability = product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder';
    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      availability: product.price > 0 ? offerAvailability : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceCurrency: 'RUB',
      url: canonical,
      seller: {
        '@type': 'Organization',
        name: 'Газобетон Online',
        telephone: regionConfig.contacts.phoneFormatted,
        areaServed: regionConfig.name,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: regionConfig.delivery.basePrice,
          currency: 'RUB',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'RU',
          addressRegion: regionConfig.name,
        },
      },
      areaServed: {
        '@type': 'City',
        name: regionConfig.name,
      },
    };

    if (product.price > 0) {
      offer.price = product.price;
      offer.unitPriceSpecification = {
        '@type': 'UnitPriceSpecification',
        price: product.price,
        priceCurrency: 'RUB',
        unitCode: 'MTQ',
        referenceQuantity: {
          '@type': 'QuantitativeValue',
          value: 1,
          unitCode: 'MTQ',
        },
      };
      if (priceValidUntil) {
        offer.priceValidUntil = priceValidUntil;
      }
    }

    const additionalProperty = [
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
        name: 'Размер блока',
        value: formatSize(product),
      },
      {
        '@type': 'PropertyValue',
        name: 'Длина',
        value: `${product.length} мм`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Высота',
        value: `${product.height} мм`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Тип блока',
        value: isWallBlock ? 'Стеновой' : 'Перегородочный',
      },
    ];

    const schemaDescription = `Газобетонные блоки ${product.brand} ${product.density} толщиной ${product.thickness} мм — купить ${regionConfig.nameGenitive}. Цена за м³, доставка ${regionConfig.namePrepositional}, самовывоз из ${regionConfig.contacts.address}.`;
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: schemaDescription,
      sku: String(product.productId),
      mpn: String(product.productId),
      productID: String(product.productId),
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: 'Газобетонные блоки',
      material: 'Газобетон автоклавный',
      image: productImageUrl,
      url: canonical,
      keywords: productKeywords,
      additionalProperty,
      offers: offer,
      areaServed: {
        '@type': 'City',
        name: regionConfig.name,
      },
      potentialAction: {
        '@type': 'BuyAction',
        target: canonical,
      },
    };

    const faqItems = [
      {
        question: 'Сколько блоков в одном кубе и сколько поддонов нужно для заказа?',
        answer: `В одном кубе помещается в среднем 34–40 стеновых блоков и до 70 перегородочных. Один поддон занимает ${palletHint}. ${blocksPerPalletSentence}Мы поможем посчитать объём и количество поддонов под ваш проект.`,
      },
      {
        question: `Какой клей использовать для кладки газобетона ${product.brand}?`,
        answer: `Для блоков ${product.brand} рекомендуем тонкошовный клей на цементной основе с фракцией до 0.63 мм. Он позволяет обеспечить шов 2–3 мм и минимизировать теплопотери.`,
      },
      {
        question: 'Нужно ли дополнительно утеплять стены из газобетона?',
        answer: 'Для домов постоянного проживания рекомендуем наружную минераловатную плиту 50 мм при толщине блока 300–400 мм. Для сезонных домов можно оставить газобетон без дополнительного утепления.',
      },
      {
        question: 'Как хранить газобетон на участке до монтажа?',
        answer: 'Держите поддоны на ровной площадке, защищайте от влаги и перепадов температуры. Плёнку снимайте непосредственно перед кладкой, чтобы блоки сохранили геометрию.',
      },
      {
        question: `Можно ли заказать доставку и разгрузку ${regionConfig.namePrepositional}?`,
        answer: `Да, доставляем манипулятором ${regionConfig.namePrepositional} от ${formatPrice(
          regionConfig.delivery.basePrice
        )} ₽, разгрузка включена. ${
          regionConfig.delivery.freeFrom
            ? `Бесплатно при заказе от ${regionConfig.delivery.freeFrom} м³.`
            : 'Бесплатно — по согласованию с менеджером.'
        }`,
      },
    ];

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Главная',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: regionConfig.name,
          item: `${BASE_URL}/${regionConfig.slug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Каталог газобетона',
          item: `${BASE_URL}/${regionConfig.slug}/catalog`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.name,
          item: canonical,
        },
      ],
    };

    const schemaScripts = [
      { key: 'product-structured-data', data: productSchema },
      { key: 'product-breadcrumb-data', data: breadcrumbSchema },
      { key: 'product-faq-data', data: faqSchema },
  ];

  return (
      <>
        {schemaScripts.map(({ key, data }) => (
          <script
            key={key}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
    <main className="bg-gray-50 pb-16">
      <nav aria-label="Хлебные крошки" className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: regionConfig.name, href: `/${regionConfig.slug}` },
              { label: 'Каталог газобетона', href: `/${regionConfig.slug}/catalog` },
              { label: product.name },
            ]}
          />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Link href={`/${regionConfig.slug}/catalog`} className="inline-flex items-center text-sm text-gray-500 hover:text-orange-500 mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
          </svg>
          Вернуться в каталог
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 md:p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] lg:items-start">
              <div className="space-y-6">
                <div className="bg-gray-100 rounded-2xl p-4 md:p-6 flex items-center justify-center">
                  <div className="relative w-full max-w-[520px] aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={productImage}
                      alt={`Газобетонные блоки ${product.brand} ${product.density} толщиной ${product.thickness} мм`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 520px, (min-width: 768px) 60vw, 100vw"
                      priority
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-700">
                  <span className="inline-flex items-center bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                    <abbr title={densityTitle}>{product.density}</abbr>
                  </span>
                  <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Толщина {product.thickness} мм</span>
                  <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{product.length}×{product.height} мм</span>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  Газобетонные блоки {product.brand}{' '}
                  <abbr title={densityTitle}>{product.density}</abbr> толщиной {product.thickness} мм — надёжный выбор
                  для строительства энергоэффективных домов {regionConfig.nameGenitive}. Материал сочетает высокую
                  прочность, точную геометрию и хорошие теплоизоляционные характеристики, что позволяет сократить
                  расходы на кладку и дальнейшее утепление.
                </p>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-24">
                <div className="border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6 bg-white">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {product.name} {regionConfig.nameGenitive}
                    </h1>
                    <p className="text-sm text-gray-500">Производитель: {product.brand}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Цена за м³</p>
                    <p className={`text-3xl font-bold ${product.price > 0 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {product.price > 0 ? `${formatPrice(product.price)} ₽` : 'Цена по запросу'}
                    </p>
                    {pricePerPalletLabel ? (
                      <p className="text-sm text-gray-600 mt-3">
                        Цена за поддон: <span className="font-semibold text-gray-900">{pricePerPalletLabel}</span>
                        {palletVolumeLabel ? ` (${palletVolumeLabel})` : null}
                      </p>
                    ) : null}
                    {product.price > 0 && (
                      <div className="mt-4 space-y-2 text-xs text-gray-500">
                        <p>
                          Стоимость указана за 1 м³ материала. Один поддон {palletHint} — итоговую стоимость поставки
                          уточним при расчёте заявки. {blocksPerPalletLabel ? `На поддоне ${blocksPerPalletLabel}.` : ''}
                        </p>
                        {priceUpdatedLabel ? (
                          <p>Дата обновления прайса: {priceUpdatedLabel}</p>
                        ) : null}
                      </div>
                    )}
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                          product.inStock
                            ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
                            : 'border-gray-200 text-gray-500 bg-gray-50'
                        }`}
                      >
                        {product.inStock ? 'В наличии' : 'Под заказ'}
                      </span>
                    </div>
                  </div>

                  <Suspense fallback={null}>
                    <ProductVariantSelector
                      regionSlug={regionSlug}
                      currentDensity={product.density}
                      currentThickness={product.thickness}
                      currentSlug={product.slug}
                      densityOptions={densityOptions}
                      thicknessOptionsMap={thicknessOptionsMap}
                      mode="inline"
                    />
                  </Suspense>

                  <div className="flex flex-col gap-3">
                    <ProductOrderButton
                      productName={`${product.name} ${regionConfig.nameGenitive}`}
                      regionName={regionConfig.name}
                      label={product.inStock ? 'Оформить заказ' : 'Оставить заявку'}
                    />
                    <a
                      href={`tel:${phoneHref}`}
                      className="text-center px-8 py-3 rounded-xl border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white transition"
                    >
                      Позвонить: {regionConfig.contacts.phoneFormatted}
                    </a>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3 text-sm text-gray-600">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="font-semibold text-gray-900">Самовывоз</p>
                      <p className="text-xs text-gray-500 mt-1">Сегодня — бесплатно из {regionConfig.contacts.address}</p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="font-semibold text-gray-900">Доставка</p>
                      <p className="text-xs text-gray-500 mt-1">В течение 1 дня от {formatPrice(regionConfig.delivery.basePrice)} ₽</p>
                      {regionConfig.delivery.freeFrom ? (
                        <p className="text-xs text-gray-500">Бесплатно от {freeFromShortLabel}</p>
                      ) : (
                        <p className="text-xs text-gray-500">Бесплатно — по согласованию</p>
                      )}
                    </div>
                  </div>
                </div>

              </aside>
            </div>
          </div>
        </article>
      </div>

      <ProductTabs 
        tabs={SECTION_LINKS} 
        defaultTab="characteristics"
        children={{
          characteristics: (
            <div className="space-y-12">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Основные характеристики</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Габариты</h3>
              <p className="text-lg font-semibold text-gray-900">{formatSize(product)}</p>
              <p className="text-sm text-gray-600 mt-2">Длина × толщина × высота</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Плотность</h3>
              <p className="text-lg font-semibold text-gray-900">{product.density}</p>
              <p className="text-sm text-gray-600 mt-2">Теплая кладка с повышенной прочностью</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Прочность</h3>
              <p className="text-lg font-semibold text-gray-900">B3.5</p>
              <p className="text-sm text-gray-600 mt-2">Подходит для несущих стен до 3 этажей</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Морозостойкость</h3>
              <p className="text-lg font-semibold text-gray-900">F50</p>
              <p className="text-sm text-gray-600 mt-2">Выдерживает циклы замерзания и оттаивания</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">Технические характеристики газобетонного блока</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Параметр
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Значение
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Производитель
                  </th>
                  <td className="px-4 py-3">{product.brand}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Плотность
                  </th>
                  <td className="px-4 py-3">
                    <abbr title={densityTitle}>{product.density}</abbr>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Размер блока
                  </th>
                  <td className="px-4 py-3">{formatSize(product)}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Объём одного блока
                  </th>
                  <td className="px-4 py-3">{blockVolumeDisplay}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Количество в 1 м³
                  </th>
                  <td className="px-4 py-3">{blocksPerCubicDisplay}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Прочность
                  </th>
                  <td className="px-4 py-3">
                    <abbr title={strengthTitle}>{strengthValue}</abbr>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Морозостойкость
                  </th>
                  <td className="px-4 py-3">
                    <abbr title={frostTitle}>{frostValue}</abbr>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Точность геометрии
                  </th>
                  <td className="px-4 py-3">±1 мм</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Количество на поддоне
                  </th>
                  <td className="px-4 py-3">{blocksPerPalletDisplay}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                    Объем поддона
                  </th>
                  <td className="px-4 py-3">{palletVolumeDisplay}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
            </div>
          ),
          description: (
            <div className="space-y-12">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Описание и преимущества</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Газобетонные блоки {product.brand} {product.density} толщиной {product.thickness} мм — популярный выбор для строительства
                энергоэффективных домов в {regionConfig.nameGenitive}. Они обеспечивают высокую несущую способность, выдерживают сезонные перепады температур и позволяют экономить на утеплении.
              </p>
              <p>
                Точная геометрия и гладкая поверхность ускоряют кладку и уменьшают расход клея. Благодаря малой плотности блоки обладают низкой теплопроводностью и подходят для строительства наружных стен, перегородок и мансардных надстроек.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Преимущества</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  Высокая теплоизоляция — стены не промерзают зимой
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  Легкий вес — упрощает транспортировку и монтаж
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  Точность размеров — ровные стены, минимум отделки
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  Экологичный материал — соответствует ГОСТ 31360-2007
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  Поддержка проектировщиков и консультации инженера
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-white border border-dashed border-orange-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-gray-900 font-semibold">Нужно посчитать точное количество блоков?</p>
              <p className="text-gray-600 text-sm mt-1">Используйте калькулятор или оставьте заявку — мы подготовим детальный расчет с учетом доставки.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/${regionConfig.slug}/calculator`}
                target="_blank"
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500 transition"
              >
                Открыть калькулятор
              </Link>
              <QuizButton label="Подобрать по параметрам" />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Перед заказом</h3>
              <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
                <li>• Уточните, какая толщина стен нужна по проекту (наружные / внутренние).</li>
                <li>• Проверьте, достаточно ли места для разгрузки манипулятора на участке.</li>
                <li>• Подготовьте план дома — мы бесплатно пересчитаем объём блоков и клея.</li>
                <li>• Сообщите менеджеру о дополнительных материалах: перемычки, U-блоки, клей.</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">При хранении и монтаже</h3>
              <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
                <li>• Держите поддоны на ровной площадке, защищайте от влаги и перепадов.</li>
                <li>• Используйте тонкошовный клей и армирующую сетку в каждом четвёртом ряду.</li>
                <li>• Начинайте кладку с углов, контролируя горизонталь и диагонали.</li>
                <li>• Не снимайте заводскую упаковку до момента монтажа — блоки дольше сохраняют точность.</li>
              </ul>
            </div>
          </div>
        </section>
            </div>
          ),
          delivery: (
            <div className="space-y-12">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Доставка и разгрузка {regionConfig.nameGenitive}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Условия доставки</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Доставка собственным транспортом — от {formatPrice(regionConfig.delivery.basePrice)} ₽</li>
                <li>
                  • Бесплатно
                  {regionConfig.delivery.freeFrom
                    ? ` от ${freeFromShortLabel} одной поставкой`
                    : ' — по согласованию с менеджером'}
                </li>
                <li>• Зоны: {regionConfig.delivery.zones.join(', ')}</li>
                <li>• Минимальный заказ: {regionConfig.delivery.minOrder || 1} м³</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Разгрузка и оплата</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Манипулятор 7–10 тонн с захватом — от {formatPrice(3500)} ₽</li>
                <li>• Разгрузка на объект входит в стоимость доставки</li>
                <li>• Безналичный расчет, НДС 20%, возможна отсрочка</li>
                <li>• Доступны сертификаты и паспорта качества</li>
              </ul>
            </div>
          </div>
        </section>
            </div>
          ),
          faq: (
            <div className="space-y-12">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="bg-gray-50 rounded-xl p-6 group">
                <summary className="font-semibold text-lg cursor-pointer flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">Q:</span>
                  <span className="flex-1">{item.question}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform ml-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 pl-8 text-gray-700 leading-relaxed">
                  <span className="font-semibold text-green-600">A:</span> {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
            </div>
          ),
          documents: (
            <div className="space-y-12">
              <section className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Документы и сертификаты</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Паспорт качества, сертификат соответствия и инструкции по кладке доступны по запросу. Мы подготовим полный пакет документов при согласовании заказа.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="#" className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:border-orange-400 hover:text-orange-500 transition">
              Скачать паспорт (PDF)
            </Link>
            <Link href="#" className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:border-orange-400 hover:text-orange-500 transition">
              Сертификат соответствия (PDF)
            </Link>
          </div>
        </section>
            </div>
          ),
        }}
      />

      <div className="mt-16">
        <RegionalCTABlock regionName={regionConfig.nameGenitive} />
      </div>

      <div className="container mx-auto px-4 mt-12 space-y-12">
        <RelatedProducts />
        <ProductSEOSection
          title={`Газобетон ${product.brand} ${product.density} ${regionConfig.namePrepositional}`}
          paragraphs={seoParagraphs}
        />
        <ProductArticles regionName={regionConfig.namePrepositional} />
        <ProductConsultationCTA regionName={regionConfig.namePrepositional} />
      </div>
    </main>
    </>
  );
  } catch (error) {
    console.error('Error in ProductPage:', error);
    notFound();
  }
}


