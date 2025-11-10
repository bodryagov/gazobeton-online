import type { Metadata } from 'next';
import CalculatorPageContent from '@/components/calculator/CalculatorPageContent';

export const metadata: Metadata = {
  title: 'Калькулятор газобетона — расчёт блоков | Газобетон Online',
  description:
    'Рассчитайте количество газобетонных блоков, объём и стоимость клея. Учитываем проёмы, фронтоны, перегородки и добавляем 5% запас.',
  alternates: {
    canonical: 'https://gazobeton-online.ru/calculator',
  },
  openGraph: {
    title: 'Калькулятор газобетона | Газобетон Online',
    description:
      'Бесплатный онлайн калькулятор газобетона. Расчёт количества блоков, клея и армирования с учётом параметров вашего дома.',
    url: 'https://gazobeton-online.ru/calculator',
    siteName: 'Газобетон Online',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Калькулятор газобетона | Газобетон Online',
    description:
      'Точный расчёт газобетонных блоков и расхода материалов онлайн.',
  },
};

export default function CalculatorPage() {
  return <CalculatorPageContent />;
}

