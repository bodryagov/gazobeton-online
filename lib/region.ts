import { validRegions } from '@/data/regions';

// Утилиты для работы с выбранным регионом пользователя

const REGION_STORAGE_KEY = 'gazobeton_selected_region';

/**
 * Получить выбранный регион из localStorage
 */
export function getSelectedRegion(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(REGION_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Сохранить выбранный регион в localStorage
 */
export function setSelectedRegion(regionSlug: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(REGION_STORAGE_KEY, regionSlug);
  } catch {
    // Игнорируем ошибки localStorage
  }
}

/**
 * Очистить выбранный регион
 */
export function clearSelectedRegion(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(REGION_STORAGE_KEY);
  } catch {
    // Игнорируем ошибки localStorage
  }
}

/**
 * Проверить, является ли регион валидным
 */
export function isValidRegion(regionSlug: string | null): boolean {
  if (!regionSlug) return false;
  return validRegions.includes(regionSlug);
}

