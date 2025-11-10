import type { Metadata } from "next";
import { getRegionConfig } from "@/data/regions";

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params;
  const regionConfig = getRegionConfig(region);
  
  if (!regionConfig) {
    return {
      title: "Регион не найден | Газобетон Online",
    };
  }

  const title = `Газобетонные блоки ${regionConfig.seo?.titleSuffix || regionConfig.nameGenitive} | Газобетон Online`;
  const description = regionConfig.seo?.description || `Каталог газобетонных блоков ${regionConfig.nameGenitive}. Доставка, цены, наличие.`;
  const url = `https://gazobeton-online.ru/${regionConfig.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
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

export default function RegionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Header и Footer уже есть в корневом layout (app/layout.tsx)
  // Не дублируем их здесь
  return <>{children}</>;
}

