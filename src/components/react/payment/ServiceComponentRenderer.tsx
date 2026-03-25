import { type ChangeEvent } from 'react';
import type { Service, ServiceComponent } from '../../../types';
import type { UiTexts } from '../../../lib/services/ui-texts';
import IncrementalBar from '../IncrementalBar';
import CheckGroup from '../CheckGroup';
import BoxPrice from '../BoxPrice';
import BoxTitle from '../BoxTitle';
import TitleService from '../TitleService';
import CustomSelector from '../CustomSelector';
import ServiceGroupRenderer from './ServiceGroupRenderer';

export interface ComponentHandlers {
  onBarValueChange: (min: number, max: number) => void;
  onBoxPriceChange: (values: number[]) => void;
  onSelectorChange: (selectorId: string, value: number) => void;
  onSelectorSelectionChange: (selectorId: string, hasSelection: boolean) => void;
  onBoxTitleChange: (componentId: string, hasSelection: boolean) => void;
  onAdditionalServicesChange: (values: number[]) => void;
  onCustomPriceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPresetPriceSelect: (price: number | string) => void;
}

interface Props {
  component: ServiceComponent;
  service: Service;
  handlers: ComponentHandlers;
  selectedPrice: number | null;
  customPrice: string;
  showValidation: boolean;
  isComponentSatisfied: (c: ServiceComponent) => boolean;
  formatPrice: (usd: number | string) => string;
  currencySymbol: string;
  uiTexts?: UiTexts;
}

function RequiredError() {
  return (
    <p className="text-red-400 text-xs -mt-4 mb-6 px-1 flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      This field is required
    </p>
  );
}

function DiscountBadge({ percent }: { percent: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-neon bg-green-neon/10 border border-green-neon/30 rounded-full px-3 py-1 mb-3">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      {percent}% discount applied
    </div>
  );
}

export default function ServiceComponentRenderer({
  component,
  service,
  handlers,
  selectedPrice,
  customPrice,
  showValidation,
  isComponentSatisfied,
  formatPrice,
  currencySymbol,
  uiTexts,
}: Props) {
  // Groups manage their own error display in the accordion header
  if (component.type === 'group') {
    const groupHasError = showValidation &&
      (component.children ?? []).some(child => child.required && !isComponentSatisfied(child));
    return (
      <ServiceGroupRenderer
        group={component}
        hasValidationError={groupHasError}
        renderChild={(child) => (
          <ServiceComponentRenderer
            key={child.id}
            component={child}
            service={service}
            handlers={handlers}
            selectedPrice={selectedPrice}
            customPrice={customPrice}
            showValidation={showValidation}
            isComponentSatisfied={isComponentSatisfied}
            formatPrice={formatPrice}
            currencySymbol={currencySymbol}
            uiTexts={uiTexts}
          />
        )}
      />
    );
  }

  const hasError = showValidation && !!component.required && !isComponentSatisfied(component);
  const discountPercent = component.discount_percent ?? 0;
  let content: React.ReactNode = null;

  switch (component.type) {
    case 'labeltitle':
      content = <TitleService title={component.data?.title || ''} />;
      break;

    case 'bar':
      content = service.barPrice ? (
        <div className="mb-6">
          <IncrementalBar
            barPrice={service.barPrice}
            onValueChange={handlers.onBarValueChange}
            title={service.barPrice.label}
            fromLabel={uiTexts?.barFrom}
            toLabel={uiTexts?.barTo}
          />
        </div>
      ) : null;
      break;

    case 'box':
      content = service.boxPrice && service.boxPrice.length > 0 ? (
        <div className="mb-6">
          <BoxPrice values={service.boxPrice} onSelectionChange={handlers.onBoxPriceChange} formatPrice={formatPrice} discountPercent={discountPercent}
            selectAmountLabel={uiTexts?.selectAmount}
            amountSingular={uiTexts?.amountSingular}
            amountPlural={uiTexts?.amountPlural}
            selectedText={uiTexts?.selected}
          />
        </div>
      ) : null;
      break;

    case 'boxtitle':
      content = component.data?.options?.length > 0 ? (
        <div className="mb-6">
          <BoxTitle
            options={component.data.options}
            onSelectionChange={(hasSelection) => handlers.onBoxTitleChange(component.id, hasSelection)}
            selectedPrefix={uiTexts?.selectedPrefix}
          />
        </div>
      ) : null;
      break;

    case 'custom':
      content = service.customPrice?.enabled ? (
        <div className="mb-6">
          <label className="block text-base font-medium text-cyber-white mb-3">
            {service.customPrice.label || 'Custom Amount'}
          </label>

          {service.customPrice.presets && service.customPrice.presets.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {service.customPrice.presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlers.onPresetPriceSelect(preset)}
                  className={`py-3 px-4 rounded-md font-semibold text-base transition-all ${
                    selectedPrice === preset
                      ? 'bg-green-neon/20 border-2 border-green-neon text-green-neon'
                      : 'bg-purple-dark/30 border-2 border-transparent text-cyber-white hover:border-purple-neon/50'
                  }`}
                >
                  {formatPrice(preset)}
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-neon text-lg">{currencySymbol}</span>
            <input
              type="text"
              value={customPrice}
              onChange={handlers.onCustomPriceChange}
              placeholder="Enter amount"
              className="w-full bg-purple-dark/30 border-2 border-purple-neon/30 rounded-md py-4 pl-8 pr-4 text-base text-cyber-white placeholder-cyber-white/40 focus:border-purple-neon focus:outline-none transition-colors"
            />
          </div>
        </div>
      ) : null;
      break;

    case 'selectors':
      content = service.selectors && Object.keys(service.selectors).length > 0 ? (
        <div>
          {Object.entries(service.selectors).map(([title, options], idx) => {
            const selectorId = `${service.id}-selector-${idx}`;
            return (
              <CustomSelector
                key={selectorId}
                selectorId={selectorId}
                title={title}
                options={options}
                onValueChange={(value) => handlers.onSelectorChange(selectorId, value)}
                onSelectionChange={(hasSelection) => handlers.onSelectorSelectionChange(selectorId, hasSelection)}
                formatPrice={formatPrice}
                discountPercent={discountPercent}
                choosePlaceholder={uiTexts?.choosePlaceholder}
              />
            );
          })}
        </div>
      ) : null;
      break;

    case 'additional':
      content = service.additionalServices && Object.keys(service.additionalServices).length > 0 ? (
        <div className="mb-6">
          <CheckGroup
            options={service.additionalServices}
            title={service.additionalServicesTitle}
            onSelectionChange={handlers.onAdditionalServicesChange}
            formatPrice={formatPrice}
            discountPercent={discountPercent}
            additionalSingular={uiTexts?.additionalSingular}
            additionalPlural={uiTexts?.additionalPlural}
            selectedText={uiTexts?.selected}
          />
        </div>
      ) : null;
      break;

    default:
      content = null;
  }

  if (!content) return null;

  const showsDiscount = discountPercent > 0 &&
    ['bar', 'box', 'selectors', 'additional', 'custom'].includes(component.type);

  return (
    <div className={hasError ? 'border-l-2 border-red-500/70 pl-2' : undefined}>
      {showsDiscount && <DiscountBadge percent={discountPercent} />}
      {content}
      {hasError && <RequiredError />}
    </div>
  );
}
