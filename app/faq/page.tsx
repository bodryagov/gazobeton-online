import Link from 'next/link';

import { regionQueryData } from '@/data/seo/region-query-data';
import { regions } from '@/data/regions';

interface FAQQuestion {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  category: string;
  keywords: string[];
  questions: FAQQuestion[];
}

interface FAQQueryCoverage {
  regionSlug: string;
  regionName: string;
  queries: string[];
}

const FAQ_CATEGORY_KEYWORDS: Record<string, string[]> = {
  choice: ['какой', 'плотн', 'd400', 'd500', 'лср', 'bonolit', 'лучше', 'сравнен'],
  pricing: ['цена', 'стоим', 'сколько стоит', 'купить', 'за куб', 'коммерческое'],
  calculator: ['калькулятор', 'расчет', 'сколько блоков', 'дом', 'баня', 'подсчет'],
  delivery: ['достав', 'манипулятор', 'самовывоз', 'разгруз', 'тариф', 'поддон'],
  montage: ['утепл', 'монтаж', 'клей', 'армир', 'зим', 'хранить', 'инструмент'],
};

function collectFaqQueryCoverage(keywords: string[]): FAQQueryCoverage[] {
  const normalized = keywords.map((keyword) => keyword.toLowerCase());

  return Object.entries(regionQueryData)
    .map(([regionSlug, data]) => {
      const combined = [...data.highFreqLowComp, ...data.top];
      const seen = new Set<string>();
      const matched: string[] = [];

      for (const query of combined) {
        const lower = query.toLowerCase();
        if (normalized.some((keyword) => lower.includes(keyword)) && !seen.has(lower)) {
          matched.push(query);
          seen.add(lower);
        }
        if (matched.length >= 5) {
          break;
        }
      }

      if (matched.length === 0) {
        return null;
      }

      const regionName = regions[regionSlug]?.name ?? regionSlug;

      return {
        regionSlug,
        regionName,
        queries: matched.slice(0, 5),
      };
    })
    .filter((item): item is FAQQueryCoverage => Boolean(item));
}

