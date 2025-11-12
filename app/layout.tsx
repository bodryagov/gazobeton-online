import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtonWrapper from "@/components/FloatingButtonWrapper";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Газобетон Online — Купить газобетонные блоки с доставкой | Каталог производителей",
  description: "Большой выбор газобетонных блоков от ведущих производителей. Помощь в подборе, калькулятор расчета, доставка по России. Гарантия лучшей цены!",
  alternates: {
    canonical: "https://gazobeton-online.ru",
  },
  metadataBase: new URL("https://gazobeton-online.ru"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="antialiased font-sans bg-white text-gray-900">
        <Header />
        {children}
        <Footer />
        <FloatingButtonWrapper />
      </body>
    </html>
  );
}

