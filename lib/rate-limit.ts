// Простой rate limiting на основе IP-адреса
// Хранит данные в памяти (для продакшена лучше использовать Redis)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Очистка старых записей каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetTime < now) {
    // Создаём новую запись
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    // Превышен лимит
    return false;
  }

  // Увеличиваем счётчик
  entry.count++;
  return true;
}

export function getRateLimitInfo(ip: string): { remaining: number; resetTime: number } | null {
  const entry = rateLimitStore.get(ip);
  if (!entry || entry.resetTime < Date.now()) {
    return null;
  }
  return {
    remaining: Math.max(0, 5 - entry.count),
    resetTime: entry.resetTime,
  };
}

