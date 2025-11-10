'use client';

import { useEffect } from 'react';
import { setSelectedRegion } from '@/lib/region';

interface RegionSyncProps {
  regionSlug: string;
}

/**
 * Компонент для автоматического сохранения выбранного региона
 * Используется на региональных страницах
 */
export default function RegionSync({ regionSlug }: RegionSyncProps) {
  useEffect(() => {
    // Сохраняем регион при загрузке региональной страницы
    setSelectedRegion(regionSlug);
    
    // Уведомляем Header об изменении региона
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('regionChanged', { detail: { region: regionSlug } }));
    }
  }, [regionSlug]);

  return null; // Компонент не рендерит ничего
}

