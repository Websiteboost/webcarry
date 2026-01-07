import { useState, useEffect } from 'react';
import type { Service, AccordionContent } from '../../types';
import PaymentSidebar from './PaymentSidebar';

interface Props {
  initialServices: Service[];
  accordionContent: AccordionContent;
  onServiceSelect?: (service: Service) => void;
}

export default function ServiceGrid({ initialServices, accordionContent, onServiceSelect }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    // Simular carga asíncrona
    const timer = setTimeout(() => {
      setServices(initialServices);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [initialServices]);

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
          <div key={index} className="glass-effect rounded-md overflow-hidden border border-purple-neon/20">
            {/* Skeleton Image */}
            <div className="skeleton h-48 w-full"></div>
            {/* Skeleton Content */}
            <div className="p-6 space-y-3">
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-5/6"></div>
              <div className="skeleton h-4 w-4/6"></div>
              <div className="skeleton h-8 w-20 mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cyber-white/70 text-lg">No services available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {services.map((service) => (
        <div
          key={service.id}
          id={service.id}
          className="glass-effect rounded-md overflow-hidden border border-purple-neon/20 card-hover group"
        >
          {/* Service Image with Gradient */}
          <div className="relative h-48 w-full overflow-hidden">
            <div className="skeleton h-full w-full group-hover:scale-110 transition-transform duration-300"></div>
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
          <div className="p-7">
            {/* Description Points */}
            {service.description && service.description.length > 0 && (
              <ul className="space-y-2 mb-4">
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
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-neon/20">
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

      {/* Payment Sidebar */}
      <PaymentSidebar 
        service={selectedService}
        isOpen={isPaymentOpen}
        onClose={handleClosePayment}
        accordionContent={accordionContent}
      />
    </div>
  );
}
