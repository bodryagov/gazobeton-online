'use client';

import Link from 'next/link';

interface ArticleItem {
  title: string;
  description: string;
  href: string;
}

interface ProductArticlesProps {
  regionName: string;
}

const placeholderArticles: ArticleItem[] = [
  {
    title: 'Как построить тёплый дом из газобетона',
    description: 'Чек-лист этапов строительства, нюансы по фундаменту, кладке и отделке.',
    href: '#',
  },
  {
    title: '5 ошибок при монтаже газобетонных перемычек',
    description: 'Разбираем распространённые ошибки и даём рекомендации по правильной установке.',
    href: '#',
  },
];

export default function ProductArticles({ regionName }: ProductArticlesProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Советы по строительству</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2">Как строить из газобетона {regionName}</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Делимся статьями и инструкциями из раздела «Как строить из газобетона» — пока собираем контент, но уже подготовили первые советы.
          </p>
        </div>
        <Link
          href="/construction"
          className="inline-flex items-center rounded-lg border border-navy-900 text-navy-900 px-4 py-2 text-sm font-medium hover:bg-navy-900 hover:text-white transition"
        >
          Все статьи →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {placeholderArticles.map((article) => (
          <article key={article.title} className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
            <p className="text-sm text-gray-600 flex-1">{article.description}</p>
            <Link
              href={article.href}
              className="inline-flex items-center text-sm font-medium text-navy-900 hover:text-orange-500 transition"
            >
              Читать статью →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}


