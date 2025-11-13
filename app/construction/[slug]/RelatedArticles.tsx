import Link from 'next/link';
import { getArticleContent } from './articleContent';

interface RelatedArticlesProps {
  currentSlug: string;
  relatedSlugs?: string[];
}

export default function RelatedArticles({ currentSlug, relatedSlugs }: RelatedArticlesProps) {
  // Если не указаны связанные статьи, используем все статьи кроме текущей
  let articlesToShow: Array<{ slug: string; title: string }> = [];

  if (relatedSlugs && relatedSlugs.length > 0) {
    // Используем указанные связанные статьи
    articlesToShow = relatedSlugs
      .map((slug) => {
        const article = getArticleContent(slug);
        return article ? { slug, title: article.title } : null;
      })
      .filter((item): item is { slug: string; title: string } => item !== null)
      .slice(0, 3);
  } else {
    // Используем все статьи кроме текущей
    const allSlugs = [
      'uteplenie-gazobetona',
      'vybor-gazobetona',
      'gazobeton-v-sravnenii',
      'kladka-gazobetona',
      'banja-iz-gazobloka',
      'fundament-dlja-gazobetona',
      'armirovanie-i-peremychki',
      'kalkulyator-gazobetona',
      'proekt-doma-10x10',
      'uteplenie-ili-net',
      'skolko-blokov-nado',
      'zashita-ot-vlagi',
      'hranenie-i-zima',
      'instrumenty-dlja-gazobetona',
      'dostavka-i-hranenije',
      'hozpostrojki-iz-gazobetona',
      'samovyvoz-i-manipulyator',
      'montazh-bonolit',
    ];

    articlesToShow = allSlugs
      .filter((slug) => slug !== currentSlug)
      .map((slug) => {
        const article = getArticleContent(slug);
        return article ? { slug, title: article.title } : null;
      })
      .filter((item): item is { slug: string; title: string } => item !== null)
      .slice(0, 3);
  }

  if (articlesToShow.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие статьи</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {articlesToShow.map((article) => (
          <Link
            key={article.slug}
            href={`/construction/${article.slug}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {article.title}
            </h3>
            <span className="text-orange-600 text-sm font-medium">Читать далее →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

