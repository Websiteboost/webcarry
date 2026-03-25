import type { ReactElement } from 'react';
import { useLanguage, type Locale } from '../../hooks/useLanguage';

// ─── Inline SVG Flags ────────────────────────────────────────────────────────

function FlagUS() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 14"
      width="20"
      height="14"
      aria-hidden="true"
      style={{ display: 'block', borderRadius: '1px' }}
    >
      {/* 13 alternating stripes */}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
        <rect
          key={i}
          x="0" y={i * (14/13)} width="20" height={14/13 + 0.5}
          fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'}
        />
      ))}
      {/* Blue canton */}
      <rect x="0" y="0" width="8" height="7.5" fill="#3C3B6E" />
      {/* Stars — 5×4 + 4×3 = simplified dots */}
      {[
        [1,1],[2.6,1],[4.2,1],[5.8,1],[7.3,1],
        [1.8,2.1],[3.4,2.1],[5,2.1],[6.6,2.1],
        [1,3.2],[2.6,3.2],[4.2,3.2],[5.8,3.2],[7.3,3.2],
        [1.8,4.3],[3.4,4.3],[5,4.3],[6.6,4.3],
        [1,5.4],[2.6,5.4],[4.2,5.4],[5.8,5.4],[7.3,5.4],
        [1.8,6.5],[3.4,6.5],[5,6.5],[6.6,6.5],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.55" fill="#FFFFFF" />
      ))}
    </svg>
  );
}

function FlagES() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 14"
      width="20"
      height="14"
      aria-hidden="true"
      style={{ display: 'block', borderRadius: '1px' }}
    >
      {/* Red stripe top */}
      <rect x="0" y="0"    width="20" height="3.5"  fill="#c60b1e" />
      {/* Yellow stripe middle */}
      <rect x="0" y="3.5"  width="20" height="7"    fill="#ffc400" />
      {/* Red stripe bottom */}
      <rect x="0" y="10.5" width="20" height="3.5"  fill="#c60b1e" />
      {/* Simplified coat of arms — vertical bars */}
      <rect x="6.5" y="4.5" width="1.2" height="4.5" fill="#c60b1e" rx="0.2" />
      <rect x="9.2" y="4.5" width="1.2" height="4.5" fill="#c60b1e" rx="0.2" />
      {/* Crown-like top */}
      <rect x="6.2" y="3.8" width="4.5" height="0.8" fill="#c60b1e" rx="0.2" />
      {/* Base */}
      <rect x="6.2" y="8.8" width="4.5" height="0.6" fill="#c60b1e" rx="0.1" />
    </svg>
  );
}

// ─── Options config ───────────────────────────────────────────────────────────

const OPTIONS: { value: Locale; label: string; Flag: () => ReactElement }[] = [
  { value: 'en', label: 'English', Flag: FlagUS },
  { value: 'es', label: 'Español', Flag: FlagES },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LanguageSelector() {
  const { locale, changeLocale } = useLanguage();

  return (
    <div className="flex items-center gap-2.5" role="group" aria-label="Language selector">
      <div
        className="relative flex items-center rounded-md overflow-hidden"
        style={{
          border: '1px solid rgba(168,85,247,0.25)',
          background: 'rgba(26,11,46,0.6)',
        }}
      >
        {/* Sliding active indicator */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-1/2 rounded-[3px] transition-transform duration-200 ease-out"
          style={{
            background: 'rgba(168,85,247,0.15)',
            border: '1px solid rgba(168,85,247,0.5)',
            transform: locale === 'es' ? 'translateX(100%)' : 'translateX(0%)',
          }}
        />

        {OPTIONS.map(({ value, label, Flag }) => {
          const isActive = locale === value;
          return (
            <button
              key={value}
              onClick={() => !isActive && changeLocale(value)}
              aria-pressed={isActive}
              aria-label={`Language: ${label}`}
              title={label}
              className={`relative z-10 flex items-center justify-center px-2.5 py-1.5 transition-opacity duration-150 cursor-pointer ${
                isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <Flag />
            </button>
          );
        })}
      </div>
    </div>
  );
}
