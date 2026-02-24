import { useState, useEffect } from 'react';
import type { SelectOption } from '../../types';

interface Props {
  title: string;
  options: SelectOption[];
  onValueChange: (value: number) => void;
  selectorId: string;
}

// Genera una clave única para cada opción usando su índice y valor.
// Formato: "índice:valor" → siempre único, y el valor numérico real es recuperable.
function makeOptionKey(index: number, value: number): string {
  return `${index}:${value}`;
}

// Extrae el valor numérico real de una clave compuesta "índice:valor".
function parseOptionKey(key: string): number {
  const parts = key.split(':');
  const num = parseFloat(parts[1]);
  return isNaN(num) ? 0 : num;
}

export default function CustomSelector({ title, options, onValueChange, selectorId }: Props) {
  // Estado guardado como clave compuesta para evitar colisiones entre opciones con el mismo valor
  const [selectedKey, setSelectedKey] = useState<string>('');

  // Reset cuando cambia el servicio
  useEffect(() => {
    setSelectedKey('');
    onValueChange(0);
  }, [selectorId, options]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    setSelectedKey(raw);
    if (raw === '') {
      onValueChange(0);
    } else {
      onValueChange(parseOptionKey(raw));
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor={selectorId} className="block text-base font-medium text-cyber-white mb-3">
        {title}
      </label>
      
      <div className="relative">
        <select
          id={selectorId}
          value={selectedKey}
          onChange={handleChange}
          style={{
            backgroundImage: 'none',
          }}
          className="w-full bg-purple-dark/30 border-2 border-purple-neon/30 rounded-md py-4 px-4 pr-10 text-base text-cyber-white focus:border-purple-neon focus:outline-none transition-colors appearance-none cursor-pointer [&>option]:bg-[#1a0b2e] [&>option]:text-[#e0e7ff] [&>option]:py-3 [&>option]:px-4 [&>option:checked]:bg-purple-neon/20 [&>option:checked]:text-purple-neon"
        >
          <option value="">Choose...</option>
          {options.map((option, index) => (
            <option key={index} value={makeOptionKey(index, option.value)}>
              {option.label} {option.value > 0 ? `+$${option.value}` : ''}
            </option>
          ))}
        </select>
        
        {/* Custom Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-purple-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
