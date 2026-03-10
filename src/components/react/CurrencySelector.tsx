import { useCurrency, type Currency } from '../../hooks/useCurrency';

interface Props {
  /** USD value of 1 EUR, delivered from the DB via SSR props. */
  euroValue: number;
}

const OPTIONS: { value: Currency; symbol: string; label: string }[] = [
  { value: 'USD', symbol: '$', label: 'USD' },
  { value: 'EUR', symbol: '€', label: 'EUR' },
];

export default function CurrencySelector({ euroValue }: Props) {
  const { currency, changeCurrency } = useCurrency(euroValue);

  return (
    <div className="flex items-center gap-2.5" role="group" aria-label="Currency selector">
      <span className="text-cyber-white/35 text-[10px] font-semibold uppercase tracking-widest select-none">
        Currency
      </span>

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
            transform: currency === 'EUR' ? 'translateX(100%)' : 'translateX(0%)',
          }}
        />

        {OPTIONS.map(({ value, symbol, label }) => {
          const isActive = currency === value;
          return (
            <button
              key={value}
              onClick={() => changeCurrency(value)}
              aria-pressed={isActive}
              className={`relative z-10 flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wider transition-colors duration-150 ${
                isActive
                  ? 'text-purple-neon'
                  : 'text-cyber-white/35 hover:text-cyber-white/60'
              }`}
            >
              <span>{symbol}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
