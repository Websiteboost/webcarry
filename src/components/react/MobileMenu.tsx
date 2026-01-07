import { useState } from 'react';
import * as Icons from 'lucide-react';
import type { Category } from '../../types';

interface Props {
  categories: Category[];
  currentCategoryId?: string;
}

const getIcon = (iconName: string) => {
  const Icon = (Icons as any)[iconName];
  return Icon || Icons.Package;
};

export default function MobileMenu({ categories, currentCategoryId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    currentCategoryId ? [currentCategoryId] : []
  );

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 glass-effect p-3 rounded-lg border border-purple-neon/30 hover:border-purple-neon transition-colors"
        aria-label="Toggle menu"
      >
        <svg 
          className="w-6 h-6 text-cyber-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Sidebar */}
      <aside 
        className={`lg:hidden fixed top-0 left-0 h-full w-80 glass-effect border-r border-purple-neon/30 z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-2xl font-bold text-pink-neon mb-6 neon-text">Categories</h2>
          <nav className="space-y-2">
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
                  {isExpanded && category.services && category.services.length > 0 && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-blue-neon/30 pl-4">
                      {category.services.map((service: any) => (
                        <a
                          key={service.id}
                          href={`#${service.id}`}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 text-sm text-blue-neon hover:text-pink-neon hover:bg-pink-neon/10 rounded transition-colors"
                        >
                          {service.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
