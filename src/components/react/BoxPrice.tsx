import { useState, useCallback, useEffect, memo } from 'react';
import type { BoxPriceItem } from '../../types';

interface Props {
  values: BoxPriceItem[];
  onSelectionChange: (selectedValues: number[]) => void;
}

function BoxPrice({ values, onSelectionChange }: Props) {
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());

  // Notificar cambios cuando selectedIndexes cambie
  useEffect(() => {
    const selectedValues = Array.from(selectedIndexes).map(idx => values[idx].value);
    onSelectionChange(selectedValues);
  }, [selectedIndexes, values, onSelectionChange]);

  const handleToggle = useCallback((index: number) => {
    setSelectedIndexes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  if (values.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="block text-base font-medium text-cyber-white">
        Select Amount
      </label>
      
      {/* Grid responsivo que se adapta al contenido */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {values.map((item, index) => {
          const isSelected = selectedIndexes.has(index);
          const isLongLabel = item.label && item.label.length > 6;
          
          return (
            <button
              key={`box-${index}`}
              onClick={() => handleToggle(index)}
              className={`py-4 px-4 rounded-md font-bold text-lg transition-all ${
                isSelected
                  ? 'bg-green-neon/20 border-2 border-green-neon text-green-neon'
                  : 'bg-purple-dark/30 border-2 border-purple-neon/30 text-cyber-white hover:border-purple-neon/60'
              } ${isLongLabel ? 'col-span-2' : ''}`}
              style={{
                boxShadow: isSelected 
                  ? '0 0 8px rgba(16, 185, 129, 0.4)' 
                  : 'none'
              }}
            >
              <div className="flex flex-col items-center gap-1">
                {/* Icono de check cuando está seleccionado */}
                {isSelected && (
                  <svg 
                    className="w-5 h-5 mb-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))'
                    }}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                )}
                
                {/* Título o Valor */}
                {item.label ? (
                  <div className="flex flex-col items-center">
                    <span className="text-base font-semibold text-center">{item.label}</span>
                    <span className="text-sm opacity-80">${item.value}</span>
                  </div>
                ) : (
                  <span className="text-xl font-bold">${item.value}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Indicador de selección múltiple */}
      {selectedIndexes.size > 0 && (
        <div className="glass-effect rounded-md p-3 border border-green-neon/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full bg-green-neon animate-pulse" 
                style={{boxShadow: '0 0 5px rgba(16,185,129,0.8)'}}
              />
              <span className="text-sm text-cyber-white/70">
                {selectedIndexes.size} amount{selectedIndexes.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <span className="text-base font-bold text-green-neon">
              +${Array.from(selectedIndexes).map(idx => values[idx].value).reduce((sum, val) => sum + val, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BoxPrice);
