'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { RegionSlug } from '@/types/product';
import { regions } from '@/data/regions';

interface FAQQuestion {
  q: string;
  a: string;
}

interface RegionalFAQBlockProps {
  regionSlug: RegionSlug;
  questions: FAQQuestion[];
  title?: string;
  showMoreLink?: boolean;
}

export default function RegionalFAQBlock({
  regionSlug,
  questions,
  title,
  showMoreLink = true,
}: RegionalFAQBlockProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const regionName = regions[regionSlug]?.name ?? regionSlug;
  const displayTitle = title || `Популярные вопросы о газобетоне ${regionName}`;

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{displayTitle}</h2>
      
      <div className="space-y-4">
        {questions.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 transition"
          >
            <button
              onClick={() => handleToggle(index)}
              className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl"
              aria-expanded={expandedIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-lg text-gray-900 flex-1">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="px-5 md:px-6 pb-5 md:pb-6 text-gray-700 leading-relaxed"
              >
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showMoreLink && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/faq"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold transition"
          >
            Все вопросы и ответы
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}

