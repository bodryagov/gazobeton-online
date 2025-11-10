import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getRegionConfig, validRegions } from '@/data/regions';
import { regionQueryData } from '@/data/seo/region-query-data';
import RegionSync from '@/components/RegionSync';
import Breadcrumbs from '@/components/Breadcrumbs';

interface RegionDeliveryPageParams {
  region: string;
}

interface RequestContext {
  params: Promise<RegionDeliveryPageParams>;
}

function formatPrice(value: number): string {
  return value.toLocaleString('ru-RU');
}

const baseDeliveryOptions = [
  {
    title: 'Манипулятор 5 тонн',
    payload: 'До 8 поддонов (8–9 м³)',
    recommendedFor: 'Частные дома и небольшие стройки в черте города',
  },
  {
    title: 'Манипулятор 10 тонн',
    payload: 'До 16 поддонов (16–18 м³)',
    recommendedFor: 'Коттеджные посёлки и крупные объёмы в пригороде',
  },
  {
    title: 'Длинномер с краном',
    payload: 'До 20 поддонов (20–22 м³)',
    recommendedFor: 'Оптовые поставки и удалённые объекты',
  },
];

const preparationChecklist = [
  'Ширина подъездного пути не менее 3 метров, без низких проводов и нависающих веток.',
  'Ровная площадка для разгрузки — техника работает стрелой и требует устойчивой опоры.',
  'Заранее согласуйте с управляющей компанией посёлка время въезда и необходимость пропуска.',
  'При разгрузке в тёмное время суток подготовьте освещение площадки.',
];

const deliveryTariffsBase = [
  { distance: 10, small: 3400, large: null },
  { distance: 15, small: 3900, large: null },
  { distance: 20, small: 4400, large: null },
  { distance: 25, small: 4800, large: null },
  { distance: 30, small: 5100, large: 10200 },
  { distance: 35, small: 5700, large: 11400 },
  { distance: 40, small: 6200, large: 12400 },
  { distance: 45, small: 6700, large: 13400 },
  { distance: 50, small: 7200, large: 14400 },
  { distance: 55, small: 7700, large: 15400 },
  { distance: 60, small: 8200, large: 16400 },
  { distance: 65, small: 8700, large: 17400 },
  { distance: 70, small: 9200, large: 18400 },
  { distance: 75, small: 9700, large: 19400 },
  { distance: 80, small: 10200, large: 20400 },
  { distance: 85, small: 10700, large: 21400 },
  { distance: 90, small: 11200, large: 22400 },
  { distance: 100, small: 12200, large: 22400 },
  { distance: 110, small: 13500, large: 25000 },
  { distance: 120, small: 14500, large: 26000 },
  { distance: 150, small: 17300, large: 27000 },
  { distance: 180, small: 20500, large: 29000 },
  { distance: 210, small: 23500, large: 30000 },
  { distance: 250, small: null, large: 31000 },
  { distance: 300, small: null, large: 34000 },
  { distance: 350, small: null, large: 38000 },
  { distance: 400, small: null, large: 44000 },
  { distance: 450, small: null, large: 49000 },
];

const regionMultipliers: Record<string, number> = {
  samara: 1,
  moscow: 1.2,
  spb: 1.1,
  ufa: 1,
};

const deliveryNotes: Record<
  string,
  {
    intro: string;
    noUnload: string[];
    withUnload: string[];
    selfPickup: string[];
  }
