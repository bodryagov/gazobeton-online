'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    honeypot: '', // Honeypot поле для защиты от ботов
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formStartTime = useRef<number>(Date.now());

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '+7';
    if (digits.length <= 1) return '+7';
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Пожалуйста, заполните имя и телефон');
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 11) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone,
          source: 'contact',
          message: formData.message.trim() || undefined,
          honeypot: formData.honeypot, // Honeypot поле
          formStartTime: formStartTime.current, // Время начала заполнения
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', message: '', honeypot: '' });
        formStartTime.current = Date.now(); // Сброс времени для следующей отправки
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          alert('Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.');
        } else {
          alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
        }
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Заявка отправлена!</h3>
          <p className="text-gray-600 mb-4">Мы свяжемся с вами в ближайшее время.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Отправить ещё одну заявку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">Форма обратной связи</h2>
      <p className="text-sm text-gray-600 mt-2">
        Укажите имя и контакт — мы свяжемся с вами и ответим на вопросы о газобетоне и доставке.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
            Имя
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Иван"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            placeholder="Например: нужен расчёт газобетона на дом 150 м²"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>
        {/* Honeypot поле - скрыто от пользователей, но видно ботам */}
        <input
          type="text"
          name="website"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </button>
        <p className="text-xs text-gray-500">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <Link href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
            политикой конфиденциальности
          </Link>
          {' '}и обработкой персональных данных.
        </p>
      </form>
    </div>
  );
}

