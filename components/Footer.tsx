import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Газобетон Online</h3>
            <p className="text-sm text-gray-400">
              Крупнейший каталог газобетонных блоков. Помогаем подобрать оптимальный материал для вашего строительства.
            </p>
          </div>

          {/* Каталог */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Каталог</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog?brand=ytong" className="hover:text-orange-500">Ytong</Link></li>
              <li><Link href="/catalog?brand=bonolit" className="hover:text-orange-500">Bonolit</Link></li>
              <li><Link href="/catalog?brand=poritep" className="hover:text-orange-500">Poritep</Link></li>
              <li><Link href="/catalog" className="hover:text-orange-500">Все производители</Link></li>
            </ul>
          </div>

          {/* Полезное */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Полезное</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculator" className="hover:text-orange-500">Калькулятор газобетона</Link></li>
              <li><Link href="/faq" className="hover:text-orange-500">Вопросы и ответы</Link></li>
              <li><Link href="/delivery" className="hover:text-orange-500">Доставка и оплата</Link></li>
              <li><Link href="/articles" className="hover:text-orange-500">Статьи о строительстве</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+74951234567" className="hover:text-orange-500">
                  +7 (495) 123-45-67
                </a>
              </li>
              <li>
                <a href="mailto:info@gazobeton-online.ru" className="hover:text-orange-500">
                  info@gazobeton-online.ru
                </a>
              </li>
              <li className="text-gray-400">Ежедневно 9:00 - 21:00</li>
            </ul>
            <div className="mt-4 flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 Газобетон Online. Все права защищены.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-orange-500">Политика конфиденциальности</Link>
            {' • '}
            <Link href="/terms" className="hover:text-orange-500">Условия использования</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

