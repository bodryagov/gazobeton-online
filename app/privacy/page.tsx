import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | Газобетон Online',
  description: 'Политика конфиденциальности и пользовательское соглашение. Обработка персональных данных в соответствии с ФЗ-152.',
  alternates: {
    canonical: 'https://gazobeton-online.ru/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Политика конфиденциальности' },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Политика конфиденциальности
        </h1>
        <p className="text-gray-600 mb-8">
          (Пользовательское соглашение)
        </p>

        <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-sm p-6 md:p-8">
          <p className="text-gray-700 leading-relaxed mb-6">
            Я, субъект персональных данных, в соответствии с Федеральным законом от 27 июля 2006 года № 152 «О персональных данных» предоставляю <strong>ООО «ОСНОВНОЙ ПОСТАВЩИК»</strong> (далее — Оператор), расположенному по адресу: <strong>443035 г. Самара, пр. Кирова, 130, 1 этаж, офис 1</strong>, согласие на обработку персональных данных, указанных мной в форме веб-чата и/или в форме заказа обратного звонка на сайте в сети «Интернет», владельцем которого является Оператор.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Состав предоставляемых персональных данных
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Состав предоставляемых мной персональных данных является следующим: <strong>ФИО, адрес электронной почты и номер телефона</strong>.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Цели обработки персональных данных
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Целями обработки моих персональных данных являются:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
            <li>обеспечение обмена короткими текстовыми сообщениями в режиме онлайн-диалога;</li>
            <li>обеспечение функционирования обратного звонка.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Действия с персональными данными
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Согласие предоставляется на совершение следующих действий (операций) с указанными в настоящем согласии персональными данными: <strong>сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, передачу (предоставление, доступ), блокирование, удаление, уничтожение</strong>, осуществляемых как с использованием средств автоматизации (автоматизированная обработка), так и без использования таких средств (неавтоматизированная обработка).
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Ограничения
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Я понимаю и соглашаюсь с тем, что предоставление Оператору какой-либо информации о себе, не являющейся контактной и не относящейся к целям настоящего согласия, а равно предоставление информации, относящейся к государственной, банковской и/или коммерческой тайне, информации о расовой и/или национальной принадлежности, политических взглядах, религиозных или философских убеждениях, состоянии здоровья, интимной жизни запрещено.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Достоверность данных
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            В случае принятия мной решения о предоставлении Оператору какой-либо информации (каких-либо данных), я обязуюсь предоставлять исключительно достоверную и актуальную информацию и не вправе вводить Оператора в заблуждение в отношении своей личности, сообщать ложную или недостоверную информацию о себе.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Я понимаю и соглашаюсь с тем, что Оператор не проверяет достоверность персональных данных, предоставляемых мной, и не имеет возможности оценивать мою дееспособность и исходит из того, что я предоставляю достоверные персональные данные и поддерживаю такие данные в актуальном состоянии.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Срок действия согласия
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Согласие действует по достижении целей обработки или в случае утраты необходимости в достижении этих целей, если иное не предусмотрено федеральным законом.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Отзыв согласия
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Согласие может быть отозвано мной в любое время на основании моего письменного заявления.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Дата последнего обновления: 12 ноября 2025 г.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contacts"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Вернуться к контактам
          </Link>
        </div>
      </div>
    </main>
  );
}

