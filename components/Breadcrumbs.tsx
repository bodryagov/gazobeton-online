import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: string;
}

export default function Breadcrumbs({
  items,
  className = '',
  separator = '/',
}: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Хлебные крошки"
      className={`flex items-center text-sm text-gray-600 ${className}`}
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span
            key={`${item.label}-${index}`}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}

            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-orange-500" itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-900" itemProp="name">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={(index + 1).toString()} />
          </span>
        );
      })}
    </nav>
  );
}

