import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getRegionConfig, validRegions } from '@/data/regions';
import RegionSync from '@/components/RegionSync';
import CalculatorPageContent from '@/components/calculator/CalculatorPageContent';

interface RegionCalculatorPageParams {
  region: string;
}

interface RequestContext {
  params: Promise<RegionCalculatorPageParams>;
}

export async function generateStaticParams() {
  return validRegions.map((region) => ({ region }));
}

export async function generateMetadata({ params }: RequestContext): Promise<Metadata> {
  const { region } = await params;
  const regionConfig = getRegionConfig(region);

  if (!regionConfig) {
    return {
      title: 'Регион не найден | Газобетон Online',
    };
  }

  const title = `Калькулятор газобетона ${regionConfig.nameGenitive} — расчёт блоков | Газобетон Online`;
  const description = `Рассчитайте количество газобетонных блоков и примерную стоимость доставки ${regionConfig.namePrepositional}. Учитываем проёмы, фронтоны и перегородки.`;
  const canonical = `https://gazobeton-online.ru/${regionConfig.slug}/calculator`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Газобетон Online',
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function RegionCalculatorPage({ params }: RequestContext) {
  const { region } = await params;
  const regionConfig = getRegionConfig(region);

  if (!regionConfig) {
    notFound();
  }

  return (
    <>
      <RegionSync regionSlug={regionConfig.slug} />
      <CalculatorPageContent regionConfig={regionConfig} />
    </>
  );
}

