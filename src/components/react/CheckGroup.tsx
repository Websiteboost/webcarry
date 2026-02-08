import { useState, useCallback, memo, useEffect } from 'react';
import type { AdditionalOption } from '../../types';

interface Props {
  options: Record<string, AdditionalOption>;
  title?: string;
  onSelectionChange: (selectedValues: number[]) => void;
}

function CheckGroup({ options, title = 'Additional Services', onSelectionChange }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

  // Reset selected options when options change (cuando cambia el servicio)
  useEffect(() => {
    setSelectedOptions(new Set());
    onSelectionChange([]);
  }, [options]);

  const handleToggle = useCallback((optionKey: string) => {
    const newSet = new Set(selectedOptions);
    if (newSet.has(optionKey)) {
      newSet.delete(optionKey);
    } else {
      newSet.add(optionKey);
    }
    setSelectedOptions(newSet);
    
    // Calcular y notificar después de determinar el nuevo estado
    const values = Array.from(newSet).map(key => options[key]?.value || 0);
    onSelectionChange(values);
  }, [selectedOptions, options, onSelectionChange]);

  const optionEntries = Object.entries(options);

  if (optionEntries.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="block text-base font-medium text-cyber-white">
        {title}
      </label>
      
      <div className="space-y-2">
        {optionEntries.map(([key, option]) => {
          const isSelected = selectedOptions.has(key);
          
          return (
            <button
              key={key}
              onClick={() => handleToggle(key)}
              className={`w-full flex items-center justify-between p-4 rounded-md transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-neon/20 border-2 border-purple-neon'
                  : 'bg-purple-dark/30 border-2 border-purple-neon/20 hover:border-purple-neon/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Custom Checkbox */}
                <div 
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-purple-neon border-purple-neon'
                      : 'bg-purple-dark/40 border-purple-neon/40'
                  }`}
                  style={{
                    boxShadow: isSelected ? '0 0 10px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.3)' : 'none'
                  }}
                >
                  {isSelected && (
                    <svg 
                      className="w-4 h-4 text-cyber-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))'
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
                </div>
                
                {/* Label */}
                <span className={`text-base font-medium transition-colors ${
                  isSelected ? 'text-cyber-white' : 'text-cyber-white/80'
                }`}>
                  {option.label}
                </span>
              </div>
              
              {/* Price Badge */}
              <div 
                className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-green-neon/20 text-green-neon border border-green-neon/40'
                    : 'bg-purple-dark/40 text-cyber-white/60 border border-purple-neon/20'
                }`}
                style={{
                  boxShadow: isSelected ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'
                }}
              >
                +${option.value}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Info tooltip */}
      {selectedOptions.size > 0 && (
        <div className="glass-effect rounded-md p-3 border border-blue-neon/20">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-neon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-cyber-white/70">
              {selectedOptions.size} additional service{selectedOptions.size > 1 ? 's' : ''} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CheckGroup);
