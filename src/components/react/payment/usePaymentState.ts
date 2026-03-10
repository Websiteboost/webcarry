import { useState, useCallback, useEffect } from 'react';
import type { Region, Service, ServiceComponent } from '../../../types';

function getInitialBarValues(service: Service): { min: number; max: number } | null {
  const bp = service.barPrice;
  if (!bp) return null;
  if (bp.mode === 'breakpoints' && bp.breakpoints && bp.breakpoints.length > 0) {
    return {
      min: bp.defaultRange?.start ?? bp.breakpoints[0].initValue,
      max: bp.defaultRange?.end ?? bp.breakpoints[bp.breakpoints.length - 1].finalValue,
    };
  }
  return {
    min: bp.defaultRange?.start ?? bp.initValue,
    max: bp.defaultRange?.end ?? bp.finalValue,
  };
}

export function usePaymentState(service: Service | null) {
  const [selectedRegion, setSelectedRegion] = useState<Region>('US');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'card' | null>(null);
  const [barMinValue, setBarMinValue] = useState<number | null>(null);
  const [barMaxValue, setBarMaxValue] = useState<number | null>(null);
  const [additionalValues, setAdditionalValues] = useState<number[]>([]);
  const [boxValues, setBoxValues] = useState<number[]>([]);
  const [selectorValues, setSelectorValues] = useState<Record<string, number>>({});
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const [boxtitleSelected, setBoxtitleSelected] = useState<Record<string, boolean>>({});
  const [selectorSelected, setSelectorSelected] = useState<Record<string, boolean>>({});
  const [showValidation, setShowValidation] = useState(false);

  // Reset all state when service changes
  useEffect(() => {
    if (!service) return;
    setSelectedPrice(null);
    setCustomPrice('');
    const barInit = getInitialBarValues(service);
    setBarMinValue(barInit?.min ?? null);
    setBarMaxValue(barInit?.max ?? null);
    setAdditionalValues([]);
    setBoxValues([]);
    setSelectorValues({});
    setBoxtitleSelected({});
    setSelectorSelected({});
    setShowValidation(false);
    setAcceptedTerms(false);
    setSelectedPaymentMethod(null);
    setShowPayPalButton(false);
  }, [service?.id]);

  // --- Handlers ---

  const handleBarValueChange = useCallback((min: number, max: number) => {
    setBarMinValue(min);
    setBarMaxValue(max);
  }, []);

  const handleAdditionalServicesChange = useCallback((values: number[]) => {
    setAdditionalValues(values);
  }, []);

  const handleBoxPriceChange = useCallback((values: number[]) => {
    setBoxValues(values);
  }, []);

  const handleSelectorChange = useCallback((selectorId: string, value: number) => {
    setSelectorValues(prev => ({ ...prev, [selectorId]: value }));
  }, []);

  const handleBoxTitleChange = useCallback((componentId: string, hasSelection: boolean) => {
    setBoxtitleSelected(prev => ({ ...prev, [componentId]: hasSelection }));
  }, []);

  const handleSelectorSelectionChange = useCallback((selectorId: string, hasSelection: boolean) => {
    setSelectorSelected(prev => ({ ...prev, [selectorId]: hasSelection }));
  }, []);

  const handleCustomPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomPrice(value);
      setSelectedPrice(null);
    }
  }, []);

  const handlePresetPriceSelect = useCallback((price: number | string) => {
    const n = typeof price === 'string' ? parseFloat(price) : Number(price);
    setSelectedPrice(isNaN(n) ? 0 : n);
    setCustomPrice('');
  }, []);

  // --- Validation ---

  const isComponentSatisfied = useCallback((component: ServiceComponent): boolean => {
    if (component.type === 'group') {
      // A group is satisfied when all of its required children are satisfied
      return (component.children ?? []).every(child => isComponentSatisfied(child));
    }
    if (!component.required) return true;
    switch (component.type) {
      case 'bar': return barMinValue !== null && barMaxValue !== null;
      case 'box': return boxValues.length > 0;
      case 'custom': return customPrice !== '' || selectedPrice !== null;
      case 'selectors': {
        if (!service?.selectors) return false;
        const count = Object.keys(service.selectors).length;
        for (let i = 0; i < count; i++) {
          if (!selectorSelected[`${service.id}-selector-${i}`]) return false;
        }
        return count > 0;
      }
      case 'additional': return additionalValues.length > 0;
      case 'boxtitle': return !!boxtitleSelected[component.id];
      case 'labeltitle': return true;
      default: return true;
    }
  }, [service, barMinValue, barMaxValue, boxValues, customPrice, selectedPrice, selectorSelected, additionalValues, boxtitleSelected]);

  const areAllRequiredSatisfied = useCallback((): boolean => {
    if (!service?.components) return true;
    // Recursive check that also traverses group children
    const check = (c: ServiceComponent): boolean => isComponentSatisfied(c);
    return service.components.every(c => check(c));
  }, [service, isComponentSatisfied]);

  // --- Payment handlers ---

  const handlePayPalSuccess = useCallback((details: any) => {
    console.log('Payment successful!', details);
    alert(`✓ Payment successful!\n\nOrder ID: ${details.id}\nAmount: $${details.purchase_units[0].amount.value} ${details.purchase_units[0].amount.currency_code}\n\nThank you for your purchase!`);
    setShowPayPalButton(false);
  }, []);

  const handlePayPalError = useCallback((error: any) => {
    console.error('PayPal error:', error);
    alert('Payment failed. Please try again.');
    setShowPayPalButton(false);
  }, []);

  const handlePayPalCancel = useCallback(() => {
    setShowPayPalButton(false);
  }, []);

  const handlePayment = useCallback(() => {
    if (!acceptedTerms || !selectedPaymentMethod) {
      alert('Please accept the policies and select a payment method');
      return;
    }
    if (!areAllRequiredSatisfied()) {
      setShowValidation(true);
      return;
    }
    if (selectedPaymentMethod === 'card') {
      alert('Card payment coming soon');
    } else if (selectedPaymentMethod === 'paypal') {
      setShowPayPalButton(true);
    }
  }, [acceptedTerms, selectedPaymentMethod, areAllRequiredSatisfied]);

  return {
    selectedRegion, setSelectedRegion,
    selectedPrice, customPrice,
    barMinValue, barMaxValue,
    additionalValues, boxValues, selectorValues,
    acceptedTerms, setAcceptedTerms,
    selectedPaymentMethod, setSelectedPaymentMethod,
    showPayPalButton,
    boxtitleSelected, selectorSelected,
    showValidation,
    isComponentSatisfied, areAllRequiredSatisfied,
    handleBarValueChange, handleAdditionalServicesChange,
    handleBoxPriceChange, handleSelectorChange,
    handleBoxTitleChange, handleSelectorSelectionChange,
    handleCustomPriceChange, handlePresetPriceSelect,
    handlePayment, handlePayPalSuccess, handlePayPalError, handlePayPalCancel,
  };
}
