import { useState, useCallback, useEffect, memo } from 'react';
import type { BoxPriceItem } from '../../types';

interface Props {
  values: BoxPriceItem[];
  onSelectionChange: (selectedValues: number[]) => void;
  formatPrice: (usd: number | string) => string;
  discountPercent?: number;
  showPrice?: boolean;
  style?: 'box' | 'pill';
  selection?: 'multiple' | 'single';
  selectAmountLabel?: string;
  amountSingular?: string;
  amountPlural?: string;
  selectedText?: string;
}

function BoxPrice({
  values,
  onSelectionChange,
  formatPrice,
  discountPercent = 0,
  showPrice = true,
  style = 'box',
  selection = 'multiple',
  selectAmountLabel,
  amountSingular,
  amountPlural,
  selectedText,
}: Props) {
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSelectedIndexes(new Set());
  }, [values]);

  useEffect(() => {
    const selectedValues = Array.from(selectedIndexes).map(idx => {
      const value = values[idx].value;
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
      return isNaN(numValue) ? 0 : numValue;
    });
    onSelectionChange(selectedValues);
  }, [selectedIndexes, values, onSelectionChange]);

  const handleToggle = useCallback((index: number) => {
    setSelectedIndexes(prev => {
      if (selection === 'single') {
        // Único: alterna el seleccionado, deselecciona si ya estaba
        return prev.has(index) ? new Set<number>() : new Set([index]);
      }
      // Múltiple
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, [selection]);

  if (values.length === 0) return null;

  const isPill = style === 'pill';

  const rawTotal = Math.round(
    Array.from(selectedIndexes)
      .map(idx => values[idx].value)
      .reduce((sum, val) => sum + val, 0) * 100
  ) / 100;

  const discountedTotal = discountPercent
    ? Math.round(rawTotal * (1 - discountPercent / 100) * 100) / 100
    : null;

  return (
    <div className="space-y-3">
      {selection !== 'single' && (
        <label className="block text-base font-medium text-cyber-white">
          {selectAmountLabel ?? 'Select Amount'}
        </label>
      )}

      {/* Grid (box) o Flex wrap (pill) */}
      {isPill ? (
        <div className="flex flex-wrap gap-2">
          {values.map((item, index) => {
            const isSelected = selectedIndexes.has(index);
            return (
              <button
                key={`pill-${index}`}
                onClick={() => handleToggle(index)}
                className={`inline-flex items-center gap-1.5 rounded-full py-2 px-5 text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-green-neon/20 border-2 border-green-neon text-green-neon'
                    : 'bg-purple-dark/30 border-2 border-purple-neon/30 text-cyber-white hover:border-purple-neon/60'
                }`}
                style={{ boxShadow: isSelected ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none' }}
              >
                {isSelected && (
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <span className="font-semibold">{item.label || formatPrice(item.value)}</span>
                {showPrice && item.label && (
                  <span className="opacity-70 font-normal">{formatPrice(item.value)}</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {values.map((item, index) => {
            const isSelected = selectedIndexes.has(index);
            const isLongLabel = item.label && item.label.length > 6;
            return (
              <button
                key={`box-${index}`}
                onClick={() => handleToggle(index)}
                className={`py-4 px-4 rounded-md font-bold text-lg transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-green-neon/20 border-2 border-green-neon text-green-neon'
                    : 'bg-purple-dark/30 border-2 border-purple-neon/30 text-cyber-white hover:border-purple-neon/60'
                } ${isLongLabel ? 'col-span-2' : ''}`}
                style={{ boxShadow: isSelected ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none' }}
              >
                {isSelected && (
                  <svg
                    className="w-5 h-5 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {item.label ? (
                  <>
                    <span className="text-base font-semibold text-center">{item.label}</span>
                    {showPrice && (
                      <span className="text-sm opacity-80">{formatPrice(item.value)}</span>
                    )}
                  </>
                ) : (
                  <span className="text-xl font-bold">
                    {showPrice ? formatPrice(item.value) : '—'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Indicador de selección */}
      {selectedIndexes.size > 0 && (selection !== 'single' || showPrice) && (
        <div className="glass-effect rounded-md p-3 border border-green-neon/20">
          <div className="flex items-center justify-between">
            {selection !== 'single' && (
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full bg-green-neon animate-pulse"
                  style={{ boxShadow: '0 0 5px rgba(16,185,129,0.8)' }}
                />
                <span className="text-sm text-cyber-white/70">
                  {selectedIndexes.size} {selectedIndexes.size > 1 ? (amountPlural ?? 'amounts') : (amountSingular ?? 'amount')} {selectedText ?? 'selected'}
                </span>
              </div>
            )}
            {showPrice && (
              <span className="text-base font-bold text-green-neon">
                {discountedTotal !== null ? (
                  <>
                    <span className="line-through opacity-40 text-sm mr-1">+{formatPrice(rawTotal)}</span>
                    +{formatPrice(discountedTotal)}
                  </>
                ) : (
                  <>+{formatPrice(rawTotal)}</>
                )}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BoxPrice);
