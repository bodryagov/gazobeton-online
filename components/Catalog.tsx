'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Типы
export interface Product {
  id: number;
  name: string;
  brand: string;
  brandName: string;
  thickness: number;
  density: string;
  price: number;
  pricePerM3: number;
  size: string;
  length: number;
  height: number;
  image: string;
  inStock: boolean;
  description: string;
  purpose: string;
  useCases: string[];
  isPopular: boolean;
  slug?: string;
  regionsAvailable?: string[];
}

interface Filters {
  brand: string[];
  thickness: string[];
  density: string[];
  size: string[];
  useCase: string[];
  popular: boolean;
  inStockOnly: boolean;
}

type ArrayFilterKey = 'brand' | 'thickness' | 'density' | 'size' | 'useCase';
type FilterSectionId = ArrayFilterKey;

type SortOption = 'default' | 'popularity' | 'priceAsc' | 'priceDesc' | 'availability';

interface CatalogProps {
  products: Product[];
  showLimit?: number;
  showFullCatalogLink?: boolean;
  showFilters?: boolean;
  regionSlug?: string;
  defaultPopularOnly?: boolean;
}

function createEmptyFilters(defaults: Partial<Filters> = {}): Filters {
  return {
    brand: [],
    thickness: [],
    density: [],
    size: [],
    useCase: [],
    popular: defaults.popular ?? false,
    inStockOnly: defaults.inStockOnly ?? false,
  };
}

const USE_CASE_ORDER = [
  'Для несущих стен дома',
  'Для наружных стен дома без утепления',
  'Для бани или гаража',
  'Для хоз.построек',
  'Для заполнения проемов',
] as const;

type UseCaseValue = (typeof USE_CASE_ORDER)[number];
type UseCaseFilterOption = { value: UseCaseValue; label: UseCaseValue; count: number };

// Данные о товарах (в будущем из API)
export const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Istkult (Ytong) D400 300 мм',
    brand: 'istkult-ytong',
    brandName: 'Istkult (Ytong)',
    thickness: 300,
    density: 'D400',
    price: 0,
    pricePerM3: 0,
    size: '625×300×250',
    length: 625,
    height: 250,
    image: '/products/istkult-ytong/wall.jpg',
    inStock: true,
    description: 'Немецкая точность геометрии для быстрой кладки',
    purpose: 'Стеновые блоки',
    useCases: [
      'Для несущих стен дома',
      'Для бани или гаража',
      'Для хоз.построек',
    ],
    isPopular: false,
    regionsAvailable: [],
  },
  {
    id: 2,
    name: 'Bonolit D500 300 мм',
    brand: 'bonolit',
    brandName: 'Bonolit',
    thickness: 300,
    density: 'D500',
    price: 0,
    pricePerM3: 0,
    size: '600×300×250',
    length: 600,
    height: 250,
    image: '/products/bonolit/wall.jpg',
    inStock: true,
    description: 'Крупнейший российский производитель газобетона',
    purpose: 'Стеновые блоки',
    useCases: [
      'Для несущих стен дома',
      'Для бани или гаража',
      'Для хоз.построек',
    ],
    isPopular: true,
    regionsAvailable: [],
  },
  {
    id: 3,
    name: 'Poritep D400 400 мм',
    brand: 'poritep',
    brandName: 'Poritep',
    thickness: 400,
    density: 'D400',
    price: 0,
    pricePerM3: 0,
    size: '625×400×250',
    length: 625,
    height: 250,
    image: '/products/poritep/wall.jpg',
    inStock: true,
    description: 'Оптимальное соотношение прочности и теплосбережения',
    purpose: 'Стеновые блоки',
    useCases: [
      'Для наружных стен дома без утепления',
      'Для несущих стен дома',
      'Для бани или гаража',
      'Для хоз.построек',
    ],
    isPopular: true,
    regionsAvailable: [],
  },
  {
    id: 4,
    name: 'Коттедж D500 200 мм',
    brand: 'kottezh',
    brandName: 'Коттедж',
    thickness: 200,
    density: 'D500',
    price: 0,
    pricePerM3: 0,
    size: '625×200×250',
    length: 625,
    height: 250,
    image: '/products/kottezh/wall.jpg',
    inStock: true,
    description: 'Распространённое решение для несущих стен',
    purpose: 'Стеновые блоки',
    useCases: [
      'Для несущих стен дома',
      'Для бани или гаража',
      'Для хоз.построек',
    ],
    isPopular: false,
    regionsAvailable: [],
  },
  {
    id: 5,
    name: 'ГРАС D600 150 мм',
    brand: 'gras',
    brandName: 'ГРАС',
    thickness: 150,
    density: 'D600',
    price: 0,
    pricePerM3: 0,
    size: '600×150×250',
    length: 600,
    height: 250,
    image: '/products/gras/partition.jpg',
    inStock: true,
    description: 'Прочные перегородочные блоки для внутренних стен',
    purpose: 'Перегородочные блоки',
    useCases: ['Для заполнения проемов'],
    isPopular: false,
    regionsAvailable: [],
  },
  {
    id: 6,
    name: 'Теплон D600 100 мм',
    brand: 'teplon',
    brandName: 'Теплон',
    thickness: 100,
    density: 'D600',
    price: 0,
    pricePerM3: 0,
    size: '600×100×250',
    length: 600,
    height: 250,
    image: '/products/teplon/partition.jpg',
    inStock: true,
    description: 'Энергоэффективные решения для лёгких перегородок',
    purpose: 'Перегородочные блоки',
    useCases: ['Для заполнения проемов'],
    isPopular: true,
    regionsAvailable: [],
  },
];

