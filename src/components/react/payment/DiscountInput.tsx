import type { DiscountCode } from '../../../types';
import type { DiscountStatus } from './useDiscount';

interface Props {
  code: string;
  status: DiscountStatus;
  error: string | null;
  applied: DiscountCode | null;
  discountAmount: number;
  formatPrice: (usd: number | string) => string;
  onCodeChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export default function DiscountInput({
  code, status, error, applied, discountAmount, formatPrice,
  onCodeChange, onApply, onRemove, onKeyDown,
}: Props) {
  const isLoading = status === 'loading';

  // Applied state — show chip with code + savings
  if (status === 'valid' && applied) {
    const label = applied.discount_type === 'percent'
      ? `${applied.discount_value}% off`
      : `${formatPrice(Number(applied.discount_value))} off`;

    return (
      <div className="mb-4">
        <p className="text-xs font-medium text-cyber-white/60 mb-2 uppercase tracking-wide">Discount Code</p>
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border border-green-neon/40 bg-green-neon/5">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-green-neon shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="min-w-0">
              <span className="text-green-neon font-bold text-sm tracking-wider">{applied.code}</span>
              <span className="text-cyber-white/50 text-xs ml-2">{label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {discountAmount > 0 && (
              <span className="text-green-neon text-sm font-semibold">
                −{formatPrice(discountAmount)}
              </span>
            )}
            <button
              onClick={onRemove}
              aria-label="Remove discount code"
              className="text-cyber-white/40 hover:text-cyber-white transition-colors p-0.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Input state — idle / loading / invalid
  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-cyber-white/60 mb-2 uppercase tracking-wide">Discount Code</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter code"
          maxLength={50}
          disabled={isLoading}
          spellCheck={false}
          autoComplete="off"
          aria-label="Discount code"
          className={`flex-1 bg-purple-dark/30 border-2 rounded-md py-2.5 px-3 text-sm font-mono text-cyber-white uppercase placeholder-cyber-white/30 focus:outline-none transition-colors disabled:opacity-50 ${
            status === 'invalid'
              ? 'border-red-500/60 focus:border-red-500'
              : 'border-purple-neon/30 focus:border-purple-neon'
          }`}
        />
        <button
          onClick={onApply}
          disabled={isLoading || !code.trim()}
          className="px-4 py-2.5 rounded-md text-sm font-semibold transition-all border border-purple-neon/40 bg-purple-neon/10 text-purple-neon hover:bg-purple-neon/25 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : 'Apply'}
        </button>
      </div>

      {status === 'invalid' && error && (
        <p role="alert" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
