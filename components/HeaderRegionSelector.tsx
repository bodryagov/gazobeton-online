'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { regions } from '@/data/regions';
import { getSelectedRegion, setSelectedRegion, isValidRegion } from '@/lib/region';

export default function HeaderRegionSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegionState] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Загружаем выбранный регион
    const region = getSelectedRegion();
    if (isValidRegion(region)) {
      setSelectedRegionState(region);
    }

    // Слушаем изменения региона
    const handleRegionChanged = (e: CustomEvent) => {
      const newRegion = e.detail?.region;
      if (isValidRegion(newRegion)) {
        setSelectedRegionState(newRegion);
      }
    };

    window.addEventListener('regionChanged', handleRegionChanged as EventListener);
    return () => window.removeEventListener('regionChanged', handleRegionChanged as EventListener);
  }, []);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const mainRegions = ['moscow', 'spb', 'ufa', 'samara']
    .map(slug => regions[slug])
    .filter(Boolean);

  const currentRegion = selectedRegion ? regions[selectedRegion] : null;

  const handleRegionSelect = (regionSlug: string) => {
    setSelectedRegion(regionSlug);
    setSelectedRegionState(regionSlug);
    setIsOpen(false);

    // Уведомляем другие компоненты
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('regionChanged', { detail: { region: regionSlug } }));
    }

    const normalizedPath = pathname?.split('?')[0] ?? '/';
    const regionPathMatch = normalizedPath.match(/^\/([^/]+)/);
    const currentPathRegion = regionPathMatch && isValidRegion(regionPathMatch[1]) ? regionPathMatch[1] : null;

    if (currentPathRegion) {
      const newPath = normalizedPath.replace(`/${currentPathRegion}`, `/${regionSlug}`);
      router.push(newPath);
      return;
    }

    const regionalRedirects: Array<{ match: (path: string) => boolean; build: (slug: string) => string }> = [
      {
        match: (path) => path === '/catalog' || path.startsWith('/catalog/'),
        build: (slug) => `/${slug}/catalog`,
      },
      {
        match: (path) => path === '/delivery',
        build: (slug) => `/${slug}/delivery`,
      },
      {
        match: (path) => path === '/calculator',
        build: (slug) => `/${slug}/calculator`,
      },
      {
        match: (path) => path === '/',
        build: (slug) => `/${slug}`,
      },
    ];

    const redirectEntry = regionalRedirects.find((entry) => entry.match(normalizedPath));

    if (redirectEntry) {
      router.push(redirectEntry.build(regionSlug));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-white hover:text-orange-400 transition text-sm font-medium"
      >
        <span className="text-sm text-gray-300">
          {currentRegion ? currentRegion.name : 'Выберите регион'}
        </span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px] z-50">
          <div className="py-2">
            {mainRegions.map((region) => (
              <button
                key={region.slug}
                onClick={() => handleRegionSelect(region.slug)}
                className={`w-full text-left px-4 py-2 hover:bg-orange-50 transition flex items-center justify-between ${
                  selectedRegion === region.slug ? 'bg-orange-50 text-orange-500 font-semibold' : 'text-gray-700'
                }`}
              >
                <span>{region.name}</span>
                {selectedRegion === region.slug && (
                  <span className="text-orange-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

