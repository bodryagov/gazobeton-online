import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface LeadData {
  name: string;
  phone: string;
  email?: string;
  source: 'quiz' | 'calculator' | 'contact' | 'product' | 'consultation';
  message?: string;
  data?: Record<string, unknown>; // Дополнительные данные (например, из квиза)
}

function formatLeadMessage(data: LeadData): string {
  const sourceNames: Record<string, string> = {
    quiz: 'Квиз подбора',
    calculator: 'Калькулятор',
    contact: 'Форма обратной связи',
    product: 'Заказ товара',
    consultation: 'Консультация',
  };

  let message = `🔔 *Новая заявка: ${sourceNames[data.source] || 'Неизвестный источник'}*\n\n`;
  message += `👤 *Имя:* ${data.name}\n`;
  message += `📞 *Телефон:* ${data.phone}\n`;

  if (data.email) {
    message += `📧 *Email:* ${data.email}\n`;
  }

  if (data.message) {
    message += `\n💬 *Сообщение:*\n${data.message}\n`;
  }

  if (data.data && Object.keys(data.data).length > 0) {
    message += `\n📋 *Дополнительные данные:*\n`;
    for (const [key, value] of Object.entries(data.data)) {
      if (value !== null && value !== undefined && value !== '') {
        message += `• ${key}: ${String(value)}\n`;
      }
    }
  }

  message += `\n⏰ *Время:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

  return message;
}

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured');
      return NextResponse.json(
        { error: 'Telegram bot not configured' },
        { status: 500 }
      );
    }

    const body: LeadData = await request.json();

    // Валидация обязательных полей
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Форматируем сообщение
    const message = formatLeadMessage(body);

    // Отправляем в Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send message to Telegram' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending lead to Telegram:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

