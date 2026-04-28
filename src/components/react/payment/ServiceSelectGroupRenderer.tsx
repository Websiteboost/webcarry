import { type ReactNode } from 'react';
import type { ServiceComponent } from '../../../types';

interface Props {
  group: ServiceComponent;
  selectedOptionIndex: number;
  onOptionChange: (optionIndex: number) => void;
  hasValidationError: boolean;
  renderChild: (child: ServiceComponent) => ReactNode;
}

export default function ServiceSelectGroupRenderer({
  group,
  selectedOptionIndex,
  onOptionChange,
  hasValidationError,
  renderChild,
}: Props) {
  const label = (group.data?.label as string | undefined) ?? 'Select an option';
  const options = (group.data?.options ?? []) as Array<{ title: string; children: ServiceComponent[] }>;

  if (options.length === 0) return null;

  const activeChildren = selectedOptionIndex >= 0 ? (options[selectedOptionIndex]?.children ?? []) : [];

  return (
    <div className="mb-6">
      {/* Label */}
      <label className="block text-base font-medium text-cyber-white mb-3">
        {label}
      </label>

      {/* Select wrapper */}
      <div className="relative">
        <select
          value={selectedOptionIndex >= 0 ? selectedOptionIndex : ''}
          onChange={e => onOptionChange(e.target.value === '' ? -1 : Number(e.target.value))}
          className={`w-full bg-purple-dark/30 border-2 rounded-md py-3.5 pl-4 pr-10 text-base text-cyber-white appearance-none focus:outline-none transition-colors cursor-pointer ${
            hasValidationError
              ? 'border-red-500/70 focus:border-red-400'
              : 'border-pink-500/40 hover:border-pink-500/70 focus:border-pink-400'
          }`}
        >
          {options.map((opt, i) => (
            <option key={i} value={i} className="bg-slate-900 text-white">
              {opt.title}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${hasValidationError ? 'text-red-400' : 'text-pink-400'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Validation error message */}
      {hasValidationError && selectedOptionIndex < 0 && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Selection required
        </p>
      )}

      {/* Children of selected option */}
      {activeChildren.length > 0 && (
        <div className="mt-4 pt-4 border-t border-pink-400/20">
          {activeChildren.map((child, i) => (
            <span key={(child as any).id ?? i}>
              {renderChild(child as ServiceComponent)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
