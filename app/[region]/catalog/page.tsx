import Link from 'next/link';
import { getRegionConfig, type RegionConfig } from '@/data/regions';
import Catalog from '@/components/Catalog';
import { notFound } from 'next/navigation';
import RegionSync from '@/components/RegionSync';
import { getRegionalContent } from '@/data/regional-content';
import { getRegionalProducts } from '@/lib/products';
import type { RegionSlug } from '@/types/product';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuizButton from '@/components/QuizButton';
import { regionQueryData } from '@/data/seo/region-query-data';

interface RegionCatalogPageProps {
  params: Promise<{
    region: string;
  }>;
}

const BASE_URL = 'https://gazobeton-online.ru';

function formatPrice(value: number): string {
  return value.toLocaleString('ru-RU');
}

function buildCatalogKeywords(regionSlug: RegionSlug, regionName: string): string[] {
  const regionData = regionQueryData[regionSlug] ?? { top: [], highFreqLowComp: [] };
  const keywords = new Set<string>();

  keywords.add(`Каталог газобетона ${regionName}`);
  keywords.add(`Газобетон ${regionName}`);
  keywords.add(`Купить газоблоки ${regionName}`);

  [...regionData.top.slice(0, 25), ...regionData.highFreqLowComp.slice(0, 15)].forEach((query) => {
    const trimmed = query.trim();
    if (trimmed) {
      keywords.add(trimmed);
    }
  });

  return Array.from(keywords).slice(0, 30);
}

const DENSITY_GLOSSARY: Record<string, string> = {
  D300: 'D300 — теплоизоляционная плотность (≈300 кг/м³), подходит для ненагруженных стен и утепления.',
  D350: 'D350 — лёгкий блок для мансард, надстроек и внутренних перегородок.',
  D400: 'D400 — тёплый блок для наружных стен энергоэффективных домов, обеспечивает низкие теплопотери.',
  D500: 'D500 — универсальная плотность с балансом прочности и теплоэффективности.',
  D600: 'D600 — повышенная прочность (≈600 кг/м³) под тяжёлые перекрытия и многоэтажные решения.',
  D700: 'D700 — максимально прочный блок для технических и промышленных объектов.',
};

const REGION_META_PRESET: Partial<Record<RegionSlug, { title: string; description: string }>> = {
  samara: {
    title: 'Купить газобетонные блоки в Самаре — цены за м³, доставка по области',
    description:
      'Каталог газобетона и газоблоков в Самаре: Bonolit, Коттедж, СГЗСБ. Актуальные цены за куб и за поддон, быстрый расчёт доставки манипулятором по Самарской области, помощь в подборе.',
  },
  moscow: {
    title: 'Газобетон в Москве и МО — Bonolit, цены за куб, доставка',
    description:
      'Газоблоки Bonolit, Ytong и другие бренды с наличием на складе. Цена за м³, подбор плотности D400–D600, расчёт доставки по Москве и области, консультация по утеплению и монтажу.',
  },
  spb: {
    title: 'Газобетон СПб — купить с доставкой, цены LSR, расчёт за м³',
    description:
      'Газобетонные блоки LSR и других производителей в Санкт-Петербурге и ЛО. Цена за куб, подбор плотности под влажный климат, доставка манипулятором, помощь в расчёте проекта.',
  },
  ufa: {
    title: 'Газобетон Уфа — купить, цены за м³, проекты домов и бань',
    description:
      'Газобетонные блоки с доставкой по Башкортостану: подбор толщины, цены за куб, калькулятор объёма, помощь в проекте бани или дома и консультация по монтажу.',
  },
};

