import { useCallback } from 'react';
import type { Service, ServiceComponent, DiscountCode } from '../../../types';

interface PriceState {
  barMinValue: number | null;
  barMaxValue: number | null;
  boxValues: number[];
  selectorValues: Record<string, number>;
  additionalValues: number[];
  selectedPrice: number | null;
  customPrice: string;
  selectedRegion: string;
  boxtitleSelected: Record<string, boolean>;
  appliedDiscount: DiscountCode | null;
}

function toNum(v: number | string): number {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return isNaN(n) ? 0 : n;
}

function flattenComponents(components: ServiceComponent[]): ServiceComponent[] {
  return components.flatMap(c =>
    c.type === 'group' ? flattenComponents(c.children ?? []) : [c]
  );
}

function applyPct(value: number, pct: number | undefined): number {
  if (!pct) return value;
  return Math.round(value * (1 - pct / 100) * 100) / 100;
}

function computeDiscount(basePrice: number, discount: DiscountCode | null): number {
  if (!discount) return basePrice;
  let result: number;
  if (discount.discount_type === 'percent') {
    result = basePrice - (basePrice * discount.discount_value / 100);
  } else {
    result = basePrice - discount.discount_value;
  }
  return Math.max(0, Math.round(result * 100) / 100);
}

export function usePaymentPrice(service: Service | null, state: PriceState) {
  const { barMinValue, barMaxValue, boxValues, selectorValues, additionalValues, selectedPrice, customPrice, selectedRegion, boxtitleSelected, appliedDiscount } = state;

  const calculateBarPrice = useCallback((barPrice: any, minValue: number, maxValue: number): number => {
    if (!barPrice) return 0;
    const mode = barPrice.mode || 'simple';

    if (mode === 'simple') {
      return (maxValue - minValue) * toNum(barPrice.step);
    }

    if (mode === 'breakpoints') {
      const { breakpoints } = barPrice;
      if (!breakpoints || breakpoints.length === 0) return 0;
      let total = 0;
      for (const bp of breakpoints) {
        const step = toNum(bp.step);
        const firstDest = Math.max(minValue + 1, bp.initValue);
        const lastDest = Math.min(maxValue, bp.finalValue);
        if (firstDest <= lastDest) {
          total += (lastDest - firstDest + 1) * step;
        }
        if (maxValue <= bp.finalValue) break;
      }
      return total;
    }

    return 0;
  }, []);

  const getBasePrice = useCallback((): number => {
    let basePrice = 0;
    const flat = service?.components ? flattenComponents(service.components) : [];
    const discountOf = (type: string) => flat.find(c => c.type === type)?.discount_percent ?? 0;

    if (service?.barPrice && barMinValue !== null && barMaxValue !== null) {
      basePrice += applyPct(calculateBarPrice(service.barPrice, barMinValue, barMaxValue), discountOf('bar'));
    }

    if (service?.boxPrice && boxValues.length > 0) {
      basePrice += applyPct(boxValues.reduce((sum, v) => sum + toNum(v), 0), discountOf('box'));
    }

    if (service?.customPrice?.enabled) {
      const rawCustom = customPrice ? toNum(customPrice) : (selectedPrice !== null ? toNum(selectedPrice) : 0);
      basePrice += applyPct(rawCustom, discountOf('custom'));
    }

    if (!service?.barPrice && !service?.boxPrice && !service?.customPrice?.enabled) {
      basePrice = toNum(service?.price ?? 0);
    }

    basePrice += applyPct(additionalValues.reduce((sum, v) => sum + toNum(v), 0), discountOf('additional'));
    basePrice += applyPct(Object.values(selectorValues).reduce((sum, v) => sum + toNum(v), 0), discountOf('selectors'));

    return Math.round(basePrice * 100) / 100;
  }, [service, barMinValue, barMaxValue, boxValues, selectorValues, additionalValues, selectedPrice, customPrice, calculateBarPrice]);

  const getFinalPrice = useCallback(
    (): number => computeDiscount(getBasePrice(), appliedDiscount),
    [getBasePrice, appliedDiscount],
  );

  const getDiscountAmount = useCallback(
    (): number => Math.round((getBasePrice() - getFinalPrice()) * 100) / 100,
    [getBasePrice, getFinalPrice],
  );

  const getPaymentDescription = useCallback((): string => {
    if (!service) return '';
    const details: string[] = [`${service.title} - Region: ${selectedRegion}`];

    if (service.barPrice && barMinValue !== null && barMaxValue !== null) {
      details.push(`${service.barPrice.label}: ${barMinValue} to ${barMaxValue}`);
    }

    if (service.boxPrice && boxValues.length > 0) {
      const selected = service.boxPrice
        .filter(box => boxValues.includes(box.value))
        .map(box => box.label || `$${box.value}`);
      if (selected.length > 0) details.push(`Selected: ${selected.join(', ')}`);
    }

    if (service.customPrice?.enabled) {
      const label = service.customPrice.label || 'Amount';
      if (customPrice) details.push(`${label}: $${customPrice}`);
      else if (selectedPrice !== null) details.push(`${label}: $${selectedPrice}`);
    }

    if (service.additionalServices && additionalValues.length > 0) {
      const selected = Object.entries(service.additionalServices)
        .filter(([, opt]) => additionalValues.includes(opt.value))
        .map(([label]) => label);
      if (selected.length > 0) details.push(`Extras: ${selected.join(', ')}`);
    }

    if (service.selectors && Object.keys(selectorValues).length > 0) {
      const selectorDetails = Object.entries(service.selectors).flatMap(([title, options], index) => {
        const selectorId = `${service.id}-selector-${index}`;
        const selectedValue = selectorValues[selectorId];
        if (selectedValue === undefined) return [];
        const opt = options.find(o => o.value === selectedValue);
        return opt ? [`${title}: ${opt.label}`] : [];
      });
      if (selectorDetails.length > 0) details.push(selectorDetails.join(', '));
    }

    details.push(`Total: $${getFinalPrice().toFixed(2)}`);
    return details.join(' | ');
  }, [service, selectedRegion, barMinValue, barMaxValue, boxValues, selectorValues, additionalValues, selectedPrice, customPrice, getFinalPrice]);

  const getEstimatedTime = useCallback((): number => {
    if (!service?.components) return 0;

    function calcComponent(c: ServiceComponent): number {
      const t = c.estimatedTime ?? 0;
      // Groups don't carry their own time — they sum their children
      if (c.type === 'group') {
        return (c.children ?? []).reduce((sum, child) => sum + calcComponent(child), 0);
      }
      // Informational labels never contribute time
      if (c.type === 'labeltitle' || t === 0) return 0;
      // For interactive components, count time only when user has engaged
      switch (c.type) {
        case 'bar':        return t; // always active — range always set
        case 'box':        return boxValues.length > 0 ? t : 0;
        case 'boxtitle':   return boxtitleSelected[c.id] ? t : 0;
        case 'custom':     return (customPrice !== '' || selectedPrice !== null) ? t : 0;
        case 'selectors':  return Object.keys(selectorValues).length > 0 ? t : 0;
        case 'additional': return additionalValues.length > 0 ? t : 0;
        default:           return t;
      }
    }

    return service.components.reduce((sum, c) => sum + calcComponent(c), 0);
  }, [service, boxValues, boxtitleSelected, customPrice, selectedPrice, selectorValues, additionalValues]);

  return { getBasePrice, getFinalPrice, getDiscountAmount, getPaymentDescription, getEstimatedTime };
}
