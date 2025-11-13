import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Доставка газобетона — условия и варианты | Газобетон Online',
  description:
    'Организуем доставку газобетонных блоков по Москве, Санкт-Петербургу, Уфе и Самаре. Собственный автопарк, помощь с разгрузкой, оптимизация маршрута.',
  alternates: {
    canonical: 'https://gazobeton-online.ru/delivery',
  },
  openGraph: {
    title: 'Доставка газобетона — условия | Газобетон Online',
    description:
      'Доставка газобетонных блоков по регионам присутствия. Выбор транспорта, сроки, разгрузка и подъём на участок.',
    url: 'https://gazobeton-online.ru/delivery',
    siteName: 'Газобетон Online',
    locale: 'ru_RU',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Доставка газобетона | Газобетон Online',
    description:
      'Условия доставки газобетона: перевозка блоков манипулятором, погрузка с завода, разгрузка на объекте.',
  },
};

const deliveryOptions = [
  {
    title: 'Манипулятор 5 тонн',
    distance: 'В пределах 30 км от склада',
    price: 'от 12 000 ₽',
    payload: 'Погрузка до 8 поддонов',
    notes: 'Оптимальное решение для частных домов, удобно разгружает блоки на участке.',
  },
  {
    title: 'Манипулятор 10 тонн',
    distance: 'До 60 км от склада',
    price: 'от 16 500 ₽',
    payload: 'Погрузка до 16 поддонов',
    notes: 'Подходит для крупных объектов, позволяет доставить весь объём за один рейс.',
  },
  {
    title: 'Длинномер с краном',
    distance: 'От 60 км и далее',
    price: 'по запросу',
    payload: 'До 20 поддонов',
    notes: 'Используется для дальних регионов и объектов с высокой потребностью в материале.',
  },
];

const preparationChecklist = [
  'Подготовьте подъездные пути — ширина проезда не менее 3 метров.',
  'Убедитесь, что площадка для разгрузки ровная и выдержит вес техники.',
  'При необходимости обеспечьте освещение и доступ к электричеству (при разгрузке в тёмное время суток).',
  'Сообщите менеджеру о любых ограничения по времени проезда техники в ваш поселок.',
];

export default function DeliveryPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Доставка газобетонных блоков',
    description:
      'Организация доставки газобетонных блоков манипулятором и длинномером по Москве, Санкт-Петербургу, Уфе, Самаре и соседним регионам.',
    provider: {
      '@type': 'Organization',
      name: 'Газобетон Online',
      url: 'https://gazobeton-online.ru/',
      telephone: '+7-962-609-35-35',
    },
    areaServed: [
      { '@type': 'City', name: 'Москва' },
      { '@type': 'City', name: 'Санкт-Петербург' },
      { '@type': 'City', name: 'Самара' },
      { '@type': 'City', name: 'Уфа' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Тарифы на доставку газобетона',
      itemListElement: deliveryOptions.map((option, index) => ({
        '@type': 'Offer',
        position: index + 1,
        name: option.title,
        description: `${option.distance}. ${option.payload}`,
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: option.price.replace(/[^\d]/g, '') || undefined,
          priceCurrency: 'RUB',
        },
      })),
    },
    serviceType: 'LogisticsService',
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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Доставка',
        item: 'https://gazobeton-online.ru/delivery',
      },
    ],
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
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Доставка' },
            ]}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 via-white to-gray-50">
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Логистика без сюрпризов
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
              Доставка газобетона на объект в срок
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl">
              Мы организуем доставку газобетонных блоков напрямую со складов производителей.
              Подберём подходящий транспорт, согласуем время, подготовим документы и поможем с разгрузкой.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="tel:+78001234567"
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-lg transition"
              >
                Позвонить менеджеру
              </Link>
              <a
                href="#delivery-options"
                className="inline-flex items-center justify-center border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold text-base transition"
              >
                Тарифы и зоны →
              </a>
            </div>
          </div>
        </section>
      </div>

      <section id="delivery-options" className="container mx-auto px-4 py-12 md:py-16">
        <header className="max-w-3xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Транспорт и тарифы</h2>
          <p className="text-gray-600 mt-3">
            Подбираем транспорт исходя из объёма заказа, удалённости объекта и особенностей подъездных путей.
            Стоимость указана ориентировочно — менеджер уточнит её при подтверждении заказа.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {deliveryOptions.map((option) => (
            <article
              key={option.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{option.distance}</p>
              <p className="text-lg font-semibold text-orange-600 mt-4">{option.price}</p>
              <p className="text-sm text-gray-600 mt-2">{option.payload}</p>
              <p className="text-sm text-gray-500 mt-4">{option.notes}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Как проходит доставка</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  1. Получаем заявку и уточняем объём, адрес, особенности подъезда, желаемую дату и время.
                </p>
                <p>
                  2. Подбираем транспорт и бронируем окно на складе производителя. При необходимости делаем
                  предварительный заезд манипулятора для оценки условий.
                </p>
                <p>
                  3. Заказываем пропуск в ваш посёлок (если требуется) и согласовываем схемы разгрузки.
                </p>
                <p>
                  4. В день доставки контролируем отгрузку, отправляем контакты водителя, сопровождаем до завершения разгрузки.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Подготовка площадки</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Нужен точный расчёт доставки?</h2>
          <p className="text-navy-100 text-lg mb-8">
            Оставьте контакты, и мы подготовим оптимальную схему доставки и разгрузки под ваш объект.
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Link
              href="tel:+79626093535"
              className="inline-flex items-center justify-center bg-white text-navy-900 px-6 py-3 rounded-lg font-semibold transition hover:bg-navy-100"
            >
              Позвонить: +7 (962) 609-35-35
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