function getRegionCatalogMeta(regionConfig: RegionConfig): { title: string; description: string } {
  const preset = REGION_META_PRESET[regionConfig.slug as RegionSlug];
  if (preset) {
    return preset;
  }

  return {
    title: `Каталог газобетонных блоков ${regionConfig.nameGenitive} — Газобетон Online`,
    description: `Газобетонные блоки ${regionConfig.nameGenitive}: Istkult (Ytong), Bonolit, Poritep, ЛСР и другие производители. Актуальные цены, наличие на складе, доставка ${regionConfig.namePrepositional}.`,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const { getRegionConfig } = await import('@/data/regions');
  const regionConfig = getRegionConfig(region);

  if (!regionConfig) {
    return {
      title: 'Каталог газобетонных блоков — Купить газобетон | Газобетон Online',
      description: 'Большой выбор газобетонных блоков от проверенных производителей.',
    };
  }

  const regionMeta = getRegionCatalogMeta(regionConfig);
  const title = regionMeta.title;
  const description = regionMeta.description;
  const canonical = `https://gazobeton-online.ru/${regionConfig.slug}/catalog`;
  const keywords = buildCatalogKeywords(regionConfig.slug as RegionSlug, regionConfig.name);

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

export default async function RegionCatalogPage({ params }: RegionCatalogPageProps) {
  const { region } = await params;
  const regionConfig = getRegionConfig(region);
  const regionalContent = getRegionalContent(region);

  if (!regionConfig) {
    notFound();
  }

  const regionSlug = regionConfig.slug as RegionSlug;
  const catalogMeta = getRegionCatalogMeta(regionConfig);
  const catalogKeywords = buildCatalogKeywords(regionSlug, regionConfig.name);
  const catalogUrl = `${BASE_URL}/${regionConfig.slug}/catalog`;
  const phoneHref = regionConfig.contacts.phone.replace(/[^+\d]/g, '');

  // Получаем товары с реальными региональными ценами из products-prices.ts
  const regionalProducts = getRegionalProducts(regionSlug);
  const availableProducts = regionalProducts.filter((product) => product.pricePerM3 > 0);
  const minPrice =
    availableProducts.length > 0
      ? Math.min(...availableProducts.map((product) => product.pricePerM3))
      : 0;
  const maxPrice =
    availableProducts.length > 0
      ? Math.max(...availableProducts.map((product) => product.pricePerM3))
      : 0;
  const thicknessRange = regionalProducts.reduce(
    (acc, product) => ({
      min: Math.min(acc.min, product.thickness),
      max: Math.max(acc.max, product.thickness),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
  );
  const thicknessMin = Number.isFinite(thicknessRange.min) ? thicknessRange.min : null;
  const thicknessMax = Number.isFinite(thicknessRange.max) ? thicknessRange.max : null;
  const brandsCount = new Set(regionalProducts.map((product) => product.brandName)).size;

  const itemListProducts = regionalProducts.filter((product) => Boolean(product.slug)).slice(0, 12);
  const itemListElement = itemListProducts.map((product, index) => {
    const productUrl = `${catalogUrl}/${product.slug}`;
    const productEntity: Record<string, unknown> = {
      '@type': 'Product',
      name: product.name,
      url: productUrl,
      image: product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`,
      brand: {
        '@type': 'Brand',
        name: product.brandName,
      },
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
    };

    if (product.price > 0) {
      productEntity.offers = {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'RUB',
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
        itemCondition: 'https://schema.org/NewCondition',
      };
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: productEntity,
    };
  });

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: catalogMeta.title,
    description: catalogMeta.description,
    url: catalogUrl,
    inLanguage: 'ru-RU',
    keywords: catalogKeywords,
    mainEntity: {
      '@type': 'ItemList',
      name: `Газобетон ${regionConfig.nameGenitive}`,
      numberOfItems: regionalProducts.length,
      itemListOrder: 'http://schema.org/ItemListOrderAscending',
      itemListElement,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
        item: catalogUrl,
      },
    ],
  };

  const schemaScripts = [
    { key: 'catalog-collection-schema', data: collectionSchema },
    { key: 'catalog-breadcrumb-schema', data: breadcrumbSchema },
  ];

  const formattedMinPrice = minPrice > 0 ? `${formatPrice(minPrice)} ₽` : '—';
  const formattedMaxPrice = maxPrice > 0 ? `${formatPrice(maxPrice)} ₽` : '—';
  const deliveryBasePriceLabel = formatPrice(regionConfig.delivery.basePrice);
  const freeDeliveryLabel = regionConfig.delivery.freeFrom ? `${regionConfig.delivery.freeFrom} м³` : null;
  const offerTitleMap: Record<RegionSlug, string> = {
    moscow: 'Подберём для вас лучшее предложение по газобетону в Москве и области',
    spb: 'Подберём для вас лучшее предложение по газобетону в Санкт-Петербурге и ЛО',
    samara: 'Подберём для вас лучшее предложение по газобетону в Самарской области',
    ufa: 'Подберём для вас лучшее предложение по газобетону в Башкортостане',
  };
  const offerTitle =
    offerTitleMap[regionConfig.slug as RegionSlug] ??
    `Подберём для вас лучшее предложение по газобетону ${regionConfig.nameGenitive}`;

  return (
    <>
      <RegionSync regionSlug={regionSlug} />
      {schemaScripts.map(({ key, data }) => (
        <script
          key={key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <main className="bg-gray-50 min-h-screen">
        <nav aria-label="Хлебные крошки" className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: regionConfig.name, href: `/${regionConfig.slug}` },
              { label: 'Каталог газобетона' },
            ]}
          />
        </div>
        </nav>

        <header className="container mx-auto px-4 py-8">
          <h1 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
            Каталог газобетонных блоков {regionConfig.nameGenitive}
          </h1>
          <div className="space-y-3 text-lg text-gray-600">
            <p>
              Большой выбор газобетона от проверенных производителей. Все товары сертифицированы и в наличии на складе.{` `}
              Доставляем {regionConfig.namePrepositional} от {deliveryBasePriceLabel} ₽{' '}
              {freeDeliveryLabel ? `и бесплатно от ${freeDeliveryLabel}.` : '— условия обсуждаем индивидуально.'}
          </p>
        </div>
        </header>

      {/* Каталог с региональными ценами */}

        <section className="container mx-auto px-4 pb-8" aria-labelledby="catalog-cta-title">
          <div className="bg-white border border-orange-100/60 rounded-3xl shadow-sm px-6 py-7 md:px-10 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-400 mb-2">Поможем с подбором</p>
              <h2 id="catalog-cta-title" className="text-2xl md:text-3xl font-semibold text-gray-900">
                {offerTitle}
              </h2>
            </div>
            <div className="flex flex-col items-start" role="group" aria-label="Оставить заявку на подбор">
              <QuizButton label="Подобрать решение" size="lg" />
            </div>
          </div>
        </section>

        <section
          id="catalog-listing"
          aria-label={`Список газобетона ${regionConfig.nameGenitive}`}
          className="container mx-auto px-4"
        >
      <Catalog
        products={regionalProducts}
        showFilters={true}
        regionSlug={regionConfig.slug}
      />
        </section>

        <section className="bg-slate-50 py-12" aria-labelledby="region-pricing-heading">
        <div className="container mx-auto px-4">
          <article className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
              <div>
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Актуальные цены</p>
                    <h2 id="region-pricing-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                      Газобетон {regionConfig.nameGenitive}: цены и наличие
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-600">
                    <span className="inline-flex h-2 w-2 rounded-full bg-orange-500" />
                    Обновлено {new Date().toLocaleDateString('ru-RU')}
                  </div>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-gray-50 border border-gray-200/60 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-gray-900">Диапазон цен</h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                      <li>• Минимальная цена: {formattedMinPrice} за м³</li>
                      <li>• Максимальная цена: {formattedMaxPrice} за м³</li>
                      <li>• Базовая стоимость доставки — {deliveryBasePriceLabel} ₽</li>
                      <li>
                        • Бесплатно{' '}
                        {freeDeliveryLabel ? `от ${freeDeliveryLabel} одной поставкой` : '— по согласованию с менеджером'}
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 border border-gray-200/60 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-gray-900">Что влияет на выбор</h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                      <li>
                        • Плотность блоков{' '}
                        <abbr title={DENSITY_GLOSSARY.D400}>D400</abbr>–
                        <abbr title={DENSITY_GLOSSARY.D600}>D600</abbr> и толщина{' '}
                        {thicknessMin && thicknessMax ? `${thicknessMin}–${thicknessMax} мм` : 'всех размеров'}
                      </li>
                      <li>• В каталоге {brandsCount} производителей: Bonolit, Ytong, Poritep, ЛСР и др.</li>
                      <li>• Наличие на складе в {regionConfig.namePrepositional} и условия разгрузки</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
                  <p>
                    {regionalContent?.categoryDescription.whatIs ||
                      'Газобетонные блоки — автоклавный ячеистый бетон с закрытыми порами. Материал лёгкий, тёплый и обеспечивает стабильный микроклимат внутри дома.'}
                  </p>
                  <p>
                    {regionalContent?.categoryDescription.advantages ||
                      'Материал отличается низкой теплопроводностью, точной геометрией и пожаробезопасностью. Лёгкий вес снижает нагрузку на фундамент и ускоряет монтаж.'}
                  </p>
                  <p>
                    {regionalContent?.categoryDescription.application ||
                      `В регионе ${regionConfig.name} газобетон используют для наружных стен, перегородок, бань и гаражей. Выберите нужную плотность и толщину, чтобы собрать тёплый короб без дополнительного утепления.`}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Действия по каталогу">
                  <Link
                    href={`/${regionConfig.slug}/catalog#catalog-filters`}
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Настроить фильтры
                  </Link>
                  <Link
                    href={`/${regionConfig.slug}/delivery`}
                    className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                  >
                    Условия доставки
                  </Link>
                  <Link
                    href={`/${regionConfig.slug}/calculator`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
                  >
                    Расчёт блоков
                  </Link>
                </div>
              </div>

              <aside
                className="bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm"
                aria-labelledby="catalog-benefits-heading"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Что включено</p>
                  <h3 id="catalog-benefits-heading" className="text-lg font-semibold text-gray-900 mt-3">
                    Покупая у нас, вы получаете
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>• Сертифицированные блоки с паспортом качества</li>
                    <li>• Подбор производителя под задачу и бюджет</li>
                    <li>• Консультацию инженера по монтажу и узлам</li>
                    <li>• Согласование манипулятора и графика разгрузки</li>
                  </ul>
                </div>
                <a
                  href={`tel:${phoneHref}`}
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
                >
                  Позвонить: {regionConfig.contacts.phoneFormatted}
                </a>
              </aside>
            </div>
          </article>
        </div>
      </section>

      {/* Информационный блок по строительству */}
        <section className="bg-white py-16 mt-16" aria-labelledby="construction-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
              <h2 id="construction-heading" className="text-3xl font-bold mb-6">
                Особенности строительства {regionConfig.namePrepositional}
              </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                {regionalContent?.constructionFeatures.climate ||
                  `В регионе ${regionConfig.name} важно учитывать локальные климатические условия: перепады температур, влажность и нагрузку на фундамент.`}
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Популярные размеры и плотности</h3>
              <p className="mb-4">
                {regionalContent?.constructionFeatures.popularSizes ||
                  'Блоки толщиной 300–400 мм подходят для наружных стен. Для перегородок чаще всего выбирают толщину 100–150 мм.'}
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Рекомендации по монтажу</h3>
              <p className="mb-4">
                {regionalContent?.constructionFeatures.recommendations ||
                  'Следуйте технологии тонкошовной кладки, обеспечьте гидроизоляцию и своевременную отделку фасада для защиты от влаги и ветра.'}
              </p>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mt-8">
                <p className="font-semibold mb-2">💡 Нужна помощь в подборе?</p>
                <p className="mb-4">
                  Мы подготовим подборку по брендам, толщине и объёму, а также рассчитаем количество блоков под ваш проект.
                </p>
                <div className="flex flex-wrap gap-3" role="group" aria-label="Контакты для консультации">
                  <a
                    href={`tel:${phoneHref}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Позвонить менеджеру
                  </a>
                  <Link
                    href={`/${regionConfig.slug}/calculator`}
                    className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                  >
                    Оставить заявку на расчёт
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

// Генерация статических страниц для региональных каталогов
export async function generateStaticParams() {
  const { validRegions } = await import('@/data/regions');
  return validRegions.map((region) => ({
    region,
  }));
}

