'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Иконка газобетонного блока */}
              <div className="w-14 h-14 bg-gradient-to-br from-navy-900 to-navy-950 rounded-lg shadow-lg transform group-hover:scale-105 transition-transform flex items-center justify-center">
                {/* Стилизованный блок с порами */}
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="32" height="32" rx="2" fill="white" opacity="0.9"/>
                  <rect x="4" y="4" width="32" height="32" rx="2" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                  {/* Поры */}
                  <circle cx="12" cy="12" r="2" fill="white" opacity="0.6"/>
                  <circle cx="28" cy="12" r="2" fill="white" opacity="0.6"/>
                  <circle cx="12" cy="28" r="2" fill="white" opacity="0.6"/>
                  <circle cx="28" cy="28" r="2" fill="white" opacity="0.6"/>
                  <circle cx="20" cy="20" r="2" fill="white" opacity="0.6"/>
                </svg>
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-navy-950 group-hover:text-orange-600 transition-colors">
                Газобетон<span className="text-orange-600">Online</span>
              </div>
              <div className="text-xs text-gray-500 -mt-1">Вся информация, лучшие цены</div>
            </div>
          </Link>

          {/* Навигация Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/catalog" 
              className="px-4 py-2 text-gray-700 hover:text-navy-950 hover:bg-gray-50 rounded-lg transition font-medium"
            >
              Каталог
            </Link>
            <Link 
              href="/calculator" 
              className="px-4 py-2 text-gray-700 hover:text-navy-950 hover:bg-gray-50 rounded-lg transition font-medium"
            >
              Калькулятор
            </Link>
            <Link 
              href="/faq" 
              className="px-4 py-2 text-gray-700 hover:text-navy-950 hover:bg-gray-50 rounded-lg transition font-medium"
            >
              Вопросы
            </Link>
            <Link 
              href="/delivery" 
              className="px-4 py-2 text-gray-700 hover:text-navy-950 hover:bg-gray-50 rounded-lg transition font-medium"
            >
              Доставка
            </Link>
            <Link 
              href="/contacts" 
              className="px-4 py-2 text-gray-700 hover:text-navy-950 hover:bg-gray-50 rounded-lg transition font-medium"
            >
              Контакты
            </Link>
          </nav>

          {/* Контакты и CTA Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <a 
                href="tel:+74951234567" 
                className="text-lg font-bold text-navy-950 hover:text-orange-600 transition block"
              >
                +7 (495) 123-45-67
              </a>
              <p className="text-xs text-gray-500">Ежедневно 9:00 - 21:00</p>
            </div>
            <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Подобрать
            </button>
          </div>

          {/* Мобильное меню */}
          <button 
            className="lg:hidden text-gray-700 hover:text-navy-950 p-2"
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
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              <Link 
                href="/catalog" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy-950 rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </Link>
              <Link 
                href="/calculator" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy-950 rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Калькулятор
              </Link>
              <Link 
                href="/faq" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy-950 rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Вопросы и ответы
              </Link>
              <Link 
                href="/delivery" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy-950 rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Доставка
              </Link>
              <Link 
                href="/contacts" 
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-navy-950 rounded-lg transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3 px-4">
                <a 
                  href="tel:+74951234567" 
                  className="block text-lg font-bold text-navy-950 hover:text-orange-600 transition"
                >
                  +7 (495) 123-45-67
                </a>
                <p className="text-xs text-gray-500">Ежедневно 9:00 - 21:00</p>
                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition">
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
