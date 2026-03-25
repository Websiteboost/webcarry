/**
 * Servicio para obtener textos de UI desde la base de datos
 * Reemplaza los textos hardcodeados en los componentes React
 */
import { sql } from '../db';
import { t, type Locale } from '../i18n';

export interface UiTexts {
  // GamePageView
  servicesLabel: string;
  categoriesLabel: string;
  backToCategories: string;
  selectCategoryHint: string;
  // ServiceGrid
  noServices: string;
  // PaymentSidebar
  selectRegion: string;
  // PaymentCheckout
  acceptTerms: string;
  paymentMethodLabel: string;
  totalToPay: string;
  importantNotice: string;
  estimatedDelivery: string;
  payNow: string;
  cancel: string;
  // DiscountInput
  discountCodeLabel: string;
  discountPlaceholder: string;
  discountApply: string;
  // ServiceGrid
  buyButton: string;
  // CurrencySelector
  currencyLabel: string;
  // PaymentSidebar
  checkout: string;
  // PaymentCheckout
  paypalLabel: string;
  cardLabel: string;
  saved: string;
  discountOff: string;
  // ServiceSearch
  searchPlaceholder: string;
  searchNoResults: string;
  // GamePageView counter
  serviceSingular: string;
  servicePlural: string;
  // BoxPrice
  selectAmount: string;
  amountSingular: string;
  amountPlural: string;
  // BoxTitle
  selectedPrefix: string;
  // CheckGroup + BoxPrice
  selected: string;
  additionalSingular: string;
  additionalPlural: string;
  // CustomSelector
  choosePlaceholder: string;
  // IncrementalBar
  barFrom: string;
  barTo: string;
}

const DEFAULTS: UiTexts = {
  servicesLabel: 'Services',
  categoriesLabel: 'Categories',
  backToCategories: 'Back to categories',
  selectCategoryHint: 'Select a category to explore our professional boosting services.',
  noServices: 'No services available for this game.',
  selectRegion: 'Select Region',
  acceptTerms: 'I accept the service policies',
  paymentMethodLabel: 'Payment Method',
  totalToPay: 'Total to pay:',
  importantNotice: 'Important Notice',
  estimatedDelivery: 'Estimated delivery:',
  payNow: 'Pay Now',
  cancel: 'Cancel',
  discountCodeLabel: 'Discount Code',
  discountPlaceholder: 'Enter code',
  discountApply: 'Apply',
  buyButton: 'Buy',
  currencyLabel: 'Currency',
  checkout: 'Checkout',
  paypalLabel: 'PayPal',
  cardLabel: 'Card',
  saved: 'saved',
  discountOff: 'off',
  searchPlaceholder: 'Search services\u2026',
  searchNoResults: 'No services match',
  serviceSingular: 'service',
  servicePlural: 'services',
  selectAmount: 'Select Amount',
  amountSingular: 'amount',
  amountPlural: 'amounts',
  selectedPrefix: 'Selected:',
  selected: 'selected',
  additionalSingular: 'additional service',
  additionalPlural: 'additional services',
  choosePlaceholder: 'Choose...',
  barFrom: 'From',
  barTo: 'To',
};

