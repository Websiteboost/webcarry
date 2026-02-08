import { useState, useEffect } from 'react';
import type { Service, AccordionContent } from '../../types';
import PaymentSidebar from './PaymentSidebar';

interface CategoryWithServices {
  id: string;
  name: string;
  services: Service[];
}

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  services: any[];
}

interface Props {
  initialServices: Service[];
  accordionContent: AccordionContent;
  categories?: CategoryInfo[];
  paymentDisclaimer?: string;
  onServiceSelect?: (service: Service) => void;
}

export default function ServiceGrid({ initialServices, accordionContent, categories, paymentDisclaimer, onServiceSelect }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [categorizedServices, setCategorizedServices] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simular carga asíncrona y agrupar por categoría
    const timer = setTimeout(() => {
      setServices(initialServices);
      
      // Si tenemos categories, usar su orden; si no, agrupar dinámicamente
      let grouped: CategoryWithServices[];
      
      if (categories && categories.length > 0) {
        // Usar el orden de categories que viene de la BD con display_order
        grouped = categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          services: initialServices.filter(s => s.categoryId === cat.id)
        })).filter(cat => cat.services.length > 0);
      } else {
        // Fallback: agrupar servicios por categoría dinámicamente
        grouped = initialServices.reduce((acc, service) => {
          const existingCategory = acc.find(cat => cat.id === service.categoryId);
          if (existingCategory) {
            existingCategory.services.push(service);
          } else {
            acc.push({
              id: service.categoryId,
              name: service.categoryId,
              services: [service]
            });
          }
          return acc;
        }, [] as CategoryWithServices[]);
      }
      
      setCategorizedServices(grouped);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [initialServices, categories]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsPaymentOpen(true);
    if (onServiceSelect) {
      onServiceSelect(service);
    }
  };

  const handleClosePayment = () => {
    setIsPaymentOpen(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="glass-effect rounded-md overflow-hidden border border-purple-neon/20 flex flex-col">
            {/* Skeleton Image */}
            <div className="skeleton h-48 w-full"></div>
            {/* Skeleton Content */}
            <div className="p-6 space-y-3 flex flex-col grow">
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-5/6"></div>
              <div className="skeleton h-4 w-4/6"></div>
              <div className="skeleton h-8 w-20 mt-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cyber-white/70 text-lg">No services available for this game.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {categorizedServices.map((category) => (
        <div key={category.id} id={category.id} className="scroll-mt-24">
          {/* Category Title */}
          <h2 className="text-2xl font-bold text-pink-neon neon-text mb-6 capitalize">
            {category.name.replace(/-/g, ' ')}
          </h2>
          
          {/* Services Grid for this Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {category.services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="glass-effect rounded-md overflow-hidden border border-purple-neon/20 card-hover group flex flex-col"
              >
                {/* Service Image with Gradient */}
                <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-purple-neon/20 to-blue-neon/20">
                  {imageErrors[service.id] ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-purple-neon/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ) : (
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={() => setImageErrors(prev => ({ ...prev, [service.id]: true }))}
                    />
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-dark/60 to-purple-dark"></div>
                  {/* Service Title on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-cyber-white group-hover:text-pink-neon transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-7 flex flex-col grow">
                  {/* Description Points */}
                  {service.description && service.description.length > 0 && (
                    <ul className="space-y-2 mb-4" style={{minHeight: '120px'}}>
                      {service.description.map((point, index) => (
                        <li key={index} className="flex items-start text-sm text-cyber-white/80">
                          <svg className="w-5 h-5 text-green-neon mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple-neon/20">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-cyber-white" style={{textShadow: '0 0 5px rgba(16,185,129,0.3), 0 0 10px rgba(16,185,129,0.2)'}}>${service.price}</span>
                      <span className="text-sm text-cyber-white/60">USD</span>
                    </div>
                    <button
                      onClick={() => handleServiceSelect(service)}
                      className="bg-linear-to-r from-pink-neon to-purple-neon px-7 py-3 rounded-md font-semibold text-base text-cyber-white hover:shadow-lg hover:shadow-pink-neon/50 transition-all hover:scale-105 shrink-0"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Payment Sidebar */}
      <PaymentSidebar 
        service={selectedService}
        isOpen={isPaymentOpen}
        onClose={handleClosePayment}
        accordionContent={accordionContent}
        paymentDisclaimer={paymentDisclaimer}
      />
    </div>
  );
}
