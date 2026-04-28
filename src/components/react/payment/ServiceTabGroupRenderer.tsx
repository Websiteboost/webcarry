import { type ReactNode, useRef, useState, useCallback, useEffect } from 'react';
import type { ServiceComponent } from '../../../types';

interface Props {
  group: ServiceComponent;
  activeTabIndex: number;
  onTabChange: (tabIndex: number) => void;
  hasValidationError: boolean;
  renderChild: (child: ServiceComponent) => ReactNode;
}

export default function ServiceTabGroupRenderer({
  group,
  activeTabIndex,
  onTabChange,
  hasValidationError,
  renderChild,
}: Props) {
  const tabs = (group.data?.tabs ?? []) as Array<{ title: string; children: ServiceComponent[] }>;
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFades = useCallback(() => {
    const el = tabBarRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  // Check on mount and whenever tabs change
  useEffect(() => {
    updateFades();
    const el = tabBarRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateFades, tabs.length]);

  if (tabs.length === 0) return null;

  const activeChildren = tabs[activeTabIndex]?.children ?? [];

  return (
    <div className={`mb-6 rounded-lg overflow-hidden border transition-colors ${hasValidationError ? 'border-red-500/50' : 'border-cyan-400/30'}`}>

      {/* Tab bar wrapper — handles fades */}
      <div className="relative border-b border-cyan-400/20 bg-cyan-400/5">

        {/* Left fade — visible when scrolled right */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 transition-opacity duration-200 bg-linear-to-r from-slate-900/70 to-transparent ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Scrollable tab list */}
        <div
          ref={tabBarRef}
          role="tablist"
          className="flex overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={updateFades}
        >
          {tabs.map((tab, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={activeTabIndex === i}
              onClick={() => onTabChange(i)}
              className={`relative shrink-0 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset ${
                activeTabIndex === i
                  ? 'text-cyan-400 bg-cyan-400/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {tab.title}
              {activeTabIndex === i && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right fade — visible when more tabs exist to the right */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 transition-opacity duration-200 bg-linear-to-l from-slate-900/70 to-transparent ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* Validation error strip */}
      {hasValidationError && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium px-4 py-2 bg-red-500/5 border-b border-red-500/20">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          This section has required fields
        </div>
      )}

      {/* Tab content */}
      <div className="px-4 pt-3 pb-1">
        {activeChildren.length > 0
          ? activeChildren.map((child, i) => (
              <span key={(child as any).id ?? i}>
                {renderChild(child as ServiceComponent)}
              </span>
            ))
          : (
            <p className="text-center py-6 text-sm text-gray-500">No options available in this tab</p>
          )
        }
      </div>
    </div>
  );
}
