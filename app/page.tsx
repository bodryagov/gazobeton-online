import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { regions, type RegionConfig } from '@/data/regions';
import Breadcrumbs from '@/components/Breadcrumbs';
import Quiz from '@/components/Quiz';

export const metadata: Metadata = {
  title: 'Газобетонные блоки — каталог и цены | Газобетон Online',
  description:
    'Газобетонные блоки ведущих производителей: Istkult (Ytong), Bonolit, Poritep, ЛСР и другие. Актуальные цены, доставка по регионам, консультации специалистов.',
  alternates: {
    canonical: 'https://gazobeton-online.ru/',
  },
  openGraph: {
    title: 'Газобетонные блоки — каталог и цены | Газобетон Online',
    description:
      'Купить газобетонные блоки с доставкой по регионам России. Подбор по плотности и толщине, помощь в расчёте материалов.',
    url: 'https://gazobeton-online.ru/',
    siteName: 'Газобетон Online',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Газобетонные блоки — каталог и цены',
    description:
      'Газобетонные блоки ведущих производителей с доставкой и консультацией специалистов.',
  },
};

export default function Home() {
  // Регионы для отображения на главной (можно ограничить до 4 основных)
  const mainRegions = ['moscow', 'spb', 'ufa', 'samara']
    .map(slug => regions[slug])
    .filter((r): r is RegionConfig => Boolean(r));

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Газобетон Online',
    url: 'https://gazobeton-online.ru/',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://gazobeton-online.ru/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'ru-RU',
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Газобетон Online',
    url: 'https://gazobeton-online.ru/',
    logo: 'https://gazobeton-online.ru/og.jpg',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+7-495-123-45-67',
        contactType: 'sales',
        areaServed: 'RU',
        availableLanguage: ['Russian'],
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://gazobeton-online.ru/',
      },
    ],
  };

  const popularBrands = [
    { name: 'Istkult (Ytong)', slug: 'istkult-ytong', desc: 'Немецкие технологии и высокая точность геометрии' },
    { name: 'Bonolit', slug: 'bonolit', desc: 'Крупнейший российский производитель газобетона' },
    { name: 'Коттедж', slug: 'kottezh', desc: 'Оптимальный выбор для частного строительства' },
    { name: 'ГРАС', slug: 'gras', desc: 'Надёжные блоки по доступной цене' },
    { name: 'Теплон', slug: 'teplon', desc: 'Энергоэффективные решения для вашего дома' },
    { name: 'Poritep', slug: 'poritep', desc: 'Сбалансированное качество и цена' },
  ];

  const brandLogos: Record<string, string> = {
    'istkult-ytong': '/brands/istkult-ytong.png',
    bonolit: '/brands/bonolit.png',
    kottezh: '/brands/kottezh.png',
    gras: '/brands/gras.png',
    teplon: '/brands/teplon.svg',
    poritep: '/brands/poritep.png',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Хлебные крошки" className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Главная' }]} />
        </div>
      </nav>
      <main className="min-h-screen">
        {/* Hero-секция */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-gray-50 py-12 md:py-20" aria-labelledby="hero-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Газобетонные блоки — каталог и цены
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Большой выбор газобетона Ytong, Bonolit, Коттедж и других производителей. 
                Актуальные цены, наличие на складе, доставка.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Основные действия">
                <Link
                  href="#quiz"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Подобрать лучший вариант
                </Link>
                <Link
                  href="/construction"
                  className="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition text-center"
                >
                  Как строить из газобетона?
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Карточки городов */}
        <section id="regions" className="bg-white py-12 md:py-16" aria-labelledby="regions-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 id="regions-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Выберите ваш город
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {mainRegions.map((region) => {
                  // Проверка на существование region
                  if (!region || !region.slug) return null;

                  // Цены по регионам
                  const prices: Record<string, number> = {
                    moscow: 4600,
                    spb: 4600,
                    samara: 5500,
                    ufa: 5200,
                  };
                  const price = prices[region.slug] || 4600;
                  
                  // Безопасное форматирование цены
                  const formattedPrice = price.toLocaleString('ru-RU');

                  return (
                    <Link
                      key={region.slug}
                      href={`/${region.slug}`}
                      className="bg-white border-2 border-gray-200 hover:border-orange-500 rounded-xl p-6 text-center transition-all transform hover:scale-105 shadow-sm hover:shadow-lg group"
                    >
                      <div className="text-4xl mb-4">🏙️</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition">
                        {region.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Цена от {formattedPrice} ₽/м³
                      </p>
                      <span className="text-orange-500 font-semibold group-hover:underline">
                        Перейти →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Общая информация о газобетоне */}
        <section className="bg-gray-50 py-12 md:py-16" aria-labelledby="about-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                О газобетоне
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Что такое газобетон?</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Газобетон (автоклавный ячеистый бетон) — современный строительный материал с отличными теплоизоляционными 
                    свойствами. Блоки производятся из цемента, извести, песка и алюминиевой пудры, которая создает множество 
                    мелких пузырьков воздуха в структуре материала.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>Преимущества газобетона:</strong>
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                    <li>Отличная теплоизоляция — дома из газобетона теплые и энергоэффективные</li>
                    <li>Легкость — блоки легче кирпича в 3-5 раз, что упрощает кладку</li>
                    <li>Точная геометрия — отклонения до 1-2 мм, позволяет использовать тонкошовную кладку</li>
                    <li>Экологичность — натуральные компоненты, безопасен для здоровья</li>
                    <li>Пожаробезопасность — не горит, устойчив к огню</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Газобетон vs Пенобетон: в чем разница?</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Многие путают газобетон и пенобетон, но это разные материалы с существенными отличиями:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 border-l-4 border-green-600 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">✅ Газобетон (автоклавный)</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Производится на заводах с автоклавами</li>
                        <li>• Точная геометрия блоков (±1-2 мм)</li>
                        <li>• Однородная структура</li>
                        <li>• Выше прочность и теплоизоляция</li>
                        <li>• Тонкошовная кладка (2-3 мм)</li>
                        <li>• Сертифицированное производство</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">⚠️ Пенобетон</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Может производиться кустарно</li>
                        <li>• Больше отклонения в геометрии</li>
                        <li>• Неоднородная структура</li>
                        <li>• Ниже прочность</li>
                        <li>• Требует толстые швы (10-15 мм)</li>
                        <li>• Качество зависит от производителя</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Вывод:</strong> Для строительства дома мы рекомендуем автоклавный газобетон — он обеспечивает лучшую теплоизоляцию, точную геометрию и долговечность.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Газобетон vs Кирпич</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Сравнение основных характеристик газобетонных блоков и кирпича:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Характеристика</th>
                          <th className="px-4 py-3 font-semibold">Газобетон</th>
                          <th className="px-4 py-3 font-semibold">Кирпич</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3">Теплоизоляция</td>
                          <td className="px-4 py-3">⭐⭐⭐⭐⭐ Отличная</td>
                          <td className="px-4 py-3">⭐⭐ Средняя (нужна дополнительная теплоизоляция)</td>
                        </tr>
                        <tr className="border-b bg-gray-50">
                          <td className="px-4 py-3">Скорость кладки</td>
                          <td className="px-4 py-3">Быстрая (большие блоки)</td>
                          <td className="px-4 py-3">Медленная (маленький размер)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3">Вес</td>
                          <td className="px-4 py-3">Легкий (350-600 кг/м³)</td>
                          <td className="px-4 py-3">Тяжелый (1600-1900 кг/м³)</td>
                        </tr>
                        <tr className="border-b bg-gray-50">
                          <td className="px-4 py-3">Стоимость</td>
                          <td className="px-4 py-3">Средняя</td>
                          <td className="px-4 py-3">Выше</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Прочность</td>
                          <td className="px-4 py-3">D400-D600 (достаточно для частного строительства)</td>
                          <td className="px-4 py-3">Высокая</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    <strong>Для частных домов:</strong> Газобетон выигрывает по теплоизоляции, скорости строительства и стоимости. Кирпич лучше для многоэтажных зданий и требует дополнительного утепления.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 p-8 md:p-12">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Почему выгодно покупать газобетон зимой?</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Зима — лучшее время для покупки газобетона по нескольким причинам:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                    <li><strong>Цены ниже</strong> — зимой спрос падает, производители предлагают скидки до 15-20%</li>
                    <li><strong>Нет дефицита</strong> — можно выбрать нужный размер и плотность без ожидания</li>
                    <li><strong>Бесплатное хранение</strong> — мы можем хранить ваш заказ на складе до начала строительства</li>
                    <li><strong>Планирование</strong> — купив зимой, вы гарантируете наличие материала к строительному сезону</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed font-semibold">
                    Заказав газобетон зимой, вы можете оставить его на бесплатное хранение на нашем складе до мая-июня. 
                    Это позволит сэкономить до 20% стоимости и быть уверенным в наличии материала к началу стройки.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Популярные производители (без цен) */}
        <section className="bg-white py-12 md:py-16" aria-labelledby="brands-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 id="brands-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Популярные производители газобетона
              </h2>
              <p className="text-lg text-gray-600">
                Работаем напрямую более, чем с 15 заводами
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              {popularBrands.map((brand) => (
                <div
                  key={brand.slug}
                  className="bg-gray-50 hover:bg-orange-50 rounded-xl p-6 text-center transition group border-2 border-transparent hover:border-orange-200 shadow-sm hover:shadow-md"
                >
                  {brandLogos[brand.slug] ? (
                    <div className="relative w-24 h-16 mx-auto mb-4">
                      <Image
                        src={brandLogos[brand.slug]}
                        alt={`Логотип ${brand.name}`}
                        fill
                        className="object-contain"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-white transition">
                      <span className="text-gray-400 text-xs font-semibold">{brand.name}</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2">{brand.name}</h3>
                  <p className="text-xs text-gray-600">{brand.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Выберите ваш город выше, чтобы увидеть цены и доступность товаров
              </p>
            </div>
          </div>
        </section>

        {/* FAQ (краткая версия) */}
        <section className="bg-gray-50 py-12 md:py-16" aria-labelledby="faq-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Часто задаваемые вопросы
                </h2>
                <p className="text-lg text-gray-600">
                  Ответы на популярные вопросы о газобетоне
                </p>
              </div>

              <div className="space-y-4">
                <details className="bg-white rounded-xl p-6 hover:shadow-md transition group">
                  <summary className="font-semibold text-lg cursor-pointer flex items-start">
                    <span className="text-orange-500 mr-3 mt-1">Q:</span>
                    <span className="flex-1">Какую толщину газобетона выбрать для строительства дома?</span>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform ml-2 mt-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 pl-8 text-gray-700 leading-relaxed">
                    <span className="font-semibold text-green-600">A:</span> Для наружных стен в средней полосе России рекомендуется использовать блоки толщиной 300-400 мм с плотностью D400-D500. Для регионов с более суровым климатом (Урал, Сибирь) — 375-400 мм. Для внутренних перегородок достаточно 100-150 мм. Точный расчет зависит от климатической зоны и требований к теплоизоляции.
                  </div>
                </details>

                <details className="bg-white rounded-xl p-6 hover:shadow-md transition group">
                  <summary className="font-semibold text-lg cursor-pointer flex items-start">
                    <span className="text-orange-500 mr-3 mt-1">Q:</span>
                    <span className="flex-1">Как рассчитать необходимое количество блоков?</span>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform ml-2 mt-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 pl-8 text-gray-700 leading-relaxed">
                    <span className="font-semibold text-green-600">A:</span> Воспользуйтесь нашим{' '}
                    <Link href="/calculator" className="text-orange-500 underline hover:text-orange-600">
                      калькулятором газобетона
                    </Link>
                    {' '}— укажите размеры стен, толщину блока, и система автоматически рассчитает нужный объем с учетом запаса 5% на подрезку. Или получите бесплатную консультацию менеджера — наши специалисты помогут рассчитать точное количество блоков для вашего проекта.
                  </div>
                </details>

                <details className="bg-white rounded-xl p-6 hover:shadow-md transition group">
                  <summary className="font-semibold text-lg cursor-pointer flex items-start">
                    <span className="text-orange-500 mr-3 mt-1">Q:</span>
                    <span className="flex-1">В чем разница между Ytong и Bonolit?</span>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform ml-2 mt-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 pl-8 text-gray-700 leading-relaxed">
                    <span className="font-semibold text-green-600">A:</span> Оба производителя выпускают качественный автоклавный газобетон, но есть нюансы: Ytong — немецкая технология, более точная геометрия блоков (отклонения до 1 мм), что позволяет использовать тонкошовную кладку. Bonolit — крупнейший российский производитель, хорошее соотношение цена-качество, чуть большие отклонения в геометрии (до 2-3 мм). Для частного строительства оба варианта отличные.
                  </div>
                </details>
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/faq"
                  className="text-orange-500 hover:text-orange-600 font-semibold underline"
                >
                  Все вопросы и ответы (16 вопросов) →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Квиз внизу страницы */}
        <section id="quiz" className="bg-white py-12 md:py-16" aria-labelledby="quiz-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 id="quiz-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Подобрать лучший вариант для вашего проекта
                </h2>
                <p className="text-lg text-gray-600">
                  Ответьте на несколько вопросов, и мы подберем оптимальный газобетон
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 md:p-12">
                <Quiz />
              </div>
            </div>
          </div>
        </section>

        {/* Быстрые ссылки */}
        <section className="bg-gray-50 py-12 md:py-16" aria-labelledby="quick-links-heading">
          <div className="container mx-auto px-4">
            <h2 id="quick-links-heading" className="sr-only">
              Быстрые ссылки
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '📊', title: 'Калькулятор газобетона', link: '/calculator' },
                { icon: '📦', title: 'Каталог блоков', link: '/catalog' },
                { icon: '❓', title: 'Вопросы и ответы', link: '/faq' },
                { icon: '🚚', title: 'Доставка и оплата', link: '/delivery' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="bg-white hover:bg-orange-50 rounded-xl p-6 text-center transition group border-2 border-transparent hover:border-orange-200 shadow-sm hover:shadow-md"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
