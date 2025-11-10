import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtonWrapper from "@/components/FloatingButtonWrapper";

export const metadata: Metadata = {
  title: "Газобетон Online — Купить газобетонные блоки с доставкой | Каталог производителей",
  description: "Большой выбор газобетонных блоков от ведущих производителей. Помощь в подборе, калькулятор расчета, доставка по России. Гарантия лучшей цены!",
  alternates: {
    canonical: "https://gazobeton-online.ru",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased font-sans bg-white text-gray-900">
        <Header />
        {children}
        <Footer />
        <FloatingButtonWrapper />
      </body>
    </html>
  );
}

