import { useState, type ReactNode } from 'react';
import type { ServiceComponent } from '../../../types';

interface Props {
  group: ServiceComponent;
  /** Render function provided by the parent to avoid circular imports */
  renderChild: (child: ServiceComponent) => ReactNode;
  /** True when showValidation is active and at least one required child is unsatisfied */
  hasValidationError: boolean;
}

export default function ServiceGroupRenderer({ group, renderChild, hasValidationError }: Props) {
  const collapseByDefault = group.data?.collapseByDefault ?? false;
  const [isOpen, setIsOpen] = useState(!collapseByDefault);

  const title = group.data?.title || 'Options';
  const panelId = `group-panel-${group.id}`;
  const triggerId = `group-trigger-${group.id}`;
  const children = group.children ?? [];

  if (children.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-purple-neon/30 overflow-hidden">
      {/* Accordion trigger */}
      <button
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 glass-effect text-left transition-colors hover:bg-purple-neon/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-neon/60 focus-visible:ring-inset"
      >
        <span className="text-base font-semibold text-cyber-white leading-tight">{title}</span>

        <div className="flex items-center gap-2 shrink-0">
          {/* Error indicator — visible when validation fired and a required child is unsatisfied */}
          {hasValidationError && (
            <span
              aria-label="This group has required fields"
              className="flex items-center gap-1 text-red-400 text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Required
            </span>
          )}

          {/* Chevron — rotates 180° when open */}
          <svg
            className={`w-4 h-4 text-purple-neon transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/*
        CSS Grid trick for smooth height animation without JS-measured heights.
        grid-rows-[1fr] → full height  |  grid-rows-[0fr] → collapsed (0 height)
        The inner div overflow-hidden clips content during transition.
      */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pt-3 pb-1 border-t border-purple-neon/20">
            {children.map(child => renderChild(child))}
          </div>
        </div>
      </div>
    </div>
  );
}