> = {
  samara: {
    intro:
      'Везём газобетон по всей Самарской области и соседним регионам: Самара, Тольятти, Сызрань, Красноярский район, трассы М5 и М32. Работаем с удалёнными посёлками и стройками за Волгой.',
    noUnload: [
      'Подготовьте свободный подъезд шириной не менее 3 м без низких проводов и нависающих веток.',
      'Организуйте бригаду или технику для разгрузки — у водителя есть 40 минут после прибытия.',
      'Площадка должна быть утрамбована: манипулятор работает стрелой, колея и рыхлый грунт замедляют выгрузку.',
    ],
    withUnload: [
      'Выделите стропальщика или заранее предупредите менеджера, если разгружает команда водителя.',
      'По возможности готовьте одну площадку для всех поддонов, чтобы не перемещать технику.',
      'Если участок тесный — сообщите менеджеру: рассчитаем схему разгрузки заранее.',
    ],
    selfPickup: [
      'Получите пропуск на складе — менеджер логистики скажет, в какую очередь вставать.',
      'Перед въездом в зону погрузки снимите стойки и растентуйте полуприцеп.',
      'После загрузки закрепите блоки ремнями и пройдите контрольное взвешивание.',
    ],
  },
  moscow: {
    intro:
      'Доставляем по Москве, Московской области и соседним регионам: Звенигород, Коломна, Солнечногорск, Домодедово, Калуга, Тверь. Берём на себя пропуска на МКАД, ТТК и Садовое, организуем ночные разгрузки.',
    noUnload: [
      'Если нужен пропуск на МКАД или въезд в посёлок — предупредите менеджера минимум за сутки.',
      'Подготовьте площадку без уклона и с доступом для маневра: манипулятору нужен радиус 8–10 м.',
      'Согласуйте время разгрузки с управляющей компанией посёлка, обеспечьте допуск водителя.',
    ],
    withUnload: [
      'Сообщите, нужен ли манипулятор 5 или 10 тонн — подберём технику под объём и ширину улиц.',
      'При ночной разгрузке или режиме «тихого часа» предупредите нас — настроим тайм-слот, освещение и согласуем проезд.',
      'Если выгрузка поэтапная (несколько точек), дайте схему — передадим водителю заранее.',
    ],
    selfPickup: [
      'Самовывоз со склада согласовывайте заранее: выдаём пропуск, помогаем с погрузкой.',
      'Проверьте, что тент и стойки можно быстро снять — водители в очереди не ждут.',
      'После погрузки перевяжите блоки, пройдите контрольное взвешивание и получите документы.',
    ],
  },
  spb: {
    intro:
      'Везём газобетон по Санкт-Петербургу, Ленинградской области и соседним регионам: Всеволожск, Гатчина, Приозерск, Выборг, Кириши, Псковское направление. Учитываем влажные грунты и прибрежный климат.',
    noUnload: [
      'Подготовьте подъезд без размытого грунта: при необходимости настелите щиты или щебень.',
      'Очистите площадку от снега/воды — влага сильно влияет на устойчивость манипулятора.',
      'Сообщите менеджеру, если участок находится в охраняемой зоне или требуется пропуск.',
    ],
    withUnload: [
      'При работе на узких дорогах согласуйте схему подъезда — есть транспорт с базой 6×2 м.',
      'Если нужно перенести блоки дальше 10 м от машины, предупредите заранее — подготовим такелаж.',
      'В прибрежных зонах возможен усиленный ветер: подготовьте место, защищенное от порывов.',
    ],
    selfPickup: [
      'На складах действует электронная очередь: приезжайте к назначенному времени.',
      'Погрузка ведётся двумя погрузчиками — убедитесь, что борта снимаются с обеих сторон.',
      'Защитите блоки плёнкой или тентом — в ЛО частые дожди даже летом.',
    ],
  },
  ufa: {
    intro:
      'Доставляем по Уфе, всему Башкортостану и соседним регионам: Черниковка, Иглино, Стерлитамак, Бирск, Благовещенск, трассы М5 и Р240. Работаем с гористым рельефом и удалёнными деревнями.',
    noUnload: [
      'Подготовьте подъезд без крутых подъёмов/спусков и с уплотнённым покрытием.',
      'В зимний период расчистите снег и насыпьте щебень для устойчивости техники.',
      'Сообщите заранее, если участок находится на возвышенности — проверим, пройдёт ли манипулятор.',
    ],
    withUnload: [
      'При температуре ниже −15 °C предупредите — дадим рекомендации по укрытию блоков и клея.',
      'Если нужно разгрузить блоки в нескольких точках участка, дайте схему — учтём время работы.',
      'Для удалённых районов планируем доставку на утренние часы, чтобы успеть вернуться до темноты.',
    ],
    selfPickup: [
      'Самовывоз возможен со склада в Черниковке — возьмите паспорт и доверенность на водителя.',
      'Перед погрузкой проверьте, что кузов чистый и сухой — особенно зимой и в распутицу.',
      'Закрепите блоки ремнями и укройте тентом: перепады температур вызывают обледенение.',
    ],
  },
};

