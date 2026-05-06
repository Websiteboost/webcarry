import { c as createComponent } from './astro-component_CcQDmYRh.mjs';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_DdqMY4so.mjs';
import { L as LanguageSelector, r as renderScript } from './LanguageSelector_C5Iwq1ab.mjs';
import { t, u as useCurrency, C as CurrencySelector, r as readLocaleCookie, g as getGameById, a as getServicesByGame, b as getCategoriesWithServicesByGame, c as getSiteContent, $ as $$MainLayout, d as $$GlitchLogo, e as $$BackgroundLogo, f as $$Footer } from './BackgroundLogo_D-tsnhIl.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { memo, useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { s as sql } from './db_B9rpJ2n0.mjs';

async function getPaymentConfig(locale = "en") {
  const configRows = await sql`
    SELECT payment_disclaimer, payment_disclaimer_es, euro_value
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  if (configRows.length === 0) {
    throw new Error("Site config not found in database");
  }
  const config = configRows[0];
  return {
    disclaimer: t(
      config.payment_disclaimer || "After completing your payment, please create a ticket in our Discord server to start your order.",
      config.payment_disclaimer_es,
      locale
    ),
    euroValue: Number(config.euro_value ?? 1.08)
  };
}

const DEFAULTS = {
  servicesLabel: "Services",
  categoriesLabel: "Categories",
  backToCategories: "Back to categories",
  selectCategoryHint: "Select a category to explore our professional boosting services.",
  noServices: "No services available for this game.",
  selectRegion: "Select Region",
  acceptTerms: "I accept the service policies",
  paymentMethodLabel: "Payment Method",
  totalToPay: "Total to pay:",
  importantNotice: "Important Notice",
  estimatedDelivery: "Estimated delivery:",
  payNow: "Pay Now",
  cancel: "Cancel",
  discountCodeLabel: "Discount Code",
  discountPlaceholder: "Enter code",
  discountApply: "Apply",
  buyButton: "Buy",
  currencyLabel: "Currency",
  checkout: "Checkout",
  paypalLabel: "PayPal",
  cardLabel: "Card",
  saved: "saved",
  discountOff: "off",
  searchPlaceholder: "Search services…",
  searchNoResults: "No services match",
  serviceSingular: "service",
  servicePlural: "services",
  selectAmount: "Select Amount",
  amountSingular: "amount",
  amountPlural: "amounts",
  selectedPrefix: "Selected:",
  selected: "selected",
  additionalSingular: "additional service",
  additionalPlural: "additional services",
  choosePlaceholder: "Choose...",
  barFrom: "From",
  barTo: "To"
};
async function getUiTexts(locale = "en") {
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
    servicesLabel: t(r.ui_services_label ?? DEFAULTS.servicesLabel, r.ui_services_label_es, locale),
    categoriesLabel: t(r.ui_categories_label ?? DEFAULTS.categoriesLabel, r.ui_categories_label_es, locale),
    backToCategories: t(r.ui_back_to_categories ?? DEFAULTS.backToCategories, r.ui_back_to_categories_es, locale),
    selectCategoryHint: t(r.ui_select_category_hint ?? DEFAULTS.selectCategoryHint, r.ui_select_category_hint_es, locale),
    noServices: t(r.ui_no_services ?? DEFAULTS.noServices, r.ui_no_services_es, locale),
    selectRegion: t(r.ui_select_region ?? DEFAULTS.selectRegion, r.ui_select_region_es, locale),
    acceptTerms: t(r.ui_accept_terms ?? DEFAULTS.acceptTerms, r.ui_accept_terms_es, locale),
    paymentMethodLabel: t(r.ui_payment_method_label ?? DEFAULTS.paymentMethodLabel, r.ui_payment_method_label_es, locale),
    totalToPay: t(r.ui_total_to_pay ?? DEFAULTS.totalToPay, r.ui_total_to_pay_es, locale),
    importantNotice: t(r.ui_important_notice ?? DEFAULTS.importantNotice, r.ui_important_notice_es, locale),
    estimatedDelivery: t(r.ui_estimated_delivery ?? DEFAULTS.estimatedDelivery, r.ui_estimated_delivery_es, locale),
    payNow: t(r.ui_pay_now ?? DEFAULTS.payNow, r.ui_pay_now_es, locale),
    cancel: t(r.ui_cancel ?? DEFAULTS.cancel, r.ui_cancel_es, locale),
    discountCodeLabel: t(r.ui_discount_code_label ?? DEFAULTS.discountCodeLabel, r.ui_discount_code_label_es, locale),
    discountPlaceholder: t(r.ui_discount_placeholder ?? DEFAULTS.discountPlaceholder, r.ui_discount_placeholder_es, locale),
    discountApply: t(r.ui_discount_apply ?? DEFAULTS.discountApply, r.ui_discount_apply_es, locale),
    buyButton: t(r.ui_buy_button ?? DEFAULTS.buyButton, r.ui_buy_button_es, locale),
    currencyLabel: t(r.ui_currency_label ?? DEFAULTS.currencyLabel, r.ui_currency_label_es, locale),
    checkout: t(r.ui_checkout ?? DEFAULTS.checkout, r.ui_checkout_es, locale),
    paypalLabel: t(r.ui_paypal_label ?? DEFAULTS.paypalLabel, r.ui_paypal_label_es, locale),
    cardLabel: t(r.ui_card_label ?? DEFAULTS.cardLabel, r.ui_card_label_es, locale),
    saved: t(r.ui_saved ?? DEFAULTS.saved, r.ui_saved_es, locale),
    discountOff: t(r.ui_discount_off ?? DEFAULTS.discountOff, r.ui_discount_off_es, locale),
    searchPlaceholder: t(r.ui_search_placeholder ?? DEFAULTS.searchPlaceholder, r.ui_search_placeholder_es, locale),
    searchNoResults: t(r.ui_search_no_results ?? DEFAULTS.searchNoResults, r.ui_search_no_results_es, locale),
    serviceSingular: t(r.ui_service_singular ?? DEFAULTS.serviceSingular, r.ui_service_singular_es, locale),
    servicePlural: t(r.ui_service_plural ?? DEFAULTS.servicePlural, r.ui_service_plural_es, locale),
    selectAmount: t(r.ui_select_amount ?? DEFAULTS.selectAmount, r.ui_select_amount_es, locale),
    amountSingular: t(r.ui_amount_singular ?? DEFAULTS.amountSingular, r.ui_amount_singular_es, locale),
    amountPlural: t(r.ui_amount_plural ?? DEFAULTS.amountPlural, r.ui_amount_plural_es, locale),
    selectedPrefix: t(r.ui_selected_prefix ?? DEFAULTS.selectedPrefix, r.ui_selected_prefix_es, locale),
    selected: t(r.ui_selected ?? DEFAULTS.selected, r.ui_selected_es, locale),
    additionalSingular: t(r.ui_additional_singular ?? DEFAULTS.additionalSingular, r.ui_additional_singular_es, locale),
    additionalPlural: t(r.ui_additional_plural ?? DEFAULTS.additionalPlural, r.ui_additional_plural_es, locale),
    choosePlaceholder: t(r.ui_choose_placeholder ?? DEFAULTS.choosePlaceholder, r.ui_choose_placeholder_es, locale),
    barFrom: t(r.ui_bar_from ?? DEFAULTS.barFrom, r.ui_bar_from_es, locale),
    barTo: t(r.ui_bar_to ?? DEFAULTS.barTo, r.ui_bar_to_es, locale)
  };
}

let _cache = null;
let _promise = null;
function loadLucide() {
  if (_cache) return Promise.resolve(_cache);
  if (!_promise) {
    _promise = import('lucide-react').then((m) => {
      _cache = m;
      return _cache;
    });
  }
  return _promise;
}
const DynamicIcon = memo(function DynamicIcon2({ name, className }) {
  const [icons, setIcons] = useState(_cache);
  useEffect(() => {
    if (icons) return;
    let active = true;
    loadLucide().then((m) => {
      if (active) setIcons(m);
    });
    return () => {
      active = false;
    };
  }, [icons]);
  if (!icons) return /* @__PURE__ */ jsx("div", { className, "aria-hidden": "true" });
  const Icon = icons[name] || icons["Package"];
  return /* @__PURE__ */ jsx(Icon, { className });
});
DynamicIcon.displayName = "DynamicIcon";

function CategorySidebar({ categories, currentCategoryId, onCategoryChange, categoriesLabel = "Categories" }) {
  const [expandedCategories, setExpandedCategories] = useState(
    currentCategoryId ? [currentCategoryId] : []
  );
  const toggleCategory = (categoryId) => {
    setExpandedCategories(
      (prev) => prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };
  const handleCategoryClick = (categoryId) => {
    toggleCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };
  if (!categories || categories.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "w-full glass-effect border-r border-purple-neon/20 p-8 flex flex-col", style: { height: "calc(100vh - 8rem)" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-pink-neon mb-8 neon-text shrink-0", children: categoriesLabel }),
    /* @__PURE__ */ jsx("nav", { className: "space-y-2 overflow-y-auto flex-1 pr-2 min-h-0 [&::-webkit-scrollbar]:w-0", style: { scrollbarWidth: "none" }, children: categories.map((category) => {
      const isExpanded = expandedCategories.includes(category.id);
      const isActive = currentCategoryId === category.id;
      return /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleCategoryClick(category.id),
            className: `w-full flex items-center justify-between px-5 py-4 rounded-md transition-all ${isActive ? "bg-purple-neon/20 border-purple-neon/50 text-purple-neon" : "hover:bg-purple-neon/10 text-cyber-white border border-transparent"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(DynamicIcon, { name: category.icon, className: "w-5 h-5" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: category.name })
              ] }),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: `w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`,
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-125 opacity-100 mt-2" : "max-h-0 opacity-0"}`,
            children: category.services && category.services.length > 0 && /* @__PURE__ */ jsx("div", { className: "ml-4 border-l-2 border-blue-neon/30 pl-4 overflow-y-auto max-h-64 pr-1 [&::-webkit-scrollbar]:w-0", style: { scrollbarWidth: "none" }, children: /* @__PURE__ */ jsx("div", { className: "space-y-1", children: category.services.map((service) => /* @__PURE__ */ jsx(
              "a",
              {
                href: `#${service.id}`,
                className: "block px-3 py-2 text-sm text-blue-neon hover:text-pink-neon hover:bg-pink-neon/10 rounded transition-colors",
                children: service.title
              },
              service.id
            )) }) })
          }
        )
      ] }, category.id);
    }) })
  ] });
}

