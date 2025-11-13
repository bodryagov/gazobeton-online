# 🔧 Примеры реализации SEO-улучшений

---

## 1. Schema.org Article разметка

### Обновление интерфейса Article

```typescript
// app/construction/[slug]/articleContent.tsx

export interface Article {
  title: string;
  description: string;
  intro?: string;
  content: React.JSX.Element;
  datePublished?: string; // Добавить
  dateModified?: string; // Добавить
  keywords?: string[]; // Добавить
  image?: string; // Добавить (URL изображения)
}
```

### Добавление Schema.org в page.tsx

```typescript
// app/construction/[slug]/page.tsx

export default async function ConstructionArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleContent(slug);

  if (!article) {
    // ... existing code
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
    datePublished: article.datePublished || '2025-11-12',
    dateModified: article.dateModified || article.datePublished || '2025-11-12',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gazobeton-online.ru/construction/${slug}`,
    },
    articleSection: 'Строительство из газобетона',
    keywords: article.keywords || [],
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: article.image,
        width: 1200,
        height: 630,
      },
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
        item: `https://gazobeton-online.ru/construction/${slug}`,
      },
    ],
  };

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

      <main className="bg-gray-50 min-h-screen">
        {/* ... existing code */}
      </main>
    </>
  );
}
```

---

## 2. FAQ Schema.org разметка

### Извлечение FAQ из контента

```typescript
// app/construction/[slug]/articleUtils.tsx

export interface FAQItem {
  question: string;
  answer: string;
}

export const extractFAQ = (content: string): FAQItem[] => {
  const faqItems: FAQItem[] = [];
  const lines = content.split('\n');
  let inFAQ = false;
  let currentQuestion = '';
  let currentAnswer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Начало FAQ-блока
    if (line.includes('Часто задаваемые вопросы') || line.includes('FAQ')) {
      inFAQ = true;
      continue;
    }

    if (inFAQ) {
      // Вопрос (обычно начинается с "###" или "**")
      if (line.startsWith('### ') || (line.startsWith('**') && line.includes('?'))) {
        // Сохраняем предыдущий FAQ, если есть
        if (currentQuestion && currentAnswer.length > 0) {
          faqItems.push({
            question: currentQuestion.replace(/### |\*\*/g, '').trim(),
            answer: currentAnswer.join(' ').trim(),
          });
          currentAnswer = [];
        }
        currentQuestion = line.replace(/### |\*\*/g, '').trim();
      } else if (currentQuestion && line && !line.startsWith('##')) {
        // Ответ
        currentAnswer.push(line);
      } else if (line.startsWith('##') && !line.includes('FAQ')) {
        // Конец FAQ-блока
        if (currentQuestion && currentAnswer.length > 0) {
          faqItems.push({
            question: currentQuestion,
            answer: currentAnswer.join(' ').trim(),
          });
        }
        break;
      }
    }
  }

  return faqItems;
};
```

### Добавление FAQ Schema.org

```typescript
// app/construction/[slug]/page.tsx

import { extractFAQ } from './articleUtils';

export default async function ConstructionArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleContent(slug);

  // Извлекаем FAQ из контента (нужно будет сохранить raw content)
  // Или добавить FAQ отдельно в интерфейс Article
  
  const faqItems = article.faq || []; // Если добавим поле faq в Article

  const faqSchema = {
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
  };

  return (
    <>
      {/* ... existing schemas */}
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* ... existing code */}
    </>
  );
}
```

---

## 3. Расширенные метаданные

### Обновление generateMetadata

```typescript
// app/construction/[slug]/page.tsx

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
```

---

## 4. Дата публикации и время чтения

### Добавление в интерфейс Article

```typescript
// app/construction/[slug]/articleContent.tsx

export interface Article {
  title: string;
  description: string;
  intro?: string;
  content: React.JSX.Element;
  datePublished?: string; // "2025-11-12"
  dateModified?: string; // "2025-11-12"
  keywords?: string[];
  image?: string;
  readingTime?: number; // минуты
}
```

### Отображение на странице

```typescript
// app/construction/[slug]/page.tsx