export async function getUiTexts(locale: Locale = 'en'): Promise<UiTexts> {
  const rows = await sql`
    SELECT
      ui_services_label,           ui_services_label_es,
      ui_categories_label,         ui_categories_label_es,
      ui_back_to_categories,       ui_back_to_categories_es,
      ui_select_category_hint,     ui_select_category_hint_es,
      ui_no_services,              ui_no_services_es,
      ui_select_region,            ui_select_region_es,
      ui_accept_terms,             ui_accept_terms_es,
      ui_payment_method_label,     ui_payment_method_label_es,
      ui_total_to_pay,             ui_total_to_pay_es,
      ui_important_notice,         ui_important_notice_es,
      ui_estimated_delivery,       ui_estimated_delivery_es,
      ui_pay_now,                  ui_pay_now_es,
      ui_cancel,                   ui_cancel_es,
      ui_discount_code_label,      ui_discount_code_label_es,
      ui_discount_placeholder,     ui_discount_placeholder_es,
      ui_discount_apply,           ui_discount_apply_es,
      ui_buy_button,               ui_buy_button_es,
      ui_currency_label,           ui_currency_label_es,
      ui_checkout,                 ui_checkout_es,
      ui_paypal_label,             ui_paypal_label_es,
      ui_card_label,               ui_card_label_es,
      ui_saved,                    ui_saved_es,
      ui_discount_off,             ui_discount_off_es,
      ui_search_placeholder,       ui_search_placeholder_es,
      ui_search_no_results,        ui_search_no_results_es,
      ui_service_singular,         ui_service_singular_es,
      ui_service_plural,           ui_service_plural_es,
      ui_select_amount,            ui_select_amount_es,
      ui_amount_singular,          ui_amount_singular_es,
      ui_amount_plural,            ui_amount_plural_es,
      ui_selected_prefix,          ui_selected_prefix_es,
      ui_selected,                 ui_selected_es,
      ui_additional_singular,      ui_additional_singular_es,
      ui_additional_plural,        ui_additional_plural_es,
      ui_choose_placeholder,       ui_choose_placeholder_es,
      ui_bar_from,                 ui_bar_from_es,
      ui_bar_to,                   ui_bar_to_es
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;

  if (rows.length === 0) return DEFAULTS;
  const r = rows[0];

  return {
    servicesLabel:       t(r.ui_services_label       ?? DEFAULTS.servicesLabel,       r.ui_services_label_es,       locale),
    categoriesLabel:     t(r.ui_categories_label     ?? DEFAULTS.categoriesLabel,     r.ui_categories_label_es,     locale),
    backToCategories:    t(r.ui_back_to_categories   ?? DEFAULTS.backToCategories,    r.ui_back_to_categories_es,   locale),
    selectCategoryHint:  t(r.ui_select_category_hint ?? DEFAULTS.selectCategoryHint,  r.ui_select_category_hint_es, locale),
    noServices:          t(r.ui_no_services          ?? DEFAULTS.noServices,          r.ui_no_services_es,          locale),
    selectRegion:        t(r.ui_select_region        ?? DEFAULTS.selectRegion,        r.ui_select_region_es,        locale),
    acceptTerms:         t(r.ui_accept_terms         ?? DEFAULTS.acceptTerms,         r.ui_accept_terms_es,         locale),
    paymentMethodLabel:  t(r.ui_payment_method_label ?? DEFAULTS.paymentMethodLabel,  r.ui_payment_method_label_es, locale),
    totalToPay:          t(r.ui_total_to_pay         ?? DEFAULTS.totalToPay,          r.ui_total_to_pay_es,         locale),
    importantNotice:     t(r.ui_important_notice     ?? DEFAULTS.importantNotice,     r.ui_important_notice_es,     locale),
    estimatedDelivery:   t(r.ui_estimated_delivery   ?? DEFAULTS.estimatedDelivery,   r.ui_estimated_delivery_es,   locale),
    payNow:              t(r.ui_pay_now              ?? DEFAULTS.payNow,              r.ui_pay_now_es,              locale),
    cancel:              t(r.ui_cancel               ?? DEFAULTS.cancel,              r.ui_cancel_es,               locale),
    discountCodeLabel:   t(r.ui_discount_code_label  ?? DEFAULTS.discountCodeLabel,   r.ui_discount_code_label_es,  locale),
    discountPlaceholder: t(r.ui_discount_placeholder ?? DEFAULTS.discountPlaceholder, r.ui_discount_placeholder_es, locale),
    discountApply:       t(r.ui_discount_apply       ?? DEFAULTS.discountApply,       r.ui_discount_apply_es,       locale),
    buyButton:           t(r.ui_buy_button           ?? DEFAULTS.buyButton,           r.ui_buy_button_es,           locale),
    currencyLabel:       t(r.ui_currency_label       ?? DEFAULTS.currencyLabel,       r.ui_currency_label_es,       locale),
    checkout:            t(r.ui_checkout             ?? DEFAULTS.checkout,            r.ui_checkout_es,             locale),
    paypalLabel:         t(r.ui_paypal_label         ?? DEFAULTS.paypalLabel,         r.ui_paypal_label_es,         locale),
    cardLabel:           t(r.ui_card_label           ?? DEFAULTS.cardLabel,           r.ui_card_label_es,           locale),
    saved:               t(r.ui_saved                ?? DEFAULTS.saved,               r.ui_saved_es,                locale),
    discountOff:         t(r.ui_discount_off         ?? DEFAULTS.discountOff,         r.ui_discount_off_es,         locale),
    searchPlaceholder:   t(r.ui_search_placeholder   ?? DEFAULTS.searchPlaceholder,   r.ui_search_placeholder_es,   locale),
    searchNoResults:     t(r.ui_search_no_results    ?? DEFAULTS.searchNoResults,     r.ui_search_no_results_es,    locale),
    serviceSingular:     t(r.ui_service_singular     ?? DEFAULTS.serviceSingular,     r.ui_service_singular_es,     locale),
    servicePlural:       t(r.ui_service_plural       ?? DEFAULTS.servicePlural,       r.ui_service_plural_es,       locale),
    selectAmount:        t(r.ui_select_amount        ?? DEFAULTS.selectAmount,        r.ui_select_amount_es,        locale),
    amountSingular:      t(r.ui_amount_singular      ?? DEFAULTS.amountSingular,      r.ui_amount_singular_es,      locale),
    amountPlural:        t(r.ui_amount_plural        ?? DEFAULTS.amountPlural,        r.ui_amount_plural_es,        locale),
    selectedPrefix:      t(r.ui_selected_prefix      ?? DEFAULTS.selectedPrefix,      r.ui_selected_prefix_es,      locale),
    selected:            t(r.ui_selected             ?? DEFAULTS.selected,            r.ui_selected_es,             locale),
    additionalSingular:  t(r.ui_additional_singular  ?? DEFAULTS.additionalSingular,  r.ui_additional_singular_es,  locale),
    additionalPlural:    t(r.ui_additional_plural    ?? DEFAULTS.additionalPlural,    r.ui_additional_plural_es,    locale),
    choosePlaceholder:   t(r.ui_choose_placeholder   ?? DEFAULTS.choosePlaceholder,   r.ui_choose_placeholder_es,   locale),
    barFrom:             t(r.ui_bar_from             ?? DEFAULTS.barFrom,             r.ui_bar_from_es,             locale),
    barTo:               t(r.ui_bar_to               ?? DEFAULTS.barTo,               r.ui_bar_to_es,               locale),
  };
}
