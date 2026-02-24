import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import type { Service, AccordionContent } from '../../types';
import CategorySidebar from './CategorySidebar';
import ServiceGrid from './ServiceGrid';
import MobileMenu from './MobileMenu';

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  services: any[];
}

interface Props {
  gameId: string;
  gameTitle: string;
  categories: CategoryInfo[];
  initialServices: Service[];
  accordionContent: AccordionContent;
  paymentDisclaimer?: string;
}

const getIcon = (iconName: string) => {
  const Icon = (Icons as any)[iconName];
  return Icon || Icons.Package;
};

export default function GamePageView({
  gameId,
  gameTitle,
  categories,
  initialServices,
  accordionContent,
  paymentDisclaimer,
}: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Leer categoría inicial desde la URL al montar (soporte browser back/forward)
  useEffect(() => {
    const readFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat && categories.find(c => c.id === cat)) {
        setSelectedCategoryId(cat);
      } else {
        setSelectedCategoryId(null);
      }
    };

    readFromUrl();

    const onPopState = () => readFromUrl();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [categories]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const url = new URL(window.location.href);
    url.searchParams.set('category', categoryId);
    history.pushState({ categoryId }, '', url.toString());
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    history.pushState({}, '', url.toString());
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) ?? null;

  const filteredServices = selectedCategoryId
    ? initialServices.filter(s => (s as any).categoryId === selectedCategoryId)
    : [];

  const filteredCategories = selectedCategoryId
    ? categories.filter(c => c.id === selectedCategoryId)
    : categories;

  return (
    <>
      {/* Mobile Menu — recibe callback de selección de categoría */}
      <MobileMenu
        categories={categories as any}
        currentCategoryId={selectedCategoryId ?? undefined}
        onCategoryChange={handleCategorySelect}
      />

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block lg:w-96 shrink-0">
          <div className="sticky top-28" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
            <CategorySidebar
              categories={categories as any}
              currentCategoryId={selectedCategoryId ?? undefined}
              onCategoryChange={handleCategorySelect}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 lg:px-10 py-8 lg:py-12">

          {/* Breadcrumb dinámico */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <span className="text-blue-neon/50 cursor-default">{gameTitle}</span>
            {selectedCategory && (
              <>
                <span className="text-cyber-white/30">/</span>
                <button
                  onClick={handleBackToCategories}
                  className="text-blue-neon hover:text-pink-neon transition-colors"
                >
                  Categories
                </button>
                <span className="text-cyber-white/30">/</span>
                <span className="text-pink-neon font-semibold">{selectedCategory.name}</span>
              </>
            )}
            {!selectedCategory && (
              <>
                <span className="text-cyber-white/30">/</span>
                <span className="text-pink-neon font-semibold">Categories</span>
              </>
            )}
          </nav>

          {/* Page Header */}
          <div className="mb-12">
            {selectedCategory ? (
              <>
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center gap-2 text-blue-neon hover:text-pink-neon transition-colors mb-4 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to categories
                </button>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  <span className="text-cyber-white">{gameTitle}</span>
                  <span className="neon-text ml-3">— {selectedCategory.name}</span>
                </h1>
                {selectedCategory.description && (
                  <p className="text-cyber-white/70 text-lg leading-relaxed max-w-3xl">
                    {selectedCategory.description}
                  </p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  <span className="text-cyber-white">{gameTitle}</span>
                  <span className="neon-text ml-3">Services</span>
                </h1>
                <p className="text-cyber-white/70 text-lg leading-relaxed max-w-3xl">
                  Select a category to explore our professional boosting services for {gameTitle}.
                </p>
              </>
            )}
          </div>

          {/* Vista: cards de categorías o grid de servicios */}
          {!selectedCategory ? (
            /* Category Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((category) => {
                const Icon = getIcon(category.icon);
                const serviceCount = category.services?.length ?? 0;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="cursor-pointer glass-effect rounded-md border border-purple-neon/20 card-hover group p-8 text-left flex flex-col gap-4 transition-all hover:border-purple-neon/60"
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-purple-neon/10 border border-purple-neon/30 flex items-center justify-center group-hover:bg-purple-neon/20 group-hover:border-purple-neon/60 transition-all">
                      <Icon className="w-7 h-7 text-purple-neon" />
                    </div>

                    {/* Name */}
                    <div>
                      <h2 className="text-xl font-bold text-cyber-white group-hover:text-pink-neon transition-colors mb-1">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-cyber-white/60 text-sm leading-relaxed line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple-neon/10">
                      <span className="text-sm text-blue-neon">
                        {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
                      </span>
                      <svg className="w-5 h-5 text-pink-neon opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Service Grid filtrado por categoría */
            <ServiceGrid
              initialServices={filteredServices}
              accordionContent={accordionContent}
              categories={filteredCategories as any}
              paymentDisclaimer={paymentDisclaimer}
            />
          )}
        </div>
      </div>
    </>
  );
}
