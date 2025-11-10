import Image from 'next/image';
import Link from 'next/link';

interface RelatedProductItem {
  title: string;
  description: string;
  href: string;
  tag: string;
  imageSrc: string;
  imageAlt: string;
}

const placeholderProducts: RelatedProductItem[] = [
  {
    title: 'Клей для газобетона',
    description: 'Тонкослойные смеси для кладки блоков, расход 18–20 кг на 1 м³.',
    href: '#',
    tag: 'Скоро',
    imageSrc: '/brands/placeholder.svg',
    imageAlt: 'Иконка клея для газобетона',
  },
  {
    title: 'Газобетонные перемычки',
    description: 'Армированные перемычки для оконных и дверных проёмов.',
    href: '#',
    tag: 'В разработке',
    imageSrc: '/brands/placeholder.svg',
    imageAlt: 'Иконка газобетонных перемычек',
  },
];

export default function RelatedProducts() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Сопутствующие товары</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2">Клей и перемычки для монтажа</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Мы готовим каталог клеевых смесей и газобетонных перемычек, чтобы вы могли заказать весь комплект одним пакетом.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-500">
          Список обновляется — скоро добавим товары
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {placeholderProducts.map((item) => (
          <article key={item.title} className="border border-gray-200 rounded-2xl p-5 flex gap-4 bg-gray-50">
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 768px) 64px, 64px"
                className="object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-medium px-3 py-1 whitespace-nowrap">
                  {item.tag}
                </span>
              </div>
              <p className="text-sm text-gray-600 flex-1">{item.description}</p>
              <Link
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-navy-900 hover:text-orange-500 transition"
              >
                Узнать подробнее →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
