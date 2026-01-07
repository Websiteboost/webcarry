import { useState } from 'react';
import type { AccordionContent } from '../../types';

interface Props {
  content: AccordionContent;
}

export default function Accordion({ content }: Props) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h3 className="text-3xl font-bold text-center text-cyber-white mb-6 neon-text uppercase tracking-wide">
        {content.title}
      </h3>

      {/* Accordion Items */}
      <div className="space-y-3">
        {content.items.map((item) => {
          const isOpen = openItemId === item.id;
          
          return (
            <div
              key={item.id}
              className="border border-purple-neon/30 rounded-md overflow-hidden transition-all"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between p-4 bg-purple-dark/30 hover:bg-purple-dark/50 transition-colors text-left"
              >
                <span className="font-semibold text-cyber-white text-sm sm:text-base pr-2">
                  {item.title}
                </span>
                <svg
                  className={`w-5 h-5 text-purple-neon shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 bg-purple-dark/20">
                  <p className="text-cyber-white/80 text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
