'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { RegionConfig } from '@/data/regions';

// Константы для расчетов
const CALCULATION_CONSTANTS = {
  BLOCK_LENGTH: 0.625, // метры (625 мм)
  BLOCK_HEIGHT: 0.25, // метры (250 мм)
  RESERVE_PERCENT: 1.05, // 5% запас
  GLUE_PER_M3: 25, // кг клея на м³ кладки
  REINFORCEMENT_STEP: 0.75, // шаг армирования в метрах
  REINFORCEMENT_ROWS: 2, // количество рядов арматуры
} as const;

// Цены по регионам
const REGION_PRICES: Record<string, { block: number; glue: number }> = {
  default: { block: 6500, glue: 350 },
  moscow: { block: 7600, glue: 420 },
  spb: { block: 6100, glue: 360 },
  ufa: { block: 5200, glue: 330 },
  samara: { block: 6800, glue: 350 },
};

// Типы для формы
interface CalculatorFormData {
  houseLength: string;
  houseWidth: string;
  perimeter: string;
  wallHeight: string;
  blockThickness: string;
  windowsCount: string;
  windowHeight: string;
  windowWidth: string;
  doorsCount: string;
  doorHeight: string;
  doorWidth: string;
  gableCount: string;
  gableHeight: string;
  gableWidth: string;
  partitionsLength: string;
  partitionsHeight: string;
  partitionsThickness: string;
}

interface CalculationResult {
  blocksCount: number;
  volume: number;
}

interface DetailedCalculationData {
  region: string;
  volume: string;
  blocksCount: number;
  blocksCost: string;
  totalCost: string;
  additionalInfo: string[];
  leadScore: number;
}

type CommunicationMethod = 'whatsapp' | 'telegram' | 'call';
type PurchaseTime = 'urgent' | '1-3months' | 'halfyear' | 'year' | 'browsing';

interface CalculatorPageContentProps {
  regionConfig?: RegionConfig | null;
}

