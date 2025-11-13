'use client';

import { useState } from 'react';

interface ProductOrderButtonProps {
  productName: string;
  regionName: string;
  label?: string;
}

type ContactMethod = 'phone' | 'telegram' | 'whatsapp';

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';

  const parts = ['+7'];
  const rest = digits.startsWith('7') ? digits.slice(1) : digits.startsWith('8') ? digits.slice(1) : digits;
  if (rest.length > 0) {
    parts.push(` (${rest.slice(0, 3)}`);
  }
  if (rest.length >= 3) {
    parts[parts.length - 1] += ')';
  }
  if (rest.length > 3) {
    parts.push(` ${rest.slice(3, 6)}`);
  }
  if (rest.length > 6) {
    parts.push(`-${rest.slice(6, 8)}`);
  }
  if (rest.length > 8) {
    parts.push(`-${rest.slice(8, 10)}`);
  }

  return parts.join('');
}

export default function ProductOrderButton({
  productName,
  regionName,
  label = 'Оформить заказ',
}: ProductOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone');
  const [isAgreed, setIsAgreed] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setIsSubmitted(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAgreed || !name.trim() || !phone.trim()) {
      alert('Пожалуйста, заполните все поля и дайте согласие на обработку данных');
      return;
    }

    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          source: 'product',
          message: `Заказ товара: ${productName} в регионе ${regionName}`,
          data: {
            productName,
            regionName,
          },
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="w-full px-8 py-3 rounded-xl bg-gradient-to-r from-navy-800 to-navy-600 text-white font-semibold text-lg shadow hover:brightness-110 transition"
      >
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/40" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Оформление заказа</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-1">Оставьте контакты — менеджер свяжется с вами</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
                aria-label="Закрыть"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="px-6 pb-6 pt-4 space-y-5" onSubmit={handleSubmit}>
              <div className="text-sm text-gray-500">
                Вы оформляете заказ на <span className="font-semibold text-gray-900">{productName}</span> для региона <span className="font-semibold text-gray-900">{regionName}</span>.
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="order-name">
                  Как вас зовут?
                </label>
                <input
                  id="order-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Ваше имя"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="order-phone">
                  Телефон
                </label>
                <input
                  id="order-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(formatPhone(event.target.value))}
                  required
                  placeholder="+7 (___) ___-__-__"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Как связаться?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {([
                    { id: 'phone', label: 'Звонок' },
                    { id: 'telegram', label: 'Telegram' },
                    { id: 'whatsapp', label: 'WhatsApp' },
                  ] as const).map(({ id, label: optionLabel }) => (
                    <label
                      key={id}
                      className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition ${
                        contactMethod === id
                          ? 'border-orange-400 bg-orange-50 text-orange-600'
                          : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contact-method"
                        value={id}
                        checked={contactMethod === id}
                        onChange={() => setContactMethod(id)}
                        className="hidden"
                      />
                      {optionLabel}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(event) => setIsAgreed(event.target.checked)}
                  className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                />
                <span>
                  Нажимая «Отправить заявку», вы даёте согласие на обработку персональных данных и подтверждаете, что ознакомлены с нашей
                  <a href="/privacy" className="text-orange-500 hover:text-orange-600 font-medium ml-1" target="_blank" rel="noreferrer">
                    политикой конфиденциальности
                  </a>
                  .
                </span>
              </label>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!isAgreed}
                  className={`inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white transition ${
                    isAgreed ? 'bg-orange-500 hover:bg-orange-600 shadow-lg' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Отправить заявку
                </button>
                {isSubmitted && (
                  <p className="text-sm text-emerald-600">
                    Спасибо! Мы получили вашу заявку и свяжемся с вами в ближайшее время.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