const faqCategories: FAQCategory[] = [
  {
    id: 'choice',
    category: 'Выбор и характеристики газобетона',
    keywords: FAQ_CATEGORY_KEYWORDS.choice,
    questions: [
      {
        q: 'Какую толщину и плотность газобетона выбрать для дома?',
        a: 'Для наружных стен в средней полосе чаще всего используют блоки D400–D500 толщиной 300–400 мм — они держат тепло без дополнительного утепления. В холодных регионах (Урал, северо-запад) выбирают 375–400 мм. Для перегородок подойдут блоки 100–200 мм. Если сомневаетесь, пришлите план дома — подберём комбинацию по несущей способности и теплотехнике.',
      },
      {
        q: 'Чем отличаются Bonolit, Ytong, ЛСР и местные заводы?',
        a: 'Bonolit — крупнейший производитель с широкой линейкой D400–D600 и стабильной геометрией, Ytong — эталон точности (±1 мм) и высокая плотность структуры, ЛСР сильны на северо-западе с акцентом на морозостойкость. Региональные заводы («Коттедж», СГЗСБ, ГРАС) предлагают выгодные цены и быструю логистику. Мы помогаем сравнить бренды под конкретный проект и регион.',
      },
      {
        q: 'Газобетон или кирпич/пеноблок — что выбрать?',
        a: 'Газобетон легче кирпича в 3–4 раза, быстрее кладётся, даёт тонкие швы и лучше сохраняет тепло. В отличие от пенобетона он производится в автоклаве, имеет стабильную геометрию и не даёт усадки. Кирпич выигрывает по прочности, но требует утепления. Для частных домов и бань газобетон — оптимальный баланс цены, скорости и энергоэффективности.',
      },
      {
        q: 'Что означает марка плотности D400, D500, D600?',
        a: 'Цифра показывает массу 1 м³ блока. D400 (≈400 кг/м³) — лёгкий и самый тёплый, D500 — универсальный для несущих стен, D600 — прочный вариант для сложных конструкций и многоэтажных домов. Чем выше плотность, тем выше прочность и ниже теплоизоляция. В каталоге у каждого товара указаны рекомендуемые области применения.',
      },
    ],
  },
  {
    id: 'pricing',
    category: 'Цены, заказ и коммерческое предложение',
    keywords: FAQ_CATEGORY_KEYWORDS.pricing,
    questions: [
      {
        q: 'Сколько стоит куб газобетона и есть ли скидки?',
        a: 'Цена зависит от бренда, плотности и региона. В каталоге отображаются актуальные цены за м³ и за поддон для выбранного города (например, «газоблок цена за куб в Самаре», «газобетон цена Москва», «сколько стоит газобетон СПб»). При заказе от 20 м³ действует бесплатная доставка, а для крупных объектов готовимся зафиксировать прайс и предложить оптовую скидку. Оставьте заявку в квизе — подготовим коммерческое за 15–30 минут.',
      },
      {
        q: 'Какой минимальный объём заказа?',
        a: 'Большинство заводов отгружают кратно поддону — это 1–2 м³ (в зависимости от толщины блока). Для розничных закупок и доборов организуем самовывоз или подберём совместную доставку с другим заказом. Всегда уточняем минимальный объём под конкретного производителя.',
      },
      {
        q: 'Как быстро подготовите КП и резерв на складе?',
        a: 'После заполнения квиза или звонка менеджеру мы проверяем наличие на складе, резервируем партию и отправляем КП в мессенджер. Если требуется поставка с завода, фиксируем сроки и стоимость ещё до оплаты, чтобы вы понимали график доставки.',
      },
      {
        q: 'Какие документы и способы оплаты доступны?',
        a: 'Физлица оплачивают наличными при получении, переводом по реквизитам или онлайн-ссылкой. Юрлица получают счёт с НДС или без, договор поставки и полный комплект закрывающих документов. Предусмотрена рассрочка для постоянных клиентов — обсуждаем индивидуально.',
      },
    ],
  },
  {
    id: 'calculator',
    category: 'Расчёт и калькулятор',
    keywords: FAQ_CATEGORY_KEYWORDS.calculator,
    questions: [
      {
        q: 'Как рассчитать количество блоков на дом или баню?',
        a: 'Самый быстрый способ — воспользоваться нашим калькулятором: укажите периметр, высоту, толщину блоков и тип перемычек. Сервис учтёт окна, двери и добавит 5% запаса. Если нужно точное КП с планом кладки, пришлите по электронной почте проект — инженер рассчитает вручную.',
      },
      {
        q: 'Сколько блоков в одном кубическом метре?',
        a: 'Зависит от размера. Например, блок 625×250×300 мм — 26 шт. в м³, 600×250×300 мм — 22 шт., перегородочный 600×200×100 мм — 83 шт. Мы указываем эти значения в карточках товаров и в калькуляторе, чтобы вы могли быстро проверить подсчёты.',
      },
      {
        q: 'Какой запас материала закладывать?',
        a: 'Рекомендуем прибавлять 5–7% на подрезку, возможный бой при разгрузке и корректировку проекта. При сложной архитектуре (эркеры, арки) запас может доходить до 10%. Мы всегда уточняем конструктив и подсказываем оптимальный коэффициент.',
      },
      {
        q: 'Можно ли заказать точный раскрой и схему кладки?',
        a: 'Да. Для домов и бань под коммерческое предложение готовим ведомость стен, распределение блоков по рядам и перечень доборных элементов. Это помогает сократить отходы и ускорить кладку на объекте.',
      },
    ],
  },
  {
    id: 'delivery',
    category: 'Доставка, логистика и разгрузка',
    keywords: FAQ_CATEGORY_KEYWORDS.delivery,
    questions: [
      {
        q: 'Где вы доставляете газобетон?',
        a: 'Мы возим по всей области выбранного региона и соседним субъектам. Например, для Москвы это МО, Калужская, Тверская и Владимирская области; для Санкт-Петербурга — весь северо-запад; для Самары — область и Татарстан; для Уфы — весь Башкортостан и ближайшие регионы. В каждом городе есть склад или прямые отгрузки с завода.',
      },
      {
        q: 'Нужны ли пропуска и можно ли разгружаться ночью?',
        a: 'Помогаем оформить пропуска на МКАД, ТТК, Садовое, ЗСД и в закрытые коттеджные посёлки. Организуем ночные разгрузки и «тихий режим», если это требования охраны или жильцов. Главное — предупредить менеджера за сутки, чтобы заложить время на оформление.',
      },
      {
        q: 'Сколько занимает доставка и как планируете маршрут?',
        a: 'При наличии на складе везём в течение 1–2 дней, при заказе с завода — 3–5 дней с фиксацией окна. Мы заранее уточняем подъезд, делаем при необходимости фото-разведку, согласовываем работу манипулятора и даём контакты водителя в день рейса.',
      },
      {
        q: 'Разгрузка входит в стоимость? Что если участок удалён?',
        a: 'Стандартная разгрузка манипулятором входит в стоимость. Если нужно выгрузить блоки в нескольких точках или завезти на удалённый участок без твёрдого покрытия, подбираем технику с нужной базой, готовим щиты, планируем маршрут с учётом грунтов и погодных условий.',
      },
      {
        q: 'Сколько поддонов помещается в манипулятор и как распределить доставку?',
        a: 'Манипулятор 5 тонн берёт 8–9 м³ (до 8 поддонов), техника на 10 тонн — до 16 поддонов. Для удалённых районов выгодно планировать комбинированные рейсы: часть груза привезём манипулятором, часть — длинномером с краном. Менеджер подскажет, как разбить заказ, чтобы уложиться в бюджет и график разгрузки.',
      },
    ],
  },
  {
    id: 'montage',
    category: 'Монтаж, эксплуатация и хранение',
    keywords: FAQ_CATEGORY_KEYWORDS.montage,
    questions: [
      {
        q: 'Нужно ли утеплять дом из газобетона?',
        a: 'При толщине 300–400 мм и плотности D400–D500 дополнительное утепление чаще всего не требуется. В северных регионах (запросы «утепление газобетона СПб», «утепление газобетона Москва») рекомендуем фасадную систему с тонким утеплителем или вентфасад. Главное — соблюдать тонкошовную кладку, исключить мостики холода и грамотно сделать отделку.',
      },
      {
        q: 'Можно ли строить зимой и какой клей использовать?',
        a: 'Для зимней кладки используйте специальные морозостойкие клеевые смеси (до −10 °C) и держите блоки сухими. При более низких температурах утепляйте рабочую зону тепловыми пушками или переносите работы. Летом используйте тонкошовный клей — он обеспечивает прочность кладки и минимальные теплопотери.',
      },
      {
        q: 'Нужно ли армировать кладку из газобетона?',
        a: 'Да, армирование — обязательное требование. Усиливаем первый ряд по фундаменту, каждый 3–4 ряд, участки под окнами и над проёмами. Используем арматуру Ø8–10 мм или базальтовую сетку. Это предотвращает трещины при усадке и температурных деформациях.',
      },
      {
        q: 'Как хранить газобетон на участке?',
        a: 'Ставьте поддоны на ровное основание, не снимая заводскую плёнку до начала кладки. При долгом хранении укройте сверху тентом, обеспечьте вентиляцию и защиту от грунтовых вод. Зимой очищайте блоки от снега и наледи перед кладкой — это сохраняет прочность клеевого шва.',
      },
    ],
  },
];