const PaymentSidebar = lazy(() => import('./PaymentSidebar_BJXh-Jzh.mjs'));
function ServiceGrid({ initialServices, accordionContent, categories, paymentDisclaimer, euroValue = 1.08, onServiceSelect, uiTexts }) {
  const { formatPrice, currency } = useCurrency(euroValue);
  const [services, setServices] = useState([]);
  const [categorizedServices, setCategorizedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  useEffect(() => {
    const openServiceFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const serviceId = params.get("service");
      if (serviceId) {
        const service = initialServices.find((s) => s.id === serviceId);
        if (service) {
          setSelectedService(service);
          setIsPaymentOpen(true);
          return;
        }
      }
      setIsPaymentOpen(false);
    };
    openServiceFromUrl();
    window.addEventListener("popstate", openServiceFromUrl);
    return () => window.removeEventListener("popstate", openServiceFromUrl);
  }, [initialServices]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setServices(initialServices);
      let grouped;
      if (categories && categories.length > 0) {
        grouped = categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          services: initialServices.filter((s) => s.categoryId === cat.id)
        })).filter((cat) => cat.services.length > 0);
      } else {
        grouped = initialServices.reduce((acc, service) => {
          const existingCategory = acc.find((cat) => cat.id === service.categoryId);
          if (existingCategory) {
            existingCategory.services.push(service);
          } else {
            acc.push({
              id: service.categoryId,
              name: service.categoryId,
              services: [service]
            });
          }
          return acc;
        }, []);
      }
      setCategorizedServices(grouped);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [initialServices, categories]);
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setIsPaymentOpen(true);
    const url = new URL(window.location.href);
    url.searchParams.set("service", service.id);
    history.pushState({ serviceId: service.id }, "", url.toString());
    if (onServiceSelect) {
      onServiceSelect(service);
    }
  };
  const handleClosePayment = () => {
    setIsPaymentOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("service");
    history.pushState({}, "", url.toString());
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8", children: [...Array(6)].map((_, index) => /* @__PURE__ */ jsxs("div", { className: "glass-effect rounded-md overflow-hidden border border-purple-neon/20 flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "skeleton h-48 w-full" }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-3 flex flex-col grow", children: [
        /* @__PURE__ */ jsx("div", { className: "skeleton h-6 w-3/4" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-full" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-5/6" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-4/6" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton h-8 w-20 mt-auto" })
      ] })
    ] }, index)) });
  }
  if (!services || services.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-cyber-white/70 text-lg", children: uiTexts?.noServices ?? "No services available for this game." }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
    categorizedServices.map((category) => /* @__PURE__ */ jsxs("div", { id: category.id, className: "scroll-mt-24", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-pink-neon neon-text mb-6 capitalize", children: category.name.replace(/-/g, " ") }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8", children: category.services.map((service) => /* @__PURE__ */ jsxs(
        "div",
        {
          id: service.id,
          className: "glass-effect rounded-md overflow-hidden border border-purple-neon/20 card-hover group flex flex-col",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-48 w-full overflow-hidden bg-linear-to-br from-purple-neon/20 to-blue-neon/20", children: [
              imageErrors[service.id] || !service.image ? /* @__PURE__ */ jsx("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 text-purple-neon/40", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) : /* @__PURE__ */ jsx(
                "img",
                {
                  src: service.image,
                  alt: service.title,
                  className: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-300",
                  loading: "lazy",
                  onError: () => setImageErrors((prev) => ({ ...prev, [service.id]: true }))
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-b from-transparent via-purple-dark/60 to-purple-dark" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-cyber-white group-hover:text-pink-neon transition-colors", children: service.title }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-7 flex flex-col grow", children: [
              service.description && service.description.length > 0 && /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-4", style: { minHeight: "120px" }, children: service.description.map((point, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start text-sm text-cyber-white/80", children: [
                /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-green-neon mr-2 shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
                /* @__PURE__ */ jsx("span", { children: point })
              ] }, index)) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-auto pt-4 border-t border-purple-neon/20", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "text-3xl font-bold text-cyber-white",
                      style: { textShadow: "0 0 5px rgba(16,185,129,0.3), 0 0 10px rgba(16,185,129,0.2)" },
                      children: formatPrice(service.price)
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-cyber-white/50", children: currency })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleServiceSelect(service),
                    className: "bg-linear-to-r from-pink-neon to-purple-neon px-7 py-3 rounded-md font-semibold text-base text-cyber-white hover:shadow-lg hover:shadow-pink-neon/50 transition-all hover:scale-105 shrink-0",
                    children: uiTexts?.buyButton ?? "Buy"
                  }
                )
              ] })
            ] })
          ]
        },
        service.id
      )) })
    ] }, category.id)),
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
      PaymentSidebar,
      {
        service: selectedService,
        isOpen: isPaymentOpen,
        onClose: handleClosePayment,
        accordionContent,
        paymentDisclaimer,
        euroValue,
        uiTexts
      }
    ) })
  ] });
}

