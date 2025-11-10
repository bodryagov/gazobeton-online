'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { regions } from '@/data/regions';
import { setSelectedRegion, getSelectedRegion, isValidRegion } from '@/lib/region';

interface RegionSelectorProps {
  onRegionSelect?: (regionSlug: string) => void;
  redirectToCatalog?: boolean;
}

export default function RegionSelector({ onRegionSelect, redirectToCatalog = true }: RegionSelectorProps) {
  const router = useRouter();
  const [selectedRegion, setSelectedRegionState] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем выбранный регион при монтировании
    const savedRegion = getSelectedRegion();
    if (isValidRegion(savedRegion)) {
      setSelectedRegionState(savedRegion);
    }
  }, []);

  const mainRegions = ['moscow', 'spb', 'ufa', 'samara']
    .map(slug => regions[slug])
    .filter(Boolean);

  const handleRegionSelect = (regionSlug: string) => {
    setSelectedRegion(regionSlug);
    setSelectedRegionState(regionSlug);
    
    // Уведомляем другие компоненты об изменении региона через кастомное событие
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('regionChanged', { detail: { region: regionSlug } }));
    }
    
    if (onRegionSelect) {
      onRegionSelect(regionSlug);
    }
    
    if (redirectToCatalog) {
      router.push(`/${regionSlug}/catalog`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Выберите ваш город
        </h2>
        <p className="text-lg text-gray-600">
          Чтобы увидеть актуальные цены и наличие товаров в вашем регионе
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainRegions.map((region) => (
          <button
            key={region.slug}
            onClick={() => handleRegionSelect(region.slug)}
            className={`border-2 rounded-xl p-6 text-center transition-all transform hover:scale-105 ${
              selectedRegion === region.slug
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-500 bg-white'
            }`}
          >
            <div className="text-3xl mb-3">🏙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{region.name}</h3>
            <p className="text-sm text-gray-600 mb-3">
              Доставка от {region.delivery.basePrice.toLocaleString('ru-RU')} ₽
            </p>
            <span className={`text-sm font-semibold ${
              selectedRegion === region.slug ? 'text-orange-500' : 'text-gray-400'
            }`}>
              {selectedRegion === region.slug ? 'Выбрано ✓' : 'Выбрать →'}
            </span>
          </button>
        ))}
      </div>

      {selectedRegion && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Выбран регион: <strong>{regions[selectedRegion]?.name}</strong>
          </p>
          <p className="text-xs text-gray-500">
            Выбор сохранен, вы будете перенаправлены на региональный каталог
          </p>
        </div>
      )}
    </div>
  );
}

