import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Контакты Газобетон Online — телефон, адрес, реквизиты',
  description:
    'Газобетон Online: консультации, расчёт и заказ газобетонных блоков. Контакты отделов продаж и логистики, график работы, адрес складов.',
  alternates: {
    canonical: 'https://gazobeton-online.ru/contacts',
  },
  openGraph: {
    title: 'Контакты Газобетон Online',
    description:
      'Свяжитесь с нами по телефону, email или через форму. Поможем подобрать газобетон и организовать доставку.',
    url: 'https://gazobeton-online.ru/contacts',
    siteName: 'Газобетон Online',
    locale: 'ru_RU',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Контакты Газобетон Online',
    description: 'Телефоны, email и адреса складов компании Газобетон Online.',
  },
};

const contactGroups = [
  {
    title: 'Отдел продаж',
    description: 'Подбор газобетона, расчёт объёма, оформление заказа.',
    phone: '+7 (800) 123-45-67',
    email: 'sales@gazobeton-online.ru',
    schedule: 'Пн–Сб: 09:00–20:00, Вс: по записи',
  },
  {
    title: 'Логистика и доставка',
    description: 'Согласование дат доставки, подбор транспорта, пропуска.',
    phone: '+7 (800) 765-43-21',
    email: 'delivery@gazobeton-online.ru',
    schedule: 'Пн–Сб: 09:00–19:00',
  },
];

const warehouseLocations = [
  {
    city: 'Москва',
    address: 'г. Москва, поселение Сосенское, строение 4',
    schedule: 'Пн–Пт: 09:00–18:00, Сб: 10:00–16:00',
  },
  {
    city: 'Санкт-Петербург',
    address: 'Ленинградская область, Тосненский район, промзона Южная',
    schedule: 'Пн–Пт: 09:00–18:00',
  },
  {
    city: 'Уфа',
    address: 'г. Уфа, ул. Индустриальная, 15',
    schedule: 'Пн–Пт: 09:00–17:00',
  },
  {
    city: 'Самара',
    address: 'г. Самара, пр-д Лесной, 3',
    schedule: 'Пн–Пт: 09:00–18:00, Сб: 10:00–15:00',
  },
];

export default function ContactsPage() {
  const contactPoints = contactGroups.map((group) => ({
    '@type': 'ContactPoint',
    contactType: group.title,
    telephone: group.phone.replace(/\s/g, ''),
    email: group.email,
    availableLanguage: ['Russian'],
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      description: group.schedule,
    },
  }));

  const locations = warehouseLocations.map((warehouse) => ({
    '@type': 'Place',
    name: `Склад ${warehouse.city}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: warehouse.city,
      streetAddress: warehouse.address,
      addressCountry: 'RU',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      description: warehouse.schedule,
    },
  }));

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Газобетон Online',
    url: 'https://gazobeton-online.ru/',
    telephone: '+7-800-123-45-67',
    email: 'info@gazobeton-online.ru',
    contactPoint: contactPoints,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Россия',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Газобетонные блоки и услуги доставки',
      url: 'https://gazobeton-online.ru/catalog',
    },
    location: locations,
  };

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Контакты Газобетон Online',
    url: 'https://gazobeton-online.ru/contacts',
    inLanguage: 'ru-RU',
    mainEntity: localBusinessSchema,
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Контакты' },
            ]}
          />
        </div>
      </div>

      <section className="container mx-auto px-4 py-12 md:py-20">
        <header className="max-w-4xl mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Всегда на связи</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
            Контакты Газобетон Online
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4">
            Выберите удобный способ связи: позвоните напрямую, напишите на почту или оставьте заявку — менеджер перезвонит в течение 15 минут.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {contactGroups.map((group) => (
            <article key={group.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">{group.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{group.description}</p>
              <div className="mt-4 space-y-2 text-base text-gray-800">
                <p>
                  Телефон:{' '}
                  <a href={`tel:${group.phone.replace(/[^+\d]/g, '')}`} className="text-orange-600 hover:text-orange-500 font-semibold">
                    {group.phone}
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a href={`mailto:${group.email}`} className="text-orange-600 hover:text-orange-500 font-semibold">
                    {group.email}
                  </a>
                </p>
                <p className="text-sm text-gray-500">График: {group.schedule}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Форма обратной связи</h2>
            <p className="text-sm text-gray-600 mt-2">
              Укажите имя и контакт — мы свяжемся с вами и ответим на вопросы о газобетоне и доставке.
            </p>
            <form className="mt-6 space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Иван"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Комментарий
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="Например: нужен расчёт газобетона на дом 150 м²"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Отправить заявку
              </button>
              <p className="text-xs text-gray-500">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и обработкой персональных данных.
              </p>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Адреса складов</h2>
            <p className="text-sm text-gray-600 mt-2">
              Самовывоз возможен по предварительной записи. Укажите менеджеру желаемое время и номер машины.
            </p>
            <div className="mt-6 space-y-5">
              {warehouseLocations.map((warehouse) => (
                <div key={warehouse.city} className="border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{warehouse.city}</h3>
                  <p className="text-sm text-gray-600 mt-1">{warehouse.address}</p>
                  <p className="text-xs text-gray-500 mt-2">График: {warehouse.schedule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-900 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Мы в телеграме</h2>
            <p className="text-navy-100 text-lg mb-8">
              Каждый день публикуем советы по строительству, отвечаем на вопросы и рассказываем о новых поступлениях газобетона.
            </p>
            <Link
              href="https://t.me/gazobeton-online"
              className="inline-flex items-center justify-center bg-white text-navy-900 px-6 py-3 rounded-lg font-semibold transition hover:bg-navy-100"
            >
              Подписаться на Telegram-канал
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

