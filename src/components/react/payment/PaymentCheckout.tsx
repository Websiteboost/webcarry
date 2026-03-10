import PayPalButton from '../PayPalButton';
import DiscountInput from './DiscountInput';
import type { DiscountCode } from '../../../types';
import type { DiscountStatus } from './useDiscount';

function formatTime(hours: number): string {
  if (hours < 24) return `~${hours}h`;
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  return h > 0 ? `~${d}d ${h}h` : `~${d} day${d !== 1 ? 's' : ''}`;
}

interface Props {
  finalPrice: number;
  basePrice: number;
  paymentDescription: string;
  estimatedTime: number;
  formatPrice: (usd: number | string) => string;
  // Discount
  discountCode: string;
  discountStatus: DiscountStatus;
  discountError: string | null;
  discountApplied: DiscountCode | null;
  discountAmount: number;
  onDiscountCodeChange: (value: string) => void;
  onDiscountApply: () => void;
  onDiscountRemove: () => void;
  onDiscountKeyDown: (e: React.KeyboardEvent) => void;
  // Payment
  acceptedTerms: boolean;
  onTermsChange: (accepted: boolean) => void;
  selectedPaymentMethod: 'paypal' | 'card' | null;
  onPaymentMethodChange: (method: 'paypal' | 'card') => void;
  showPayPalButton: boolean;
  onPaymentClick: () => void;
  onPayPalSuccess: (details: any) => void;
  onPayPalError: (error: any) => void;
  onPayPalCancel: () => void;
  paymentDisclaimer?: string;
}

export default function PaymentCheckout({
  finalPrice,
  basePrice,
  paymentDescription,
  estimatedTime,
  formatPrice,
  discountCode,
  discountStatus,
  discountError,
  discountApplied,
  discountAmount,
  onDiscountCodeChange,
  onDiscountApply,
  onDiscountRemove,
  onDiscountKeyDown,
  acceptedTerms,
  onTermsChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  showPayPalButton,
  onPaymentClick,
  onPayPalSuccess,
  onPayPalError,
  onPayPalCancel,
  paymentDisclaimer,
}: Props) {
  return (
    <>
      {/* Terms Checkbox */}
      <div className="mb-6">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-purple-neon bg-purple-dark/30 text-pink-neon focus:ring-2 focus:ring-pink-neon focus:ring-offset-0 cursor-pointer"
          />
          <span className="ml-3 text-base text-cyber-white/80">
            I accept the{' '}
            <a
              href="/policies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-neon hover:text-pink-neon underline"
            >
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
            onClick={() => onPaymentMethodChange('paypal')}
            className={`flex-1 flex items-center justify-center gap-2 py-5 px-5 rounded-md font-semibold text-base transition-all ${
              selectedPaymentMethod === 'paypal'
                ? 'bg-blue-neon/20 border-2 border-blue-neon'
                : 'bg-purple-dark/30 border-2 border-transparent hover:border-purple-neon/50'
            }`}
          >
            <svg className="w-6 h-6 text-blue-neon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L9.718 7.08a.972.972 0 0 1 .957-.817h4.992c1.006 0 1.746.09 2.262.261.088.03.17.059.246.09.024.01.047.024.066.038.503.222.863.572 1.056 1.106.136.378.205.804.226 1.284a4.49 4.49 0 0 1-.015.436h.002z" />
            </svg>
            <span className="text-blue-neon">PayPal</span>
          </button>

          <button
            onClick={() => onPaymentMethodChange('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-5 px-5 rounded-md font-semibold text-base transition-all ${
              selectedPaymentMethod === 'card'
                ? 'bg-green-neon/20 border-2 border-green-neon'
                : 'bg-purple-dark/30 border-2 border-transparent hover:border-purple-neon/50'
            }`}
          >
            <svg className="w-6 h-6 text-green-neon" fill="currentColor" viewBox="0 0 48 32">
              <rect x="0" y="0" width="48" height="32" rx="4" opacity="0.3" />
              <rect x="4" y="8" width="40" height="4" />
            </svg>
            <span className="text-green-neon">Card</span>
          </button>
        </div>
      </div>

      {/* Total and Pay Button */}
      <div className="space-y-4">
        {/* Disclaimer */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3 flex items-start gap-2">
          <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-yellow-500 font-semibold text-sm mb-1">Important Notice</p>
            <p className="text-yellow-200/90 text-xs leading-relaxed">
              {paymentDisclaimer || 'After completing your payment, please create a ticket in our Discord server to start your order. Join BattleBoost Discord community for support!'}
            </p>
          </div>
        </div>

        {/* Discount Code */}
        <DiscountInput
          code={discountCode}
          status={discountStatus}
          error={discountError}
          applied={discountApplied}
          discountAmount={discountAmount}
          formatPrice={formatPrice}
          onCodeChange={onDiscountCodeChange}
          onApply={onDiscountApply}
          onRemove={onDiscountRemove}
          onKeyDown={onDiscountKeyDown}
        />

        {/* Total + Estimated Time */}
        <div className="glass-effect rounded-md border border-purple-neon/30 overflow-hidden">
          {discountAmount > 0 && (
            <div className="flex items-center justify-between px-5 pt-4 pb-1">
              <span className="text-sm text-cyber-white/40 line-through">{formatPrice(basePrice)}</span>
              <span className="text-xs font-semibold text-green-neon bg-green-neon/10 px-2 py-0.5 rounded-full">
                −{formatPrice(discountAmount)} saved
              </span>
            </div>
          )}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <span className="text-cyber-white font-medium text-base">Total to pay:</span>
            <span
              className={`text-3xl font-bold ${ discountAmount > 0 ? 'text-green-neon' : 'text-cyber-white'}`}
              style={{ textShadow: discountAmount > 0 ? '0 0 8px rgba(16,185,129,0.5), 0 0 16px rgba(16,185,129,0.3)' : '0 0 5px rgba(16,185,129,0.3), 0 0 10px rgba(16,185,129,0.2)' }}
            >
              {formatPrice(finalPrice)}
            </span>
          </div>
          {estimatedTime > 0 && (
            <div className="flex items-center gap-2 px-5 py-2.5 border-t border-purple-neon/15 bg-purple-neon/5">
              <svg className="w-3.5 h-3.5 text-blue-neon shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-cyber-white/60">
                Estimated delivery:{' '}
                <span className="text-blue-neon font-semibold">{formatTime(estimatedTime)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Pay Button / PayPal flow */}
        {selectedPaymentMethod === 'paypal' && showPayPalButton ? (
          <div className="space-y-3">
            <PayPalButton
              amount={finalPrice}
              currency="USD"
              description={paymentDescription}
              onSuccess={onPayPalSuccess}
              onError={onPayPalError}
              onCancel={onPayPalCancel}
              disabled={!acceptedTerms}
            />
            <button
              onClick={onPayPalCancel}
              className="w-full py-3 rounded-md font-medium text-base bg-purple-dark/30 text-cyber-white hover:bg-purple-dark/50 transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onPaymentClick}
            disabled={!acceptedTerms || !selectedPaymentMethod}
            className={`w-full py-5 rounded-md font-bold text-lg transition-all ${
              acceptedTerms && selectedPaymentMethod
                ? 'bg-linear-to-r from-pink-neon to-purple-neon text-cyber-white hover:shadow-lg hover:shadow-pink-neon/50 hover:scale-105'
                : 'bg-purple-dark/30 text-cyber-white/40 cursor-not-allowed'
            }`}
          >
            Pay Now
          </button>
        )}
      </div>
    </>
  );
}
