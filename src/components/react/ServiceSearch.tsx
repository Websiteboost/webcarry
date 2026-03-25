import { useState, useRef, useEffect, useCallback } from 'react';
import type { Service } from '../../types';

interface CategoryInfo {
  id: string;
  name: string;
}

interface Props {
  services: Service[];
  categories: CategoryInfo[];
  placeholder?: string;
  buyLabel?: string;
  noResultsText?: string;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-pink-neon/25 text-pink-neon rounded-sm px-0.5 not-italic font-bold" style={{ background: 'none', color: 'inherit', fontWeight: 700, textDecoration: 'underline', textDecorationColor: 'rgba(244,114,182,0.7)', textDecorationThickness: '2px', textUnderlineOffset: '3px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function ServiceSearch({ services, categories, placeholder = 'Search services…', buyLabel, noResultsText }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  // ── Filter ────────────────────────────────────────────────────────────────
  const results = query.trim().length < 2 ? [] : services.filter(s => {
    const q = query.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description?.some(d => d.toLowerCase().includes(q)) ||
      (categoryMap.get(s.categoryId) ?? '').toLowerCase().includes(q)
    );
  }).slice(0, 8);

  // ── Navigate to service (reuse existing URL system) ───────────────────────
  const openService = useCallback((service: Service) => {
    const url = new URL(window.location.href);
    url.searchParams.set('category', service.categoryId);
    url.searchParams.set('service', service.id);
    history.pushState({ categoryId: service.categoryId, serviceId: service.id }, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
    setQuery('');
    setIsOpen(false);
    setMobileExpanded(false);
    setActiveIndex(-1);
  }, []);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') { setQuery(''); setIsOpen(false); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      openService(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setQuery('');
      setIsOpen(false);
    }
  };

  // ── Click-outside ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setMobileExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reset activeIndex when results change
  useEffect(() => { setActiveIndex(-1); }, [query]);

  // Auto-focus mobile input when expanded
  useEffect(() => {
    if (mobileExpanded) mobileInputRef.current?.focus();
  }, [mobileExpanded]);

  // ── Shared dropdown ───────────────────────────────────────────────────────
  const Dropdown = () => (
    <>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto rounded-xl border border-purple-neon/30 shadow-2xl shadow-purple-neon/10 overflow-hidden"
          style={{ background: 'rgba(26,11,46,0.97)', backdropFilter: 'blur(16px)' }}>
          {results.map((service, idx) => {
            const catName = categoryMap.get(service.categoryId) ?? '';
            const isActive = idx === activeIndex;
            return (
              <button
                key={service.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => openService(service)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-l-2 group ${
                  isActive
                    ? 'bg-purple-neon/15 border-l-pink-neon'
                    : 'border-l-transparent hover:bg-purple-neon/8 hover:border-l-purple-neon/60'
                }`}
                style={{ borderBottom: idx < results.length - 1 ? '1px solid rgba(168,85,247,0.1)' : 'none' }}
              >
                {/* Icon */}
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-pink-neon/20' : 'bg-purple-neon/10 group-hover:bg-purple-neon/20'
                }`}>
                  <svg className={`w-4 h-4 ${isActive ? 'text-pink-neon' : 'text-purple-neon'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-cyber-white truncate">
                    {highlight(service.title, query)}
                  </div>
                  {catName && (
                    <div className="text-xs text-cyber-white/40 mt-0.5 truncate capitalize">
                      {catName.replace(/-/g, ' ')}
                    </div>
                  )}
                </div>

                {/* CTA chip */}
                <div className={`shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                  isActive
                    ? 'bg-pink-neon/20 text-pink-neon border border-pink-neon/40'
                    : 'bg-purple-neon/10 text-purple-neon/70 border border-purple-neon/20'
                }`}>
                  {buyLabel ?? 'Buy'}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {isOpen && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-purple-neon/20 px-4 py-5 text-center"
          style={{ background: 'rgba(26,11,46,0.97)', backdropFilter: 'blur(16px)' }}>
          <p className="text-cyber-white/40 text-sm">{noResultsText ?? 'No services match'} <span className="text-cyber-white/70">"{query}"</span></p>
        </div>
      )}
    </>
  );

  return (
    <div ref={containerRef} className="relative">

      {/* ── DESKTOP: full bar (hidden on mobile) ──────────────────────────── */}
      <div className="hidden lg:block relative">
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
          isOpen ? 'border-purple-neon/60 shadow-[0_0_0_3px_rgba(168,85,247,0.1)]' : 'border-purple-neon/25 hover:border-purple-neon/45'
        }`}
          style={{ background: 'rgba(26,11,46,0.6)', backdropFilter: 'blur(12px)' }}>
          <svg className="w-4 h-4 text-purple-neon/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-cyber-white placeholder-cyber-white/30 outline-none min-w-0"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus(); }}
              className="shrink-0 text-cyber-white/30 hover:text-cyber-white/70 transition-colors p-0.5 rounded">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <Dropdown />
      </div>

      {/* ── MOBILE: icon button that expands to full bar ───────────────────── */}
      <div className="lg:hidden">
        {!mobileExpanded ? (
          <button
            onClick={() => { setMobileExpanded(true); }}
            className="flex items-center justify-center p-3 glass-effect rounded-lg border border-purple-neon/30 hover:border-purple-neon transition-colors"
            aria-label="Search services"
          >
            <svg className="w-6 h-6 text-cyber-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        ) : (
          <div className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl border border-purple-neon/60 shadow-[0_0_0_3px_rgba(168,85,247,0.1)]"
            style={{ background: 'rgba(26,11,46,0.95)', backdropFilter: 'blur(16px)', minWidth: '200px' }}>
            <svg className="w-4 h-4 text-purple-neon/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={mobileInputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-cyber-white placeholder-cyber-white/30 outline-none w-32"
              autoComplete="off"
              spellCheck={false}
            />
            <button onClick={() => { setMobileExpanded(false); setQuery(''); setIsOpen(false); }}
              className="shrink-0 text-cyber-white/40 hover:text-cyber-white/80 transition-colors p-1 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {/* Mobile dropdown anchored to this container */}
        <Dropdown />
      </div>
    </div>
  );
}
