import { useState, useEffect, memo } from 'react';

// Lucide se carga una vez y se cachea para todas las instancias
let _cache: Record<string, React.ComponentType<any>> | null = null;
let _promise: Promise<Record<string, React.ComponentType<any>>> | null = null;

function loadLucide(): Promise<Record<string, React.ComponentType<any>>> {
  if (_cache) return Promise.resolve(_cache);
  if (!_promise) {
    _promise = import('lucide-react').then(m => {
      _cache = m as unknown as Record<string, React.ComponentType<any>>;
      return _cache;
    });
  }
  return _promise;
}

interface Props {
  name: string;
  className?: string;
}

const DynamicIcon = memo(function DynamicIcon({ name, className }: Props) {
  const [icons, setIcons] = useState<Record<string, React.ComponentType<any>> | null>(_cache);

  useEffect(() => {
    if (icons) return;
    let active = true;
    loadLucide().then(m => { if (active) setIcons(m); });
    return () => { active = false; };
  }, [icons]);

  if (!icons) return <div className={className} aria-hidden="true" />;
  const Icon = icons[name] || icons['Package'];
  return <Icon className={className} />;
});

DynamicIcon.displayName = 'DynamicIcon';

export default DynamicIcon;
