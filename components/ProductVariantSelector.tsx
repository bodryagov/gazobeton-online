'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ProductDensityOption, ProductThicknessOption } from '@/lib/products';

interface ProductVariantSelectorProps {
  regionSlug: string;
  currentDensity: string;
  currentThickness: number;
  currentSlug: string;
  densityOptions: ProductDensityOption[];
  thicknessOptionsMap: Record<string, ProductThicknessOption[]>;
  mode?: 'card' | 'inline';
}

export default function ProductVariantSelector({
  regionSlug,
  currentDensity,
  currentThickness,
  currentSlug,
  densityOptions,
  thicknessOptionsMap,
  mode = 'card',
}: ProductVariantSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const variantOpen = searchParams?.get('variant') === 'open';

  const [isOpen, setIsOpen] = useState(variantOpen);
  const [activeDensity, setActiveDensity] = useState(currentDensity);
  const [selectedThickness, setSelectedThickness] = useState<number | null>(currentThickness ?? null);

  useEffect(() => {
    setIsOpen(variantOpen);
  }, [variantOpen]);

  useEffect(() => {
    setActiveDensity(currentDensity);
    setSelectedThickness(currentThickness ?? null);
  }, [currentDensity, currentThickness]);

  const activeThicknessOptions = thicknessOptionsMap[activeDensity] ?? [];
  const hasAvailable = activeThicknessOptions.some((item) => item.available && item.slug);

  const openModal = () => {
    ensureVariantQuery();
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    removeVariantQuery();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const ensureVariantQuery = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (params.get('variant') !== 'open') {
      params.set('variant', 'open');
      const query = params.toString();
      router.replace(`${pathname}?${query}`, { scroll: false });
    }
  };

  const removeVariantQuery = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete('variant');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleDensityChange = (density: string) => {
    setActiveDensity(density);
    const options = thicknessOptionsMap[density] ?? [];
    const preferred = options.find((item) => item.slug === currentSlug) ?? options.find((item) => item.available && item.slug) ?? options[0];
    setSelectedThickness(preferred ? preferred.thickness : null);
  };

  const handleSelect = (slug: string | null, density: string, thickness: number) => {
    if (!slug) {
      return;
    }
    setActiveDensity(density);
    setSelectedThickness(thickness);
    ensureVariantQuery();
    if (slug !== currentSlug) {
      router.replace(`/${regionSlug}/catalog/${slug}?variant=open`, { scroll: false });
    }
  };

  const summary =
    mode === 'card' ? (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Текущая конфигурация</p>
          <p className="text-xl font-semibold text-gray-900">
            {currentDensity} • {currentThickness} мм
          </p>
          <p className="text-sm text-gray-500 mt-1">Выбирайте плотность и толщину из доступных для региона вариантов.</p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-navy-900 text-white font-semibold shadow-lg hover:bg-navy-800 transition"
        >
          Выбрать другой вариант
        </button>
      </div>
    ) : (
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Вариант товара</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {currentDensity} • {currentThickness} мм
            </span>
            <span className="text-xs text-gray-500">Доступные плотности и толщины по региону</span>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-navy-900 text-sm font-medium text-navy-900 hover:bg-navy-900 hover:text-white transition"
          >
            Выбрать вариант
          </button>
        </div>
      </div>
    );

  return (
    <>
      {summary}

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/60" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Выбор конфигурации</p>
                <h2 className="text-xl font-semibold text-gray-900 mt-1">Плотность и толщина блока</h2>
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

            <div className="px-6 pb-6 pt-4 space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Плотность</p>
                <div className="flex flex-wrap gap-2">
                  {densityOptions.map((option) => {
                    const isActive = option.density === activeDensity;
                    const densityHasAvailable = (thicknessOptionsMap[option.density] ?? []).some((item) => item.available && item.slug);

                    return (
                      <button
                        key={option.density}
                        type="button"
                        onClick={() => handleDensityChange(option.density)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                          isActive
                            ? 'border-navy-500 bg-navy-50 text-navy-700 shadow-sm'
                            : densityHasAvailable
                            ? 'border-gray-200 text-gray-700 hover:border-navy-300 hover:text-navy-600'
                            : 'border-dashed border-gray-200 text-gray-400'
                        }`}
                      >
                        {option.density}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Толщина</p>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                      hasAvailable ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-gray-200 text-gray-500 bg-gray-50'
                    }`}
                  >
                    {hasAvailable ? 'Доступно' : 'Нет в наличии'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeThicknessOptions.length > 0 ? (
                    activeThicknessOptions.map((variant) => {
                      const isSelected = selectedThickness === variant.thickness;

                      if (!variant.slug || !variant.available) {
                        return (
                          <button
                            key={`${activeDensity}-${variant.thickness}`}
                            disabled
                            className="px-4 py-2 rounded-xl border border-dashed border-gray-200 text-gray-400 bg-gray-50 text-sm cursor-not-allowed"
                          >
                            {variant.thickness} мм
                          </button>
                        );
                      }

                      return (
                        <button
                          key={`${activeDensity}-${variant.thickness}`}
                          type="button"
                          onClick={() => handleSelect(variant.slug, activeDensity, variant.thickness)}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                            isSelected
                              ? 'border-navy-500 bg-navy-50 text-navy-700 shadow-sm'
                              : 'border-gray-200 text-gray-700 hover:border-navy-300 hover:text-navy-600'
                          }`}
                        >
                          <span>{variant.thickness} мм</span>
                          {!variant.inStock && !isSelected ? (
                            <span className="block text-[11px] text-gray-400 font-normal">Нет в наличии</span>
                          ) : null}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-500">
                      В этой плотности пока нет предложений. Свяжитесь с менеджером для подбора альтернативы.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

