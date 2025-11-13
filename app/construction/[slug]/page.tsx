import Link from 'next/link';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

// Импортируем контент статей
import { getArticleContent } from './articleContent';
import RelatedArticles from './RelatedArticles';
import { extractFAQ, calculateReadingTime } from './articleUtils';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleContent(slug);
  
  if (!article) {
    return {
      title: 'Статья не найдена',
    };
  }

  const articleUrl = `https://gazobeton-online.ru/construction/${slug}`;
  const articleImage = article.image || 'https://gazobeton-online.ru/images/default-article.jpg';

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords?.join(', '),
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: articleUrl,
      siteName: 'Газобетон Online',
      locale: 'ru_RU',
      type: 'article',
      images: [
        {
          url: articleImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified || article.datePublished,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [articleImage],
    },
  };
}

export default async function ConstructionArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleContent(slug);

  if (!article) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Статья не найдена</h1>
            <Link href="/construction" className="text-orange-600 hover:text-orange-700">
              Вернуться к разделу «Как строить из газобетона»
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const articleUrl = `https://gazobeton-online.ru/construction/${slug}`;
  const datePublished = article.datePublished || '2025-11-12';
  const dateModified = article.dateModified || datePublished;

  // Извлекаем FAQ и рассчитываем время чтения из rawContent
  let faqItems = article.faq || [];
  let readingTime = article.readingTime;

  if (article.rawContent) {
    // Извлекаем FAQ, если не указано вручную
    if (faqItems.length === 0) {
      faqItems = extractFAQ(article.rawContent);
    }
    // Рассчитываем время чтения, если не указано вручную
    if (!readingTime) {
      readingTime = calculateReadingTime(article.rawContent);
    }
  }

  // Schema.org Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: 'Газобетон Online',
      url: 'https://gazobeton-online.ru',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Газобетон Online',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gazobeton-online.ru/logo.png',
        width: 600,
        height: 60,
      },
    },
    datePublished,
    dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: 'Строительство из газобетона',
    keywords: article.keywords || [],
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: article.image.startsWith('http') ? article.image : `https://gazobeton-online.ru${article.image}`,
        width: 1200,
        height: 630,
      },
    }),
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
  };

  // Breadcrumbs Schema.org
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
        name: 'Как строить из газобетона',
        item: 'https://gazobeton-online.ru/construction',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  // FAQ Schema.org
  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null;

  return (
    <>
      {/* Schema.org разметка */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="bg-gray-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumbs
              items={[
                { label: 'Главная', href: '/' },
                { label: 'Как строить из газобетона', href: '/construction' },
                { label: article.title },
              ]}
            />
          </div>
        </div>

        <article className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Заголовок */}
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>
                
                {/* Метаинформация */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  {datePublished && (
                    <time dateTime={datePublished}>
                      Опубликовано: {new Date(datePublished).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {readingTime && (
                    <span>⏱️ {readingTime} мин. чтения</span>
                  )}
                </div>

                {article.intro && (
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    {article.intro}
                  </p>
                )}
              </header>

              {/* Контент */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:text-gray-700 prose-li:mb-2 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline">
                  {article.content}
                </div>
              </div>

              {/* Связанные статьи */}
              <RelatedArticles
                currentSlug={slug}
                relatedSlugs={article.relatedArticles}
              />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