function MobileMenu({ categories, currentCategoryId, onCategoryChange, categoriesLabel = "Categories" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(
    currentCategoryId ? [currentCategoryId] : []
  );
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleCategory = (categoryId) => {
    setExpandedCategories(
      (prev) => prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };
  if (!categories || categories.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: toggleMenu,
        className: "lg:hidden fixed top-4 left-4 z-50 glass-effect p-3 rounded-lg border border-purple-neon/30 hover:border-purple-neon transition-colors",
        "aria-label": "Toggle menu",
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-6 h-6 text-cyber-white",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: isOpen ? /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) : /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`,
        onClick: toggleMenu
      }
    ),
    /* @__PURE__ */ jsx(
      "aside",
      {
        className: `lg:hidden fixed top-0 left-0 h-full w-80 glass-effect border-r border-purple-neon/30 z-40 transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "p-6 pt-20", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-pink-neon mb-6 neon-text", children: categoriesLabel }),
          /* @__PURE__ */ jsx("nav", { className: "space-y-2", children: categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const isActive = currentCategoryId === category.id;
            return /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    toggleCategory(category.id);
                    onCategoryChange?.(category.id);
                  },
                  className: `w-full flex items-center justify-between px-5 py-4 rounded-md transition-all ${isActive ? "bg-purple-neon/20 border border-purple-neon/50 text-purple-neon" : "hover:bg-purple-neon/10 text-cyber-white border border-transparent"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx(DynamicIcon, { name: category.icon, className: "w-5 h-5" }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: category.name })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: `w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`,
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
                      }
                    )
                  ]
                }
              ),
              isExpanded && category.services && category.services.length > 0 && /* @__PURE__ */ jsx("div", { className: "ml-4 mt-2 space-y-1 border-l-2 border-blue-neon/30 pl-4", children: category.services.map((service) => /* @__PURE__ */ jsx(
                "a",
                {
                  href: `#${service.id}`,
                  onClick: () => setIsOpen(false),
                  className: "block px-3 py-2 text-sm text-blue-neon hover:text-pink-neon hover:bg-pink-neon/10 rounded transition-colors",
                  children: service.title
                },
                service.id
              )) })
            ] }, category.id);
          }) })
        ] })
      }
    )
  ] });
}

