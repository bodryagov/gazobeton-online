import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Валидные регионы (дублируем из data/regions, чтобы избежать проблем с импортом в proxy)
const validRegions = ['moscow', 'spb', 'ufa', 'samara'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Пропускаем статические файлы и API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Если первый сегмент пути — это регион, проверяем его валидность
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];
    
    // Если это валидный регион — продолжаем
    if (validRegions.includes(firstSegment)) {
      return NextResponse.next();
    }
    
    // Если это стандартный путь (calculator, catalog, faq и т.д.) — продолжаем
    const excludedPaths = ['calculator', 'catalog', 'faq', 'construction', 'delivery', 'contacts'];
    if (excludedPaths.includes(firstSegment)) {
      return NextResponse.next();
    }
  }

  // Для всех остальных путей (включая главную) продолжаем
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Исключаем статические файлы и API
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