const faqCategoriesWithCoverage = faqCategories.map((category) => ({
  ...category,
  queryCoverage: collectFaqQueryCoverage(category.keywords),
}));

const defaultPhone = regions.moscow.contacts;
const defaultPhoneHref = defaultPhone.phone.replace(/[^+\d]/g, '');

export default function FAQPage() {
  const faqEntities = faqCategoriesWithCoverage.flatMap((category) =>
    category.questions.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
      keywords: category.keywords,
    })),
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'Часто задаваемые вопросы о газобетоне',
    description:
      'Ответы на популярные вопросы о выборе, стоимости, доставке и строительстве из газобетона. Составлено по данным из Wordstat и семантического ядра.',
    url: 'https://gazobeton-online.ru/faq',
    inLanguage: 'ru-RU',
    mainEntity: faqEntities,
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Вопросы и ответы</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Часто задаваемые вопросы
            </h1>
            <p className="text-lg text-gray-600">
              Отвечаем на запросы из Wordstat и `semantic_summary.md`: выбор бренда, цены, калькулятор, доставка,
              утепление и хранение газобетона в регионах.
            </p>
          </div>

          {/* FAQ по категориям */}
          {faqCategoriesWithCoverage.map((category, catIndex) => (
            <div key={catIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3 font-bold">
                  {catIndex + 1}
                </span>
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => (
                  <details 
                    key={qIndex} 
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition group"
                  >
                    <summary className="font-semibold text-lg cursor-pointer flex items-start">
                      <span className="text-orange-600 mr-3 mt-1">Q:</span>
                      <span className="flex-1">{faq.q}</span>
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
                      <span className="font-semibold text-green-600">A:</span> {faq.a}
                    </div>
                  </details>
                ))}
              </div>

              {category.queryCoverage.length > 0 && (
                <div className="mt-4 rounded-xl border border-dashed border-orange-200 bg-orange-50/50 p-5">
                  <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-[0.3em]">
                    Что спрашивают в регионах
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-orange-900">
                    {category.queryCoverage.map((item) => (
                      <li key={item.regionSlug}>
                        <span className="font-semibold text-orange-800">{item.regionName}:</span>{' '}
                        {item.queries.join(', ')}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-orange-700/70">
                    Эти поисковые запросы уже разобраны в ответах и будут раскрыты дополнительно в статьях раздела «Как
                    строить из газобетона».
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* CTA блок */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 md:p-12 text-white text-center mt-16">
            <h2 className="text-3xl font-bold mb-4">Не нашли ответ на свой вопрос?</h2>
            <p className="text-lg opacity-90 mb-8">
              Наши специалисты с радостью проконсультируют вас и помогут подобрать оптимальный газобетон
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${defaultPhoneHref}`}
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Позвонить: {defaultPhone.phoneFormatted}
              </a>
              <Link
                href="/#quiz"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center justify-center"
              >
                Задать вопрос онлайн
              </Link>
            </div>
          </div>

          {/* Дополнительные ресурсы */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link href="/calculator" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Калькулятор газобетона</h3>
              <p className="text-gray-600">Рассчитайте необходимое количество блоков для вашего проекта</p>
            </Link>

            <Link href="/catalog" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Каталог газобетона</h3>
              <p className="text-gray-600">Выберите подходящий газобетон из широкого ассортимента</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

