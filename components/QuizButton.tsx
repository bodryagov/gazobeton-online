'use client';

import { useState } from 'react';
import QuizModal from './QuizModal';

interface QuizButtonProps {
  variant?: 'primary' | 'secondary';
  label?: string;
  size?: 'md' | 'lg';
}

export default function QuizButton({ variant = 'primary', label = 'Подобрать оптимальный вариант', size = 'md' }: QuizButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const baseClasses = 'rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105';
  const sizeClasses = size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base';

  const variantClasses =
    variant === 'secondary'
      ? 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
      : 'bg-orange-500 hover:bg-orange-600 text-white';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${baseClasses} ${sizeClasses} ${variantClasses}`}
      >
        {label}
      </button>
      <QuizModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

