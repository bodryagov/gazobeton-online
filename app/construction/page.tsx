import Link from 'next/link';
import type { Metadata } from 'next';

import { regionQueryData } from '@/data/seo/region-query-data';
import { regions } from '@/data/regions';

export const metadata: Metadata = {
  title: 'Как строить из газобетона — проекты, монтаж, утепление',
  description:
    'Раздел о строительстве из газобетона: проекты домов и бань, расчёт количества блоков, монтаж и армирование, утепление и защита, инструменты и логистика. Навигация по статьям и практические инструкции.',
  alternates: {
    canonical: 'https://gazobeton-online.ru/construction',
  },
  openGraph: {
    title: 'Как строить из газобетона — проекты, монтаж, утепление',
    description:
      'Собрали всё для строительства из газобетона: типовые проекты, расчёты, инструкции по монтажу, утепление и эксплуатация, инструменты и логистика.',
    url: 'https://gazobeton-online.ru/construction',
    siteName: 'Газобетон Online',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Как строить из газобетона — проекты, монтаж, утепление',
    description:
      'Проекты, расчёты, монтаж, утепление и эксплуатация газобетонных домов. Стартовая точка по всем статьям о строительстве из газобетона.',
  },
};

interface ConstructionSectionLink {
  href: string;
  label: string;
  note?: string;
}

interface ConstructionSection {
  id: string;
  title: string;
  intro: string;
  keywords: string[];
  links: ConstructionSectionLink[];
}

interface SectionQueryCoverage {
  regionSlug: string;
  regionName: string;
  queries: string[];
}

const SECTION_KEYWORDS: Record<string, string[]> = {
  projects: ['проект', 'баня', 'гараж', 'сколько', 'калькулятор', 'дом', 'расчет'],
  montage: ['монтаж', 'кладк', 'армир', 'фундамент', 'bonolit', 'перемыч'],
  insulation: ['утепл', 'мороз', 'влага', 'отделк', 'сравн', 'кирпич'],
  tools: ['инструмент', 'клей', 'самовывоз', 'манипулятор', 'доставк', 'хранен'],
  faq: ['какой', 'нужно ли', 'сколько блоков', 'хранить', 'зимой', 'вопрос'],
};

function collectQueriesForSection(keywords: string[]): SectionQueryCoverage[] {
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
        if (matched.length >= 4) {
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
        queries: matched.slice(0, 4),
      };
    })
    .filter((item): item is SectionQueryCoverage => Boolean(item));
}

