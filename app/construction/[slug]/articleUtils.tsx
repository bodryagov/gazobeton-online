import Link from 'next/link';
import React from 'react';
import TableOfContents from './TableOfContents';

// Функция для преобразования текста в slug для якорных ссылок
const slugify = (text: string): string => {
  let slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Удаляем спецсимволы
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .trim();
  
  // Если slug пустой или состоит только из дефисов, создаем базовый slug
  if (!slug || slug === '-' || /^-+$/.test(slug)) {
    slug = 'heading';
  }
  
  return slug;
};

// Интерфейс для элемента содержания
export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

// Функция для создания содержания
export const createTableOfContents = (items: TableOfContentsItem[]): React.JSX.Element => {
  if (items.length === 0) return <></>;

  return <TableOfContents items={items} />;
};

// Функция для извлечения заголовков из контента для содержания
export const extractHeadings = (content: string): TableOfContentsItem[] => {
  const lines = content.split('\n');
  const headings: TableOfContentsItem[] = [];
  const usedIds = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const text = trimmed.substring(3);
      let id = slugify(text);
      
      // Обеспечиваем уникальность id
      let uniqueId = id;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter++}`;
      }
      usedIds.add(uniqueId);
      
      headings.push({
        id: uniqueId,
        text,
        level: 2,
      });
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.substring(4);
      let id = slugify(text);
      
      // Обеспечиваем уникальность id
      let uniqueId = id;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter++}`;
      }
      usedIds.add(uniqueId);
      
      headings.push({
        id: uniqueId,
        text,
        level: 3,
      });
    }
  }

  return headings;
};

// Функция для создания ссылок
export const createLink = (href: string, text: string) => {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className="text-orange-600 hover:text-orange-700 underline font-medium">
        {text}
      </Link>
    );
  }
  return (
    <a href={href} className="text-orange-600 hover:text-orange-700 underline font-medium" target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
};

