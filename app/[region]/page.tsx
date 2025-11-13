import type { Metadata } from 'next';
import Link from 'next/link';
import { getRegionConfig } from '@/data/regions';
import { getRegionalContent } from '@/data/regional-content';
import Catalog from '@/components/Catalog';
import { notFound } from 'next/navigation';
import RegionSync from '@/components/RegionSync';
import RegionalCTABlock from '@/components/RegionalCTABlock';
import { getRegionalProducts } from '@/lib/products';
import type { RegionSlug } from '@/types/product';
import Breadcrumbs from '@/components/Breadcrumbs';
import RegionalFAQBlock from '@/components/RegionalFAQBlock';
import { getRegionalFAQQuestions } from '@/lib/faq';
import { getManufacturer, getAllManufacturers } from '@/data/manufacturers';
import Image from 'next/image';

interface RegionPageProps {
  params: Promise<{
    region: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params;
  const regionConfig = getRegionConfig(region);

  if (!regionConfig) {
    return {
      title: 'Регион не найден | Газобетон Online',
    };
  }

  // SEO-оптимизированные мета-теги под популярные запросы из high_freq_low_comp.json
  // Для Самары: "газобетонные блоки" (1785), "баня из газобетона" (226), "газоблок размеры" (236)
  // Для Москвы: "газобетон цена за куб" (128), "перекрытие из газобетона" (507)
  // Для СПб: "купить газобетон в спб", "газобетонные блоки размеры"
  // Для Уфы: "баня из газоблока", "калькулятор газоблока"
  const title = `Газобетон ${regionConfig.nameGenitive} — каталог и цены | Газобетон Online`;
  const description =
    regionConfig.seo?.description ||
    `Газобетонные блоки ${regionConfig.nameGenitive}: актуальные цены за м³, доставка ${regionConfig.namePrepositional}, консультации и подбор. Калькулятор расчёта количества блоков.`; 
  const canonical = `https://gazobeton-online.ru/${regionConfig.slug}`;

  return {
    title,
    description,
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

export default async function RegionPage({ params }: RegionPageProps) {
  const { region } = await params;
  const regionConfig = getRegionConfig(region);
  const regionalContent = getRegionalContent(region);

  if (!regionConfig) {
    notFound();
  }

  // Получаем товары с реальными региональными ценами из products-prices.ts
  const regionalProducts = getRegionalProducts(region as RegionSlug);

  // Получаем список производителей, которые есть в регионе
  const brandsInRegion = new Set(regionalProducts.map((p) => p.brand));
  const manufacturersInRegion = getAllManufacturers()
    .filter((m) => brandsInRegion.has(m.brandSlug))
    .sort((a, b) => a.brandName.localeCompare(b.brandName));

  // Логотипы производителей (как на главной)
  const brandLogos: Record<string, string> = {
    'istkult-ytong': '/brands/istkult-ytong.png',
    bonolit: '/brands/bonolit.png',
    kottezh: '/brands/kottezh.png',
    gras: '/brands/gras.png',
    teplon: '/brands/teplon.svg',
    poritep: '/brands/poritep.png',
    lsr: '/brands/lsr.png',
    novoblock: '/brands/novoblock.png',
    stenblock: '/brands/stenblock.png',
  };

  // Schema.org разметка для региона
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Газобетон Online - ${regionConfig.name}`,
    description: regionConfig.seo?.description || `Каталог газобетонных блоков ${regionConfig.nameGenitive}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: regionConfig.name,
      addressCountry: 'RU',
      streetAddress: regionConfig.contacts.address,
    },
    telephone: regionConfig.contacts.phoneFormatted,
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: regionConfig.name,
    },
    url: `https://gazobeton-online.ru/${regionConfig.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://gazobeton-online.ru',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: regionConfig.name,
        item: `https://gazobeton-online.ru/${regionConfig.slug}`,
      },
    ],
  };

  return (
    <>
      <RegionSync regionSlug={region} />
      {/* Schema.org разметка */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="min-h-screen">
        <nav aria-label="Хлебные крошки" className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumbs
              items={[
                { label: 'Главная', href: '/' },
                { label: regionConfig.name },
              ]}
            />
          </div>
        </nav>
        {/* Hero-секция для региона */}
        <section
          className="bg-gradient-to-br from-orange-50 via-white to-gray-50 py-12 md:py-20"
          aria-labelledby="region-hero-heading"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 id="region-hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Газобетонные блоки {regionConfig.nameGenitive} — купить с доставкой
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Большой выбор газобетона Ytong, Bonolit, Коттедж и других производителей. 
                Актуальные цены, наличие на складе, доставка {regionConfig.namePrepositional}.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8" role="group" aria-label="Основные действия">
                <Link
                  href={`/${regionConfig.slug}/catalog`}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Смотреть каталог
                </Link>
                <Link
                  href="/construction"
                  className="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition text-center"
                >
                  Как строить из газобетона?
                </Link>
              </div>

              {/* Краткая информация о регионе */}
              <div className="bg-white rounded-xl shadow-sm p-6 mt-8 max-w-3xl mx-auto" role="list" aria-label="Контакты и доставка в регионе">
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div role="listitem">
                    <div className="text-orange-500 text-2xl mb-2">🚚</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Доставка</h3>
                    <p className="text-sm text-gray-600">
                      {regionConfig.namePrepositional} от {regionConfig.delivery.basePrice.toLocaleString('ru-RU')} ₽
                      {regionConfig.delivery.freeFrom && (
                        <span className="block text-green-600 mt-1">
                          Бесплатно от {regionConfig.delivery.freeFrom} м³
                        </span>
                      )}
                    </p>
                  </div>
                  <div role="listitem">
                    <div className="text-orange-500 text-2xl mb-2">📞</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Телефон</h3>
                    <a href={`tel:${regionConfig.contacts.phone}`} className="text-sm text-orange-500 hover:text-orange-600">
                      {regionConfig.contacts.phoneFormatted}
                    </a>
                    {regionConfig.contacts.workingHours && (
                      <p className="text-xs text-gray-500 mt-1">{regionConfig.contacts.workingHours}</p>
                    )}
                  </div>
                  <div role="listitem">
                    <div className="text-orange-500 text-2xl mb-2">📍</div>
                    <h3 className="font-semibold text-gray-900 mb-1">Склад</h3>
                    <p className="text-sm text-gray-600">{regionConfig.contacts.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Быстрые ссылки */}
        <section className="bg-white py-8 md:py-12 border-b border-gray-200" aria-labelledby="quick-links-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 id="quick-links-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Полезные разделы
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href={`/${regionConfig.slug}/catalog`}
                  className="bg-gray-50 hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 rounded-xl p-6 text-center transition group"
                >
                  <div className="text-4xl mb-3">📦</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition">
                    Каталог
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">Все товары</p>
                </Link>
                <Link
                  href={`/${regionConfig.slug}/calculator`}
                  className="bg-gray-50 hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 rounded-xl p-6 text-center transition group"
                >
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition">
                    Калькулятор
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">Расчет количества</p>
                </Link>
                <Link
                  href={`/${regionConfig.slug}/delivery`}
                  className="bg-gray-50 hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 rounded-xl p-6 text-center transition group"
                >
                  <div className="text-4xl mb-3">🚚</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition">
                    Доставка
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">Условия и цены</p>
                </Link>
                <Link
                  href={`/${regionConfig.slug}/contacts`}
                  className="bg-gray-50 hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 rounded-xl p-6 text-center transition group"
                >
                  <div className="text-4xl mb-3">📞</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition">
                    Контакты
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">Связаться с нами</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Описание категории (перед товарами) */}
        {regionalContent && (
          <section className="bg-gray-50 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  О газобетонных блоках
                </h2>
                
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Что такое газобетон?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {regionalContent.categoryDescription.whatIs}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Преимущества газобетона
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {regionalContent.categoryDescription.advantages}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Применение газобетона
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {regionalContent.categoryDescription.application}
                    </p>
                  </div>

                  {/* Региональные особенности и ответы на запросы */}
                  {regionConfig.slug === 'samara' && (
                    <div className="mt-8 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Почему выбирают газобетон в Самаре</h3>
                      <div className="space-y-3 text-gray-700">
                        <p>В Самаре и Самарской области газобетонные блоки используют для строительства домов, бань и гаражей. Блоки производятся на заводах «Коттедж», СГЗСБ и других производителей, которые работают в регионе — это обеспечивает доступные цены и быструю доставку.</p>
                        <p>Популярные размеры для строительства в Поволжье: 600×300×200 мм и 600×300×300 мм для наружных стен, 600×100×200 мм для перегородок. Для бани 6×4 м нужно примерно 6-8 м³ газобетона. Используйте калькулятор для точного расчёта или пришлите проект — рассчитаем количество блоков и стоимость.</p>
                        <p>В каталоге указаны актуальные цены за м³ и за поддон. При заказе от 30 м³ действует бесплатная доставка по Самарской области. Оставьте заявку в квизе или позвоните — подготовим коммерческое предложение с ценами и условиями доставки.</p>
                      </div>
                    </div>
                  )}

                  {regionConfig.slug === 'moscow' && (
                    <div className="mt-8 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Почему выбирают газобетон в Москве</h3>
                      <div className="space-y-3 text-gray-700">
                        <p>В Москве и Московской области газобетонные блоки Bonolit, Ytong и других производителей пользуются большим спросом. Блоки Bonolit — эталон качества с гарантией точных размеров и стабильной геометрией. В каталоге представлены блоки с наличием на складе в Подмосковье.</p>
                        <p>Цена за куб зависит от бренда и плотности: блоки D500 толщиной 300 мм стоят от 5500 до 7500 руб/м³. При заказе от 20 м³ — бесплатная доставка по Москве и МО. Доставляем в пределах МКАД и до 50 км от МКАД, помогаем с пропусками и ночными разгрузками.</p>
                        <p>Популярные размеры для строительства в МО: 600×300×200 мм и 600×300×300 мм для наружных стен, 600×100×200 мм для перегородок. Газобетон подходит для строительства домов, коттеджей, бань и гаражей. Оставьте заявку в квизе — подберём нужные блоки и подготовим КП с ценами.</p>
                      </div>
                    </div>
                  )}

                  {regionConfig.slug === 'spb' && (
                    <div className="mt-8 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Почему выбирают газобетон в Санкт-Петербурге</h3>
                      <div className="space-y-3 text-gray-700">
                        <p>В Санкт-Петербурге и Ленинградской области газобетонные блоки LSR, Bonolit и других производителей хорошо подходят для влажного климата Северо-Запада. Блоки LSR производятся специально для северо-запада с учётом климатических особенностей — высокая влажность и прохладное лето.</p>
                        <p>В каталоге представлены блоки с наличием на складе в Санкт-Петербурге. Работаем напрямую с заводами и региональными дилерами, что позволяет предлагать выгодные цены и быструю доставку. При заказе от 25 м³ — бесплатная доставка по СПб и ЛО.</p>
                        <p>Популярные размеры для строительства в ЛО: 600×375×200 мм и 600×400×200 мм для наружных стен (увеличенная толщина для лучшей теплоизоляции), 600×100×200 мм для перегородок. При толщине стен 375-400 мм дополнительное утепление чаще всего не требуется. Оставьте заявку в квизе — подберём блоки под ваш проект.</p>
                      </div>
                    </div>
                  )}

                  {regionConfig.slug === 'ufa' && (
                    <div className="mt-8 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Почему выбирают газобетон в Уфе</h3>
                      <div className="space-y-3 text-gray-700">
                        <p>В Уфе и Республике Башкортостан газобетонные блоки подходят для строительства домов, бань и хозяйственных построек в условиях уральского климата. Качественный газобетон выдерживает морозы до -50°C и имеет высокую морозостойкость, что важно для уральских зим.</p>
                        <p>Популярные размеры для строительства в Уфе: 600×375×200 мм и 600×400×200 мм для наружных стен (для уральских зим), 600×100×200 мм для перегородок. Для бани 6×4 м нужно примерно 6-8 м³ газобетона. Используйте калькулятор для точного расчёта количества блоков на ваш проект.</p>
                        <p>В каталоге представлены блоки разных производителей с актуальными ценами. При заказе от 30 м³ — бесплатная доставка по Башкортостану. Доставляем по всей территории республики и в соседние регионы. Оставьте заявку в квизе или позвоните — подготовим КП с ценами и условиями доставки.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Популярные производители */}
        {manufacturersInRegion.length > 0 && (
          <section className="bg-white py-12 md:py-16 border-b border-gray-200" aria-labelledby="brands-heading">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 id="brands-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Популярные производители газобетона {regionConfig.nameGenitive}
                </h2>
                <p className="text-lg text-gray-600">
                  Работаем напрямую с производителями с 2008 года. Все товары сертифицированы и в наличии на складе.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-8 justify-items-center">
                {manufacturersInRegion.map((manufacturer) => {
                  const manufacturerProducts = regionalProducts.filter(
                    (p) => p.brand === manufacturer.brandSlug
                  );

                  return (
                    <Link
                      key={manufacturer.brandSlug}
                      href={`/${regionConfig.slug}/manufacturer/${manufacturer.brandSlug}`}
                      className="bg-gray-50 hover:bg-orange-50 rounded-xl p-4 sm:p-6 text-center transition group border-2 border-transparent hover:border-orange-200 shadow-sm hover:shadow-md flex flex-col items-center w-full max-w-[200px]"
                    >
                      {brandLogos[manufacturer.brandSlug] ? (
                        <div className="relative w-20 h-12 sm:w-24 sm:h-16 mb-3 sm:mb-4 mx-auto flex items-center justify-center">
                          <Image
                            src={brandLogos[manufacturer.brandSlug]}
                            alt={`Логотип ${manufacturer.brandName}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 80px, 96px"
                            unoptimized={manufacturer.brandSlug === 'teplon'}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-12 sm:w-24 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:bg-white transition">
                          <span className="text-gray-400 text-xs font-semibold text-[10px] sm:text-xs text-center">
                            {manufacturer.brandName}
                          </span>
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base group-hover:text-orange-600 transition">
                        {manufacturer.brandName}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                        {manufacturer.description.split('.').slice(0, 1).join('.')}
                        {manufacturerProducts.length > 0 && (
                          <span className="block mt-1 text-orange-600 font-medium">
                            {manufacturerProducts.length} {manufacturerProducts.length === 1 ? 'товар' : 'товаров'}
                          </span>
                        )}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Популярные товары с региональными ценами */}
        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                Популярные товары
              </h2>
              <p className="text-lg text-gray-600 text-center">
                Выбор газобетона от проверенных производителей. Все товары сертифицированы и в наличии на складе.
              </p>
            </div>
            <Catalog 
              products={regionalProducts}
              showLimit={6}
              showFullCatalogLink={true}
              showFilters={true}
              regionSlug={regionConfig.slug}
              defaultPopularOnly={true}
            />
          </div>
        </section>

        {/* FAQ блок с популярными вопросами */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <RegionalFAQBlock
                regionSlug={region as RegionSlug}
                questions={getRegionalFAQQuestions(region as RegionSlug, 5)}
                title={`Популярные вопросы о газобетоне ${regionConfig.nameGenitive}`}
              />
            </div>
          </div>
        </section>

        {/* Мотивационный блок-призыв к квизу */}
        <RegionalCTABlock regionName={regionConfig.nameGenitive} />

        {/* Зоны доставки */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Доставка {regionConfig.namePrepositional}
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">🗺️</span>
                      Зоны доставки
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      {regionConfig.delivery.zones.map((zone, idx) => (
                        <li key={idx}>{zone}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">💰</span>
                      Стоимость доставки
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Базовая стоимость доставки — <strong>{regionConfig.delivery.basePrice.toLocaleString('ru-RU')} ₽</strong>.
                      {regionConfig.delivery.freeFrom && (
                        <span className="block mt-2 text-green-600 font-semibold">
                          Бесплатная доставка при заказе от {regionConfig.delivery.freeFrom} м³
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded">
                    <p className="text-gray-700 font-semibold mb-2">⚡ Быстрая доставка</p>
                    <p className="text-gray-700">
                      При наличии товара на складе доставка {regionConfig.namePrepositional} — от 1-2 дней. 
                      Мы всегда согласовываем удобное время доставки заранее.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  href={`/${regionConfig.slug}/delivery`}
                  className="text-orange-500 hover:text-orange-600 font-semibold underline"
                >
                  Подробнее о доставке →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Особенности строительства в регионе */}
        {regionalContent && (
          <section className="bg-white py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  Особенности строительства из газобетона {regionConfig.namePrepositional}
                </h2>
                
                <div className="bg-gray-50 rounded-xl p-8 md:p-12 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Климатические особенности региона
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {regionalContent.constructionFeatures.climate}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Популярные размеры блоков
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {regionalContent.constructionFeatures.popularSizes}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Рекомендации по строительству
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {regionalContent.constructionFeatures.recommendations}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <Link
                      href="/construction"
                      className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                      Читать подробнее о строительстве из газобетона →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ для региона */}
        {regionalContent && regionalContent.faq.length > 0 && (
          <section className="bg-gray-50 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  Часто задаваемые вопросы
                </h2>
                
                <div className="space-y-4">
                  {regionalContent.faq.map((item, idx) => (
                    <details
                      key={idx}
                      className="bg-white rounded-xl p-6 hover:shadow-md transition group"
                    >
                      <summary className="font-semibold text-lg cursor-pointer flex items-start">
                        <span className="text-orange-500 mr-3 mt-1">Q:</span>
                        <span className="flex-1">{item.question}</span>
                        <svg
                          className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform ml-2 mt-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="mt-4 pl-8 text-gray-700 leading-relaxed">
                        <span className="font-semibold text-green-600">A:</span>{' '}
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link
                    href="/faq"
                    className="text-orange-500 hover:text-orange-600 font-semibold underline"
                  >
                    Все вопросы и ответы →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

// Генерация статических страниц для регионов
export async function generateStaticParams() {
  const { validRegions } = await import('@/data/regions');
  return validRegions.map((region) => ({
    region,
  }));
}
