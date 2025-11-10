import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Каталог газобетонных блоков — Купить газобетон | Газобетон Online',
  description: 'Большой выбор газобетонных блоков от проверенных производителей. Ytong, Bonolit, Коттедж и другие. Актуальные цены, наличие на складе.',
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

