import { useState, useEffect, useCallback } from 'react';

export type Currency = 'USD' | 'EUR';

const LS_CURRENCY = 'bb_currency';
const LS_EURO_VALUE = 'bb_euro_value';
const DISPATCH_EVENT = 'bb:currency';

/** Matches all IANA Europe/* zones plus the European Atlantic islands */
const EUROPE_TZ_RE = /^Europe\/|^Atlantic\/(Azores|Canary|Madeira|Faroe)/;

function detectCurrencyFromTimezone(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return EUROPE_TZ_RE.test(tz) ? 'EUR' : 'USD';
  } catch {
    return 'USD';
  }
}

function readStoredCurrency(): Currency | null {
  try {
    const v = localStorage.getItem(LS_CURRENCY);
    if (v === 'USD' || v === 'EUR') return v;
  } catch { /* storage blocked */ }
  return null;
}

function readStoredRate(fallback: number): number {
  try {
    const raw = localStorage.getItem(LS_EURO_VALUE);
    const n = raw ? parseFloat(raw) : NaN;
    if (!isNaN(n) && n > 0) return n;
  } catch { /* storage blocked */ }
  return fallback;
}

/**
 * Shared currency hook for all React islands.
 *
 * @param euroValue  — the USD-value of 1 EUR, served from the DB via SSR props.
 *                     e.g. 1.08 means 1 EUR = $1.08 USD.
 *                     To convert: eur = usd / euroValue
 */
export function useCurrency(euroValue: number = 1.08) {
  // Always start with 'USD' so server HTML matches the first client render.
  // The real detected/stored value is applied after hydration in useEffect.
  const [currency, setCurrency] = useState<Currency>('USD');
  const [rate, setRate] = useState<number>(euroValue);

  // After mount: restore stored preference or auto-detect from timezone
  useEffect(() => {
    const detected = readStoredCurrency() ?? detectCurrencyFromTimezone();
    const cachedRate = readStoredRate(euroValue);
    setCurrency(detected);
    setRate(cachedRate);
  }, []);

  // When a fresh SSR-delivered euroValue arrives, persist and sync it
  useEffect(() => {
    if (euroValue > 0) {
      setRate(euroValue);
      try { localStorage.setItem(LS_EURO_VALUE, String(euroValue)); } catch { /* noop */ }
    }
  }, [euroValue]);

  // Cross-island sync: listen for currency changes dispatched by CurrencySelector
  useEffect(() => {
    const handler = (e: Event) => {
      const { currency: c, rate: r } = (e as CustomEvent<{ currency: Currency; rate: number }>).detail;
      setCurrency(c);
      if (r > 0) setRate(r);
    };
    window.addEventListener(DISPATCH_EVENT, handler);
    return () => window.removeEventListener(DISPATCH_EVENT, handler);
  }, []);

  const changeCurrency = useCallback((next: Currency) => {
    setCurrency(next);
    try { localStorage.setItem(LS_CURRENCY, next); } catch { /* noop */ }
    window.dispatchEvent(
      new CustomEvent(DISPATCH_EVENT, { detail: { currency: next, rate } }),
    );
  }, [rate]);

  /** Formats a USD price according to the active currency + rate. */
  const formatPrice = useCallback((usdPrice: number | string): string => {
    const n = typeof usdPrice === 'string' ? parseFloat(usdPrice) : Number(usdPrice);
    const safe = isNaN(n) ? 0 : n;
    if (currency === 'EUR') {
      return `€${(safe / rate).toFixed(2)}`;
    }
    return `$${safe.toFixed(2)}`;
  }, [currency, rate]);

  /** The currency symbol for the active currency. */
  const symbol = currency === 'EUR' ? '€' : '$';

  return { currency, changeCurrency, formatPrice, symbol, rate };
}
