import { useState, useCallback, memo } from 'react';

interface BoxTitleOption {
  label: string;
  value: string;
}

interface Props {
  options: BoxTitleOption[];
}

function BoxTitle({ options }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(new Set());

  const handleToggle = useCallback((index: number) => {
    setSelectedOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  if (options.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Grid responsivo para mostrar títulos como cajas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {options.map((option, index) => {
          const isLongLabel = option.label.length > 6;
          const isSelected = selectedOptions.has(index);
          
          return (
            <button
              key={`title-${index}`}
              onClick={() => handleToggle(index)}
              className={`py-4 px-4 rounded-md font-semibold text-base transition-all text-center cursor-pointer ${
                isLongLabel ? 'col-span-2' : ''
              } ${
                isSelected
                  ? 'bg-purple-neon/20 border-2 border-purple-neon text-purple-neon'
                  : 'bg-purple-dark/30 border-2 border-purple-neon/30 text-cyber-white hover:border-purple-neon/60'
              }`}
              style={{
                boxShadow: isSelected 
                  ? '0 0 8px rgba(168, 85, 247, 0.4)' 
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
                      filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.8))'
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
                <span className={`font-bold ${isSelected ? 'text-purple-neon' : 'text-cyber-white'}`}>
                  {option.label}
                </span>
                <span className="text-sm opacity-80">{option.value}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Indicador de selección */}
      {selectedOptions.size > 0 && (
        <div className="glass-effect rounded-md p-3 border border-purple-neon/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full bg-purple-neon animate-pulse" 
                style={{boxShadow: '0 0 5px rgba(168,85,247,0.8)'}}
              />
              <span className="text-sm text-cyber-white/70">
                {selectedOptions.size} option{selectedOptions.size > 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BoxTitle);
