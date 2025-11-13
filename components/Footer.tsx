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
              Крупнейший каталог газобетонных блоков. Работаем с 2008 года. Помогаем подобрать оптимальный материал для вашего строительства.
            </p>
          </div>

          {/* Каталог */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Каталог</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="hover:text-orange-500">Все товары</Link></li>
              <li><Link href="/moscow/manufacturer/bonolit" className="hover:text-orange-500">Bonolit</Link></li>
              <li><Link href="/moscow/manufacturer/istkult-ytong" className="hover:text-orange-500">Istkult (Ytong)</Link></li>
              <li><Link href="/moscow/manufacturer/poritep" className="hover:text-orange-500">Poritep</Link></li>
              <li><Link href="/moscow/manufacturer/kottezh" className="hover:text-orange-500">Коттедж</Link></li>
            </ul>
          </div>

          {/* Полезное */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Полезное</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculator" className="hover:text-orange-500">Калькулятор газобетона</Link></li>
              <li><Link href="/faq" className="hover:text-orange-500">Вопросы и ответы (FAQ)</Link></li>
              <li><Link href="/construction" className="hover:text-orange-500">Как строить из газобетона</Link></li>
              <li><Link href="/delivery" className="hover:text-orange-500">Доставка и оплата</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+79626093535" className="hover:text-orange-500">
                  +7 (962) 609-35-35
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
              <a 
                href="https://t.me/+79626093535" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition" 
                aria-label="Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.787z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/79626093535?text=Здравствуйте!%20Хочу%20узнать%20о%20газобетоне" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition" 
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
            <Link href="/contacts" className="hover:text-orange-500">Контакты и реквизиты</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