<header className="mb-8">
  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
    {article.title}
  </h1>
  
  {/* Метаинформация */}
  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
    {article.datePublished && (
      <time dateTime={article.datePublished}>
        Опубликовано: {new Date(article.datePublished).toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
    )}
    {article.readingTime && (
      <span>⏱️ {article.readingTime} мин. чтения</span>
    )}
  </div>

  {article.intro && (
    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
      {article.intro}
    </p>
  )}
</header>
```

---

## 5. Связанные статьи

### Добавление компонента

```typescript
// app/construction/[slug]/RelatedArticles.tsx

import Link from 'next/link';

interface RelatedArticle {
  slug: string;
  title: string;
}

interface RelatedArticlesProps {
  currentSlug: string;
  articles: RelatedArticle[];
}

export default function RelatedArticles({ currentSlug, articles }: RelatedArticlesProps) {
  // Фильтруем текущую статью
  const related = articles.filter(a => a.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие статьи</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/construction/${article.slug}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {article.title}
            </h3>
            <span className="text-orange-600 text-sm">Читать далее →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### Использование в page.tsx

```typescript
// app/construction/[slug]/page.tsx

import RelatedArticles from './RelatedArticles';

// В конце статьи, перед закрывающим </article>
<RelatedArticles
  currentSlug={slug}
  articles={[
    { slug: 'uteplenie-gazobetona', title: 'Когда утеплять газобетон...' },
    { slug: 'vybor-gazobetona', title: 'Как выбрать газобетон...' },
    // ... другие статьи
  ]}
/>
```

---

## 6. Изображения в статьях

### Добавление изображений

```typescript
// app/construction/[slug]/articles/uteplenie-gazobetona.tsx

import Image from 'next/image';

export const article: Article = {
  title: 'Когда утеплять газобетон...',
  // ...
  image: '/images/uteplenie-gazobetona.jpg',
  content: parseContentWithTOC(`
    ## Нужно ли утеплять газобетон?
    
    <!-- Можно добавить изображение в контент -->
    <Image
      src="/images/uteplenie-sxema.jpg"
      alt="Схема утепления газобетона"
      width={800}
      height={600}
    />
    
    Ответ на этот вопрос...
  `),
};
```

---

## 7. Улучшенный интерфейс Article

### Полный пример

```typescript
// app/construction/[slug]/articleContent.tsx

export interface Article {
  title: string;
  description: string;
  intro?: string;
  content: React.JSX.Element;
  datePublished?: string; // ISO 8601: "2025-11-12"
  dateModified?: string; // ISO 8601: "2025-11-12"
  keywords?: string[]; // ['утепление газобетона', 'газобетон утепление']
  image?: string; // '/images/article-image.jpg'
  readingTime?: number; // минуты
  faq?: Array<{ question: string; answer: string }>; // Для Schema.org FAQ
  relatedArticles?: string[]; // slugs связанных статей
}
```

---

## 8. Автоматический расчёт времени чтения

```typescript
// app/construction/[slug]/articleUtils.tsx

export const calculateReadingTime = (content: string): number => {
  // Удаляем markdown разметку
  const text = content
    .replace(/#{1,6}\s/g, '') // Заголовки
    .replace(/\*\*/g, '') // Жирный текст
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Ссылки
    .replace(/\|/g, ' ') // Таблицы
    .replace(/\n/g, ' ') // Переносы строк
    .trim();

  // Считаем слова (примерно)
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Средняя скорость чтения: 200 слов в минуту
  const readingTime = Math.ceil(wordCount / 200);

  return Math.max(1, readingTime); // Минимум 1 минута
};
```

---

## 📝 Итоговый чек-лист реализации

- [ ] Добавить поля в интерфейс `Article` (datePublished, dateModified, keywords, image, readingTime, faq)
- [ ] Добавить Schema.org Article разметку в `page.tsx`
- [ ] Добавить Schema.org BreadcrumbList разметку
- [ ] Добавить Schema.org FAQPage разметку (если есть FAQ)
- [ ] Расширить `generateMetadata` (images, dates, keywords, twitter)
- [ ] Добавить отображение дат и времени чтения на странице
- [ ] Создать компонент `RelatedArticles`
- [ ] Добавить изображения к статьям (опционально)
- [ ] Обновить все 18 статей с новыми полями

