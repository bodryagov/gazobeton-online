import React from 'react';

// Тип для FAQ
export interface FAQItem {
  question: string;
  answer: string;
}

// Тип для статьи
export interface Article {
  title: string;
  description: string;
  intro?: string;
  content: React.JSX.Element;
  rawContent?: string; // Raw markdown content для извлечения FAQ и расчёта времени чтения
  datePublished?: string; // ISO 8601: "2025-11-12"
  dateModified?: string; // ISO 8601: "2025-11-12"
  keywords?: string[]; // ['утепление газобетона', 'газобетон утепление']
  image?: string; // '/images/article-image.jpg'
  readingTime?: number; // минуты (автоматически рассчитывается из rawContent, если не указано)
  faq?: FAQItem[]; // Для Schema.org FAQ (автоматически извлекается из rawContent, если не указано)
  relatedArticles?: string[]; // slugs связанных статей
}

// Импортируем статьи из отдельных файлов
import { article as uteplenieGazobetona } from './articles/uteplenie-gazobetona';
import { article as vyborGazobetona } from './articles/vybor-gazobetona';
import { article as gazobetonVSravnenii } from './articles/gazobeton-v-sravnenii';
import { article as kladkaGazobetona } from './articles/kladka-gazobetona';
import { article as banjaIzGazobloka } from './articles/banja-iz-gazobloka';
import { article as fundamentDljaGazobetona } from './articles/fundament-dlja-gazobetona';
import { article as armirovanieIPeremychki } from './articles/armirovanie-i-peremychki';
import { article as kalkulyatorGazobetona } from './articles/kalkulyator-gazobetona';
import { article as proektDoma10x10 } from './articles/proekt-doma-10x10';
import { article as uteplenieIliNet } from './articles/uteplenie-ili-net';
import { article as skolkoBlokovNado } from './articles/skolko-blokov-nado';
import { article as zashitaOtVlagi } from './articles/zashita-ot-vlagi';
import { article as hranenieIZima } from './articles/hranenie-i-zima';
import { article as instrumentyDljaGazobetona } from './articles/instrumenty-dlja-gazobetona';
import { article as dostavkaIHranenije } from './articles/dostavka-i-hranenije';
import { article as hozpostrojkiIzGazobetona } from './articles/hozpostrojki-iz-gazobetona';
import { article as samovyvozIManipulyator } from './articles/samovyvoz-i-manipulyator';
import { article as montazhBonolit } from './articles/montazh-bonolit';

// Объект со всеми статьями
const articles: Record<string, Article> = {
  'uteplenie-gazobetona': uteplenieGazobetona,
  'vybor-gazobetona': vyborGazobetona,
  'gazobeton-v-sravnenii': gazobetonVSravnenii,
  'kladka-gazobetona': kladkaGazobetona,
  'banja-iz-gazobloka': banjaIzGazobloka,
  'fundament-dlja-gazobetona': fundamentDljaGazobetona,
  'armirovanie-i-peremychki': armirovanieIPeremychki,
  'kalkulyator-gazobetona': kalkulyatorGazobetona,
  'proekt-doma-10x10': proektDoma10x10,
  'uteplenie-ili-net': uteplenieIliNet,
  'skolko-blokov-nado': skolkoBlokovNado,
  'zashita-ot-vlagi': zashitaOtVlagi,
  'hranenie-i-zima': hranenieIZima,
  'instrumenty-dlja-gazobetona': instrumentyDljaGazobetona,
  'dostavka-i-hranenije': dostavkaIHranenije,
  'hozpostrojki-iz-gazobetona': hozpostrojkiIzGazobetona,
  'samovyvoz-i-manipulyator': samovyvozIManipulyator,
  'montazh-bonolit': montazhBonolit,
};

export function getArticleContent(slug: string): Article | null {
  return articles[slug] || null;
}