export default function Catalog({ 
  products = defaultProducts, 
  showLimit = 12,
  showFullCatalogLink = false,
  showFilters = true,
  regionSlug,
  defaultPopularOnly = false,
}: CatalogProps) {
  const [filters, setFilters] = useState<Filters>(() =>
    createEmptyFilters({ popular: defaultPopularOnly })
  );
  const [displayCount, setDisplayCount] = useState(showLimit);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [openSections, setOpenSections] = useState<Record<FilterSectionId, boolean>>({
    brand: true,
    thickness: true,
    density: false,
    size: false,
    useCase: false,
  });

  const toggleSection = (section: FilterSectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetDisplayCount = () => {
    setDisplayCount(showLimit);
  };

useEffect(() => {
  setDisplayCount(showLimit);
}, [showLimit]);

useEffect(() => {
  setDisplayCount(showLimit);
}, [products, showLimit]);

useEffect(() => {
  if (!defaultPopularOnly) {
    return;
  }

  setFilters((prev) => {
    if (prev.popular) {
      return prev;
    }

    return {
      ...prev,
      popular: true,
    };
  });
}, [defaultPopularOnly, regionSlug]);

  const densityToNumber = (value: string) => {
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
  };

  const filterOptions = useMemo(() => {
    const brandMap = new Map<string, { label: string; count: number }>();
    const thicknessMap = new Map<number, number>();
    const densityMap = new Map<string, number>();
    const sizeMap = new Map<
      string,
      { count: number; thickness: number; height: number }
    >();
    const useCaseMap = new Map<string, number>();
    let popularCount = 0;
    let inStockCount = 0;

    products.forEach((product) => {
      if (product.isPopular) {
        popularCount += 1;
      }

      if (product.inStock) {
        inStockCount += 1;
      }

      const brandStats = brandMap.get(product.brand);
      if (brandStats) {
        brandStats.count += 1;
      } else {
        brandMap.set(product.brand, { label: product.brandName, count: 1 });
      }

      thicknessMap.set(
        product.thickness,
        (thicknessMap.get(product.thickness) ?? 0) + 1
      );

      densityMap.set(
        product.density,
        (densityMap.get(product.density) ?? 0) + 1
      );

      sizeMap.set(product.size, {
        count: (sizeMap.get(product.size)?.count ?? 0) + 1,
        thickness: product.thickness,
        height: product.height,
      });

      product.useCases.forEach((useCase) => {
        useCaseMap.set(useCase, (useCaseMap.get(useCase) ?? 0) + 1);
      });
    });

    return {
      brands: Array.from(brandMap.entries())
        .map(([value, { label, count }]) => ({ value, label, count }))
        .sort((a, b) => a.label.localeCompare(b.label, 'ru')),
      thicknesses: Array.from(thicknessMap.entries())
        .map(([value, count]) => ({ value, label: `${value} мм`, count }))
        .sort((a, b) => a.value - b.value),
      densities: Array.from(densityMap.entries())
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => densityToNumber(a.value) - densityToNumber(b.value)),
      sizes: Array.from(sizeMap.entries())
        .map(([value, meta]) => ({
          value,
          label: `${value} мм`,
          count: meta.count,
          thickness: meta.thickness,
          height: meta.height,
        }))
        .sort((a, b) => {
          if (a.thickness !== b.thickness) {
            return a.thickness - b.thickness;
          }
          return a.height - b.height;
        }),
      useCases: USE_CASE_ORDER.map((label): UseCaseFilterOption | null => {
        const count = useCaseMap.get(label);
        if (!count) return null;
        return { value: label, label, count };
      }).filter((item): item is UseCaseFilterOption => item !== null),
      popularCount,
      inStockCount,
    };
  }, [products]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.brand.length > 0 ||
      filters.thickness.length > 0 ||
      filters.density.length > 0 ||
      filters.size.length > 0 ||
      filters.useCase.length > 0 ||
      filters.popular ||
      filters.inStockOnly
    );
  }, [filters]);

  // Фильтрация товаров (множественный выбор)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      if (
        filters.thickness.length > 0 &&
        !filters.thickness.includes(product.thickness.toString())
      ) {
        return false;
      }

      if (
        filters.density.length > 0 &&
        !filters.density.includes(product.density)
      ) {
        return false;
      }

      if (filters.size.length > 0 && !filters.size.includes(product.size)) {
        return false;
      }

      if (
        filters.useCase.length > 0 &&
        !filters.useCase.some((useCase) => product.useCases.includes(useCase))
      ) {
        return false;
      }

      if (filters.popular && !product.isPopular) {
        return false;
      }

      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

    return true;
  });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    switch (sortOption) {
      case 'popularity':
        return [...filteredProducts].sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return a.name.localeCompare(b.name, 'ru');
        });
      case 'priceAsc':
        return [...filteredProducts].sort((a, b) => a.pricePerM3 - b.pricePerM3);
      case 'priceDesc':
        return [...filteredProducts].sort((a, b) => b.pricePerM3 - a.pricePerM3);
      case 'availability':
        return [...filteredProducts].sort((a, b) => Number(b.inStock) - Number(a.inStock));
      default:
        return [...filteredProducts].sort((a, b) => {
          const inStockDiff = Number(b.inStock) - Number(a.inStock);
          if (inStockDiff !== 0) return inStockDiff;
          return a.name.localeCompare(b.name, 'ru');
        });
    }
  }, [filteredProducts, sortOption]);

  const displayedProducts = sortedProducts.slice(
    0,
    Math.min(displayCount, sortedProducts.length)
  );
  const handleFilterChange = (filterType: ArrayFilterKey, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[filterType];
      const isSelected = currentArray.includes(value);
      
      return {
        ...prev,
        [filterType]: isSelected
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
    resetDisplayCount();
  };

  const togglePopular = () => {
    setFilters((prev) => ({
      ...prev,
      popular: !prev.popular,
    }));
    resetDisplayCount();
  };

  const toggleInStockOnly = () => {
    setFilters((prev) => ({
      ...prev,
      inStockOnly: !prev.inStockOnly,
    }));
    resetDisplayCount();
  };

  const clearFilters = () => {
    setFilters(createEmptyFilters());
    resetDisplayCount();
  };

  return (
    <div id="catalog-filters" className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Фильтры */}
          {showFilters && (
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm sticky top-24 flex flex-col max-h-[calc(100vh-6rem)] overflow-hidden">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b">
                <h2 className="text-xl font-semibold">Фильтры</h2>
                  {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    Сбросить
                  </button>
                )}
              </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                  {(filterOptions.popularCount > 0 || filterOptions.inStockCount > 0) && (
                    <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 space-y-3">
                      {filterOptions.popularCount > 0 && (
                        <label className="flex items-center justify-between gap-3 cursor-pointer text-sm font-medium text-gray-900">
                          <span className="flex items-center flex-1">
                            <input
                              type="checkbox"
                              checked={filters.popular}
                              onChange={togglePopular}
                              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="ml-3">Популярные</span>
                          </span>
                          <span className="text-xs text-gray-500">
                            {filterOptions.popularCount}
                          </span>
                        </label>
                      )}
                      {filterOptions.inStockCount > 0 && (
                        <label className="flex items-center justify-between gap-3 cursor-pointer text-sm font-medium text-gray-900">
                          <span className="flex items-center flex-1">
                            <input
                              type="checkbox"
                              checked={filters.inStockOnly}
                              onChange={toggleInStockOnly}
                              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="ml-3">В наличии</span>
                          </span>
                          <span className="text-xs text-gray-500">
                            {filterOptions.inStockCount}
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                  {[
                    {
                      id: 'brand' as FilterSectionId,
                      title: 'Производитель',
                      hasContent: filterOptions.brands.length > 0,
                      content: (
                        <div className="space-y-3">
                          {filterOptions.brands.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <span className="flex items-center flex-1">
                                <input
                                  type="checkbox"
                                  checked={filters.brand.includes(option.value)}
                                  onChange={() =>
                                    handleFilterChange('brand', option.value)
                                  }
                                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                />
                                <span className="ml-3">{option.label}</span>
                              </span>
                              <span className="text-xs text-gray-400">
                                {option.count}
                              </span>
                            </label>
                          ))}
                        </div>
                      ),
                    },
                    {
                      id: 'thickness' as FilterSectionId,
                      title: 'Толщина блока',
                      hasContent: filterOptions.thicknesses.length > 0,
                      content: (
                        <div className="space-y-3">
                          {filterOptions.thicknesses.map((option) => {
                            const thicknessValue = option.value.toString();
                            return (
                              <label
                                key={thicknessValue}
                                className="flex items-center justify-between gap-3 cursor-pointer"
                              >
                                <span className="flex items-center flex-1">
                                  <input
                                    type="checkbox"
                                    checked={filters.thickness.includes(
                                      thicknessValue
                                    )}
                                    onChange={() =>
                                      handleFilterChange(
                                        'thickness',
                                        thicknessValue
                                      )
                                    }
                                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                  />
                                  <span className="ml-3">{option.label}</span>
                                </span>
                                <span className="text-xs text-gray-400">
                                  {option.count}
                                </span>
                              </label>
                            );
                          })}
                </div>
                      ),
                    },
                    {
                      id: 'density' as FilterSectionId,
                      title: 'Плотность',
                      hasContent: filterOptions.densities.length > 0,
                      content: (
                        <div className="space-y-3">
                          {filterOptions.densities.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <span className="flex items-center flex-1">
                        <input 
                          type="checkbox"
                                  checked={filters.density.includes(option.value)}
                                  onChange={() =>
                                    handleFilterChange('density', option.value)
                                  }
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                                <span className="ml-3">{option.label}</span>
                              </span>
                              <span className="text-xs text-gray-400">
                                {option.count}
                              </span>
                      </label>
                    ))}
                  </div>
                      ),
                    },
                    {
                      id: 'size' as FilterSectionId,
                      title: 'Размер блока',
                      hasContent: filterOptions.sizes.length > 0,
                      content: (
                        <div className="space-y-3">
                          {filterOptions.sizes.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <span className="flex items-center flex-1">
                                <input
                                  type="checkbox"
                                  checked={filters.size.includes(option.value)}
                                  onChange={() =>
                                    handleFilterChange('size', option.value)
                                  }
                                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                />
                                <span className="ml-3">{option.label}</span>
                              </span>
                              <span className="text-xs text-gray-400">
                                {option.count}
                              </span>
                            </label>
                          ))}
                </div>
                      ),
                    },
                    {
                      id: 'useCase' as FilterSectionId,
                      title: 'Назначение',
                      hasContent: filterOptions.useCases.length > 0,
                      content: (
                        <div className="space-y-3">
                          {filterOptions.useCases.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <span className="flex items-center flex-1">
                        <input 
                          type="checkbox"
                                  checked={filters.useCase.includes(
                                    option.value
                                  )}
                                  onChange={() =>
                                    handleFilterChange('useCase', option.value)
                                  }
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                                <span className="ml-3">{option.label}</span>
                              </span>
                              <span className="text-xs text-gray-400">
                                {option.count}
                              </span>
                      </label>
                          ))}
                        </div>
                      ),
                    },
                  ]
                    .filter((section) => section.hasContent)
                    .map((section, index, array) => (
                      <div
                        key={section.id}
                        className={`border-b border-gray-100 pb-4 ${
                          index === array.length - 1 ? 'border-b-0 pb-0' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-900"
                          aria-expanded={openSections[section.id]}
                        >
                          <span>{section.title}</span>
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              openSections[section.id] ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {openSections[section.id] && (
                          <div className="mt-3 space-y-2">
                            {section.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={clearFilters}
                    className="w-full text-sm font-medium text-orange-500 hover:text-orange-600"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* Список товаров */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Сортировка и количество */}
            {showFilters && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Найдено товаров: <span className="font-semibold">{filteredProducts.length}</span>
                </p>
                <select
                  value={sortOption}
                  onChange={(event) => {
                    const value = event.target.value as SortOption;
                    setSortOption(value);
                    resetDisplayCount();
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="default">По умолчанию</option>
                  <option value="popularity">По популярности</option>
                  <option value="priceAsc">Сначала дешевле</option>
                  <option value="priceDesc">Сначала дороже</option>
                  <option value="availability">По наличию</option>
                </select>
              </div>
            )}

            {/* Карточки товаров */}
            {displayedProducts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => {
                    const blockVolume =
                      (product.length / 1000) *
                      (product.thickness / 1000) *
                      (product.height / 1000);
                    const rawPricePerPiece =
                      product.pricePerM3 > 0 && blockVolume > 0
                        ? product.pricePerM3 * blockVolume
                        : null;
                    const pricePerPiece =
                      rawPricePerPiece !== null
                        ? Math.round(rawPricePerPiece * 10) / 10
                        : null;
                    const isClickable = Boolean(regionSlug && product.slug);

                    return (
                    <Link
                      key={product.id}
                        href={isClickable ? `/${regionSlug}/catalog/${product.slug}` : '#'}
                        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden block ${isClickable ? '' : 'pointer-events-none opacity-80'}`}
                    >
                        <div className="relative h-48 bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                          {regionSlug && !product.inStock && (
                          <div className="absolute top-2 right-2 z-10 bg-gray-500 text-white text-xs px-3 py-1 rounded-full">
                            Нет в наличии
                          </div>
                        )}
                        <Image
                          src={product.image}
                          alt={`Газобетон ${product.brandName} ${product.density} толщиной ${product.thickness} мм`}
                          fill
                          className="object-contain"
                          sizes="(min-width: 1280px) 300px, (min-width: 768px) 45vw, 100vw"
                        />
                      </div>

                      <div className="p-5">
                          <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            {product.name}
                          </h3>
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <p>Размер: {product.size} мм</p>
                          <p>Плотность: {product.density}</p>
                          <p>Толщина: {product.thickness} мм</p>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-end justify-between mb-3">
                            <div>
                                <p className="text-sm text-gray-500">{regionSlug ? 'Цена за м³' : 'Цена от'}</p>
                                <p className={`text-2xl font-bold ${product.pricePerM3 > 0 ? 'text-orange-500' : 'text-gray-500'}`}>
                                  {product.pricePerM3 > 0 ? `${product.pricePerM3.toLocaleString('ru-RU')} ₽` : 'Цена по запросу'}
                              </p>
                                {pricePerPiece !== null && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    ≈{' '}
                                    {pricePerPiece.toLocaleString('ru-RU', {
                                      minimumFractionDigits: pricePerPiece % 1 === 0 ? 0 : 1,
                                      maximumFractionDigits: 1,
                                    })}{' '}
                                    ₽ за блок
                                  </p>
                                )}
                              </div>
                              {regionSlug && (
                                <span
                                  className={`text-sm font-medium ${
                                    product.inStock ? 'text-green-600' : 'text-gray-500'
                                  }`}
                                >
                                  {product.inStock ? 'В наличии' : 'Под заказ'}
                                </span>
                            )}
                          </div>
                          
                          <span
                            className={`inline-flex items-center justify-center w-full py-3 rounded-lg font-medium transition ${
                                regionSlug
                                  ? product.inStock
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-gray-200 text-gray-500'
                                  : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                              {regionSlug
                                ? product.inStock
                                  ? 'Подробнее'
                                  : 'Нет в наличии'
                                : 'Подробнее'}
                          </span>
                        </div>
                      </div>
                    </Link>
                    );
                  })}
                </div>

                {/* Кнопки пагинации */}
                {filteredProducts.length > displayCount && (
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() =>
                        setDisplayCount((prev) =>
                          Math.min(prev + showLimit, filteredProducts.length)
                        )
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Показать больше
                    </button>
                    <button
                      onClick={() => setDisplayCount(filteredProducts.length)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Показать все
                    </button>
                  </div>
                )}

                {/* Ссылка "Весь каталог" */}
                {showFullCatalogLink && (
                  <div className="text-center mt-8">
                    <Link
                      href="/catalog"
                      className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                    >
                      Весь каталог →
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
                <p className="text-gray-600 mb-4">Попробуйте изменить параметры фильтра</p>
                <button onClick={clearFilters} className="text-orange-500 hover:text-orange-600 font-medium">
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

