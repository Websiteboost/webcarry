import { createPortal } from 'react-dom';
import type { Service, Region, AccordionContent } from '../../types';
import Accordion from './Accordion';
import { usePaymentState } from './payment/usePaymentState';
import { usePaymentPrice } from './payment/usePaymentPrice';
import { useDiscount } from './payment/useDiscount';
import { useSidebarEffects } from './payment/useSidebarEffects';
import ServicePreview from './payment/ServicePreview';
import ServiceComponentRenderer from './payment/ServiceComponentRenderer';
import PaymentCheckout from './payment/PaymentCheckout';
import { useCurrency } from '../../hooks/useCurrency';

interface Props {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  accordionContent: AccordionContent;
  paymentDisclaimer?: string;
  euroValue?: number;
}

export default function PaymentSidebar({ service, isOpen, onClose, accordionContent, paymentDisclaimer, euroValue = 1.08 }: Props) {
  const { formatPrice, symbol } = useCurrency(euroValue);
  const ps = usePaymentState(service);
  const discount = useDiscount(service?.id ?? undefined);
  const { isVisible, imageError, setImageError, imageLoading, setImageLoading } = useSidebarEffects(isOpen, service?.id);
  const { getBasePrice, getFinalPrice, getDiscountAmount, getPaymentDescription, getEstimatedTime } = usePaymentPrice(service, {
    barMinValue: ps.barMinValue,
    barMaxValue: ps.barMaxValue,
    boxValues: ps.boxValues,
    selectorValues: ps.selectorValues,
    additionalValues: ps.additionalValues,
    selectedPrice: ps.selectedPrice,
    customPrice: ps.customPrice,
    selectedRegion: ps.selectedRegion,
    boxtitleSelected: ps.boxtitleSelected,
    appliedDiscount: discount.applied,
  });

  if (!service) return null;

  const handlers = {
    onBarValueChange: ps.handleBarValueChange,
    onBoxPriceChange: ps.handleBoxPriceChange,
    onSelectorChange: ps.handleSelectorChange,
    onSelectorSelectionChange: ps.handleSelectorSelectionChange,
    onBoxTitleChange: ps.handleBoxTitleChange,
    onAdditionalServicesChange: ps.handleAdditionalServicesChange,
    onCustomPriceChange: ps.handleCustomPriceChange,
    onPresetPriceSelect: ps.handlePresetPriceSelect,
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-200 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Desktop Accordion - Centered Left on Overlay */}
      {isOpen && (
        <div className="hidden lg:block fixed left-0 top-0 bottom-0 right-0 z-201 pointer-events-none">
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
          className={`fixed top-0 right-0 h-full w-full sm:w-120 glass-effect border-l border-purple-neon/30 z-202 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pb-32 sm:pb-6 pt-32 lg:pt-6">
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

            <ServicePreview
              service={service}
              imageError={imageError}
              imageLoading={imageLoading}
              onImageLoad={() => setImageLoading(false)}
              onImageError={() => { setImageLoading(false); setImageError(true); }}
            />

            {/* Region Selection */}
            <div className="mb-6">
              <label className="block text-base font-medium text-cyber-white mb-3">
                Select Region
              </label>
              <div className="flex gap-3">
                {(['EU', 'US'] as Region[]).map((region) => (
                  <button
                    key={region}
                    onClick={() => ps.setSelectedRegion(region)}
                    className={`flex-1 py-4 px-5 rounded-md font-semibold text-base transition-all ${
                      ps.selectedRegion === region
                        ? 'bg-blue-neon/20 border-2 border-blue-neon text-blue-neon'
                        : 'bg-purple-dark/30 border-2 border-transparent text-cyber-white hover:border-purple-neon/50'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Components */}
            {service.components?.map((component, idx) => (
              <ServiceComponentRenderer
                key={`${component.id}-${idx}`}
                component={component}
                service={service}
                handlers={handlers}
                selectedPrice={ps.selectedPrice}
                customPrice={ps.customPrice}
                showValidation={ps.showValidation}
                isComponentSatisfied={ps.isComponentSatisfied}
                formatPrice={formatPrice}
                currencySymbol={symbol}
              />
            ))}

            <PaymentCheckout
              finalPrice={getFinalPrice()}
              basePrice={getBasePrice()}
              paymentDescription={getPaymentDescription()}
              estimatedTime={getEstimatedTime()}
              formatPrice={formatPrice}
              discountCode={discount.code}
              discountStatus={discount.status}
              discountError={discount.error}
              discountApplied={discount.applied}
              discountAmount={getDiscountAmount()}
              onDiscountCodeChange={discount.handleCodeChange}
              onDiscountApply={discount.apply}
              onDiscountRemove={discount.remove}
              onDiscountKeyDown={discount.handleKeyDown}
              acceptedTerms={ps.acceptedTerms}
              onTermsChange={(v) => ps.setAcceptedTerms(v)}
              selectedPaymentMethod={ps.selectedPaymentMethod}
              onPaymentMethodChange={(m) => ps.setSelectedPaymentMethod(m)}
              showPayPalButton={ps.showPayPalButton}
              onPaymentClick={ps.handlePayment}
              onPayPalSuccess={ps.handlePayPalSuccess}
              onPayPalError={ps.handlePayPalError}
              onPayPalCancel={ps.handlePayPalCancel}
              paymentDisclaimer={paymentDisclaimer}
            />

            {/* Mobile Accordion */}
            <div className="lg:hidden mt-6">
              <div className="glass-effect rounded-lg p-4 border border-purple-neon/20">
                <Accordion content={accordionContent} />
              </div>
            </div>
          </div>
        </aside>
      )}
    </>,
    document.body,
  );
}
