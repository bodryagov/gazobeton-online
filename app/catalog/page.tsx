import type { Metadata } from 'next';
import Link from 'next/link';
import Catalog from '@/components/Catalog';
import RegionSelector from '@/components/RegionSelector';
import Breadcrumbs from '@/components/Breadcrumbs';
import CatalogRegionGate from '@/components/catalog/CatalogRegionGate';
import { getAllCatalogProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Каталог газобетонных блоков — выбрать и купить | Газобетон Online',
  description:
    'Каталог газобетонных блоков популярных брендов: Istkult (Ytong), Bonolit, Poritep, ЛСР и других. Выберите регион, сравните характеристики, получите консультацию.',
  alternates: {
    canonical: 'https://gazobeton-online.ru/catalog',
  },
  openGraph: {
    title: 'Каталог газобетонных блоков | Газобетон Online',
    description:
      'Газобетонные блоки ведущих производителей. Фильтры по плотности и толщине, помощь в подборе и расчёте.',
    url: 'https://gazobeton-online.ru/catalog',
    siteName: 'Газобетон Online',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Каталог газобетонных блоков | Газобетон Online',
    description:
      'Газобетонные блоки ведущих производителей. Фильтры по плотности и толщине, помощь в подборе и расчёте.',
  },
};

export default function CatalogPage() {
  const catalogProducts = getAllCatalogProducts();
  const availableProducts = catalogProducts.filter((product) => product.pricePerM3 > 0);
  const minPrice =
    availableProducts.length > 0
      ? Math.min(...availableProducts.map((product) => product.pricePerM3))
      : 0;
  const maxPrice =
    availableProducts.length > 0
      ? Math.max(...availableProducts.map((product) => product.pricePerM3))
      : 0;
  const brandsCount = new Set(catalogProducts.map((product) => product.brandName)).size;
  const thicknessRange = catalogProducts.reduce(
    (acc, product) => {
      return {
        min: Math.min(acc.min, product.thickness),
        max: Math.max(acc.max, product.thickness),
      };
    },
    { min: Infinity, max: -Infinity }
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <nav aria-label="Хлебные крошки" className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Каталог газобетона' },
            ]}
          />
        </div>
      </nav>

      <CatalogRegionGate>
        <header className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Каталог газобетонных блоков
          </h1>
          <div className="space-y-3 text-lg text-gray-600">
            <p>
              Выберите ваш город, чтобы увидеть актуальные цены и наличие товаров в регионе. Для каждого склада мы
              показываем минимальную стоимость за м³, количество блоков в поддоне и доступ к манипуляторам.
            </p>
          </div>
        </header>

        <div className="container mx-auto px-4">
          <RegionSelector redirectToCatalog />
        </div>

        <div className="container mx-auto px-4 pb-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <section
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8"
              aria-labelledby="catalog-pricing-heading"
            >
              <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Как считать стоимость</p>
                  <h2 id="catalog-pricing-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                    Цена указана за 1 м³ газобетона
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-orange-500" />
                  Обновлено {new Date().toLocaleDateString('ru-RU')}
                </div>
              </header>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900">Ориентиры по цене</h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>
                      • Средний диапазон по брендам:{' '}
                      {minPrice > 0 ? `${minPrice.toLocaleString('ru-RU')} ₽` : '—'} —{' '}
                      {maxPrice > 0 ? `${maxPrice.toLocaleString('ru-RU')} ₽` : '—'} за м³
                    </li>
                    <li>• Один поддон ≈ 1.8–2.2 м³ (в зависимости от толщины блоков)</li>
                    <li>• Итоговая стоимость заказа зависит от объёма, разгрузки и расстояния доставки</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900">Что влияет на цену</h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>
                      • Плотность (
                      <abbr title="Тёплый блок для энергоэффективных стен">D400</abbr>–
                      <abbr title="Универсальный блок для несущих стен">D600</abbr>) и толщина ({thicknessRange.min}–{thicknessRange.max} мм)
                    </li>
                    <li>• Производитель — в каталоге {brandsCount} проверенных брендов</li>
                    <li>• Наличие регионального склада и стоимость манипулятора</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
                <p>
                  Мы предлагаем газобетонные блоки популярных брендов (Bonolit, Istkult, LSR, ГРАС, «Коттедж» и др.)
                  разной плотности и размеров. В карточке каждого товара указаны цена за м³, примерная стоимость блока,
                  наличие на складе и советы по доставке.
                </p>
                <p>
                  Для наружных стен чаще всего выбирают блоки 300–400 мм (D400–D500), для перегородок — 100–200 мм. В
                  каталоге есть фильтры по производителю, толщине, назначению и наличию, поэтому легко подобрать блоки
                  «под ключ» для коттеджа, бани или гаража.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Быстрые действия по каталогу">
                <Link
                  href="#catalog-filters"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Подобрать блоки
                </Link>
                <Link
                  href="/#delivery"
                  className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                >
                  Посмотреть тарифы доставки
                </Link>
                <Link
                  href="/calculator"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
                >
                  Открыть калькулятор
                </Link>
              </div>
            </section>

            <aside
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col justify-between"
              aria-labelledby="catalog-benefits-heading"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Что входит</p>
                <h3 id="catalog-benefits-heading" className="text-lg font-semibold text-gray-900 mt-3">
                  В стоимость включено
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>• Блоки с точной геометрией и паспортом качества</li>
                  <li>• Помощь менеджера в подборе и расчёте количества</li>
                  <li>• Консультация инженера по монтажу и узлам</li>
                  <li>• Подбор манипулятора и согласование доставки</li>
                </ul>
              </div>
              <Link
                href="#quiz"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Получить персональный расчёт →
              </Link>
            </aside>
          </div>
        </div>

        <section className="container mx-auto px-4 pb-8" aria-labelledby="all-products-heading">
          <div className="mb-6">
            <h2 id="all-products-heading" className="text-2xl font-bold text-gray-900 mb-2">
              Все товары (примерные цены)
            </h2>
            <p className="text-gray-600 text-sm">
              Для просмотра актуальных цен и наличия выберите ваш регион выше: после выбора покажем точные цены, наличие и
              дату обновления прайса.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12" aria-label="Полный список товаров">
          <Catalog products={catalogProducts} showFilters />
        </section>

        <section className="bg-white py-16 mt-16" aria-labelledby="selection-guide-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 id="selection-guide-heading" className="text-3xl font-bold mb-6">
                Как выбрать газобетонные блоки?
              </h2>

              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  Газобетон — один из самых популярных материалов для строительства частных домов. При выборе
                  газобетонных блоков важно учитывать несколько ключевых параметров:
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">1. Плотность блоков (марка)</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>D400</strong> — легкие блоки с отличной теплоизоляцией, подходят для строительства домов до 2 этажей</li>
                  <li><strong>D500</strong> — универсальный вариант, сочетающий прочность и теплоизоляцию, используется для несущих стен</li>
                  <li><strong>D600</strong> — более прочные блоки для строительства многоэтажных зданий</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">2. Толщина блока</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>100-150 мм</strong> — для внутренних перегородок</li>
                  <li><strong>200-250 мм</strong> — для внутренних несущих стен</li>
                  <li><strong>300-400 мм</strong> — для наружных стен (наиболее популярный вариант в средней полосе России)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">3. Производитель</h3>
                <p className="mb-4">
                  В нашем каталоге представлены только проверенные производители с сертифицированной продукцией:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Istkult (Ytong)</strong> — эталон качества и точности геометрии</li>
                  <li><strong>Bonolit</strong> — крупнейший российский производитель, оптимальное соотношение цена-качество</li>
                  <li><strong>Poritep / ЛСР</strong> — надежная продукция по доступной цене</li>
                </ul>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mt-8">
                  <p className="font-semibold mb-2">💡 Нужна помощь в выборе?</p>
                  <p className="mb-4">
                    Наши специалисты бесплатно подберут оптимальный газобетон для вашего проекта и рассчитают точное количество материала.
                  </p>
                  <span className="inline-flex">
                    <Link
                      href="/#quiz"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                      Получить консультацию
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </CatalogRegionGate>
    </main>
  );
}