const regionHighlights: Record<string, string[]> = {
  samara: [
    'Работаем с заводами «Коттедж», Bonolit, СГЗСБ и региональными логистами — быстрые отгрузки без разрывов поставок.',
    'Вывозим газобетон в любые районы области и соседние регионы, включая удалённые посёлки и объекты за Волгой.',
    'Помогаем рассчитать комбинированные рейсы: самовывоз + доставка манипулятором на участок.',
  ],
  moscow: [
    'Оформляем пропуска на МКАД, ТТК и Садовое кольцо, согласовываем въезд в КП и стройки с охраной.',
    'Работаем днём и ночью: подстроимся под режим тишины и график строителей.',
    'Доставляем не только по Московской области, но и в Калужскую, Тверскую, Владимирскую области и другие соседние регионы.',
  ],
  spb: [
    'Подбираем технику под узкие улицы и влажный грунт — есть манипуляторы с укороченной базой и комплектами щитов.',
    'Доставляем по всему побережью Финского залива, в курортные и садовые зоны, работаем с переправами.',
    'Помогаем организовать временное хранение на складе для крупных объектов и проектов поэтапной застройки.',
  ],
  ufa: [
    'Работаем по всему Башкортостану и везём газобетон в соседние регионы — Челябинская, Оренбургская области, Татарстан.',
    'Знаем особенности гористого рельефа и зимних дорог: выбираем маршруты с учётом подъемов и спусков.',
    'Предлагаем комплекс: доставка, хранение на складе в Черниковке и консультации по зимнему монтажу.',
  ],
};

const DELIVERY_KEYWORDS = ['достав', 'манипуля', 'разгруз', 'привез', 'привезти', 'самовывоз', 'логист', 'тариф'];

function selectDeliveryQueries(regionSlug: string): {
  quickWins: string[];
  popular: string[];
} {
  const regionData = regionQueryData[regionSlug as keyof typeof regionQueryData];
  if (!regionData) {
    return { quickWins: [], popular: [] };
  }

  const matchesKeyword = (query: string) => {
    const lower = query.toLowerCase();
    return DELIVERY_KEYWORDS.some((keyword) => lower.includes(keyword));
  };

  const quickWins = regionData.highFreqLowComp.filter(matchesKeyword).slice(0, 4);
  const popular = regionData.top.filter(matchesKeyword).slice(0, 4);

  return { quickWins, popular };
}

function getRegionTariffs(regionSlug: string) {
  const multiplier = regionMultipliers[regionSlug] ?? 1;
  return deliveryTariffsBase.map((row) => ({
    distance: row.distance,
    small: typeof row.small === 'number' ? Math.round(row.small * multiplier) : null,
    large: typeof row.large === 'number' ? Math.round(row.large * multiplier) : null,
  }));
}

