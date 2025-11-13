'use client';

import { useState, useRef } from 'react';

interface ProductConsultationCTAProps {
  regionName: string;
}

type ContactMethod = 'phone' | 'telegram' | 'whatsapp';

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  const parts = ['+7'];
  const rest = digits.startsWith('7') ? digits.slice(1) : digits.startsWith('8') ? digits.slice(1) : digits;
  if (rest.length > 0) parts.push(` (${rest.slice(0, 3)}`);
  if (rest.length >= 3) parts[parts.length - 1] += ')';
  if (rest.length > 3) parts.push(` ${rest.slice(3, 6)}`);
  if (rest.length > 6) parts.push(`-${rest.slice(6, 8)}`);
  if (rest.length > 8) parts.push(`-${rest.slice(8, 10)}`);
  return parts.join('');
}

export default function ProductConsultationCTA({ regionName }: ProductConsultationCTAProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<ContactMethod>('phone');
  const [agreed, setAgreed] = useState(true);
  const [sent, setSent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const formStartTime = useRef<number>(Date.now());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreed || !name.trim() || !phone.trim()) {
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
          source: 'consultation',
          message: `Консультация по газобетону в регионе ${regionName}`,
          honeypot: honeypot,
          formStartTime: formStartTime.current,
          data: {
            regionName,
            contactMethod: method,
          },
        }),
      });

      if (response.ok) {
        setSent(true);
        formStartTime.current = Date.now();
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          alert('Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.');
        } else {
          alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
        }
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white rounded-3xl shadow-xl p-6 md:p-10">
      <div className="grid gap-8 md:grid-cols-[1.2fr_minmax(0,1fr)] items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-3">Консультация</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Нужна помощь с выбором газобетона {regionName}?</h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl">
            Оставьте контакт — менеджер оперативно подберёт клей, перемычки и рассчитает логистику. Расскажем про актуальные акции и наличие на складе.
          </p>
          <ul className="mt-6 space-y-2 text-white/70 text-sm">
            <li>• Рассчитаем объём блоков и сопутствующих материалов</li>
            <li>• Проверим наличие на складе и уточним сроки доставки</li>
            <li>• Подскажем, как оптимизировать монтаж и количество отходов</li>
          </ul>
        </div>

        <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Honeypot поле */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
              aria-hidden="true"
            />
            <div className="space-y-1">
              <label htmlFor="consult-name" className="text-sm font-semibold text-gray-700">
                Имя
              </label>
              <input
                id="consult-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Ваше имя"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="consult-phone" className="text-sm font-semibold text-gray-700">
                Телефон
              </label>
              <input
                id="consult-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(formatPhone(event.target.value))}
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Как удобнее связаться?</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'phone', label: 'Звонок' },
                  { id: 'telegram', label: 'Telegram' },
                  { id: 'whatsapp', label: 'WhatsApp' },
                ] as const).map(({ id, label }) => (
                  <label
                    key={id}
                    className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium text-center transition ${
                      method === id
                        ? 'border-navy-500 bg-navy-50 text-navy-700'
                        : 'border-gray-200 text-gray-600 hover:border-navy-400 hover:text-navy-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="consult-method"
                      value={id}
                      checked={method === id}
                      onChange={() => setMethod(id)}
                      className="hidden"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-1 rounded border-gray-300 text-navy-600 focus:ring-navy-400"
              />
              <span>
                Соглашаюсь на обработку персональных данных и ознакомлен с
                <a href="/privacy" className="text-navy-700 font-medium ml-1" target="_blank" rel="noreferrer">
                  политикой конфиденциальности
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed}
              className={`w-full inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white transition ${
                agreed ? 'bg-navy-900 hover:bg-navy-800 shadow' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Оставить контакт
            </button>

            {sent && (
              <p className="text-sm text-emerald-600">Спасибо! Мы свяжемся с вами в ближайшее время.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}