// Функция для создания таблицы
export const createTable = (headers: string[], rows: string[][]) => {
  return (
    <div className="overflow-x-auto my-8 rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gradient-to-r from-orange-50 to-orange-100">
            {headers.map((header, index) => (
              <th
                key={index}
                className="border-b border-gray-200 px-6 py-4 text-left text-sm font-bold text-gray-900 first:rounded-tl-lg last:rounded-tr-lg"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-gray-100 ${
                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } ${rowIndex === rows.length - 1 ? 'last:rounded-b-lg' : ''}`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm text-gray-700 leading-relaxed"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Функция для создания чек-листа
export const createChecklist = (items: string[]) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Чек-лист:
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-3 mt-1 text-xl">☐</span>
            <span className="text-gray-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Функция для парсинга markdown-подобного текста в JSX с содержанием
export const parseContentWithTOC = (content: string): React.JSX.Element => {
  const headings = extractHeadings(content);
  const toc = headings.length > 0 ? createTableOfContents(headings) : null;
  
  // Создаем Map для быстрого поиска id по тексту заголовка
  const headingIdMap = new Map<string, string>();
  headings.forEach(heading => {
    headingIdMap.set(heading.text, heading.id);
  });
  
  const parsedContent = parseContent(content, headingIdMap);
  
  return (
    <>
      {toc}
      {parsedContent}
    </>
  );
};

// Функция для парсинга markdown-подобного текста в JSX
export const parseContent = (content: string, headingIdMap?: Map<string, string>): React.JSX.Element => {
  const lines = content.split('\n');
  const elements: React.JSX.Element[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ');
      if (text.trim()) {
        // Обработка ссылок в тексте
        const paraKey = `para-${elements.length}`;
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts: (string | React.JSX.Element)[] = [];
        let lastIndex = 0;
        let match;
        let linkIndex = 0;

        while ((match = linkRegex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
          }
          parts.push(
            <React.Fragment key={`${paraKey}-link-${linkIndex++}`}>
              {createLink(match[2], match[1])}
            </React.Fragment>
          );
          lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
          parts.push(text.substring(lastIndex));
        }

        // Обработка жирного текста
        const processBold = (text: string, baseKey: string = ''): (string | React.JSX.Element)[] => {
          const boldRegex = /\*\*([^*]+)\*\*/g;
          const result: (string | React.JSX.Element)[] = [];
          let lastIndex = 0;
          let match;
          let boldIndex = 0;

          while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
              result.push(text.substring(lastIndex, match.index));
            }
            result.push(<strong key={`${baseKey}-bold-${boldIndex++}`} className="font-semibold text-gray-900">{match[1]}</strong>);
            lastIndex = match.index + match[0].length;
          }

          if (lastIndex < text.length) {
            result.push(text.substring(lastIndex));
          }

          return result.length > 0 ? result : [text];
        };

        // Обрабатываем части: если строка - обрабатываем жирный текст, если элемент - оставляем как есть
        // Важно: все React элементы должны иметь уникальные ключи
        const finalParts: (string | React.JSX.Element)[] = [];
        if (parts.length > 0) {
          parts.forEach((p, idx) => {
            if (typeof p === 'string') {
              const boldParts = processBold(p, `${paraKey}-part-${idx}`);
              boldParts.forEach((bp, bpIdx) => {
                if (typeof bp === 'string') {
                  finalParts.push(bp);
                } else {
                  // React элемент уже имеет ключ из processBold
                  finalParts.push(bp);
                }
              });
            } else {
              // Если это уже React элемент (Fragment с ссылкой), оставляем как есть
              // Fragment уже имеет ключ
              finalParts.push(p);
            }
          });
        } else {
          const boldParts = processBold(text, paraKey);
          finalParts.push(...boldParts);
        }

        elements.push(
          <p key={elements.length} className="mb-6 text-gray-700 leading-relaxed text-base">
            {finalParts}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      const listKey = `list-${elements.length}`;
      elements.push(
        <ul key={listKey} className="list-disc list-inside mb-6 space-y-2 text-gray-700">
          {listItems.map((item, index) => {
            const itemKey = `${listKey}-item-${index}`;
            // Обработка ссылок в элементах списка
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const parts: (string | React.JSX.Element)[] = [];
            let lastIndex = 0;
            let match;
            let partIndex = 0;

            while ((match = linkRegex.exec(item)) !== null) {
              if (match.index > lastIndex) {
                parts.push(item.substring(lastIndex, match.index));
              }
              parts.push(
                <React.Fragment key={`${itemKey}-link-${partIndex++}`}>
                  {createLink(match[2], match[1])}
                </React.Fragment>
              );
              lastIndex = match.index + match[0].length;
            }

            if (lastIndex < item.length) {
              parts.push(item.substring(lastIndex));
            }

            // Если есть части (ссылки), рендерим их, иначе просто текст
            return (
              <li key={itemKey} className="ml-4">
                {parts.length > 0 ? (
                  <>
                    {parts.map((part, partIdx) => {
                      if (typeof part === 'string') {
                        return <span key={`${itemKey}-text-${partIdx}`}>{part}</span>;
                      }
                      return part;
                    })}
                  </>
                ) : (
                  item
                )}
              </li>
            );
          })}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableHeaders.length > 0 && tableRows.length > 0) {
      elements.push(createTable(tableHeaders, tableRows));
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Заголовки
    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      flushTable();
      const text = line.substring(2);
      // Используем id из карты заголовков, если она есть, иначе генерируем новый
      const id = headingIdMap?.get(text) || slugify(text);
      elements.push(
        <h1 key={elements.length} id={id} className="text-4xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-20">
          {text}
        </h1>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      flushTable();
      const text = line.substring(3);
      // Используем id из карты заголовков, если она есть, иначе генерируем новый
      const id = headingIdMap?.get(text) || slugify(text);
      elements.push(
        <h2 key={elements.length} id={id} className="text-3xl font-bold text-gray-900 mt-10 mb-5 scroll-mt-20">
          {text}
        </h2>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      flushTable();
      const text = line.substring(4);
      // Используем id из карты заголовков, если она есть, иначе генерируем новый
      const id = headingIdMap?.get(text) || slugify(text);
      elements.push(
        <h3 key={elements.length} id={id} className="text-2xl font-semibold text-gray-900 mt-8 mb-4 scroll-mt-20">
          {text}
        </h3>
      );
      continue;
    }

    // Таблицы
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        flushParagraph();
        flushList();
        inTable = true;
      }

      const cells = line
        .split('|')
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0);

      // Пропускаем разделитель таблицы
      if (cells.every((cell) => cell.match(/^[-:]+$/))) {
        continue;
      }

      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    }

    // Если не таблица, но была таблица - закрываем её
    if (inTable) {
      flushTable();
    }

    // Списки
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      if (!inList) {
        inList = true;
      }
      listItems.push(line.substring(2).trim());
      continue;
    }

    // Чек-листы
    if (line.startsWith('- [ ]')) {
      flushParagraph();
      if (!inList) {
        inList = true;
      }
      listItems.push(line.substring(5).trim());
      continue;
    }

    // Если был список, но строка не список - закрываем список
    if (inList && line.length > 0) {
      flushList();
    }

    // Обычный текст
    if (line.length > 0) {
      currentParagraph.push(line);
    } else {
      flushParagraph();
    }
  }

  // Закрываем все открытые блоки
  flushParagraph();
  flushList();
  flushTable();

  return <>{elements}</>;
};

// Функция для извлечения FAQ из контента
export const extractFAQ = (content: string): Array<{ question: string; answer: string }> => {
  const faqItems: Array<{ question: string; answer: string }> = [];
  const lines = content.split('\n');
  let inFAQ = false;
  let currentQuestion = '';
  let currentAnswer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Начало FAQ-блока
    if (line.includes('Часто задаваемые вопросы') || line.includes('## Часто задаваемые вопросы')) {
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
            answer: currentAnswer.join(' ').replace(/\*\*/g, '').trim(),
          });
          currentAnswer = [];
        }
        currentQuestion = line.replace(/### |\*\*/g, '').trim();
      } else if (currentQuestion && line && !line.startsWith('##') && !line.startsWith('###')) {
        // Ответ (пропускаем пустые строки в начале)
        if (line.length > 0) {
          currentAnswer.push(line);
        }
      } else if (line.startsWith('##') && !line.includes('FAQ') && !line.includes('Часто задаваемые')) {
        // Конец FAQ-блока
        if (currentQuestion && currentAnswer.length > 0) {
          faqItems.push({
            question: currentQuestion,
            answer: currentAnswer.join(' ').replace(/\*\*/g, '').trim(),
          });
        }
        break;
      }
    }
  }

  // Сохраняем последний FAQ, если блок закончился
  if (inFAQ && currentQuestion && currentAnswer.length > 0) {
    faqItems.push({
      question: currentQuestion,
      answer: currentAnswer.join(' ').replace(/\*\*/g, '').trim(),
    });
  }

  return faqItems;
};

// Функция для расчёта времени чтения
export const calculateReadingTime = (content: string): number => {
  // Удаляем markdown разметку
  const text = content
    .replace(/#{1,6}\s/g, '') // Заголовки
    .replace(/\*\*/g, '') // Жирный текст
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Ссылки
    .replace(/\|/g, ' ') // Таблицы
    .replace(/\n/g, ' ') // Переносы строк
    .replace(/\s+/g, ' ') // Множественные пробелы
    .trim();

  // Считаем слова
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Средняя скорость чтения: 200 слов в минуту
  const readingTime = Math.ceil(wordCount / 200);

  return Math.max(1, readingTime); // Минимум 1 минута
};

