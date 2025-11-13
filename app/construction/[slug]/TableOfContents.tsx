'use client';

import React, { useState } from 'react';
import type { TableOfContentsItem } from './articleUtils';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

// Функция для создания якорной ссылки
const createAnchorLink = (id: string, text: string) => {
  return (
    <a 
      href={`#${id}`}
      className="text-gray-700 hover:text-gray-900 transition-colors"
    >
      {text}
    </a>
  );
};

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  // Группируем заголовки: H2 с их подзаголовками H3
  const groupedItems: Array<{
    h2: TableOfContentsItem;
    h3s: TableOfContentsItem[];
  }> = [];

  let currentH2: TableOfContentsItem | null = null;
  let currentH3s: TableOfContentsItem[] = [];

  items.forEach((item) => {
    if (item.level === 2) {
      // Сохраняем предыдущий H2 с его H3
      if (currentH2) {
        groupedItems.push({ h2: currentH2, h3s: currentH3s });
      }
      // Начинаем новую группу
      currentH2 = item;
      currentH3s = [];
    } else if (item.level === 3 && currentH2) {
      // Добавляем H3 к текущему H2
      currentH3s.push(item);
    }
  });

  // Добавляем последнюю группу
  if (currentH2) {
    groupedItems.push({ h2: currentH2, h3s: currentH3s });
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 my-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Содержание
      </h2>
      <nav className="space-y-0">
        {groupedItems.map((group) => (
          <TOCSection key={`toc-section-${group.h2.id}`} h2={group.h2} h3s={group.h3s} />
        ))}
      </nav>
    </div>
  );
}

interface TOCSectionProps {
  h2: TableOfContentsItem;
  h3s: TableOfContentsItem[];
}

function TOCSection({ h2, h3s }: TOCSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0 py-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {createAnchorLink(h2.id, h2.text)}
        </div>
        {h3s.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-3 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-100"
            aria-label={isExpanded ? 'Свернуть подразделы' : 'Развернуть подразделы'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      {h3s.length > 0 && isExpanded && (
        <div className="pl-4 pt-2 space-y-1.5">
          {h3s.map((h3) => (
            <div key={`toc-h3-${h3.id}`} className="text-sm text-gray-600">
              {createAnchorLink(h3.id, h3.text)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

