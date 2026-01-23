import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import type { BarPrice } from '../../types';

interface Props {
  barPrice: BarPrice;
  onValueChange: (minValue: number, maxValue: number) => void;
  title?: string;
}

function IncrementalBar({ barPrice, onValueChange, title = "Select Value" }: Props) {
  const { defaultRange, progressValue = 1, mode, breakpoints } = barPrice;
  
  // Calcular initValue y finalValue según el modo
  let initValue: number;
  let finalValue: number;
  
  if (mode === 'breakpoints' && breakpoints && breakpoints.length > 0) {
    // En modo breakpoints, calcular límites desde los breakpoints
    initValue = breakpoints[0].initValue;
    finalValue = breakpoints[breakpoints.length - 1].finalValue;
  } else {
    // En modo simple o si no hay breakpoints, usar del nivel raíz
    initValue = barPrice.initValue;
    finalValue = barPrice.finalValue;
  }
  
  // Usar defaultRange si está disponible, sino usar los límites calculados
  const initialMinValue = defaultRange?.start ?? initValue;
  const initialMaxValue = defaultRange?.end ?? finalValue;
  
  const [minValue, setMinValue] = useState(initialMinValue);
  const [maxValue, setMaxValue] = useState(initialMaxValue);
  const [draggingHandle, setDraggingHandle] = useState<'min' | 'max' | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Notificar cambios solo cuando sea necesario
  useEffect(() => {
    onValueChange(minValue, maxValue);
  }, [minValue, maxValue, onValueChange]);

  // Calcular porcentajes memoizados
  const minPercentage = useMemo(() => {
    return ((minValue - initValue) / (finalValue - initValue)) * 100;
  }, [minValue, initValue, finalValue]);

  const maxPercentage = useMemo(() => {
    return ((maxValue - initValue) / (finalValue - initValue)) * 100;
  }, [maxValue, initValue, finalValue]);

  // Memoizar función de actualización
  const updateValueFromPosition = useCallback((clientX: number, handle: 'min' | 'max') => {
    if (!barRef.current) return;
    
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const range = finalValue - initValue;
    let newValue = initValue + (percentage * range);
    
    // Redondear al progressValue más cercano (este es el incremento visual)
    newValue = Math.round(newValue / progressValue) * progressValue;
    newValue = Math.max(initValue, Math.min(newValue, finalValue));
    
    if (handle === 'min') {
      // Si el min intenta superar al max, empujar max
      if (newValue >= maxValue) {
        const newMax = Math.min(maxValue + progressValue, finalValue);
        setMaxValue(newMax);
        setMinValue(Math.min(newValue, newMax - progressValue));
      } else {
        setMinValue(newValue);
      }
    } else {
      // Si el max intenta bajar del min, empujar min
      if (newValue <= minValue) {
        const newMin = Math.max(minValue - progressValue, initValue);
        setMinValue(newMin);
        setMaxValue(Math.max(newValue, newMin + progressValue));
      } else {
        setMaxValue(newValue);
      }
    }
  }, [initValue, finalValue, progressValue, minValue, maxValue]);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: 'min' | 'max') => {
    e.stopPropagation();
    setDraggingHandle(handle);
    updateValueFromPosition(e.clientX, handle);
  }, [updateValueFromPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggingHandle) {
      updateValueFromPosition(e.clientX, draggingHandle);
    }
  }, [draggingHandle, updateValueFromPosition]);

  const handleMouseUp = useCallback(() => {
    setDraggingHandle(null);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent, handle: 'min' | 'max') => {
    e.stopPropagation();
    setDraggingHandle(handle);
    updateValueFromPosition(e.touches[0].clientX, handle);
  }, [updateValueFromPosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (draggingHandle && e.touches[0]) {
      updateValueFromPosition(e.touches[0].clientX, draggingHandle);
    }
  }, [draggingHandle, updateValueFromPosition]);

  useEffect(() => {
    if (draggingHandle) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [draggingHandle, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="space-y-4">
      {/* Título */}
      <div className="flex items-center justify-between">
        <label className="block text-base font-medium text-cyber-white">
          {title}
        </label>
      </div>

      {/* Barra de progreso interactiva */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-cyber-white/50">
          <span>Min: {initValue}</span>
          <span>Max: {finalValue}</span>
        </div>
        
        {/* Contenedor de la barra */}
        <div 
          ref={barRef}
          className="relative h-6 bg-purple-dark/40 rounded-full border border-purple-neon/30 cursor-pointer select-none"
        >
          {/* Barra de progreso entre los dos valores */}
          <div
            className="absolute top-0 h-full rounded-full pointer-events-none"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
              background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #38bdf8 100%)',
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.4)',
              willChange: draggingHandle ? 'left, width' : 'auto'
            }}
          />
          
          {/* Punto arrastrable MIN (izquierda) */}
          <div
            onMouseDown={(e) => handleMouseDown(e, 'min')}
            onTouchStart={(e) => handleTouchStart(e, 'min')}
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-cyber-white bg-pink-neon shadow-lg cursor-grab active:cursor-grabbing z-10"
            style={{
              left: `${minPercentage}%`,
              transform: `translate(-50%, -50%) scale(${draggingHandle === 'min' ? 1.2 : 1})`,
              boxShadow: `0 0 15px rgba(236, 72, 153, ${draggingHandle === 'min' ? 1 : 0.8}), 0 0 25px rgba(236, 72, 153, ${draggingHandle === 'min' ? 0.6 : 0.4})`,
              willChange: draggingHandle === 'min' ? 'transform, left' : 'auto',
              transition: draggingHandle === 'min' ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* Punto interno brillante */}
            <div className="absolute inset-1 rounded-full bg-linear-to-br from-pink-neon to-purple-neon" />
          </div>

          {/* Punto arrastrable MAX (derecha) */}
          <div
            onMouseDown={(e) => handleMouseDown(e, 'max')}
            onTouchStart={(e) => handleTouchStart(e, 'max')}
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-cyber-white bg-blue-neon shadow-lg cursor-grab active:cursor-grabbing z-10"
            style={{
              left: `${maxPercentage}%`,
              transform: `translate(-50%, -50%) scale(${draggingHandle === 'max' ? 1.2 : 1})`,
              boxShadow: `0 0 15px rgba(56, 189, 248, ${draggingHandle === 'max' ? 1 : 0.8}), 0 0 25px rgba(56, 189, 248, ${draggingHandle === 'max' ? 0.6 : 0.4})`,
              willChange: draggingHandle === 'max' ? 'transform, left' : 'auto',
              transition: draggingHandle === 'max' ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* Punto interno brillante */}
            <div className="absolute inset-1 rounded-full bg-linear-to-br from-blue-neon to-cyan-400" />
          </div>
        </div>

        {/* Valores actuales con rango */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center glass-effect rounded-md p-2 border border-pink-neon/20">
            <span className="text-xs text-cyber-white/60 block mb-1">From</span>
            <span className="text-xl font-bold text-pink-neon" style={{textShadow: '0 0 10px rgba(236, 72, 153, 0.6)'}}>
              {minValue}
            </span>
          </div>
          
          <svg className="w-5 h-5 text-purple-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          
          <div className="flex-1 text-center glass-effect rounded-md p-2 border border-blue-neon/20">
            <span className="text-xs text-cyber-white/60 block mb-1">To</span>
            <span className="text-xl font-bold text-blue-neon" style={{textShadow: '0 0 10px rgba(56, 189, 248, 0.6)'}}>
              {maxValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(IncrementalBar);