export default function CalculatorPageContent({ regionConfig }: CalculatorPageContentProps) {
  // Основные параметры калькулятора
  const [formData, setFormData] = useState<CalculatorFormData>({
    houseLength: '10',
    houseWidth: '8',
    perimeter: '36',
    wallHeight: '3',
    blockThickness: '400',
    windowsCount: '0',
    windowHeight: '1.5',
    windowWidth: '1.5',
    doorsCount: '0',
    doorHeight: '2.1',
    doorWidth: '0.9',
    gableCount: '0',
    gableHeight: '2',
    gableWidth: '10',
    partitionsLength: '0',
    partitionsHeight: '2.5',
    partitionsThickness: '100',
  });

  const [result, setResult] = useState<CalculationResult>({ blocksCount: 0, volume: 0 });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [additionalOptions, setAdditionalOptions] = useState({
    glue: false,
    reinforcement: false,
    delivery: false,
  });
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [purchaseTime, setPurchaseTime] = useState<PurchaseTime>('1-3months');
  const [communicationMethod, setCommunicationMethod] = useState<CommunicationMethod>('whatsapp');
  const [formFields, setFormFields] = useState({ name: '', phone: '' });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [perimeterEnteredManually, setPerimeterEnteredManually] = useState(false);

  const currentRegionSlug = regionConfig?.slug ?? 'default';
  const currentRegionPrices = REGION_PRICES[currentRegionSlug] ?? REGION_PRICES.default;
  const pageTitle = regionConfig
    ? `Калькулятор газобетона ${regionConfig.nameGenitive}`
    : 'Калькулятор газобетона';
  const pageSubtitle = regionConfig
    ? `Рассчитайте объём блоков и примерную стоимость доставки ${regionConfig.namePrepositional}.`
    : 'Точный расчет материалов для вашего дома.';
  const breadcrumbs = regionConfig
    ? [
        { label: 'Главная', href: '/' },
        { label: regionConfig.name, href: `/${regionConfig.slug}` },
        { label: 'Калькулятор' },
      ]
    : [
        { label: 'Главная', href: '/' },
        { label: 'Калькулятор' },
      ];

  // Lead scoring
  const [leadScore, setLeadScore] = useState(0);
  const sessionStartTime = useRef(Date.now());
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Загрузка из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('calculatorData');
      if (saved) {
        const data = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...data }));
        setLeadScore((prev) => prev + 15);
      }
      setLeadScore((prev) => prev + 10); // За открытие калькулятора
    } catch {
      // Игнорируем ошибки localStorage
    }

    // Проверка повторного визита
    try {
      if (localStorage.getItem('hasVisited')) {
        setLeadScore((prev) => prev + 15);
      } else {
        localStorage.setItem('hasVisited', 'true');
      }
    } catch {
      // Игнорируем ошибки
    }
  }, []);

  // Таймеры для lead scoring
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLeadScore((prev) => prev + 10);
    }, 60000);
    const timer2 = setTimeout(() => {
      setLeadScore((prev) => prev + 10);
    }, 180000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Вычисление периметра из длины и ширины (только при потере фокуса)
  const calculatePerimeter = useCallback(() => {
    // Не вычисляем, если периметр был введен вручную
    if (perimeterEnteredManually) {
      return;
    }
    const length = parseFloat(formData.houseLength) || 0;
    const width = parseFloat(formData.houseWidth) || 0;
    if (length > 0 && width > 0) {
      const perimeter = (length + width) * 2;
      setFormData((prev) => ({ ...prev, perimeter: perimeter.toString() }));
      // Автоматически рассчитанный периметр не блокирует поля
      setPerimeterEnteredManually(false);
    } else if (!length && !width) {
      // Если оба поля пустые, очищаем периметр если он не был введен вручную
      if (!perimeterEnteredManually) {
        setFormData((prev) => ({ ...prev, perimeter: '' }));
      }
    }
  }, [formData.houseLength, formData.houseWidth, perimeterEnteredManually]);

  // Расчет с debounce для сохранения
  const calculateBasic = useCallback(() => {
    const perimeter = parseFloat(formData.perimeter) || 0;
    const height = parseFloat(formData.wallHeight) || 0;
    const thickness = parseFloat(formData.blockThickness) || 400;

    if (perimeter < 1 || height < 0.1) {
      setResult({ blocksCount: 0, volume: 0 });
      return;
    }

    // Основная площадь стен
    const wallArea = perimeter * height;
    const volumeGross = wallArea * (thickness / 1000);

    // Оконные проемы
    const windowsCount = parseInt(formData.windowsCount) || 0;
    const windowHeight = parseFloat(formData.windowHeight) || 1.5;
    const windowWidth = parseFloat(formData.windowWidth) || 1.5;
    const windowArea = windowsCount * windowHeight * windowWidth;

    // Дверные проемы
    const doorsCount = parseInt(formData.doorsCount) || 0;
    const doorHeight = parseFloat(formData.doorHeight) || 2.1;
    const doorWidth = parseFloat(formData.doorWidth) || 0.9;
    const doorArea = doorsCount * doorHeight * doorWidth;

    // Объем проемов
    const openingsVolume = (windowArea + doorArea) * (thickness / 1000);

    // Фронтоны (треугольные)
    const gableCount = parseInt(formData.gableCount) || 0;
    const gableHeight = parseFloat(formData.gableHeight) || 2;
    const gableWidth = parseFloat(formData.gableWidth) || 10;
    // Формула для площади треугольника: (ширина * высота) / 2
    const gablesVolume = gableCount * (0.5 * gableWidth * gableHeight * (thickness / 1000));

    // Внутренние перегородки
    const partitionsLength = parseFloat(formData.partitionsLength) || 0;
    const partitionsHeight = parseFloat(formData.partitionsHeight) || 2.5;
    const partitionsThickness = parseFloat(formData.partitionsThickness) || 100;
    const partitionsVolume = partitionsLength * partitionsHeight * (partitionsThickness / 1000);

    // Итоговый объем
    const volumeNet = volumeGross - openingsVolume + gablesVolume + partitionsVolume;
    const volumeWithReserve = Math.max(0, volumeNet * CALCULATION_CONSTANTS.RESERVE_PERCENT);

    // Количество блоков
    const blockVolume = CALCULATION_CONSTANTS.BLOCK_LENGTH * CALCULATION_CONSTANTS.BLOCK_HEIGHT * (thickness / 1000);
    const blocksCount = Math.ceil(volumeWithReserve / blockVolume);

    setResult({ blocksCount, volume: volumeWithReserve });
  }, [formData]);

  // Пересчет при изменении данных
  useEffect(() => {
    calculateBasic();
  }, [calculateBasic]);

  // Сохранение в localStorage с debounce
  const saveToStorage = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('calculatorData', JSON.stringify(formData));
      } catch {
        // Игнорируем ошибки localStorage
      }
    }, 500);
  }, [formData]);

  useEffect(() => {
    saveToStorage();
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveToStorage]);

  // Обработка изменения полей
  const handleFieldChange = (field: keyof CalculatorFormData, value: string) => {
    if (field === 'perimeter') {
      // Периметр вводится вручную - устанавливаем флаг
      setPerimeterEnteredManually(true);
      setFormData((prev) => ({
        ...prev,
        perimeter: value,
        // При вводе периметра очищаем длину и ширину
        houseLength: value ? '' : prev.houseLength,
        houseWidth: value ? '' : prev.houseWidth,
      }));
    } else if (field === 'houseLength' || field === 'houseWidth') {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Если пользователь изменяет длину/ширину, сбрасываем флаг ручного ввода периметра
      // чтобы периметр пересчитался автоматически и поля не блокировались
      setPerimeterEnteredManually(false);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setLeadScore((prev) => prev + 1);
  };

  // Форматирование телефона
  const formatPhone = (value: string): string => {
    let digits = value.replace(/\D/g, '');
    
    if (digits.startsWith('8')) {
      digits = '7' + digits.substring(1);
    }
    
    if (digits.startsWith('7')) {
      digits = digits.substring(1);
    }
    
    let formatted = '+7';
    if (digits.length > 0) {
      formatted += ' (' + digits.substring(0, 3);
      if (digits.length > 3) {
        formatted += ') ' + digits.substring(3, 6);
        if (digits.length > 6) {
          formatted += '-' + digits.substring(6, 8);
          if (digits.length > 8) {
            formatted += '-' + digits.substring(8, 10);
          }
        }
      }
    }
    
    return formatted;
  };

  // Валидация телефона (российский формат)
  const isValidPhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    // Проверяем, что номер содержит 10 цифр (после удаления 7) или 11 цифр (с 7)
    return (digits.length === 11 && digits.startsWith('7')) || digits.length === 10;
  };

  // Расчет детального расчета
  const calculateDetailed = (): DetailedCalculationData => {
    const region = regionConfig?.slug ?? 'default';
    const prices = currentRegionPrices;
    const thickness = parseFloat(formData.blockThickness) || 400;
    const perimeter = parseFloat(formData.perimeter) || 0;
    const height = parseFloat(formData.wallHeight) || 0;

    const blockVolume = CALCULATION_CONSTANTS.BLOCK_LENGTH * CALCULATION_CONSTANTS.BLOCK_HEIGHT * (thickness / 1000);
    const blocksCount = Math.ceil(result.volume / blockVolume);
    const blocksCost = result.volume * prices.block;

    let additionalCosts = 0;
    const additionalInfo: string[] = [];

    if (additionalOptions.glue) {
      // Расчет клея: расход 25 кг на м³, мешок 25 кг
      // Количество мешков = (объем * расход на м³) / вес мешка
      const glueAmount = Math.ceil(result.volume); // 1 мешок на м³ (25кг/м³ / 25кг мешок = 1)
      const glueCost = glueAmount * prices.glue;
      additionalCosts += glueCost;
      additionalInfo.push(`Клей: ${glueAmount} мешков (${glueCost.toLocaleString()} ₽)`);
      setLeadScore((prev) => prev + 5);
    }

    if (additionalOptions.reinforcement) {
      const reinforcementLength = perimeter * Math.ceil(height / CALCULATION_CONSTANTS.REINFORCEMENT_STEP) * CALCULATION_CONSTANTS.REINFORCEMENT_ROWS;
      additionalInfo.push(`Арматура: ~${Math.round(reinforcementLength)} м`);
      setLeadScore((prev) => prev + 5);
    }

    if (additionalOptions.delivery) {
      additionalInfo.push(`Доставка в ${deliveryAddress || 'указанный адрес'}: рассчитаем отдельно`);
      setLeadScore((prev) => prev + 10);
    }

    return {
      region: regionConfig?.name ?? region,
      volume: result.volume.toFixed(1),
      blocksCount,
      blocksCost: blocksCost.toFixed(0),
      totalCost: (blocksCost + additionalCosts).toFixed(0),
      additionalInfo,
      leadScore,
    };
  };

  // Обработка отправки формы
  const handleSubmit = async () => {
    if (!formFields.name.trim()) {
      alert('Пожалуйста, укажите ваше имя');
      return;
    }

    if (!isValidPhone(formFields.phone)) {
      alert('Пожалуйста, укажите корректный номер телефона');
      return;
    }

    if (!privacyConsent) {
      alert('Необходимо согласие с политикой конфиденциальности');
      return;
    }

    const timeScores: Record<PurchaseTime, number> = {
      urgent: 30,
      '1-3months': 20,
      halfyear: 10,
      year: 5,
      browsing: 1,
    };

    const finalLeadScore = leadScore + (timeScores[purchaseTime] || 1);
    const leadType =
      finalLeadScore >= 70 ? '🔥 Горячий' : finalLeadScore >= 40 ? '🌡 Тёплый' : '❄️ Холодный';

    const calculationData = calculateDetailed();

    const phoneDigits = formFields.phone.replace(/\D/g, '').replace(/^7/, '');

    const formDataToSend = {
      name: formFields.name.trim(),
      phone: phoneDigits,
      communicationMethod,
      purchaseTime,
      region: regionConfig?.slug ?? 'default',
      calculation: calculationData,
      leadScore: finalLeadScore,
      leadType,
      timestamp: new Date().toISOString(),
      sessionDuration: Math.round((Date.now() - sessionStartTime.current) / 1000),
      ...formData,
      deliveryAddress,
      additionalOptions,
    };

    setIsSubmitting(true);

    try {
      const SCRIPT_URL =
        'https://script.google.com/macros/s/AKfycbyDKuaQc2g_rT27qMn5X1NJD6-ntn5WStWk5Y50td8CSTlOAxqs81AQO6fpk9Ul6JhC/exec';

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      setTimeout(() => {
        setShowSuccess(true);
        setIsSubmitting(false);
        try {
          localStorage.removeItem('calculatorData');
        } catch {
          // Игнорируем ошибки
        }
      }, 1500);
    } catch (error) {
      console.error('Calculator lead submission failed:', error);
      setIsSubmitting(false);
      alert('Произошла ошибка при отправке. Попробуйте позже.');
    }
  };

  // Управление модальным окном
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    setLeadScore((prev) => prev + 15);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setShowSuccess(false);
    setModalStep(1);
  };

  const nextStep = () => {
    if (modalStep < 3) {
      setModalStep((prev) => prev + 1);
      if (modalStep === 2) {
        calculateDetailed();
      }
    }
  };

  const prevStep = () => {
    if (modalStep > 1) {
      setModalStep((prev) => prev - 1);
    }
  };

  // Проверка, заблокированы ли поля длины/ширины (только если периметр введен вручную)
  const isLengthWidthDisabled = perimeterEnteredManually && !!formData.perimeter;

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-12">
        {/* Заголовок */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {pageTitle}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {pageSubtitle}
          </p>
          {regionConfig && (
            <p className="text-sm md:text-base text-gray-500 mt-3">
              Мы используем цены производителей и логистику {regionConfig.namePrepositional}, чтобы расчёт был ближе к реальности.
            </p>
          )}
        </div>

        {/* Сетка: инструкция слева, калькулятор справа (на больших экранах) */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Инструкция */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm p-5 lg:sticky lg:top-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Как пользоваться?</h2>

              <div className="space-y-4 mb-5">
                <div>
                  <h3 className="font-semibold mb-2 flex items-start text-sm">
                    <span className="w-6 h-6 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mr-2 font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span className="text-sm">Укажите размеры</span>
                  </h3>
                  <p className="text-gray-600 text-sm ml-8 leading-relaxed">
                    Введите длину и ширину дома или периметр стен. Укажите высоту стен и толщину блоков.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-start text-sm">
                    <span className="w-6 h-6 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mr-2 font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span className="text-sm">Дополнительные параметры</span>
                  </h3>
                  <p className="text-gray-600 text-sm ml-8 leading-relaxed">
                    Откройте дополнительные параметры для учета окон, дверей, фронтонов и перегородок.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-start text-sm">
                    <span className="w-6 h-6 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mr-2 font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span className="text-sm">Получите результат</span>
                  </h3>
                  <p className="text-gray-600 text-sm ml-8 leading-relaxed">
                    Калькулятор рассчитает количество блоков и объем с учетом 5% запаса.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
                <p className="font-semibold text-sm mb-2">💡 Важно:</p>
                <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                  <li>Все проемы вычитаются из расчета</li>
                  <li>Учитывается запас 5%</li>
                  <li>Расход клея: ~25 кг/м³</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-orange-600 block mb-1">Нужен точный расчет с доставкой?</strong>
                  <span className="text-sm">
                    Нажмите "Детальный расчет" для получения сметы с учетом клея, армирования и доставки.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Основной калькулятор */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
            {/* Header с градиентом */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-700 text-white p-6 md:p-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Расчет газобетонных блоков</h2>
              <p className="text-sm md:text-base opacity-90">Вся информация, лучшие цены</p>
            </div>

            <div className="p-4 md:p-6 lg:p-8">
              {/* Основные параметры */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Длина дома (м)
                  </label>
                  <input
                    type="number"
                    value={formData.houseLength}
                    onChange={(e) => handleFieldChange('houseLength', e.target.value)}
                    onBlur={calculatePerimeter}
                    disabled={isLengthWidthDisabled}
                    min="1"
                    max="50"
                    step="0.5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ширина дома (м)
                  </label>
                  <input
                    type="number"
                    value={formData.houseWidth}
                    onChange={(e) => handleFieldChange('houseWidth', e.target.value)}
                    onBlur={calculatePerimeter}
                    disabled={isLengthWidthDisabled}
                    min="1"
                    max="50"
                    step="0.5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Общая длина стен (периметр, м)
                </label>
                <input
                  type="number"
                  value={formData.perimeter}
                  onChange={(e) => handleFieldChange('perimeter', e.target.value)}
                  min="1"
                  max="200"
                  step="0.5"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50"
                />
                <small className="text-xs text-gray-500 mt-1 block">
                  При вводе периметра поля длина/ширина блокируются
                </small>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Высота стен (м)
                  </label>
                  <input
                    type="number"
                    value={formData.wallHeight}
                    onChange={(e) => handleFieldChange('wallHeight', e.target.value)}
                    min="2"
                    max="15"
                    step="0.1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Толщина блока (мм)
                  </label>
                  <select
                    value={formData.blockThickness}
                    onChange={(e) => handleFieldChange('blockThickness', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50"
                  >
                    <option value="200">200 мм</option>
                    <option value="250">250 мм</option>
                    <option value="300">300 мм</option>
                    <option value="375">375 мм</option>
                    <option value="400">400 мм</option>
                  </select>
                </div>
              </div>

              {/* Дополнительные параметры */}
              <div className="mb-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-600 text-blue-600 font-semibold px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <span>{isAdvancedOpen ? '▲' : '▼'}</span>
                  Дополнительные параметры
                </button>

                {isAdvancedOpen && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                    {/* Оконные проемы */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Оконные проемы</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Количество (шт)</label>
                          <input
                            type="number"
                            value={formData.windowsCount}
                            onChange={(e) => handleFieldChange('windowsCount', e.target.value)}
                            min="0"
                            max="50"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Высота (м)</label>
                          <input
                            type="number"
                            value={formData.windowHeight}
                            onChange={(e) => handleFieldChange('windowHeight', e.target.value)}
                            min="0.5"
                            max="5"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Ширина (м)</label>
                          <input
                            type="number"
                            value={formData.windowWidth}
                            onChange={(e) => handleFieldChange('windowWidth', e.target.value)}
                            min="0.5"
                            max="5"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Дверные проемы */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Дверные проемы</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Количество (шт)</label>
                          <input
                            type="number"
                            value={formData.doorsCount}
                            onChange={(e) => handleFieldChange('doorsCount', e.target.value)}
                            min="0"
                            max="20"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Высота (м)</label>
                          <input
                            type="number"
                            value={formData.doorHeight}
                            onChange={(e) => handleFieldChange('doorHeight', e.target.value)}
                            min="1"
                            max="3"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Ширина (м)</label>
                          <input
                            type="number"
                            value={formData.doorWidth}
                            onChange={(e) => handleFieldChange('doorWidth', e.target.value)}
                            min="0.5"
                            max="3"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Фронтоны */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Фронтоны</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Количество (шт)</label>
                          <input
                            type="number"
                            value={formData.gableCount}
                            onChange={(e) => handleFieldChange('gableCount', e.target.value)}
                            min="0"
                            max="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Высота (м)</label>
                          <input
                            type="number"
                            value={formData.gableHeight}
                            onChange={(e) => handleFieldChange('gableHeight', e.target.value)}
                            min="0.5"
                            max="10"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Ширина основания (м)</label>
                          <input
                            type="number"
                            value={formData.gableWidth}
                            onChange={(e) => handleFieldChange('gableWidth', e.target.value)}
                            min="1"
                            max="50"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Перегородки */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Внутренние перегородки</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Длина (м)</label>
                          <input
                            type="number"
                            value={formData.partitionsLength}
                            onChange={(e) => handleFieldChange('partitionsLength', e.target.value)}
                            min="0"
                            max="200"
                            step="0.5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Высота (м)</label>
                          <input
                            type="number"
                            value={formData.partitionsHeight}
                            onChange={(e) => handleFieldChange('partitionsHeight', e.target.value)}
                            min="1"
                            max="5"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Толщина (мм)</label>
                          <select
                            value={formData.partitionsThickness}
                            onChange={(e) => handleFieldChange('partitionsThickness', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                          >
                            <option value="100">100 мм</option>
                            <option value="150">150 мм</option>
                            <option value="200">200 мм</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Результаты */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-orange-500 rounded-xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                    <span className="font-semibold text-gray-700">Количество блоков:</span>
                    <span className="font-bold text-xl text-gray-900">{result.blocksCount} шт</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Объем:</span>
                    <span className="font-bold text-xl text-gray-900">{result.volume.toFixed(1)} м³</span>
                  </div>
                </div>
                <div
                  onClick={openModal}
                  className="mt-4 bg-yellow-50 border-2 border-dashed border-orange-500 rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-orange-500 hover:text-white hover:border-orange-600 hover:transform hover:-translate-y-0.5"
                >
                  <strong className="text-base">💰 Рассчитать стоимость с доставкой</strong>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 mb-6">
                Чтобы посчитать стоимость в Вашем регионе, с учетом клея, армирования и доставки,
                уточните параметры →
              </p>

              <button
                onClick={openModal}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                📊 Детальный расчет
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header модального окна */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-700 text-white p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl md:text-2xl font-bold">Детальный расчет</h2>
              <button
                onClick={closeModal}
                className="text-2xl hover:text-orange-400 transition-colors"
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>

            <div className="p-6 md:p-8">
              {/* Индикатор шагов */}
              <div className="flex justify-center mb-8 gap-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step < modalStep
                        ? 'bg-green-500 text-white'
                        : step === modalStep
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>

              {/* Шаг 1 */}
              {modalStep === 1 && !showSuccess && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Уточнение расчета</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Уточните дополнительные параметры для более точного расчета количества и стоимости
                    материала.
                  </p>

                  <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={additionalOptions.glue}
                        onChange={(e) =>
                          setAdditionalOptions((prev) => ({ ...prev, glue: e.target.checked }))
                        }
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="font-medium">Добавить расчет клея</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={additionalOptions.reinforcement}
                        onChange={(e) =>
                          setAdditionalOptions((prev) => ({ ...prev, reinforcement: e.target.checked }))
                        }
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="font-medium">Добавить армирование</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={additionalOptions.delivery}
                        onChange={(e) => {
                          setAdditionalOptions((prev) => ({ ...prev, delivery: e.target.checked }));
                          if (!e.target.checked) setDeliveryAddress('');
                        }}
                        className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="font-medium">Нужна доставка</span>
                    </label>

                    {additionalOptions.delivery && (
                      <div className="mt-3 ml-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Адрес доставки
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Укажите город/населенный пункт"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Далее →
                  </button>
                </div>
              )}

              {/* Шаг 2 */}
              {modalStep === 2 && !showSuccess && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Планы строительства</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Поделитесь планами, мы пришлем наиболее актуальную для Вас информацию
                  </p>

                  <div className="bg-blue-50 rounded-lg p-5 mb-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>Точный расчет с учетом всех параметров</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>Сравнение цен 3 поставщиков в Вашем регионе</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>БОНУС:</strong>
                      <span>
                        Книга "Строим просто!" - как построить качественный дом и сэкономить от
                        800.000 рублей?
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Когда планируете покупку:
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'urgent', label: 'Срочно / в ближайшее время' },
                        { value: '1-3months', label: 'В течении 1-3 месяцев' },
                        { value: 'halfyear', label: 'В течении полугода' },
                        { value: 'year', label: 'В течении года' },
                        { value: 'browsing', label: 'Пока прицениваюсь' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="radio"
                            name="purchaseTime"
                            value={option.value}
                            checked={purchaseTime === option.value}
                            onChange={(e) => setPurchaseTime(e.target.value as PurchaseTime)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-colors"
                    >
                      ← Назад
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Далее →
                    </button>
                  </div>
                </div>
              )}

              {/* Шаг 3 */}
              {modalStep === 3 && !showSuccess && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Пришлем расчет и ссылку на книгу</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Никаких навязчивых звонков - отправим информацию в удобный мессенджер.
                  </p>

                  <div className="bg-blue-50 rounded-lg p-5 mb-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>Точный расчет с учетом всех параметров</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>Сравнение цен 3 поставщиков в Вашем регионе</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>БОНУС:</strong>
                      <span>
                        Книга "Строим просто!" - как построить качественный дом и сэкономить от
                        800.000 рублей?
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        value={formFields.name}
                        onChange={(e) => setFormFields((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Как к вам обращаться?"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        value={formFields.phone}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          setFormFields((prev) => ({ ...prev, phone: formatted }));
                        }}
                        placeholder="+7 (___) ___-__-__"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Удобный способ связи:
                      </label>
                      <div className="flex gap-3 flex-wrap">
                        {[
                          { value: 'whatsapp', label: '📱 WhatsApp' },
                          { value: 'telegram', label: '✈️ Telegram' },
                          { value: 'call', label: '📞 Позвонить' },
                        ].map((method) => (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => setCommunicationMethod(method.value as CommunicationMethod)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              communicationMethod === method.value
                                ? 'bg-orange-500 border-orange-500 text-white font-semibold'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-orange-500'
                            }`}
                          >
                            {method.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacyConsent}
                        onChange={(e) => setPrivacyConsent(e.target.checked)}
                        required
                        className="w-5 h-5 mt-0.5 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">
                        Согласен с{' '}
                        <Link href="/confidence/" target="_blank" className="text-orange-500 hover:underline">
                          политикой конфиденциальности
                        </Link>
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-colors"
                    >
                      ← Назад
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '⏳ Отправка...' : '🎁 Получить расчет'}
                    </button>
                  </div>
                </div>
              )}

              {/* Экран успеха */}
              {showSuccess && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-6">🎉</div>
                  <h2 className="text-2xl font-bold mb-6">Заявка на расчет отправлена!</h2>
                  <div className="bg-blue-50 rounded-lg p-6 mb-6 space-y-3 text-left">
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>
                        Книга "Как сэкономить от 800.000₽ на строительстве" - пришлем ссылку на
                        скачивание
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>
                        В ближайшее время наш менеджер посчитает самый выгодный для Вас вариант и
                        свяжется указанным способом!
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Отлично!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
