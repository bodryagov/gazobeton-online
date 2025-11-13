'use client';

import { useState } from 'react';
import Link from 'next/link';
import Catalog from '@/components/Catalog';
import ContactFormModal from '@/components/ContactFormModal';
import type { RegionConfig } from '@/data/regions';
import type { Manufacturer } from '@/data/manufacturers';
import type { Product } from '@/components/Catalog';
import type { RegionSlug } from '@/types/product';

interface ManufacturerPageClientProps {
  region: string;
  regionConfig: RegionConfig;
  manufacturerData: Manufacturer;
  manufacturerProducts: Product[];
  breadcrumbs: Array<{ label: string; href: string }>;
  recommendedArticles: Array<{ href: string; label: string }>;
}

export default function ManufacturerPageClient({
  region,
  regionConfig,
  manufacturerData,
  manufacturerProducts,
  breadcrumbs,
  recommendedArticles,
}: ManufacturerPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Краткая информация о доставке (из региональной страницы)
  const deliveryInfo = {
    samara: {
      intro: 'Доставляем газобетон по всей Самарской области: Самара, Тольятти, Сызрань и другие города. Работаем с удалёнными посёлками и стройками.',
      options: ['Манипулятор 5 тонн — до 8 поддонов', 'Манипулятор 10 тонн — до 16 поддонов', 'Длинномер с краном — до 20 поддонов'],
    },
    moscow: {
      intro: 'Доставляем по Москве, Московской области и соседним регионам. Берём на себя пропуска на МКАД, ТТК и Садовое, организуем ночные разгрузки.',
      options: ['Манипулятор 5 тонн — до 8 поддонов', 'Манипулятор 10 тонн — до 16 поддонов', 'Длинномер с краном — до 20 поддонов'],
    },
    spb: {
      intro: 'Везём газобетон по Санкт-Петербургу, Ленинградской области и соседним регионам. Учитываем влажные грунты и прибрежный климат.',
      options: ['Манипулятор 5 тонн — до 8 поддонов', 'Манипулятор 10 тонн — до 16 поддонов', 'Длинномер с краном — до 20 поддонов'],
    },
    ufa: {
      intro: 'Доставляем газобетон по Башкортостану и соседним регионам. Работаем с удалёнными объектами и стройками.',
      options: ['Манипулятор 5 тонн — до 8 поддонов', 'Манипулятор 10 тонн — до 16 поддонов', 'Длинномер с краном — до 20 поддонов'],
    },
  };

  const delivery = deliveryInfo[regionConfig.slug as keyof typeof deliveryInfo] || deliveryInfo.moscow;

  return (
    <>
      <main className="bg-gray-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <nav aria-label="Хлебные крошки" className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <span className="text-gray-400">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-gray-600 hover:text-blue-600 transition">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Hero-блок */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
                {/* Логотип */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-blue-100">
                    <span className="text-4xl md:text-5xl font-bold text-blue-600">
                      {manufacturerData.brandName.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Текст */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                    Газобетонные блоки {manufacturerData.brandName} {regionConfig.nameGenitive}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-700 mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto md:mx-0">
                    Качественные газобетонные блоки {manufacturerData.brandName} по доступным ценам. Широкий ассортимент плотностей и размеров для строительства домов, бань и хозяйственных построек. Доставка {regionConfig.namePrepositional} и области.
                  </p>

                  {/* CTA-кнопки */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button
                      onClick={scrollToCatalog}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Посмотреть цены
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Заказать товар
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* О производителе */}
            {manufacturerData.about && (
              <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 mb-12 border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  О производителе {manufacturerData.brandName}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">{manufacturerData.about}</p>

                  {manufacturerData.advantages && manufacturerData.advantages.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Преимущества</h3>
                      <ul className="space-y-3">
                        {manufacturerData.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <svg
                              className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Каталог товаров */}
            <div id="catalog" className="scroll-mt-8 mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Цены на газобетонные блоки {manufacturerData.brandName}
              </h2>
              <Catalog
                products={manufacturerProducts}
                showFilters={true}
                regionSlug={regionConfig.slug as RegionSlug}
                showFullCatalogLink={false}
              />
            </div>

            {/* Калькулятор и полезные статьи */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Калькулятор */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Калькулятор газобетона</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Рассчитайте точное количество блоков {manufacturerData.brandName} для вашего проекта. Укажите размеры дома, и калькулятор покажет необходимое количество материала с учётом запаса.
                </p>
                <Link
                  href={`/${region}/calculator`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Открыть калькулятор
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Полезные статьи */}
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Полезные статьи по строительству</h3>
                <p className="text-gray-700 mb-4">
                  Узнайте больше о выборе, монтаже и утеплении газобетона из наших статей.
                </p>
                <ul className="space-y-2">
                  {recommendedArticles.map((article) => (
                    <li key={article.href}>
                      <Link
                        href={article.href}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-start gap-2 group"
                      >
                        <svg
                          className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0 group-hover:text-blue-600 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span>{article.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Доставка */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Доставка {manufacturerData.brandName} {regionConfig.namePrepositional}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {delivery.intro}
              </p>
              <ul className="space-y-2 mb-4">
                {delivery.options.map((option, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/${region}/delivery`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Подробнее о доставке и условиях
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* FAQ по бренду */}
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 border border-gray-200 mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Частые вопросы о {manufacturerData.brandName}
              </h2>
              <div className="space-y-6">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                    <span>Чем отличается {manufacturerData.brandName} от других производителей?</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
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
                  <div className="mt-4 text-gray-700 leading-relaxed pl-6">
                    {manufacturerData.advantages && manufacturerData.advantages.length > 0 ? (
                      <ul className="space-y-2">
                        {manufacturerData.advantages.map((advantage, index) => (
                          <li key={index}>• {advantage}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        {manufacturerData.brandName} отличается качеством продукции, точной геометрией
                        блоков и оптимальным соотношением цена-качество.
                      </p>
                    )}
                  </div>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                    <span>Какая плотность {manufacturerData.brandName} лучше для дома?</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
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
                  <div className="mt-4 text-gray-700 leading-relaxed pl-6">
                    <p>
                      Для наружных стен дома рекомендуется использовать блоки плотностью D400 или D500
                      толщиной 300-400 мм. Для внутренних перегородок подойдут блоки D600 толщиной 100-150
                      мм. Выбор зависит от этажности дома и климатических условий региона.
                    </p>
                    <Link
                      href="/construction/vybor-gazobetona"
                      className="mt-3 inline-block text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Подробнее о выборе газобетона →
                    </Link>
                  </div>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                    <span>Есть ли сертификаты на {manufacturerData.brandName}?</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
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
                  <div className="mt-4 text-gray-700 leading-relaxed pl-6">
                    <p>
                      Да, продукция {manufacturerData.brandName} сертифицирована и соответствует всем
                      требованиям ГОСТ. Все товары имеют необходимые сертификаты качества и
                      соответствия.
                    </p>
                  </div>
                </details>
              </div>
            </div>

            {/* CTA-блок в конце */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 md:p-10 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Нужна консультация по выбору {manufacturerData.brandName}?
                </h2>
                <p className="text-lg mb-6 text-blue-50">
                  Наши специалисты помогут подобрать оптимальный вариант для вашего проекта и рассчитать
                  необходимое количество блоков.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition shadow-md"
                  >
                    Оставить заявку
                  </button>
                  <Link
                    href={`/${region}/calculator`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition"
                  >
                    Рассчитать количество
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Модалка с формой обратной связи */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        manufacturerName={manufacturerData.brandName}
        regionName={regionConfig.name}
      />
    </>
  );
}

