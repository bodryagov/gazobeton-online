import Link from 'next/link';
import Quiz from '@/components/Quiz';

export const metadata = {
  title: 'Купить газобетонные блоки с доставкой — Все производители | Газобетон Online',
  description: 'Большой выбор газобетонных блоков Ytong, Bonolit, Коттедж, Грас, Теплон, Теплит. Подбор оптимального газобетона за 2 минуты. Доставка по Москве и области. Гарантия лучшей цены!',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero-секция */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Купить газобетонные блоки с доставкой
              <br />
              <span className="text-orange-600">Все производители в одном месте</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Подберем оптимальный газобетон для вашего дома за 2 минуты. 
              Бесплатная консультация специалиста.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-700 text-center">Гарантия лучшей цены</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-700 text-center">Доставка по Москве и области</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-700 text-center">Сертифицированный газобетон</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-700 text-center">Помощь в подборе</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#quiz"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Подобрать газобетон за 2 минуты
              </Link>
              <Link
                href="/catalog"
                className="bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition"
              >
                Смотреть каталог
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Квиз */}
      <section id="quiz" className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Подобрать газобетон за 2 минуты
            </h2>
            <p className="text-lg text-gray-600">
              Ответьте на 6 вопросов, и мы предложим оптимальный вариант
            </p>
          </div>
          <Quiz />
        </div>
      </section>

      {/* Популярные производители */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Популярные производители газобетона
            </h2>
            <p className="text-lg text-gray-600">
              Работаем напрямую более, чем с 15 заводами
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {[
              { name: 'Ytong', slug: 'ytong', desc: 'Немецкое качество, точная геометрия' },
              { name: 'Bonolit', slug: 'bonolit', desc: 'Крупнейший российский производитель' },
              { name: 'Коттедж', slug: 'kottedzh', desc: 'Надежные блоки для частного строительства' },
              { name: 'Грас', slug: 'gras', desc: 'Качественный газобетон по доступной цене' },
              { name: 'Теплон', slug: 'teplon', desc: 'Энергоэффективные блоки' },
              { name: 'Теплит', slug: 'teplit', desc: 'Проверенное качество' },
            ].map((brand) => (
              <Link
                key={brand.slug}
                href={`/catalog?brand=${brand.slug}`}
                className="bg-gray-50 hover:bg-orange-50 rounded-xl p-6 text-center transition group border-2 border-transparent hover:border-orange-200"
              >
                <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-white transition">
                  {/* Вместо placeholder можно использовать: <img src={`/brands/${brand.slug}.svg`} alt={`Логотип ${brand.name}`} className="max-w-full max-h-full object-contain" /> */}
                  <span className="text-gray-400 text-xs font-semibold">{brand.name}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{brand.desc}</p>
                <span className="text-orange-600 text-sm font-medium group-hover:underline">
                  Смотреть →
                </span>
              </Link>
            ))}
          </div>

        <div className="text-center">
            <Link
              href="/catalog"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Все производители
            </Link>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-lg text-gray-600">
              Работаем с 2008 года — более 15 лет опыта
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💰',
                title: 'Работаем напрямую с 15+ заводами',
                desc: 'Можем подобрать самое выгодное предложение для вас',
              },
              {
                icon: '🏆',
                title: 'Опыт с 2008 года',
                desc: 'Более 15 лет на рынке газобетона',
              },
              {
                icon: '🚚',
                title: 'Оперативная доставка с разгрузкой',
                desc: 'Организуем доставку и разгрузку манипулятором',
              },
              {
                icon: '💳',
                title: 'Оплата на месте',
                desc: 'Гибкие условия оплаты при получении товара',
              },
              {
                icon: '📦',
                title: 'Бесплатное хранение на складе',
                desc: 'Можем хранить ваш заказ до нужного времени',
              },
              {
                icon: '🔕',
                title: 'Без спамных звонков',
                desc: 'Уважаем ваше время, связываемся только по делу',
              },
            ].map((benefit, idx) => (
              <article
                key={idx}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Часто задаваемые вопросы
              </h2>
              <p className="text-lg text-gray-600">
                Ответы на популярные вопросы о газобетоне
              </p>
            </div>

            <div className="space-y-4">
              <details className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition group">
                <summary className="font-semibold text-lg cursor-pointer flex items-start">
                  <span className="text-orange-600 mr-3 mt-1">Q:</span>
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

              <details className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition group">
                <summary className="font-semibold text-lg cursor-pointer flex items-start">
                  <span className="text-orange-600 mr-3 mt-1">Q:</span>
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
                  <Link href="/calculator" className="text-orange-600 underline hover:text-orange-700">
                    калькулятором газобетона
                  </Link>
                  {' '}— укажите размеры стен, толщину блока, и система автоматически рассчитает нужный объем с учетом запаса 5% на подрезку. Или получите бесплатную консультацию менеджера — наши специалисты помогут рассчитать точное количество блоков для вашего проекта.
                </div>
              </details>

              <details className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition group">
                <summary className="font-semibold text-lg cursor-pointer flex items-start">
                  <span className="text-orange-600 mr-3 mt-1">Q:</span>
                  <span className="flex-1">Сколько стоит доставка газобетона?</span>
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
                  <span className="font-semibold text-green-600">A:</span> Стоимость доставки зависит от региона и объема заказа. По Москве и МО (до 50 км от МКАД) — от 3000 руб. Для заказов от 20 м³ доставка может быть бесплатной. Точную стоимость рассчитает менеджер при оформлении заказа.{' '}
                  <Link href="/catalog" className="text-orange-600 underline hover:text-orange-700">
                    Смотреть каталог
                  </Link>
                </div>
              </details>

              <details className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition group">
                <summary className="font-semibold text-lg cursor-pointer flex items-start">
                  <span className="text-orange-600 mr-3 mt-1">Q:</span>
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
                className="text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                Все вопросы и ответы (16 вопросов) →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Блок "Как мы подбираем" */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Как мы подбираем лучшее предложение
              </h2>
          <p className="text-lg text-gray-600">
                Комплексный подход к выбору оптимального газобетона
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: '🔍',
                  title: 'Анализируем цены у всех заводов',
                  desc: 'Сравниваем цены напрямую с 15+ производителями, находим самые выгодные условия',
                },
                {
                  icon: '🗺️',
                  title: 'Учитываем логистику и подъездные пути',
                  desc: 'Проверяем доступность участка для доставки, планируем оптимальный маршрут',
                },
                {
                  icon: '🏭',
                  title: 'Используем свой склад и собственный транспорт',
                  desc: 'Собственная логистика позволяет оперативно доставлять и хранить газобетон',
                },
                {
                  icon: '💰',
                  title: 'Помогаем сэкономить',
                  desc: 'Точный расчет количества + максимальные скидки + сезонные акции = лучшая цена',
                },
                {
                  icon: '⚡',
                  title: 'Организуем доставку в день заказа или бесплатное хранение до лета',
                  desc: 'Гибкие условия: привезем сразу или сохраним на складе до начала строительства',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center gap-4"
                >
                  <div className="text-4xl flex-shrink-0">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Быстрые ссылки */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
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
                className="bg-gray-50 hover:bg-orange-50 rounded-xl p-6 text-center transition group border-2 border-transparent hover:border-orange-200"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA перед футером */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Остались вопросы? Получите бесплатную консультацию
            </h2>
            <p className="text-lg text-orange-50 mb-8">
              Наши специалисты помогут подобрать газобетон и рассчитать точное количество блоков для вашего проекта
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+74951234567"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Позвонить
              </a>
              <a
                href="https://wa.me/74951234567"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
        </div>
      </div>
      </section>
    </main>
  );
}
