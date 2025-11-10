'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSelectedRegion, isValidRegion } from '@/lib/region';

interface CatalogRegionGateProps {
  children: React.ReactNode;
}

export default function CatalogRegionGate({ children }: CatalogRegionGateProps) {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const region = getSelectedRegion();

    if (isValidRegion(region)) {
      router.replace(`/${region}/catalog`);
      return;
    }

    setShouldRender(true);
  }, [router]);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}