const constructionSections: ConstructionSection[] = [
  {
    id: 'projects',
    title: 'Проекты и расчёты',
    intro:
      'Готовим разборы типовых домов, бань и хозяйственных построек, а также калькуляции материала под разные задачи.',
    keywords: SECTION_KEYWORDS.projects,
    links: [
      {
        href: '/construction/proekt-doma-10x10',
        label: 'Дом 10×10 из газобетона: пошаговый расчёт блоков и бюджета',
      },
      {
        href: '/construction/banja-iz-gazobloka',
        label: 'Баня из газоблока: проект, количество блоков и особенности монтажа',
      },
      {
        href: '/construction/hozpostrojki-iz-gazobetona',
        label: 'Хозпостройки и гаражи из газобетона: как рассчитать материалы',
      },
      {
        href: '/construction/kalkulyator-gazobetona',
        label: 'Как пользоваться калькулятором газобетона и не ошибиться с запасом',
      },
    ],
  },
  {
    id: 'montage',
    title: 'Монтаж и армирование',
    intro:
      'Собираем инструкции по кладке, армированию, устройству перемычек и подготовке узлов для разных климатических зон.',
    keywords: SECTION_KEYWORDS.montage,
    links: [
      {
        href: '/construction/kladka-gazobetona',
        label: 'Кладка газобетона: технология тонкошовной кладки и типовые ошибки',
      },
      {
        href: '/construction/armirovanie-i-peremychki',
        label: 'Армирование и перемычки в стенах из газобетона',
      },
      {
        href: '/construction/fundament-dlja-gazobetona',
        label: 'Фундамент под газобетон: плита, лента или сваи?',
      },
      {
        href: '/construction/montazh-bonolit',
        label: 'Монтаж блоков Bonolit: рекомендации для Московской области',
      },
    ],
  },
  {
    id: 'insulation',
    title: 'Утепление и защита',
    intro:
      'Темы про энергоэффективность, отделку фасадов и защиту газобетона от влаги для разных регионов.',
    keywords: SECTION_KEYWORDS.insulation,
    links: [
      {
        href: '/construction/uteplenie-gazobetona',
        label: 'Когда утеплять газобетон и какие материалы выбрать',
      },
      {
        href: '/construction/uteplenie-v-sankt-peterburge',
        label: 'Утепление газобетона в Санкт-Петербурге и Ленинградской области',
      },
      {
        href: '/construction/zashita-ot-vlagi',
        label: 'Как защитить газобетон от влаги и сделать долговечный фасад',
      },
      {
        href: '/construction/gazobeton-v-sravnenii',
        label: 'Газобетон vs кирпич и пенобетон: тепло, стоимость, скорость работ',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Инструменты и логистика',
    intro:
      'Подборка инструментов, клеевых составов и рекомендаций по доставке и хранению блоков на объекте.',
    keywords: SECTION_KEYWORDS.tools,
    links: [
      {
        href: '/construction/instrumenty-dlja-gazobetona',
        label: 'Инструменты и расходники для работы с газобетоном',
      },
      {
        href: '/construction/dostavka-i-hranenije',
        label: 'Как организовать доставку, разгрузку и хранение газобетона на участке',
      },
      {
        href: '/construction/samovyvoz-i-manipulyator',
        label: 'Самовывоз и работа манипулятора: чек-лист для площадки',
      },
    ],
  },
  {
    id: 'faq',
    title: 'Частые вопросы',
    intro:
      'Отвечаем на популярные запросы из поисковой выдачи. Эти материалы будут связаны с разделом FAQ и карточками товаров.',
    keywords: SECTION_KEYWORDS.faq,
    links: [
      {
        href: '/construction/vybor-gazobetona',
        label: 'Как выбрать газобетон: плотность, толщина и производители',
      },
      {
        href: '/construction/skolko-blokov-nado',
        label: 'Сколько газоблоков нужно на дом 150 м²: пример расчёта',
      },
      {
        href: '/construction/hranenie-i-zima',
        label: 'Как хранить газобетон зимой и защитить от осадков',
      },
      {
        href: '/construction/uteplenie-ili-net',
        label: 'Нужно ли утеплять дом из газобетона в разных регионах',
      },
    ],
  },
];

const sectionsWithQueries = constructionSections.map((section) => ({
  ...section,
  queryCoverage: collectQueriesForSection(section.keywords),
}));

export default function ConstructionPage() {
  const sectionListElements = sectionsWithQueries.map((section, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: section.title,
    description: section.intro,
    url: `https://gazobeton-online.ru/construction#${section.id}`,
  }));

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Как строить из газобетона — проекты, монтаж, утепление',
    description:
      'Темы, инструкции и ссылки на будущие статьи по проектированию, монтажу, утеплению и логистике газобетона. Стартовая точка раздела «Как строить из газобетона».',
    url: 'https://gazobeton-online.ru/construction',
    inLanguage: 'ru-RU',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Оглавление раздела «Как строить из газобетона»',
      numberOfItems: sectionListElements.length,
      itemListOrder: 'http://schema.org/ItemListOrderAscending',
      itemListElement: sectionListElements,
    },
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-orange-500 transition">
                  Главная
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-700 font-medium">Как строить из газобетона</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-br from-orange-50 via-white to-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Как строить из газобетона
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Здесь собраны будущие статьи и инструкции, которые помогут спроектировать дом, рассчитать объёмы блоков и
              защитить газобетон в конкретном регионе. Каждое направление отвечает на типичные вопросы наших клиентов и
              свяжет каталог, доставку и FAQ в единую воронку.
            </p>
            <div className="mt-8 bg-white border border-orange-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Оглавление раздела</h2>
              <ul className="grid gap-3 md:grid-cols-2 text-sm md:text-base text-gray-700">
                {sectionsWithQueries.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-3 bg-orange-50 border border-orange-100 hover:border-orange-300 hover:text-orange-600 transition"
                    >
                      <span>→</span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 space-y-16">
          {sectionsWithQueries.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm"
            >
              <header className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-base text-gray-600">{section.intro}</p>
              </header>

              <div className="space-y-4">
                {section.links.map((link) => (
                  <div
                    key={link.href}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-2xl px-5 py-4 hover:border-orange-200 transition"
                  >
                    <div className="space-y-1">
                      <Link
                        href={link.href}
                        className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition"
                      >
                        {link.label}
                      </Link>
                      {link.note && <p className="text-sm text-gray-500">{link.note}</p>}
                    </div>
                    <Link
                      href={link.href}
                      className="self-start md:self-center inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      Читать →
                    </Link>
                  </div>
                ))}
              </div>

            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

