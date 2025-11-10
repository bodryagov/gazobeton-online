'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSelectedRegion, isValidRegion } from '@/lib/region';
// import HeaderRegionSelector from './HeaderRegionSelector'; // Архивный файл - компонент перенесен

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем выбранный регион при монтировании
    const region = getSelectedRegion();
    if (isValidRegion(region)) {
      setSelectedRegion(region);
    }

    // Слушаем изменения в localStorage (если регион выбран на другой вкладке)
    const handleStorageChange = () => {
      const region = getSelectedRegion();
      if (isValidRegion(region)) {
        setSelectedRegion(region);
      } else {
        setSelectedRegion(null);
      }
    };

    // Слушаем кастомное событие изменения региона (на той же вкладке)
    const handleRegionChanged = (e: CustomEvent) => {
      const region = e.detail?.region;
      if (isValidRegion(region)) {
        setSelectedRegion(region);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('regionChanged', handleRegionChanged as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('regionChanged', handleRegionChanged as EventListener);
    };
  }, []);

  // URL для каталога: если регион выбран - ведем на региональный каталог
  const catalogUrl = selectedRegion ? `/${selectedRegion}/catalog` : '/catalog';

  return (
    <header className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-3 group py-4">
            <div className="relative">
              {/* Иконка блока с 3D эффектом */}
              <div className="w-12 h-12 bg-white rounded-lg shadow-lg transform group-hover:rotate-3 transition-transform flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="20" height="20" rx="1" fill="#ea580c" opacity="0.9"/>
                  <rect x="6" y="6" width="20" height="20" rx="1" stroke="#ea580c" strokeWidth="1"/>
                  {/* Линии для объема */}
                  <rect x="6" y="6" width="20" height="2" fill="#ea580c" opacity="0.5"/>
                  <rect x="6" y="6" width="2" height="20" fill="#ea580c" opacity="0.5"/>
                </svg>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                Газобетон<span className="text-orange-400">Online</span>
              </div>
              <div className="text-xs text-gray-300 -mt-1">Вся информация, лучшие цены</div>
            </div>
          </Link>

          {/* Навигация Desktop */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link 
              href={catalogUrl}
              className="px-4 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium"
            >
              Каталог
            </Link>
            <Link 
              href="/calculator" 
              className="px-4 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium"
            >
              Калькулятор
            </Link>
            <Link 
              href="/construction" 
              className="px-4 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium"
            >
              Как строить из газобетона?
            </Link>
            <Link 
              href="/delivery" 
              className="px-4 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium"
            >
              Доставка
            </Link>
            <Link 
              href="/contacts" 
              className="px-4 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium"
            >
              Контакты
            </Link>
          </nav>

          {/* Выбор региона, контакты и CTA Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Регион и телефон (вертикально) */}
            <div className="flex flex-col items-end border-r border-white/20 pr-4">
              {/* <HeaderRegionSelector /> - архивный файл */}
              <a 
                href="tel:+74951234567" 
                className="text-base font-semibold text-white hover:text-orange-400 transition whitespace-nowrap mt-1"
              >
                +7 (495) 123-45-67
              </a>
            </div>
            
            {/* CTA */}
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Подобрать
            </button>
          </div>

          {/* Мобильное меню */}
          <button 
            className="lg:hidden text-white hover:text-orange-400 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Мобильная навигация */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-4">
            <nav className="space-y-2">
              <Link 
                href={catalogUrl}
                className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </Link>
              <Link 
                href="/calculator" 
                className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Калькулятор
              </Link>
              <Link 
                href="/construction" 
                className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Как строить из газобетона?
              </Link>
              <Link 
                href="/delivery" 
                className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Доставка
              </Link>
              <Link 
                href="/contacts" 
                className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
              {/* Выбор региона в мобильном меню */}
              {/* <div className="px-4 py-3 border-t border-white/20">
                <HeaderRegionSelector />
              </div> - архивный файл */}
              
              <div className="pt-4 border-t border-white/20 space-y-3 px-4">
                <a 
                  href="tel:+74951234567" 
                  className="block text-base font-semibold text-white hover:text-orange-400 transition"
                >
                  +7 (495) 123-45-67
                </a>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition">
                  Подобрать газобетон
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

