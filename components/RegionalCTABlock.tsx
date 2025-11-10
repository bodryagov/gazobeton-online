'use client';

import { useState } from 'react';
import QuizModal from './QuizModal';

interface RegionalCTABlockProps {
  regionName: string; // Название региона в предложном падеже (например, "в Москве", "в Санкт-Петербурге")
}

export default function RegionalCTABlock({ regionName }: RegionalCTABlockProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-br from-orange-50 via-orange-100/30 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-2 border-orange-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Подберем лучшее предложение по газобетону {regionName}
                </h2>
                <p className="text-lg text-gray-600">
                  Наши специалисты помогут выбрать оптимальный газобетон с учетом ваших требований и бюджета
                </p>
              </div>

              {/* Преимущества */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏭</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">15+ заводов-производителей</h3>
                    <p className="text-sm text-gray-600">Широкий выбор от ведущих производителей</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Работаем с 2008 года</h3>
                    <p className="text-sm text-gray-600">Более 15 лет опыта на рынке</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🚚</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Быстрая доставка и разгрузка</h3>
                    <p className="text-sm text-gray-600">Доставка от 1-2 дней, помощь с разгрузкой</p>
                  </div>
                </div>
              </div>

              {/* Кнопка CTA */}
              <div className="text-center">
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Подобрать газобетон
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Бесплатная консультация специалиста. Без спама и навязчивых звонков.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Модалка с квизом */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}