function highlight(text, query) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    text.slice(0, idx),
    /* @__PURE__ */ jsx("mark", { className: "bg-pink-neon/25 text-pink-neon rounded-sm px-0.5 not-italic font-bold", style: { background: "none", color: "inherit", fontWeight: 700, textDecoration: "underline", textDecorationColor: "rgba(244,114,182,0.7)", textDecorationThickness: "2px", textUnderlineOffset: "3px" }, children: text.slice(idx, idx + query.length) }),
    text.slice(idx + query.length)
  ] });
}
function ServiceSearch({ services, categories, placeholder = "Search services…", buyLabel, noResultsText }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const containerRef = useRef(null);
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const results = query.trim().length < 2 ? [] : services.filter((s) => {
    const q = query.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.description?.some((d) => d.toLowerCase().includes(q)) || (categoryMap.get(s.categoryId) ?? "").toLowerCase().includes(q);
  }).slice(0, 8);
  const openService = useCallback((service) => {
    const url = new URL(window.location.href);
    url.searchParams.set("category", service.categoryId);
    url.searchParams.set("service", service.id);
    history.pushState({ categoryId: service.categoryId, serviceId: service.id }, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
    setQuery("");
    setIsOpen(false);
    setMobileExpanded(false);
    setActiveIndex(-1);
  }, []);
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Escape") {
        setQuery("");
        setIsOpen(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      openService(results[activeIndex]);
    } else if (e.key === "Escape") {
      setQuery("");
      setIsOpen(false);
    }
  };
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setMobileExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);
  useEffect(() => {
    if (mobileExpanded) mobileInputRef.current?.focus();
  }, [mobileExpanded]);
  const Dropdown = () => /* @__PURE__ */ jsxs(Fragment, { children: [
    isOpen && results.length > 0 && /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto rounded-xl border border-purple-neon/30 shadow-2xl shadow-purple-neon/10 overflow-hidden",
        style: { background: "rgba(26,11,46,0.97)", WebkitBackdropFilter: "blur(16px)", backdropFilter: "blur(16px)" },
        children: results.map((service, idx) => {
          const catName = categoryMap.get(service.categoryId) ?? "";
          const isActive = idx === activeIndex;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onMouseEnter: () => setActiveIndex(idx),
              onClick: () => openService(service),
              className: `w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-l-2 group ${isActive ? "bg-purple-neon/15 border-l-pink-neon" : "border-l-transparent hover:bg-purple-neon/8 hover:border-l-purple-neon/60"}`,
              style: { borderBottom: idx < results.length - 1 ? "1px solid rgba(168,85,247,0.1)" : "none" },
              children: [
                /* @__PURE__ */ jsx("div", { className: `shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? "bg-pink-neon/20" : "bg-purple-neon/10 group-hover:bg-purple-neon/20"}`, children: /* @__PURE__ */ jsx("svg", { className: `w-4 h-4 ${isActive ? "text-pink-neon" : "text-purple-neon"}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-cyber-white truncate", children: highlight(service.title, query) }),
                  catName && /* @__PURE__ */ jsx("div", { className: "text-xs text-cyber-white/40 mt-0.5 truncate capitalize", children: catName.replace(/-/g, " ") })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: `shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${isActive ? "bg-pink-neon/20 text-pink-neon border border-pink-neon/40" : "bg-purple-neon/10 text-purple-neon/70 border border-purple-neon/20"}`, children: [
                  buyLabel ?? "Buy",
                  /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }) })
                ] })
              ]
            },
            service.id
          );
        })
      }
    ),
    isOpen && query.trim().length >= 2 && results.length === 0 && /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-purple-neon/20 px-4 py-5 text-center",
        style: { background: "rgba(26,11,46,0.97)", WebkitBackdropFilter: "blur(16px)", backdropFilter: "blur(16px)" },
        children: /* @__PURE__ */ jsxs("p", { className: "text-cyber-white/40 text-sm", children: [
          noResultsText ?? "No services match",
          " ",
          /* @__PURE__ */ jsxs("span", { className: "text-cyber-white/70", children: [
            '"',
            query,
            '"'
          ] })
        ] })
      }
    )
  ] });
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:block relative", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 ${isOpen ? "border-purple-neon/60 shadow-[0_0_0_3px_rgba(168,85,247,0.1)]" : "border-purple-neon/25 hover:border-purple-neon/45"}`,
          style: { background: "rgba(26,11,46,0.6)", WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" },
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-purple-neon/60 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: inputRef,
                type: "text",
                value: query,
                onChange: (e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                },
                onFocus: () => setIsOpen(true),
                onKeyDown: handleKeyDown,
                placeholder,
                className: "flex-1 bg-transparent text-sm text-cyber-white placeholder-cyber-white/30 outline-none min-w-0",
                autoComplete: "off",
                spellCheck: false
              }
            ),
            query && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setQuery("");
                  setIsOpen(false);
                  inputRef.current?.focus();
                },
                className: "shrink-0 text-cyber-white/30 hover:text-cyber-white/70 transition-colors p-0.5 rounded",
                children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(Dropdown, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:hidden", children: [
      !mobileExpanded ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setMobileExpanded(true);
          },
          className: "flex items-center justify-center p-3 glass-effect rounded-lg border border-purple-neon/30 hover:border-purple-neon transition-colors",
          "aria-label": "Search services",
          children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-cyber-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })
        }
      ) : /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative flex items-center gap-2 px-3 py-2.5 rounded-xl border border-purple-neon/60 shadow-[0_0_0_3px_rgba(168,85,247,0.1)]",
          style: { background: "rgba(26,11,46,0.95)", WebkitBackdropFilter: "blur(16px)", backdropFilter: "blur(16px)", minWidth: "200px" },
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-purple-neon/60 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: mobileInputRef,
                type: "text",
                value: query,
                onChange: (e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                },
                onKeyDown: handleKeyDown,
                placeholder,
                className: "flex-1 bg-transparent text-sm text-cyber-white placeholder-cyber-white/30 outline-none w-32",
                autoComplete: "off",
                spellCheck: false
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setMobileExpanded(false);
                  setQuery("");
                  setIsOpen(false);
                },
                className: "shrink-0 text-cyber-white/40 hover:text-cyber-white/80 transition-colors p-1 rounded",
                children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(Dropdown, {})
    ] })
  ] });
}

