'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface QuizData {
  thickness: string[];
  volume: string;
  delivery: 'yes' | 'no' | '';
  unloading: boolean;
  settlement: string;
  timeframe: string;
  contactMethod: string;
  name: string;
  phone: string;
  consent: boolean;
  roofing: boolean;
}

interface QuizProps {
  onComplete?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

const QUIZ_STORAGE_KEY = 'gazobeton_quiz_progress';

// Функция форматирования телефона в российском формате +7 (999) 123-45-67
const formatPhone = (phone: string): string => {
  if (!phone) return '+7';
  const digits = phone.replace(/\D/g, '');
  if (!digits.startsWith('7') || digits.length === 0) {
    return '+7';
  }
  const number = digits.slice(1); // убираем первую 7
  if (number.length === 0) return '+7';
  
  let formatted = '+7';
  if (number.length > 0) {
    formatted += ` (${number.slice(0, 3)}`;
  }
  if (number.length > 3) {
    formatted += `) ${number.slice(3, 6)}`;
  }
  if (number.length > 6) {
    formatted += `-${number.slice(6, 8)}`;
  }
  if (number.length > 8) {
    formatted += `-${number.slice(8, 10)}`;
  }
  return formatted;
};

export default function Quiz({ onComplete, showCloseButton = false, onClose }: QuizProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>({
    thickness: [],
    volume: '',
    delivery: '',
    unloading: false,
    settlement: '',
    timeframe: '',
    contactMethod: '',
    name: '',
    phone: '',
    consent: false,
    roofing: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Honeypot поле
  const contentRef = useRef<HTMLFormElement>(null);
  const formStartTime = useRef<number>(Date.now());

  // Загрузка прогресса из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data);
        setStep(parsed.step);
      } catch {
        // Игнорируем ошибки парсинга
      }
    }
  }, []);

  // Сохранение прогресса в localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify({ step, data }));
    }, 300);
    return () => clearTimeout(timer);
  }, [step, data]);

  const updateData = <K extends keyof QuizData>(field: K, value: QuizData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleThicknessToggle = (value: string) => {
    setData(prev => ({
      ...prev,
      thickness: prev.thickness.includes(value)
        ? prev.thickness.filter(t => t !== value)
        : [...prev.thickness, value],
    }));
  };

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
      // Прокручиваем только начало контента квиза в видимую область (если открыт не в модалке)
      // В модалке прокрутка не нужна
      setTimeout(() => {
        if (contentRef.current && typeof window !== 'undefined') {
          const rect = contentRef.current.getBoundingClientRect();
          // Прокручиваем только если контент вне видимой области
          if (rect.top < 0 || rect.top > window.innerHeight * 0.3) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 50);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      // Прокручиваем только начало контента квиза в видимую область (если открыт не в модалке)
      // В модалке прокрутка не нужна
      setTimeout(() => {
        if (contentRef.current && typeof window !== 'undefined') {
          const rect = contentRef.current.getBoundingClientRect();
          // Прокручиваем только если контент вне видимой области
          if (rect.top < 0 || rect.top > window.innerHeight * 0.3) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 50);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.consent || !data.name || !data.phone) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Валидация телефона (11 цифр: 7 + 10 цифр номера)
    if (!data.phone || data.phone.length < 11) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }

    try {
      // Отправка данных на API (пока заглушка, API будет создан позже)
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          source: 'quiz',
          honeypot: honeypot,
          formStartTime: formStartTime.current,
          data: {
            thickness: data.thickness,
            volume: data.volume,
            delivery: data.delivery,
            timeframe: data.timeframe,
            contactMethod: data.contactMethod,
            settlement: data.settlement,
            unloading: data.unloading,
            roofing: data.roofing,
          },
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        localStorage.removeItem(QUIZ_STORAGE_KEY);
        formStartTime.current = Date.now(); // Сброс времени
        // Закрываем модалку через 2 секунды после успешной отправки
        if (onComplete) {
          setTimeout(() => onComplete(), 2000);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          alert('Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.');
        } else {
          // Если API еще не создан, все равно показываем успех
          setIsSubmitted(true);
          localStorage.removeItem(QUIZ_STORAGE_KEY);
          if (onComplete) {
            setTimeout(() => onComplete(), 2000);
          }
        }
      }
    } catch (error) {
      console.error('Quiz submission failed:', error);
      // Если API еще не создан, показываем успех
      console.log('API не настроен, но показываем успех для демо');
      setIsSubmitted(true);
      localStorage.removeItem(QUIZ_STORAGE_KEY);
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto my-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Спасибо!</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ваша заявка принята. Мы сравним предложения от разных заводов и отправим расчет 
            в {data.contactMethod === 'telegram' ? 'Telegram' : 
               data.contactMethod === 'whatsapp' ? 'WhatsApp' : 
               data.contactMethod === 'sms' ? 'SMS' : 
               'удобный мессенджер'} в ближайшее время.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/catalog"
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Смотреть каталог
            </Link>
            <Link 
              href="/calculator"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold transition border-2 border-gray-200 hover:border-gray-300"
            >
              Калькулятор
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const progress = (step / 6) * 100;

  return (
    <section className={`bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-gray-100 relative ${showCloseButton ? '' : 'my-12'}`}>
      {/* Кнопка закрытия для модалки */}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-all transform hover:scale-110 shadow-lg border border-gray-200"
          aria-label="Закрыть"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {/* Баннер */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white text-sm md:text-base font-medium">
            Чтобы подобрать лучшее предложение, нам нужно немного уточнить детали.
          </p>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <div className="h-2 bg-gray-100">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Контент */}
      <form onSubmit={handleSubmit} className="p-6 md:p-10" ref={contentRef}>
        {/* Honeypot поле - скрыто от пользователей, но видно ботам */}
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
        {/* Шаг 1: Толщина */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
              Какая толщина блока вам нужна?
            </h3>
            <p className="text-gray-600 mb-8">Выберите один или несколько вариантов</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {['100 мм', '150 мм', '200 мм', '250 мм', '300 мм', '400 мм', 'Не знаю, нужна консультация', 'Рассматриваю эконом-блоки (дешевле в 3 раза)'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                    data.thickness.includes(option)
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={data.thickness.includes(option)}
                    onChange={() => handleThicknessToggle(option)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  />
                  <span className={`ml-3 ${data.thickness.includes(option) ? 'text-orange-900 font-medium' : 'text-gray-700'}`}>{option}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={nextStep}
              disabled={data.thickness.length === 0}
              className="w-full md:w-auto bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Далее →
            </button>
          </div>
        )}

        {/* Шаг 2: Объем */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
              Какой объем нужен (м³)?
            </h3>
            <p className="text-gray-600 mb-8">Укажите примерный объем или отметьте, если нужна консультация</p>
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={data.volume === 'unknown' ? '' : data.volume}
                  onChange={(e) => {
                    if (data.volume !== 'unknown') {
                      updateData('volume', e.target.value);
                    }
                  }}
                  placeholder="Например: 25"
                  disabled={data.volume === 'unknown'}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">м³</span>
              </div>
            </div>
            <label className="flex items-center mb-8 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition cursor-pointer">
              <input
                type="checkbox"
                checked={data.volume === 'unknown'}
                onChange={(e) => updateData('volume', e.target.checked ? 'unknown' : '')}
                className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              />
              <span className="ml-3 text-gray-700 font-medium">
                Не знаю, помогите рассчитать
              </span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition"
              >
                ← Назад
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!data.volume || data.volume === ''}
                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Далее →
              </button>
            </div>
          </div>
        )}

        {/* Шаг 3: Доставка */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
              Нужна ли доставка?
            </h3>
            <p className="text-gray-600 mb-8">Мы организуем доставку по всему региону</p>
            <div className="flex gap-4 mb-8">
              <label className={`flex-1 p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                data.delivery === 'yes'
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300 bg-white'
              }`}>
                <input
                  type="radio"
                  name="delivery"
                  value="yes"
                  checked={data.delivery === 'yes'}
                  onChange={(e) => updateData('delivery', e.target.value as QuizData['delivery'])}
                  className="w-5 h-5 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                />
                <span className={`ml-3 ${data.delivery === 'yes' ? 'text-orange-900 font-semibold' : 'text-gray-700 font-semibold'}`}>Да</span>
              </label>
              <label className={`flex-1 p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                data.delivery === 'no'
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300 bg-white'
              }`}>
                <input
                  type="radio"
                  name="delivery"
                  value="no"
                  checked={data.delivery === 'no'}
                  onChange={(e) => updateData('delivery', e.target.value as QuizData['delivery'])}
                  className="w-5 h-5 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                />
                <span className={`ml-3 ${data.delivery === 'no' ? 'text-orange-900 font-semibold' : 'text-gray-700 font-semibold'}`}>Нет</span>
              </label>
            </div>
            
            {data.delivery === 'yes' && (
              <div className="space-y-4 mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition">
                  <input
                    type="checkbox"
                    checked={data.unloading}
                    onChange={(e) => updateData('unloading', e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  />
                  <span className="ml-3 text-gray-700 font-medium">Нужна разгрузка (манипулятор)</span>
                </label>
                <input
                  type="text"
                  value={data.settlement}
                  onChange={(e) => updateData('settlement', e.target.value)}
                  placeholder="Название населенного пункта"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition"
              >
                ← Назад
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!data.delivery}
                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Далее →
              </button>
            </div>
          </div>
        )}

        {/* Шаг 4: Сроки */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
              Когда планируете закупку?
            </h3>
            <p className="text-gray-600 mb-8">Это поможет подобрать лучшее предложение</p>
            <div className="space-y-3 mb-8">
              {[
                'Срочно (в ближайшие дни)',
                'В течение 1-3 месяцев',
                'В течение полугода',
                'Пока прицениваюсь',
              ].map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                    data.timeframe === option
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeframe"
                    value={option}
                    checked={data.timeframe === option}
                    onChange={(e) => updateData('timeframe', e.target.value)}
                    className="w-5 h-5 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  />
                  <span className={`ml-3 ${data.timeframe === option ? 'text-orange-900 font-medium' : 'text-gray-700'}`}>{option}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition"
              >
                ← Назад
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!data.timeframe}
                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Далее →
              </button>
            </div>
          </div>
        )}

        {/* Шаг 5: Способ связи */}
        {step === 5 && (
          <div className="animate-fadeIn">
            <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
              Как удобнее получить расчет?
            </h3>
            <p className="text-gray-600 mb-8">Выберите удобный способ связи</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {[
                { value: 'telegram', label: 'Telegram' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'sms', label: 'SMS (CMC)' },
                { value: 'call', label: 'Позвоните мне' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                    data.contactMethod === option.value
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="contactMethod"
                    value={option.value}
                    checked={data.contactMethod === option.value}
                    onChange={(e) => updateData('contactMethod', e.target.value)}
                    className="w-5 h-5 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  />
                  <span className={`ml-3 ${data.contactMethod === option.value ? 'text-orange-900 font-medium' : 'text-gray-700'}`}>{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition"
              >
                ← Назад
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!data.contactMethod}
                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Далее →
              </button>
            </div>
          </div>
        )}

        {/* Шаг 6: Контакты */}
        {step === 6 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
              Благодарим за уточнение деталей
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Мы сравним предложения от разных заводов и подберем лучший вариант с учетом скидок и доставки. 
              Если потребуется что-то уточнить, менеджер напишет Вам.
            </p>
            
            <div className="space-y-4 mb-6">
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData('name', e.target.value)}
                placeholder="Ваше имя"
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl z-10">🇷🇺</span>
                <input
                  type="tel"
                  value={formatPhone(data.phone)}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 0 && !value.startsWith('7')) {
                      value = '7' + value;
                    }
                    if (value === '7') {
                      value = '';
                    }
                    // Максимум 11 цифр (7 + 10 цифр номера)
                    if (value.length <= 11) {
                      updateData('phone', value);
                    }
                  }}
                  placeholder="+7 (___) ___-__-__"
                  required
                  className="w-full pl-14 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <label className="flex items-start p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => updateData('consent', e.target.checked)}
                  required
                  className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Я даю согласие на обработку{' '}
                  <Link href="/privacy" className="text-orange-600 hover:text-orange-700 underline font-medium">
                    персональных данных
                  </Link>
                </span>
              </label>
              <label className="flex items-start p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.roofing}
                  onChange={(e) => updateData('roofing', e.target.checked)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mt-1"
                />
                <span className="ml-3 text-sm text-gray-700 font-medium">
                  Хочу получить предложения по кровле и фасадам — так будет еще дешевле!
                </span>
              </label>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 p-5 mb-6 rounded-r-xl">
              <div className="flex items-center space-x-2">
                <span className="text-orange-600 font-bold text-xl">₽</span>
                <p className="font-semibold text-orange-900">
                  При заказе через эту форму – скидка 1000 рублей на доставку
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition"
              >
                ← Назад
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Получить расчет
              </button>
            </div>
          </div>
        )}

        {/* Прогресс внизу */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold text-navy-900">Шаг {step} из 6</span> • Без спама и звонков — расчет отправим в удобный мессенджер или по SMS
          </p>
        </div>
      </form>
    </section>
  );
}

