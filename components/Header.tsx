'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSelectedRegion, isValidRegion } from '@/lib/region';
import HeaderRegionSelector from './HeaderRegionSelector';
import ContactFormModal from './ContactFormModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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

  // URLы с учетом выбранного региона
  const homeUrl = selectedRegion ? `/${selectedRegion}` : '/';
  const catalogUrl = selectedRegion ? `/${selectedRegion}/catalog` : '/catalog';
  const calculatorUrl = selectedRegion ? `/${selectedRegion}/calculator` : '/calculator';
  const deliveryUrl = selectedRegion ? `/${selectedRegion}/delivery` : '/delivery';

  return (
    <header className="bg-navy-900 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Логотип */}
          <Link href={homeUrl} className="flex items-center space-x-2 sm:space-x-3 group py-3 sm:py-4 flex-shrink-0 min-w-0">
            <div className="relative flex-shrink-0">
              {/* Иконка блока с 3D эффектом */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg shadow-lg transform group-hover:rotate-3 transition-transform flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="20" height="20" rx="1" fill="#fb923c" opacity="0.9"/>
                  <rect x="6" y="6" width="20" height="20" rx="1" stroke="#fb923c" strokeWidth="1"/>
                  {/* Линии для объема */}
                  <rect x="6" y="6" width="20" height="2" fill="#fb923c" opacity="0.5"/>
                  <rect x="6" y="6" width="2" height="20" fill="#fb923c" opacity="0.5"/>
                </svg>
              </div>
            </div>
            <div className="min-w-0 flex-shrink">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
                Газобетон<span className="text-orange-400">Online</span>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-300 -mt-0.5 sm:-mt-1 truncate">Вся информация, лучшие цены</div>
            </div>
          </Link>

          {/* Навигация Desktop */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link 
              href={catalogUrl}
              className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium whitespace-nowrap"
            >
              Каталог
            </Link>
            <Link 
              href={calculatorUrl} 
              className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium whitespace-nowrap"
            >
              Калькулятор
            </Link>
            <Link 
              href="/faq" 
              className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium whitespace-nowrap"
            >
              FAQ
            </Link>
            <Link 
              href="/construction" 
              className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium whitespace-nowrap"
            >
              Как строить
            </Link>
            <Link 
              href={deliveryUrl} 
              className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium whitespace-nowrap"
            >
              Доставка
            </Link>
            <Link 
              href="/contacts" 
              className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition font-medium whitespace-nowrap"
            >
              Контакты
            </Link>
          </nav>

          {/* Выбор региона, контакты и CTA Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Регион и телефон (вертикально) */}
            <div className="flex flex-col items-end border-r border-white/20 pr-4">
              <HeaderRegionSelector />
              <a 
                href="tel:+79626093535" 
                className="text-base font-semibold text-white hover:text-orange-400 transition whitespace-nowrap mt-1"
              >
                +7 (962) 609-35-35
              </a>
            </div>
            
            {/* CTA */}
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
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
                href={calculatorUrl} 
                className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Калькулятор
              </Link>
              <Link 
                href="/faq" 
                className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/construction" 
                className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Как строить из газобетона
              </Link>
              <Link 
                href={deliveryUrl} 
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
              <div className="px-4 py-3 border-t border-white/20">
                <HeaderRegionSelector />
              </div>
              
              <div className="pt-4 border-t border-white/20 space-y-3 px-4">
                <a 
                  href="tel:+79626093535" 
                  className="block text-base font-semibold text-white hover:text-orange-400 transition"
                >
                  +7 (962) 609-35-35
                </a>
                <button 
                  onClick={() => {
                    setIsContactModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
                >
                  Подобрать газобетон
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Модалка обратной связи */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        regionName={selectedRegion || undefined}
      />
    </header>
  );
}

