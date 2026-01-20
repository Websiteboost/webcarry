import { useState, useCallback, memo } from 'react';

interface BoxTitleOption {
  label: string;
  value: string;
}

interface Props {
  options: BoxTitleOption[];
}

function BoxTitle({ options }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setSelectedOption(prev => prev === index ? null : index);
  }, []);

  if (options.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Grid responsivo para mostrar títulos como cajas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {options.map((option, index) => {
          const isLongLabel = option.label.length > 6;
          const isSelected = selectedOption === index;
          
          return (
            <button
              key={`title-${index}`}
              onClick={() => handleToggle(index)}
              className={`py-4 px-5 rounded-md font-semibold text-base transition-all text-center cursor-pointer ${
                isLongLabel ? 'col-span-2' : ''
              } ${
                isSelected
                  ? 'bg-blue-neon/20 border-2 border-blue-neon text-blue-neon'
                  : 'bg-purple-dark/30 border-2 border-transparent text-cyber-white hover:border-purple-neon/50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{option.label}</span>
                {option.value && <span className="text-sm opacity-80">{option.value}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Indicador de selección */}
      {selectedOption !== null && (
        <div className="glass-effect rounded-md p-3 border border-blue-neon/20">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-neon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-cyber-white/70">
              Selected: {options[selectedOption].label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BoxTitle);