export async function generateMetadata({ params }: RequestContext): Promise<Metadata> {
  const { region } = await params;
  const regionConfig = getRegionConfig(region);

  if (!regionConfig) {
    return {
      title: 'Регион не найден | Газобетон Online',
    };
  }

  const title = `Доставка газобетона ${regionConfig.nameGenitive} — условия и тарифы | Газобетон Online`;
  const description = `Организуем доставку газобетонных блоков ${regionConfig.namePrepositional}: собственный парк манипуляторов, разгрузка на участке, помощь с пропусками. Базовая стоимость от ${formatPrice(regionConfig.delivery.basePrice)} ₽.`;
  const canonical = `https://gazobeton-online.ru/${regionConfig.slug}/delivery`;

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
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function RegionDeliveryPage({ params }: RequestContext) {
  const { region } = await params;
  const regionConfig = getRegionConfig(region);

  if (!regionConfig) {
    notFound();
  }

  const phoneHref = regionConfig.contacts.phone.replace(/[^+\d]/g, '');
  const formattedBasePrice = formatPrice(regionConfig.delivery.basePrice);
  const freeDeliveryThreshold = regionConfig.delivery.freeFrom ? `${regionConfig.delivery.freeFrom} м³` : null;
  const deliveryQueries = selectDeliveryQueries(regionConfig.slug);
  const regionTariffs = getRegionTariffs(regionConfig.slug);

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: regionConfig.name, href: `/${regionConfig.slug}` },
    { label: 'Доставка' },
  ];

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
      {
        '@type': 'ListItem',
        position: 2,
        name: regionConfig.name,
        item: `https://gazobeton-online.ru/${regionConfig.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Доставка ${regionConfig.nameGenitive}`,
        item: `https://gazobeton-online.ru/${regionConfig.slug}/delivery`,
      },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Доставка газобетона ${regionConfig.nameGenitive}`,
    serviceType: 'LogisticsService',
    provider: {
      '@type': 'Organization',
      name: 'Газобетон Online',
      url: 'https://gazobeton-online.ru/',
      telephone: regionConfig.contacts.phone.replace(/\s/g, ''),
      areaServed: {
        '@type': 'AdministrativeArea',
        name: regionConfig.name,
      },
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: regionConfig.name,
      },
      ...regionConfig.delivery.zones.map((zone) => ({
        '@type': 'Place',
        name: zone,
      })),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Тарифы на доставку газобетона ${regionConfig.nameGenitive}`,
      itemListElement: baseDeliveryOptions.map((option, index) => ({
        '@type': 'Offer',
        position: index + 1,
        name: option.title,
        description: option.recommendedFor,
        priceSpecification:
          index === 0
            ? {
                '@type': 'PriceSpecification',
                price: regionConfig.delivery.basePrice,
                priceCurrency: 'RUB',
              }
            : undefined,
      })),
    },
    termsOfService: `https://gazobeton-online.ru/${regionConfig.slug}/delivery`,
    additionalType: 'https://schema.org/DeliveryChargeSpecification',
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <RegionSync regionSlug={regionConfig.slug} />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <section className="bg-gradient-to-br from-orange-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Доставка {regionConfig.namePrepositional}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
              Привезём газобетон на ваш объект {regionConfig.namePrepositional}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl">
              Собственный парк манипуляторов и проверенные подрядчики. Доставляем по всей области и в соседние регионы, помогаем с пропусками и нестандартными условиями. Базовая стоимость — от {formattedBasePrice} ₽, бесплатно от {freeDeliveryThreshold ?? 'объёма, согласованного с менеджером'}.
            </p>
            <div className="mt-6 bg-white/80 border border-orange-100 rounded-2xl p-6 shadow-sm">
              <ul className="space-y-3 text-sm text-gray-600">
                {regionHighlights[regionConfig.slug].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {(deliveryQueries.quickWins.length > 0 || deliveryQueries.popular.length > 0) && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {deliveryQueries.quickWins.length > 0 && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-orange-500">Запросы с быстрой отдачей</p>
                    <h3 className="text-lg font-semibold text-orange-700 mt-2">Что ищут клиенты про доставку</h3>
                    <ul className="mt-3 space-y-2 text-sm text-orange-900">
                      {deliveryQueries.quickWins.map((query) => (
                        <li key={query}>• {query}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-orange-700/80">
                      Эти темы раскрываем в тарифах, FAQ и карточках товаров, чтобы ускорить SEO-рост.
                    </p>
                  </div>
                )}
                {deliveryQueries.popular.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white/80 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Популярные направления</p>
                    <h3 className="text-lg font-semibold text-gray-900 mt-2">Покрываем ключевые вопросы</h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                      {deliveryQueries.popular.map((query) => (
                        <li key={query}>• {query}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-gray-500">
                      Используем полученные данные в контенте и консультациях менеджеров.
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
              href={`tel:${phoneHref}`}
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-lg transition"
              >
                Позвонить менеджеру: {regionConfig.contacts.phoneFormatted}
              </Link>
              <a
                href="#delivery-options"
                className="inline-flex items-center justify-center border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold text-base transition"
              >
                Посмотреть тарифы →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="delivery-options" className="container mx-auto px-4 py-12 md:py-16">
        <header className="max-w-3xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Транспорт для {regionConfig.nameGenitive}</h2>
          <p className="text-gray-600 mt-3">
            Работаем с объектами {regionConfig.namePrepositional} и в соседних регионах. Основные направления: {regionConfig.delivery.zones.join(', ')}. Минимальный заказ — {regionConfig.delivery.minOrder ?? 1} м³.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {baseDeliveryOptions.map((option, index) => (
            <article
              key={option.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
              <p className="text-lg font-semibold text-orange-600 mt-4">
                {index === 0 ? `от ${formattedBasePrice} ₽` : index === 1 ? 'от расчёта под заказ' : 'по запросу'}
              </p>
              <p className="text-sm text-gray-600 mt-2">{option.payload}</p>
              <p className="text-sm text-gray-500 mt-4">{option.recommendedFor}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-6 md:px-8 md:py-8 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <h2 className="text-3xl font-bold text-gray-900">Тарифы на доставку</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Расстояние, км
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Манипулятор до 8 поддонов
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Манипулятор до 15 поддонов
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regionTariffs.map((row) => (
                  <tr key={row.distance}>
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{row.distance} км</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {typeof row.small === 'number' ? `${formatPrice(row.small)} ₽` : '—'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {typeof row.large === 'number' ? `${formatPrice(row.large)} ₽` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-6 md:px-8 md:py-8 bg-gray-50 border-t border-gray-200">
            <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900">Доставка без разгрузки</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {deliveryNotes[regionConfig.slug].noUnload.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900">Доставка с разгрузкой манипулятором</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {deliveryNotes[regionConfig.slug].withUnload.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Самовывоз со склада</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {deliveryNotes[regionConfig.slug].selfPickup.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-t border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Как проходит доставка</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  1. Уточняем объём, адрес и условия выгрузки {regionConfig.namePrepositional}. При необходимости делаем фото/видеоразведку подъезда.
                </p>
                <p>
                  2. Подбираем транспорт и бронируем окно на складе {regionConfig.nameGenitive}. Сообщаем водителю контакты прораба.
                </p>
                <p>
                  3. В день доставки контролируем погрузку и отправляем вам данные о времени прибытия и ФИО водителя.
                </p>
                <p>
                  4. Разгружаем блоки согласно схеме, отмечаем фактический объём и передаём закрывающие документы.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Подготовьте площадку</h2>
              <ul className="mt-6 space-y-3 text-gray-600">
                {preparationChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl bg-navy-900 text-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Хотите получить расчёт доставки {regionConfig.namePrepositional}?
          </h2>
          <p className="text-navy-100 text-lg mb-8">
            Оставьте контакт — менеджер уточнит объём, подберёт транспорт и согласует удобное время доставки.
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Link
              href={`tel:${phoneHref}`}
              className="inline-flex items-center justify-center bg-white text-navy-900 px-6 py-3 rounded-lg font-semibold transition hover:bg-navy-100"
            >
              Позвонить: {regionConfig.contacts.phoneFormatted}
            </Link>
            <a
              href="#quiz"
              className="inline-flex items-center justify-center border border-white/40 text-white px-6 py-3 rounded-lg font-semibold transition hover:bg-white/10"
            >
              Заполнить форму →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return validRegions.map((region) => ({ region }));
}

