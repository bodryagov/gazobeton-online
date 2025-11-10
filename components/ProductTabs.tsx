'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface ProductTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: Record<string, React.ReactNode>;
}

export default function ProductTabs({ tabs, defaultTab, children }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <>
      <div className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-[72px] z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-6 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative text-sm font-semibold tracking-wide uppercase transition-colors pb-2 ${
                  activeTab === tab.id
                    ? 'text-orange-600'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-10">
        {children[activeTab] || null}
      </div>
    </>
  );
}
