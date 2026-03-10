import { useState, useCallback, useEffect } from 'react';
import type { DiscountCode } from '../../../types';

export type DiscountStatus = 'idle' | 'loading' | 'valid' | 'invalid';

export function useDiscount(serviceId?: string) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<DiscountStatus>('idle');
  const [applied, setApplied] = useState<DiscountCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset whenever the active service changes
  useEffect(() => {
    setCode('');
    setStatus('idle');
    setApplied(null);
    setError(null);
  }, [serviceId]);

  const apply = useCallback(async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setStatus('loading');
    setError(null);

    try {
      const res = await fetch(`/api/discounts/${encodeURIComponent(trimmed)}`);
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('invalid');
        setError(body.error ?? 'Invalid or expired discount code.');
        setApplied(null);
        return;
      }

      setApplied(body as DiscountCode);
      setStatus('valid');
    } catch {
      setStatus('invalid');
      setError('Network error. Please try again.');
    }
  }, [code]);

  const remove = useCallback(() => {
    setCode('');
    setApplied(null);
    setStatus('idle');
    setError(null);
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    // Force uppercase, strip anything that can't be a valid code
    setCode(value.toUpperCase().replace(/[^A-Z0-9_\-]/g, '').slice(0, 50));
    // Clear previous error/result when user edits
    if (status !== 'idle') {
      setStatus('idle');
      setError(null);
      setApplied(null);
    }
  }, [status]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') apply();
  }, [apply]);

  return { code, status, applied, error, apply, remove, handleCodeChange, handleKeyDown };
}