function GamePageView({
  gameId,
  gameTitle,
  categories,
  initialServices,
  accordionContent,
  paymentDisclaimer,
  euroValue = 1.08,
  uiTexts
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  useEffect(() => {
    const readFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      const serviceId = params.get("service");
      if (cat && categories.find((c) => c.id === cat)) {
        setSelectedCategoryId(cat);
      } else if (serviceId) {
        const service = initialServices.find((s) => s.id === serviceId);
        if (service && categories.find((c) => c.id === service.categoryId)) {
          setSelectedCategoryId(service.categoryId);
          const url = new URL(window.location.href);
          if (!url.searchParams.get("category")) {
            url.searchParams.set("category", service.categoryId);
            history.replaceState({ categoryId: service.categoryId, serviceId }, "", url.toString());
          }
        } else {
          setSelectedCategoryId(null);
        }
      } else {
        setSelectedCategoryId(null);
      }
    };
    readFromUrl();
    const onPopState = () => readFromUrl();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [categories]);
  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    const url = new URL(window.location.href);
    url.searchParams.set("category", categoryId);
    history.pushState({ categoryId }, "", url.toString());
  };
  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    history.pushState({}, "", url.toString());
  };
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;
  const filteredServices = selectedCategoryId ? initialServices.filter((s) => s.categoryId === selectedCategoryId) : [];
  const filteredCategories = selectedCategoryId ? categories.filter((c) => c.id === selectedCategoryId) : categories;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      MobileMenu,
      {
        categories,
        currentCategoryId: selectedCategoryId ?? void 0,
        onCategoryChange: handleCategorySelect,
        categoriesLabel: uiTexts.categoriesLabel
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-3 fixed top-4 right-4 z-50", children: [
      /* @__PURE__ */ jsx(LanguageSelector, {}),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          style: {
            width: "1px",
            alignSelf: "stretch",
            background: "rgba(168,85,247,0.2)",
            margin: "4px 0"
          }
        }
      ),
      /* @__PURE__ */ jsx(CurrencySelector, { euroValue, label: uiTexts.currencyLabel })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "lg:hidden fixed top-18 left-5 z-35", children: /* @__PURE__ */ jsx(LanguageSelector, {}) }),
    /* @__PURE__ */ jsx("div", { className: "lg:hidden fixed top-4 left-17.5 z-50", children: /* @__PURE__ */ jsx(ServiceSearch, { services: initialServices, categories, placeholder: uiTexts.searchPlaceholder, buyLabel: uiTexts.buyButton, noResultsText: uiTexts.searchNoResults }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden lg:block lg:w-96 shrink-0", children: /* @__PURE__ */ jsx("div", { className: "sticky top-28", style: { maxHeight: "calc(100vh - 8rem)" }, children: /* @__PURE__ */ jsx(
        CategorySidebar,
        {
          categories,
          currentCategoryId: selectedCategoryId ?? void 0,
          onCategoryChange: handleCategorySelect,
          categoriesLabel: uiTexts.categoriesLabel
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 px-6 lg:px-10 py-8 lg:py-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-8", children: [
          /* @__PURE__ */ jsxs("nav", { className: "flex items-center space-x-2 text-sm min-w-0 overflow-hidden", children: [
            /* @__PURE__ */ jsx("span", { className: "text-blue-neon/50 cursor-default truncate max-w-25 sm:max-w-45 lg:max-w-none", children: gameTitle }),
            selectedCategory && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-cyber-white/30", children: "/" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleBackToCategories,
                  className: "text-blue-neon hover:text-pink-neon transition-colors",
                  children: uiTexts.categoriesLabel
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-cyber-white/30", children: "/" }),
              /* @__PURE__ */ jsx("span", { className: "text-pink-neon font-semibold", children: selectedCategory.name })
            ] }),
            !selectedCategory && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-cyber-white/30", children: "/" }),
              /* @__PURE__ */ jsx("span", { className: "text-pink-neon font-semibold", children: uiTexts.categoriesLabel })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden lg:block w-72 xl:w-96 shrink-0", children: /* @__PURE__ */ jsx(ServiceSearch, { services: initialServices, categories, placeholder: uiTexts.searchPlaceholder, buyLabel: uiTexts.buyButton, noResultsText: uiTexts.searchNoResults }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-12", children: selectedCategory ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleBackToCategories,
              className: "flex items-center gap-2 text-blue-neon hover:text-pink-neon transition-colors mb-4 text-sm",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
                uiTexts.backToCategories
              ]
            }
          ),
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 wrap-break-word", children: [
            /* @__PURE__ */ jsx("span", { className: "text-cyber-white", children: gameTitle }),
            /* @__PURE__ */ jsxs("span", { className: "neon-text ml-3", children: [
              "— ",
              selectedCategory.name
            ] })
          ] }),
          selectedCategory.description && /* @__PURE__ */ jsx("p", { className: "text-cyber-white/70 text-lg leading-relaxed max-w-3xl", children: selectedCategory.description })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 wrap-break-word", children: [
            /* @__PURE__ */ jsx("span", { className: "text-cyber-white", children: gameTitle }),
            /* @__PURE__ */ jsx("span", { className: "neon-text ml-3", children: uiTexts.servicesLabel })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-cyber-white/70 text-lg leading-relaxed max-w-3xl", children: uiTexts.selectCategoryHint })
        ] }) }),
        !selectedCategory ? (
          /* Category Cards Grid */
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: categories.map((category) => {
            const serviceCount = category.services?.length ?? 0;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleCategorySelect(category.id),
                className: "cursor-pointer glass-effect rounded-md border border-purple-neon/20 card-hover group p-8 text-left flex flex-col gap-4 transition-all hover:border-purple-neon/60",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-purple-neon/10 border border-purple-neon/30 flex items-center justify-center group-hover:bg-purple-neon/20 group-hover:border-purple-neon/60 transition-all", children: /* @__PURE__ */ jsx(DynamicIcon, { name: category.icon, className: "w-7 h-7 text-purple-neon" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-cyber-white group-hover:text-pink-neon transition-colors mb-1", children: category.name }),
                    category.description && /* @__PURE__ */ jsx("p", { className: "text-cyber-white/60 text-sm leading-relaxed line-clamp-2", children: category.description })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-auto pt-4 border-t border-purple-neon/10", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-sm text-blue-neon", children: [
                      serviceCount,
                      " ",
                      serviceCount === 1 ? uiTexts.serviceSingular : uiTexts.servicePlural
                    ] }),
                    /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-pink-neon opacity-0 group-hover:opacity-100 transition-opacity", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                  ] })
                ]
              },
              category.id
            );
          }) })
        ) : (
          /* Service Grid filtrado por categoría */
          /* @__PURE__ */ jsx(
            ServiceGrid,
            {
              initialServices: filteredServices,
              accordionContent,
              categories: filteredCategories,
              paymentDisclaimer,
              euroValue,
              uiTexts
            }
          )
        )
      ] })
    ] })
  ] });
}

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const locale = readLocaleCookie(Astro2.cookies);
  const game = await getGameById(id);
  if (!game) {
    return Astro2.redirect("/");
  }
  const gameServices = await getServicesByGame(game.id, locale);
  const gameCategories = await getCategoriesWithServicesByGame(game.id, locale);
  const siteContent = await getSiteContent(locale);
  const { accordion, home } = siteContent;
  const paymentConfig = await getPaymentConfig(locale);
  const uiTexts = await getUiTexts(locale);
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `${game.title} - ${home.title}`, "data-astro-cid-vxakhy7z": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="game-logo" class="fixed top-6 right-3 z-50 p-2 sm:top-0 sm:left-0 sm:right-auto sm:p-6" data-astro-cid-vxakhy7z> <div class="transition-all duration-700 ease-in-out opacity-100" data-astro-cid-vxakhy7z> ${renderComponent($$result2, "GlitchLogo", $$GlitchLogo, { "logoText": home.logoText, "logoImage": home.logoImage, "data-astro-cid-vxakhy7z": true })} </div> </div> <main class="min-h-screen pt-24 pb-8 relative" data-astro-cid-vxakhy7z> <!-- Background BB Watermark --> ${renderComponent($$result2, "BackgroundLogo", $$BackgroundLogo, { "data-astro-cid-vxakhy7z": true })} <div class="w-full max-w-full" data-astro-cid-vxakhy7z> <!-- GamePageView gestiona: MobileMenu, Sidebar, Breadcrumb, CategoryCards y ServiceGrid --> ${renderComponent($$result2, "GamePageView", GamePageView, { "client:load": true, "gameId": game.id, "gameTitle": game.title, "categories": gameCategories, "initialServices": gameServices, "accordionContent": accordion, "paymentDisclaimer": paymentConfig.disclaimer, "euroValue": paymentConfig.euroValue, "uiTexts": uiTexts, "client:component-hydration": "load", "client:component-path": "C:/DevCode/Repositories/Webcarry/src/components/react/GamePageView", "client:component-export": "default", "data-astro-cid-vxakhy7z": true })} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-vxakhy7z": true })} ` })} ${renderScript($$result, "C:/DevCode/Repositories/Webcarry/src/pages/game/[id].astro?astro&type=script&index=0&lang.ts")}  ${renderScript($$result, "C:/DevCode/Repositories/Webcarry/src/pages/game/[id].astro?astro&type=script&index=1&lang.ts")} `;
}, "C:/DevCode/Repositories/Webcarry/src/pages/game/[id].astro", void 0);

const $$file = "C:/DevCode/Repositories/Webcarry/src/pages/game/[id].astro";
const $$url = "/game/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
