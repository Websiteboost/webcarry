import { useState } from 'react';
import * as Icons from 'lucide-react';
import type { Category } from '../../types';

interface Props {
  categories: Category[];
  currentCategoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const getIcon = (iconName: string) => {
  const Icon = (Icons as any)[iconName];
  return Icon || Icons.Package;
};

export default function CategorySidebar({ categories, currentCategoryId, onCategoryChange }: Props) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    currentCategoryId ? [currentCategoryId] : []
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
    if (!expandedCategories.includes(categoryId)) {
      setExpandedCategories(prev => [...prev, categoryId]);
    }
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full glass-effect border-r border-purple-neon/20 p-8 flex flex-col" style={{height: 'calc(100vh - 8rem)'}}>
      <h2 className="text-2xl font-bold text-pink-neon mb-8 neon-text shrink-0">Categories</h2>
      <nav className="space-y-2 overflow-y-auto flex-1 pr-2 min-h-0">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const isActive = currentCategoryId === category.id;
          
          return (
            <div key={category.id}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-md transition-all ${
                  isActive
                    ? 'bg-purple-neon/20 border border-purple-neon/50 text-purple-neon'
                    : 'hover:bg-purple-neon/10 text-cyber-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getIcon(category.icon);
                    return <Icon className="w-5 h-5" />;
                  })()}
                  <span className="font-medium">{category.name}</span>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Services under category */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-125 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                {category.services && category.services.length > 0 && (
                  <div className="ml-4 space-y-1 border-l-2 border-blue-neon/30 pl-4">
                    {category.services.map((service: any) => (
                      <a
                        key={service.id}
                        href={`#${service.id}`}
                        className="block px-3 py-2 text-sm text-blue-neon hover:text-pink-neon hover:bg-pink-neon/10 rounded transition-colors"
                      >
                        {service.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
