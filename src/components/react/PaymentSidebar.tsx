import { useState, useEffect, useCallback } from 'react';
import type { Service, Region, AccordionContent } from '../../types';
import IncrementalBar from './IncrementalBar';
import CheckGroup from './CheckGroup';
import BoxPrice from './BoxPrice';
import Accordion from './Accordion';
import CustomSelector from './CustomSelector';

interface Props {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  accordionContent: AccordionContent;
}

export default function PaymentSidebar({ service, isOpen, onClose, accordionContent }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<Region>('US');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'card' | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [barMinValue, setBarMinValue] = useState<number | null>(null);
  const [barMaxValue, setBarMaxValue] = useState<number | null>(null);
  const [additionalValues, setAdditionalValues] = useState<number[]>([]);
  const [boxValues, setBoxValues] = useState<number[]>([]);
  const [selectorValues, setSelectorValues] = useState<Record<string, number>>({});

  // Todos los hooks deben estar antes de cualquier return condicional
  const handleBarValueChange = useCallback((minValue: number, maxValue: number) => {
    setBarMinValue(minValue);
    setBarMaxValue(maxValue);
  }, []);

  const handleAdditionalServicesChange = useCallback((values: number[]) => {
    setAdditionalValues(values);
  }, []);

  const handleBoxPriceChange = useCallback((values: number[]) => {
    setBoxValues(values);
  }, []);

  const handleSelectorChange = useCallback((selectorId: string, value: number) => {
    setSelectorValues(prev => ({
      ...prev,
      [selectorId]: value
    }));
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Forzar un reflow para que la animación funcione en la primera apertura
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      // Bloquear scroll del body cuando el sidebar está abierto
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      // Restaurar scroll del body cuando el sidebar se cierra
      document.body.style.overflow = '';
    }

    // Cleanup: restaurar scroll cuando el componente se desmonta
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Efecto para manejar el scroll del aside y actualizar el logo en mobile
  useEffect(() => {
    if (!isOpen) return;

    const handleAsideScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && window.innerWidth < 1024) { // Solo en mobile/tablet (< lg)
        // Simular evento de scroll en window para que el script del logo funcione
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
      }
    };

    const aside = document.querySelector('aside');
    if (aside) {
      aside.addEventListener('scroll', handleAsideScroll);
    }

    return () => {
      if (aside) {
        aside.removeEventListener('scroll', handleAsideScroll);
      }
    };
  }, [isOpen]);

  // Return condicional después de todos los hooks
  if (!service) return null;

  const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomPrice(value);
      setSelectedPrice(null);
    }
  };

  const handlePresetPriceSelect = (price: number) => {
    setSelectedPrice(price);
    setCustomPrice('');
  };

  const getFinalPrice = () => {
    let basePrice = 0;
    
    // Si el servicio tiene barPrice, calcular número de steps en el rango
    if (service?.barPrice && barMinValue !== null && barMaxValue !== null) {
      const { step } = service.barPrice;
      const numSteps = Math.round((barMaxValue - barMinValue) / step);
      basePrice += numSteps * step;
    }
    
    // Si tiene boxPrice, sumar los valores seleccionados
    if (service?.boxPrice && boxValues.length > 0) {
      basePrice += boxValues.reduce((sum, value) => sum + value, 0);
    }
    
    // Si tiene customPrice habilitado y hay valor
    if (service?.customPrice?.enabled) {
      if (customPrice) {
        basePrice += parseInt(customPrice);
      } else if (selectedPrice) {
        basePrice += selectedPrice;
      }
    }
    
    // Si no tiene ningún método de pricing, usar el precio base
    if (!service?.barPrice && !service?.boxPrice && !service?.customPrice?.enabled) {
      basePrice = service?.price || 0;
    }
    
    // Sumar valores adicionales
    const additionalTotal = additionalValues.reduce((sum, value) => sum + value, 0);
    
    // Sumar valores de selectores
    const selectorTotal = Object.values(selectorValues).reduce((sum, value) => sum + value, 0);
    
    return basePrice + additionalTotal + selectorTotal;
  };

  const handlePayment = () => {
    if (!acceptedTerms || !selectedPaymentMethod) {
      alert('Please accept the policies and select a payment method');
      return;
    }
    
    alert(`Processing payment of $${getFinalPrice()} USD for ${service.title} (Region: ${selectedRegion}) with ${selectedPaymentMethod === 'paypal' ? 'PayPal' : 'Card'}`);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Desktop Accordion - Centered Left on Overlay */}
      {isOpen && (
        <div className="hidden lg:block fixed left-0 top-0 bottom-0 right-0 z-45 pointer-events-none">
          <div className="flex items-center justify-center h-full pr-125 xl:pr-155 pl-20 py-16 pt-48">
            <div className="pointer-events-auto w-full max-w-3xl max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="glass-effect rounded-lg p-6 border border-purple-neon/30 shadow-2xl">
                <Accordion content={accordionContent} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {isOpen && (
        <aside 
          className={`fixed top-0 lg:top-24 right-0 h-full lg:h-[calc(100vh-6rem)] w-full sm:w-120 glass-effect border-l border-purple-neon/30 z-40 lg:z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
        <div className="p-6 pb-32 sm:pb-6 pt-40 lg:pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-pink-neon neon-text">Checkout</h2>
            <button
              onClick={onClose}
              className="text-cyber-white hover:text-pink-neon transition-colors p-2"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Service Preview */}
          <div className="mb-6">
            <div className="relative h-40 rounded-md overflow-hidden mb-4">
              <div className="skeleton h-full w-full"></div>
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-dark/60 to-purple-dark"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-cyber-white">{service.title}</h3>
              </div>
            </div>
            
            {service.description && service.description.length > 0 && (
              <ul className="space-y-2">
                {service.description.map((point, index) => (
                  <li key={index} className="flex items-start text-sm text-cyber-white/80">
                    <svg className="w-4 h-4 text-green-neon mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Region Selection */}
          <div className="mb-6">
            <label className="block text-base font-medium text-cyber-white mb-3">
              Select Region
            </label>
            <div className="flex gap-3">
              {(['EU', 'US'] as Region[]).map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`flex-1 py-4 px-5 rounded-md font-semibold text-base transition-all ${
                    selectedRegion === region
                      ? 'bg-blue-neon/20 border-2 border-blue-neon text-blue-neon'
                      : 'bg-purple-dark/30 border-2 border-transparent text-cyber-white hover:border-purple-neon/50'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Incremental Bar si el servicio tiene barPrice */}
          {service.barPrice && (
            <div className="mb-6">
              <IncrementalBar 
                barPrice={service.barPrice} 
                onValueChange={handleBarValueChange}
                title={service.barPrice.label}
              />
            </div>
          )}

          {/* BoxPrice si el servicio tiene boxPrice */}
          {service.boxPrice && service.boxPrice.length > 0 && (
            <div className="mb-6">
              <BoxPrice 
                values={service.boxPrice}
                onSelectionChange={handleBoxPriceChange}
              />
            </div>
          )}

          {/* Custom Price Input - Solo mostrar si el servicio tiene customPrice habilitado */}
          {service.customPrice?.enabled && (
            <div className="mb-6">
              <label className="block text-base font-medium text-cyber-white mb-3">
                {service.customPrice.label || 'Custom Amount'}
              </label>
              
              {/* Presets si existen */}
              {service.customPrice.presets && service.customPrice.presets.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {service.customPrice.presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePresetPriceSelect(preset)}
                      className={`py-3 px-4 rounded-md font-semibold text-base transition-all ${
                        selectedPrice === preset
                          ? 'bg-green-neon/20 border-2 border-green-neon text-green-neon'
                          : 'bg-purple-dark/30 border-2 border-transparent text-cyber-white hover:border-purple-neon/50'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Input personalizado */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-neon text-lg">$</span>
                <input
                  type="text"
                  value={customPrice}
                  onChange={handleCustomPriceChange}
                  placeholder="Enter amount"
                  className="w-full bg-purple-dark/30 border-2 border-purple-neon/30 rounded-md py-4 pl-8 pr-4 text-base text-cyber-white placeholder-cyber-white/40 focus:border-purple-neon focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Custom Selectors - Si el servicio tiene selectors */}
          {service.selectors && Object.keys(service.selectors).length > 0 && (
            <>
              {Object.entries(service.selectors).map(([title, options], index) => (
                <CustomSelector
                  key={`${service.id}-selector-${index}`}
                  selectorId={`${service.id}-selector-${index}`}
                  title={title}
                  options={options}
                  onValueChange={(value) => handleSelectorChange(`${service.id}-selector-${index}`, value)}
                />
              ))}
            </>
          )}

          {/* Additional Services CheckGroup */}
          {service.additionalServices && Object.keys(service.additionalServices).length > 0 && (
            <div className="mb-6">
              <CheckGroup 
                options={service.additionalServices}
                onSelectionChange={handleAdditionalServicesChange}
              />
            </div>
          )}

          {/* Terms Checkbox */}
          <div className="mb-6">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-purple-neon bg-purple-dark/30 text-pink-neon focus:ring-2 focus:ring-pink-neon focus:ring-offset-0 cursor-pointer"
              />
              <span className="ml-3 text-base text-cyber-white/80">
                I accept the{' '}
                <a href="/terms" className="text-blue-neon hover:text-pink-neon underline">
                  service policies
                </a>
              </span>
            </label>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <label className="block text-base font-medium text-cyber-white mb-3">
              Payment Method
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPaymentMethod('paypal')}
                className={`flex-1 flex items-center justify-center gap-2 py-5 px-5 rounded-md font-semibold text-base transition-all ${
                  selectedPaymentMethod === 'paypal'
                    ? 'bg-blue-neon/20 border-2 border-blue-neon'
                    : 'bg-purple-dark/30 border-2 border-transparent hover:border-purple-neon/50'
                }`}
              >
                <svg className="w-6 h-6 text-blue-neon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L9.718 7.08a.972.972 0 0 1 .957-.817h4.992c1.006 0 1.746.09 2.262.261.088.03.17.059.246.09.024.01.047.024.066.038.503.222.863.572 1.056 1.106.136.378.205.804.226 1.284a4.49 4.49 0 0 1-.015.436h.002z"/>
                </svg>
                <span className="text-blue-neon">PayPal</span>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod('card')}
                className={`flex-1 flex items-center justify-center gap-2 py-5 px-5 rounded-md font-semibold text-base transition-all ${
                  selectedPaymentMethod === 'card'
                    ? 'bg-green-neon/20 border-2 border-green-neon'
                    : 'bg-purple-dark/30 border-2 border-transparent hover:border-purple-neon/50'
                }`}
              >
                <svg className="w-6 h-6 text-green-neon" fill="currentColor" viewBox="0 0 48 32">
                  <rect x="0" y="0" width="48" height="32" rx="4" opacity="0.3"/>
                  <rect x="4" y="8" width="40" height="4"/>
                </svg>
                <span className="text-green-neon">Card</span>
              </button>
            </div>
          </div>

          {/* Total and Pay Button */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 glass-effect rounded-md border border-purple-neon/30">
              <span className="text-cyber-white font-medium text-base">Total to pay:</span>
              <span className="text-3xl font-bold text-cyber-white" style={{textShadow: '0 0 5px rgba(16,185,129,0.3), 0 0 10px rgba(16,185,129,0.2)'}}>${getFinalPrice()}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={!acceptedTerms || !selectedPaymentMethod}
              className={`w-full py-5 rounded-md font-bold text-lg transition-all ${
                acceptedTerms && selectedPaymentMethod
                  ? 'bg-linear-to-r from-pink-neon to-purple-neon text-cyber-white hover:shadow-lg hover:shadow-pink-neon/50 hover:scale-105'
                  : 'bg-purple-dark/30 text-cyber-white/40 cursor-not-allowed'
              }`}
            >
              Pay Now
            </button>
          </div>

          {/* Mobile Accordion - Below Pay Now button */}
          <div className="lg:hidden mt-6">
            <div className="glass-effect rounded-lg p-4 border border-purple-neon/20">
              <Accordion content={accordionContent} />
            </div>
          </div>
        </div>
        </aside>
      )}
    </>
  );
}
