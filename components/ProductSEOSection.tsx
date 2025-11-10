'use client';

interface ProductSEOSectionProps {
  title: string;
  paragraphs: string[];
}

export default function ProductSEOSection({ title, paragraphs }: ProductSEOSectionProps) {
  if (!paragraphs.length) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        {paragraphs.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </section>
  );
}


