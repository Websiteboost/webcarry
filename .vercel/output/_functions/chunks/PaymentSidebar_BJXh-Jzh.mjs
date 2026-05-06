import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';
import { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { u as useCurrency } from './BackgroundLogo_D-tsnhIl.mjs';

function Accordion({ content }) {
  const [openItemId, setOpenItemId] = useState(null);
  const toggleItem = (itemId) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-center text-cyber-white mb-6 neon-text uppercase tracking-wide", children: content.title }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: content.items.map((item) => {
      const isOpen = openItemId === item.id;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border border-purple-neon/30 rounded-md overflow-hidden transition-all",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => toggleItem(item.id),
                className: "w-full flex items-center justify-between p-4 bg-purple-dark/30 hover:bg-purple-dark/50 transition-colors text-left",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-cyber-white text-sm sm:text-base pr-2", children: item.title }),
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: `w-5 h-5 text-purple-neon shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`,
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M19 9l-7 7-7-7"
                        }
                      )
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`,
                children: /* @__PURE__ */ jsx("div", { className: "p-4 bg-purple-dark/20", children: /* @__PURE__ */ jsx("p", { className: "text-cyber-white/80 text-sm leading-relaxed", children: item.content }) })
              }
            )
          ]
        },
        item.id
      );
    }) })
  ] });
}

function getInitialBarValues(service) {
  const bp = service.barPrice;
  if (!bp) return null;
  if (bp.mode === "breakpoints" && bp.breakpoints && bp.breakpoints.length > 0) {
    return {
      min: bp.defaultRange?.start ?? bp.breakpoints[0].initValue,
      max: bp.defaultRange?.end ?? bp.breakpoints[bp.breakpoints.length - 1].finalValue
    };
  }
  return {
    min: bp.defaultRange?.start ?? bp.initValue,
    max: bp.defaultRange?.end ?? bp.finalValue
  };
}
function usePaymentState(service) {
  const [selectedRegion, setSelectedRegion] = useState("US");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [customPrice, setCustomPrice] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [barMinValue, setBarMinValue] = useState(null);
  const [barMaxValue, setBarMaxValue] = useState(null);
  const [additionalValues, setAdditionalValues] = useState([]);
  const [boxValues, setBoxValues] = useState([]);
  const [selectorValues, setSelectorValues] = useState({});
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const [boxtitleSelected, setBoxtitleSelected] = useState({});
  const [selectorSelected, setSelectorSelected] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [tabGroupSelected, setTabGroupSelected] = useState({});
  const [selectGroupSelected, setSelectGroupSelected] = useState({});
  useEffect(() => {
    if (!service) return;
    setSelectedPrice(null);
    setCustomPrice("");
    const barInit = getInitialBarValues(service);
    setBarMinValue(barInit?.min ?? null);
    setBarMaxValue(barInit?.max ?? null);
    setAdditionalValues([]);
    setBoxValues([]);
    setSelectorValues({});
    setBoxtitleSelected({});
    setSelectorSelected({});
    setShowValidation(false);
    setAcceptedTerms(false);
    setSelectedPaymentMethod(null);
    setShowPayPalButton(false);
    setTabGroupSelected({});
    const defaults = {};
    const collectSelectGroups = (components) => {
      for (const c of components) {
        if (c.type === "select-group") defaults[c.id] = 0;
        else if (c.type === "group") collectSelectGroups(c.children ?? []);
      }
    };
    if (service.components) collectSelectGroups(service.components);
    setSelectGroupSelected(defaults);
  }, [service?.id]);
  const handleBarValueChange = useCallback((min, max) => {
    setBarMinValue(min);
    setBarMaxValue(max);
  }, []);
  const handleAdditionalServicesChange = useCallback((values) => {
    setAdditionalValues(values);
  }, []);
  const handleBoxPriceChange = useCallback((values) => {
    setBoxValues(values);
  }, []);
  const handleSelectorChange = useCallback((selectorId, value) => {
    setSelectorValues((prev) => ({ ...prev, [selectorId]: value }));
  }, []);
  const handleBoxTitleChange = useCallback((componentId, hasSelection) => {
    setBoxtitleSelected((prev) => ({ ...prev, [componentId]: hasSelection }));
  }, []);
  const handleSelectorSelectionChange = useCallback((selectorId, hasSelection) => {
    setSelectorSelected((prev) => ({ ...prev, [selectorId]: hasSelection }));
  }, []);
  const handleCustomPriceChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomPrice(value);
      setSelectedPrice(null);
    }
  }, []);
  const handlePresetPriceSelect = useCallback((price) => {
    const n = typeof price === "string" ? parseFloat(price) : Number(price);
    setSelectedPrice(isNaN(n) ? 0 : n);
    setCustomPrice("");
  }, []);
  const handleTabGroupChange = useCallback((componentId, tabIndex) => {
    setTabGroupSelected((prev) => ({ ...prev, [componentId]: tabIndex }));
  }, []);
  const handleSelectGroupChange = useCallback((componentId, optionIndex) => {
    setSelectGroupSelected((prev) => ({ ...prev, [componentId]: optionIndex }));
  }, []);
  const isComponentSatisfied = useCallback((component) => {
    if (component.type === "group") {
      return (component.children ?? []).every((child) => isComponentSatisfied(child));
    }
    if (component.type === "tab-group") {
      const activeTab = tabGroupSelected[component.id] ?? 0;
      const activeChildren = component.data?.tabs?.[activeTab]?.children ?? [];
      return activeChildren.every((child) => !child.required || isComponentSatisfied(child));
    }
    if (component.type === "select-group") {
      const selectedOpt = selectGroupSelected[component.id] ?? -1;
      if (component.required && selectedOpt < 0) return false;
      if (selectedOpt < 0) return true;
      const activeChildren = component.data?.options?.[selectedOpt]?.children ?? [];
      return activeChildren.every((child) => !child.required || isComponentSatisfied(child));
    }
    if (!component.required) return true;
    switch (component.type) {
      case "bar":
        return barMinValue !== null && barMaxValue !== null;
      case "box":
        return boxValues.length > 0;
      case "custom":
        return customPrice !== "" || selectedPrice !== null;
      case "selectors": {
        if (!service?.selectors) return false;
        const count = Object.keys(service.selectors).length;
        for (let i = 0; i < count; i++) {
          if (!selectorSelected[`${service.id}-selector-${i}`]) return false;
        }
        return count > 0;
      }
      case "additional":
        return additionalValues.length > 0;
      case "boxtitle":
        return !!boxtitleSelected[component.id];
      case "labeltitle":
        return true;
      default:
        return true;
    }
  }, [service, barMinValue, barMaxValue, boxValues, customPrice, selectedPrice, selectorSelected, additionalValues, boxtitleSelected, tabGroupSelected, selectGroupSelected]);
  const areAllRequiredSatisfied = useCallback(() => {
    if (!service?.components) return true;
    const check = (c) => isComponentSatisfied(c);
    return service.components.every((c) => check(c));
  }, [service, isComponentSatisfied]);
  const handlePayPalSuccess = useCallback((details) => {
    console.log("Payment successful!", details);
    alert(`✓ Payment successful!

Order ID: ${details.id}
Amount: $${details.purchase_units[0].amount.value} ${details.purchase_units[0].amount.currency_code}

Thank you for your purchase!`);
    setShowPayPalButton(false);
  }, []);
  const handlePayPalError = useCallback((error) => {
    console.error("PayPal error:", error);
    alert("Payment failed. Please try again.");
    setShowPayPalButton(false);
  }, []);
  const handlePayPalCancel = useCallback(() => {
    setShowPayPalButton(false);
  }, []);
  const handlePayment = useCallback(() => {
    if (!acceptedTerms || !selectedPaymentMethod) {
      alert("Please accept the policies and select a payment method");
      return;
    }
    if (!areAllRequiredSatisfied()) {
      setShowValidation(true);
      return;
    }
    if (selectedPaymentMethod === "card") {
      alert("Card payment coming soon");
    } else if (selectedPaymentMethod === "paypal") {
      setShowPayPalButton(true);
    }
  }, [acceptedTerms, selectedPaymentMethod, areAllRequiredSatisfied]);
  return {
    selectedRegion,
    setSelectedRegion,
    selectedPrice,
    customPrice,
    barMinValue,
    barMaxValue,
    additionalValues,
    boxValues,
    selectorValues,
    acceptedTerms,
    setAcceptedTerms,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    showPayPalButton,
    boxtitleSelected,
    selectorSelected,
    showValidation,
    tabGroupSelected,
    selectGroupSelected,
    isComponentSatisfied,
    areAllRequiredSatisfied,
    handleBarValueChange,
    handleAdditionalServicesChange,
    handleBoxPriceChange,
    handleSelectorChange,
    handleBoxTitleChange,
    handleSelectorSelectionChange,
    handleCustomPriceChange,
    handlePresetPriceSelect,
    handleTabGroupChange,
    handleSelectGroupChange,
    handlePayment,
    handlePayPalSuccess,
    handlePayPalError,
    handlePayPalCancel
  };
}

function toNum(v) {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return isNaN(n) ? 0 : n;
}
function flattenComponents(components, tabGroupSelected, selectGroupSelected) {
  return components.flatMap((c) => {
    if (c.type === "group") {
      return flattenComponents(c.children ?? [], tabGroupSelected, selectGroupSelected);
    }
    if (c.type === "tab-group") {
      const activeTab = tabGroupSelected[c.id] ?? 0;
      const activeChildren = c.data?.tabs?.[activeTab]?.children ?? [];
      return flattenComponents(activeChildren, tabGroupSelected, selectGroupSelected);
    }
    if (c.type === "select-group") {
      const selectedOpt = selectGroupSelected[c.id] ?? -1;
      if (selectedOpt < 0) return [];
      const activeChildren = c.data?.options?.[selectedOpt]?.children ?? [];
      return flattenComponents(activeChildren, tabGroupSelected, selectGroupSelected);
    }
    return [c];
  });
}
function hasTabOrSelectGroupers(components) {
  return components.some(
    (c) => c.type === "tab-group" || c.type === "select-group" || c.type === "group" && hasTabOrSelectGroupers(c.children ?? [])
  );
}
function applyPct(value, pct) {
  if (!pct) return value;
  return Math.round(value * (1 - pct / 100) * 100) / 100;
}
function computeDiscount(basePrice, discount) {
  if (!discount) return basePrice;
  let result;
  if (discount.discount_type === "percent") {
    result = basePrice - basePrice * discount.discount_value / 100;
  } else {
    result = basePrice - discount.discount_value;
  }
  return Math.max(0, Math.round(result * 100) / 100);
}
function usePaymentPrice(service, state) {
  const {
    barMinValue,
    barMaxValue,
    boxValues,
    selectorValues,
    additionalValues,
    selectedPrice,
    customPrice,
    selectedRegion,
    boxtitleSelected,
    appliedDiscount,
    tabGroupSelected,
    selectGroupSelected
  } = state;
  const calculateBarPrice = useCallback((barPrice, minValue, maxValue) => {
    if (!barPrice) return 0;
    const mode = barPrice.mode || "simple";
    if (mode === "simple") {
      return (maxValue - minValue) * toNum(barPrice.step);
    }
    if (mode === "breakpoints") {
      const { breakpoints } = barPrice;
      if (!breakpoints || breakpoints.length === 0) return 0;
      let total = 0;
      for (const bp of breakpoints) {
        const step = toNum(bp.step);
        const firstDest = Math.max(minValue + 1, bp.initValue);
        const lastDest = Math.min(maxValue, bp.finalValue);
        if (firstDest <= lastDest) {
          total += (lastDest - firstDest + 1) * step;
        }
        if (maxValue <= bp.finalValue) break;
      }
      return total;
    }
    return 0;
  }, []);
  const getBasePrice = useCallback(() => {
    let basePrice = 0;
    const flat = service?.components ? flattenComponents(service.components, tabGroupSelected, selectGroupSelected) : [];
    const discountOf = (type) => flat.find((c) => c.type === type)?.discount_percent ?? 0;
    const useActiveFilter = !!(service?.components && hasTabOrSelectGroupers(service.components));
    const isTypeActive = (type) => !useActiveFilter || flat.some((c) => c.type === type);
    if (service?.barPrice && barMinValue !== null && barMaxValue !== null && isTypeActive("bar")) {
      basePrice += applyPct(calculateBarPrice(service.barPrice, barMinValue, barMaxValue), discountOf("bar"));
    }
    if (service?.boxPrice && boxValues.length > 0 && isTypeActive("box")) {
      basePrice += applyPct(boxValues.reduce((sum, v) => sum + toNum(v), 0), discountOf("box"));
    }
    if (service?.customPrice?.enabled && isTypeActive("custom")) {
      const rawCustom = customPrice ? toNum(customPrice) : selectedPrice !== null ? toNum(selectedPrice) : 0;
      basePrice += applyPct(rawCustom, discountOf("custom"));
    }
    if (!service?.barPrice && !service?.boxPrice && !service?.customPrice?.enabled) {
      basePrice = toNum(service?.price ?? 0);
    }
    if (isTypeActive("additional")) {
      basePrice += applyPct(additionalValues.reduce((sum, v) => sum + toNum(v), 0), discountOf("additional"));
    }
    if (isTypeActive("selectors")) {
      basePrice += applyPct(Object.values(selectorValues).reduce((sum, v) => sum + toNum(v), 0), discountOf("selectors"));
    }
    return Math.round(basePrice * 100) / 100;
  }, [service, barMinValue, barMaxValue, boxValues, selectorValues, additionalValues, selectedPrice, customPrice, calculateBarPrice, tabGroupSelected, selectGroupSelected]);
  const getFinalPrice = useCallback(
    () => computeDiscount(getBasePrice(), appliedDiscount),
    [getBasePrice, appliedDiscount]
  );
  const getDiscountAmount = useCallback(
    () => Math.round((getBasePrice() - getFinalPrice()) * 100) / 100,
    [getBasePrice, getFinalPrice]
  );
  const getPaymentDescription = useCallback(() => {
    if (!service) return "";
    const details = [`${service.title} - Region: ${selectedRegion}`];
    if (service.barPrice && barMinValue !== null && barMaxValue !== null) {
      details.push(`${service.barPrice.label}: ${barMinValue} to ${barMaxValue}`);
    }
    if (service.boxPrice && boxValues.length > 0) {
      const selected = service.boxPrice.filter((box) => boxValues.includes(box.value)).map((box) => box.label || `$${box.value}`);
      if (selected.length > 0) details.push(`Selected: ${selected.join(", ")}`);
    }
    if (service.customPrice?.enabled) {
      const label = service.customPrice.label || "Amount";
      if (customPrice) details.push(`${label}: $${customPrice}`);
      else if (selectedPrice !== null) details.push(`${label}: $${selectedPrice}`);
    }
    if (service.additionalServices && additionalValues.length > 0) {
      const selected = Object.entries(service.additionalServices).filter(([, opt]) => additionalValues.includes(opt.value)).map(([label]) => label);
      if (selected.length > 0) details.push(`Extras: ${selected.join(", ")}`);
    }
    if (service.selectors && Object.keys(selectorValues).length > 0) {
      const selectorDetails = Object.entries(service.selectors).flatMap(([title, options], index) => {
        const selectorId = `${service.id}-selector-${index}`;
        const selectedValue = selectorValues[selectorId];
        if (selectedValue === void 0) return [];
        const opt = options.find((o) => o.value === selectedValue);
        return opt ? [`${title}: ${opt.label}`] : [];
      });
      if (selectorDetails.length > 0) details.push(selectorDetails.join(", "));
    }
    details.push(`Total: $${getFinalPrice().toFixed(2)}`);
    return details.join(" | ");
  }, [service, selectedRegion, barMinValue, barMaxValue, boxValues, selectorValues, additionalValues, selectedPrice, customPrice, getFinalPrice]);
  const getEstimatedTime = useCallback(() => {
    if (!service?.components) return 0;
    function calcComponent(c) {
      const t = c.estimatedTime ?? 0;
      if (c.type === "group") {
        return (c.children ?? []).reduce((sum, child) => sum + calcComponent(child), 0);
      }
      if (c.type === "tab-group") {
        const activeTab = tabGroupSelected[c.id] ?? 0;
        const activeChildren = c.data?.tabs?.[activeTab]?.children ?? [];
        return activeChildren.reduce((sum, child) => sum + calcComponent(child), 0);
      }
      if (c.type === "select-group") {
        const selectedOpt = selectGroupSelected[c.id] ?? -1;
        if (selectedOpt < 0) return 0;
        const activeChildren = c.data?.options?.[selectedOpt]?.children ?? [];
        return activeChildren.reduce((sum, child) => sum + calcComponent(child), 0);
      }
      if (c.type === "labeltitle" || t === 0) return 0;
      switch (c.type) {
        case "bar":
          return t;
        case "box":
          return boxValues.length > 0 ? t : 0;
        case "boxtitle":
          return boxtitleSelected[c.id] ? t : 0;
        case "custom":
          return customPrice !== "" || selectedPrice !== null ? t : 0;
        case "selectors":
          return Object.keys(selectorValues).length > 0 ? t : 0;
        case "additional":
          return additionalValues.length > 0 ? t : 0;
        default:
          return t;
      }
    }
    return service.components.reduce((sum, c) => sum + calcComponent(c), 0);
  }, [service, boxValues, boxtitleSelected, customPrice, selectedPrice, selectorValues, additionalValues, tabGroupSelected, selectGroupSelected]);
  return { getBasePrice, getFinalPrice, getDiscountAmount, getPaymentDescription, getEstimatedTime };
}

function useDiscount(serviceId) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    setCode("");
    setStatus("idle");
    setApplied(null);
    setError(null);
  }, [serviceId]);
  const apply = useCallback(async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(`/api/discounts/${encodeURIComponent(trimmed)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("invalid");
        setError(body.error ?? "Invalid or expired discount code.");
        setApplied(null);
        return;
      }
      setApplied(body);
      setStatus("valid");
    } catch {
      setStatus("invalid");
      setError("Network error. Please try again.");
    }
  }, [code]);
  const remove = useCallback(() => {
    setCode("");
    setApplied(null);
    setStatus("idle");
    setError(null);
  }, []);
  const handleCodeChange = useCallback((value) => {
    setCode(value.toUpperCase().replace(/[^A-Z0-9_\-]/g, "").slice(0, 50));
    if (status !== "idle") {
      setStatus("idle");
      setError(null);
      setApplied(null);
    }
  }, [status]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") apply();
  }, [apply]);
  return { code, status, applied, error, apply, remove, handleCodeChange, handleKeyDown };
}

function useSidebarEffects(isOpen, serviceId) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
      document.body.style.overflow = "hidden";
      setImageError(false);
      setImageLoading(true);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, serviceId]);
  useEffect(() => {
    if (!isOpen) return;
    const handleAsideScroll = (e) => {
      if (e.target && window.innerWidth < 1024) {
        window.dispatchEvent(new Event("scroll"));
      }
    };
    const aside = document.querySelector("aside");
    aside?.addEventListener("scroll", handleAsideScroll);
    return () => aside?.removeEventListener("scroll", handleAsideScroll);
  }, [isOpen]);
  return { isVisible, imageError, setImageError, imageLoading, setImageLoading };
}

function ServicePreview({ service, imageError, imageLoading, onImageLoad, onImageError }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-40 rounded-md overflow-hidden mb-4 bg-linear-to-br from-purple-neon/20 to-blue-neon/20", children: [
      imageLoading && !imageError && service.image && /* @__PURE__ */ jsx("div", { className: "skeleton h-full w-full absolute inset-0" }),
      imageError || !service.image ? /* @__PURE__ */ jsx("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 text-purple-neon/40", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) : /* @__PURE__ */ jsx(
        "img",
        {
          src: service.image,
          alt: service.title,
          className: `h-full w-full object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`,
          loading: "eager",
          onLoad: onImageLoad,
          onError: onImageError
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-b from-transparent via-purple-dark/60 to-purple-dark" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-cyber-white", children: service.title }) })
    ] }),
    service.service_points && service.service_points.length > 0 && /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: service.service_points.map(
      (point, index) => point ? /* @__PURE__ */ jsxs("li", { className: "flex items-start text-sm text-cyber-white/80", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-neon mr-2 shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
        /* @__PURE__ */ jsx("span", { children: point })
      ] }, index) : null
    ) })
  ] });
}

function IncrementalBar({ barPrice, onValueChange, title = "Select Value", fromLabel, toLabel }) {
  const { defaultRange, progressValue = 1, mode, breakpoints } = barPrice;
  let initValue;
  let finalValue;
  if (mode === "breakpoints" && breakpoints && breakpoints.length > 0) {
    initValue = breakpoints[0].initValue;
    finalValue = breakpoints[breakpoints.length - 1].finalValue;
  } else {
    initValue = barPrice.initValue;
    finalValue = barPrice.finalValue;
  }
  const initialMinValue = defaultRange?.start ?? initValue;
  const initialMaxValue = defaultRange?.end ?? finalValue;
  const [minValue, setMinValue] = useState(initialMinValue);
  const [maxValue, setMaxValue] = useState(initialMaxValue);
  const [draggingHandle, setDraggingHandle] = useState(null);
  const [minInputValue, setMinInputValue] = useState(String(initialMinValue));
  const [maxInputValue, setMaxInputValue] = useState(String(initialMaxValue));
  const barRef = useRef(null);
  useEffect(() => {
    const newInitialMin = defaultRange?.start ?? initValue;
    const newInitialMax = defaultRange?.end ?? finalValue;
    setMinValue(newInitialMin);
    setMaxValue(newInitialMax);
    setMinInputValue(String(newInitialMin));
    setMaxInputValue(String(newInitialMax));
  }, [barPrice, defaultRange?.start, defaultRange?.end, initValue, finalValue]);
  useEffect(() => {
    onValueChange(minValue, maxValue);
  }, [minValue, maxValue, onValueChange]);
  const minPercentage = useMemo(() => {
    return (minValue - initValue) / (finalValue - initValue) * 100;
  }, [minValue, initValue, finalValue]);
  const maxPercentage = useMemo(() => {
    return (maxValue - initValue) / (finalValue - initValue) * 100;
  }, [maxValue, initValue, finalValue]);
  const updateValueFromPosition = useCallback((clientX, handle) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const range = finalValue - initValue;
    let newValue = initValue + percentage * range;
    newValue = Math.round(newValue / progressValue) * progressValue;
    newValue = Math.max(initValue, Math.min(newValue, finalValue));
    if (handle === "min") {
      if (newValue >= maxValue) {
        const newMax = Math.min(maxValue + progressValue, finalValue);
        setMaxValue(newMax);
        setMinValue(Math.min(newValue, newMax - progressValue));
      } else {
        setMinValue(newValue);
      }
    } else {
      if (newValue <= minValue) {
        const newMin = Math.max(minValue - progressValue, initValue);
        setMinValue(newMin);
        setMaxValue(Math.max(newValue, newMin + progressValue));
      } else {
        setMaxValue(newValue);
      }
    }
  }, [initValue, finalValue, progressValue, minValue, maxValue]);
  const handleMouseDown = useCallback((e, handle) => {
    e.stopPropagation();
    setDraggingHandle(handle);
    updateValueFromPosition(e.clientX, handle);
  }, [updateValueFromPosition]);
  const handleMouseMove = useCallback((e) => {
    if (draggingHandle) {
      updateValueFromPosition(e.clientX, draggingHandle);
    }
  }, [draggingHandle, updateValueFromPosition]);
  const handleMouseUp = useCallback(() => {
    setDraggingHandle(null);
  }, []);
  const handleTouchStart = useCallback((e, handle) => {
    e.stopPropagation();
    setDraggingHandle(handle);
    updateValueFromPosition(e.touches[0].clientX, handle);
  }, [updateValueFromPosition]);
  const handleTouchMove = useCallback((e) => {
    if (draggingHandle && e.touches[0]) {
      updateValueFromPosition(e.touches[0].clientX, draggingHandle);
    }
  }, [draggingHandle, updateValueFromPosition]);
  useEffect(() => {
    if (draggingHandle) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [draggingHandle, handleMouseMove, handleMouseUp, handleTouchMove]);
  useEffect(() => {
    setMinInputValue(String(minValue));
  }, [minValue]);
  useEffect(() => {
    setMaxInputValue(String(maxValue));
  }, [maxValue]);
  const handleMinInputChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setMinInputValue(value);
    }
  }, []);
  const handleMaxInputChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setMaxInputValue(value);
    }
  }, []);
  const applyMinValue = useCallback(() => {
    if (minInputValue === "") {
      setMinInputValue(String(minValue));
      return;
    }
    let newValue = parseInt(minInputValue);
    newValue = Math.round(newValue / progressValue) * progressValue;
    newValue = Math.max(initValue, Math.min(newValue, finalValue - progressValue));
    if (newValue >= maxValue) {
      const newMax = Math.min(newValue + progressValue, finalValue);
      setMaxValue(newMax);
      setMaxInputValue(String(newMax));
      const adjustedMin = Math.min(newValue, newMax - progressValue);
      setMinValue(adjustedMin);
      setMinInputValue(String(adjustedMin));
    } else {
      setMinValue(newValue);
      setMinInputValue(String(newValue));
    }
  }, [minInputValue, minValue, maxValue, progressValue, initValue, finalValue]);
  const applyMaxValue = useCallback(() => {
    if (maxInputValue === "") {
      setMaxInputValue(String(maxValue));
      return;
    }
    let newValue = parseInt(maxInputValue);
    newValue = Math.round(newValue / progressValue) * progressValue;
    newValue = Math.max(initValue + progressValue, Math.min(newValue, finalValue));
    if (newValue <= minValue) {
      const newMin = Math.max(newValue - progressValue, initValue);
      setMinValue(newMin);
      setMinInputValue(String(newMin));
      const adjustedMax = Math.max(newValue, newMin + progressValue);
      setMaxValue(adjustedMax);
      setMaxInputValue(String(adjustedMax));
    } else {
      setMaxValue(newValue);
      setMaxInputValue(String(newValue));
    }
  }, [maxInputValue, maxValue, minValue, progressValue, initValue, finalValue]);
  const handleMinKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }, []);
  const handleMaxKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("label", { className: "block text-base font-medium text-cyber-white", children: title }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-cyber-white/50", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Min: ",
          initValue
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Max: ",
          finalValue
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          ref: barRef,
          className: "relative h-6 bg-purple-dark/40 rounded-full border border-purple-neon/30 cursor-pointer select-none",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute top-0 h-full rounded-full pointer-events-none",
                style: {
                  left: `${minPercentage}%`,
                  width: `${maxPercentage - minPercentage}%`,
                  background: "linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #38bdf8 100%)",
                  boxShadow: "0 0 10px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.4)",
                  willChange: draggingHandle ? "left, width" : "auto"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onMouseDown: (e) => handleMouseDown(e, "min"),
                onTouchStart: (e) => handleTouchStart(e, "min"),
                className: "absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-cyber-white bg-pink-neon shadow-lg cursor-grab active:cursor-grabbing z-10",
                style: {
                  left: `${minPercentage}%`,
                  transform: `translate(-50%, -50%) scale(${draggingHandle === "min" ? 1.2 : 1})`,
                  boxShadow: `0 0 15px rgba(236, 72, 153, ${draggingHandle === "min" ? 1 : 0.8}), 0 0 25px rgba(236, 72, 153, ${draggingHandle === "min" ? 0.6 : 0.4})`,
                  willChange: draggingHandle === "min" ? "transform, left" : "auto",
                  transition: draggingHandle === "min" ? "none" : "transform 0.15s ease-out"
                },
                children: /* @__PURE__ */ jsx("div", { className: "absolute inset-1 rounded-full bg-linear-to-br from-pink-neon to-purple-neon" })
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                onMouseDown: (e) => handleMouseDown(e, "max"),
                onTouchStart: (e) => handleTouchStart(e, "max"),
                className: "absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-cyber-white bg-blue-neon shadow-lg cursor-grab active:cursor-grabbing z-10",
                style: {
                  left: `${maxPercentage}%`,
                  transform: `translate(-50%, -50%) scale(${draggingHandle === "max" ? 1.2 : 1})`,
                  boxShadow: `0 0 15px rgba(56, 189, 248, ${draggingHandle === "max" ? 1 : 0.8}), 0 0 25px rgba(56, 189, 248, ${draggingHandle === "max" ? 0.6 : 0.4})`,
                  willChange: draggingHandle === "max" ? "transform, left" : "auto",
                  transition: draggingHandle === "max" ? "none" : "transform 0.15s ease-out"
                },
                children: /* @__PURE__ */ jsx("div", { className: "absolute inset-1 rounded-full bg-linear-to-br from-blue-neon to-cyan-400" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center glass-effect rounded-md p-2 border border-pink-neon/20", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "min-value-input", className: "text-xs text-cyber-white/60 block mb-1", children: fromLabel ?? "From" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "min-value-input",
              type: "text",
              inputMode: "numeric",
              value: minInputValue,
              onChange: handleMinInputChange,
              onBlur: applyMinValue,
              onKeyDown: handleMinKeyDown,
              className: "w-full text-xl font-bold text-pink-neon text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-pink-neon/50 rounded px-1 transition-all",
              style: { textShadow: "0 0 10px rgba(236, 72, 153, 0.6)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-purple-neon shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7l5 5m0 0l-5 5m5-5H6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center glass-effect rounded-md p-2 border border-blue-neon/20", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "max-value-input", className: "text-xs text-cyber-white/60 block mb-1", children: toLabel ?? "To" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "max-value-input",
              type: "text",
              inputMode: "numeric",
              value: maxInputValue,
              onChange: handleMaxInputChange,
              onBlur: applyMaxValue,
              onKeyDown: handleMaxKeyDown,
              className: "w-full text-xl font-bold text-blue-neon text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-neon/50 rounded px-1 transition-all",
              style: { textShadow: "0 0 10px rgba(56, 189, 248, 0.6)" }
            }
          )
        ] })
      ] })
    ] })
  ] });
}
const IncrementalBar$1 = memo(IncrementalBar);

function CheckGroup({ options, title = "Additional Services", onSelectionChange, formatPrice, discountPercent = 0, additionalSingular, additionalPlural, selectedText }) {
  const [selectedOptions, setSelectedOptions] = useState(/* @__PURE__ */ new Set());
  useEffect(() => {
    setSelectedOptions(/* @__PURE__ */ new Set());
    onSelectionChange([]);
  }, [options]);
  const handleToggle = useCallback((optionKey) => {
    const newSet = new Set(selectedOptions);
    if (newSet.has(optionKey)) {
      newSet.delete(optionKey);
    } else {
      newSet.add(optionKey);
    }
    setSelectedOptions(newSet);
    const values = Array.from(newSet).map((key) => {
      const option = options[key];
      const rawValue = option?.value;
      const numValue = typeof rawValue === "string" ? parseFloat(rawValue) : Number(rawValue);
      return isNaN(numValue) ? 0 : numValue;
    });
    onSelectionChange(values);
  }, [selectedOptions, options, onSelectionChange]);
  const optionEntries = Object.entries(options);
  if (optionEntries.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-base font-medium text-cyber-white", children: title }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: optionEntries.map(([key, option]) => {
      const isSelected = selectedOptions.has(key);
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleToggle(key),
          className: `w-full flex items-center justify-between p-4 rounded-md transition-all cursor-pointer ${isSelected ? "bg-purple-neon/20 border-2 border-purple-neon" : "bg-purple-dark/30 border-2 border-purple-neon/20 hover:border-purple-neon/50"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isSelected ? "bg-purple-neon border-purple-neon" : "bg-purple-dark/40 border-purple-neon/40"}`,
                  style: {
                    boxShadow: isSelected ? "0 0 10px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.3)" : "none"
                  },
                  children: isSelected && /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: "w-4 h-4 text-cyber-white",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      style: {
                        filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))"
                      },
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 3,
                          d: "M5 13l4 4L19 7"
                        }
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: `text-base font-medium transition-colors ${isSelected ? "text-cyber-white" : "text-cyber-white/80"}`, children: option.label })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `px-3 py-1 rounded-full text-sm font-bold transition-all ${isSelected ? "bg-green-neon/20 text-green-neon border border-green-neon/40" : "bg-purple-dark/40 text-cyber-white/60 border border-purple-neon/20"}`,
                style: {
                  boxShadow: isSelected ? "0 0 8px rgba(16, 185, 129, 0.4)" : "none"
                },
                children: discountPercent ? /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-end leading-tight", children: [
                  /* @__PURE__ */ jsxs("span", { className: "line-through opacity-40 text-xs", children: [
                    "+",
                    formatPrice(option.value)
                  ] }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "+",
                    formatPrice(Math.round(option.value * (1 - discountPercent / 100) * 100) / 100)
                  ] })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  "+",
                  formatPrice(option.value)
                ] })
              }
            )
          ]
        },
        key
      );
    }) }),
    selectedOptions.size > 0 && /* @__PURE__ */ jsx("div", { className: "glass-effect rounded-md p-3 border border-blue-neon/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-blue-neon", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-cyber-white/70", children: [
        selectedOptions.size,
        " ",
        selectedOptions.size > 1 ? additionalPlural ?? "additional services" : additionalSingular ?? "additional service",
        " ",
        selectedText ?? "selected"
      ] })
    ] }) })
  ] });
}
const CheckGroup$1 = memo(CheckGroup);

function BoxPrice({ values, onSelectionChange, formatPrice, discountPercent = 0, selectAmountLabel, amountSingular, amountPlural, selectedText }) {
  const [selectedIndexes, setSelectedIndexes] = useState(/* @__PURE__ */ new Set());
  useEffect(() => {
    setSelectedIndexes(/* @__PURE__ */ new Set());
  }, [values]);
  useEffect(() => {
    const selectedValues = Array.from(selectedIndexes).map((idx) => {
      const value = values[idx].value;
      const numValue = typeof value === "string" ? parseFloat(value) : Number(value);
      return isNaN(numValue) ? 0 : numValue;
    });
    onSelectionChange(selectedValues);
  }, [selectedIndexes, values, onSelectionChange]);
  const handleToggle = useCallback((index) => {
    setSelectedIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);
  if (values.length === 0) return null;
  const rawTotal = Math.round(
    Array.from(selectedIndexes).map((idx) => values[idx].value).reduce((sum, val) => sum + val, 0) * 100
  ) / 100;
  const discountedTotal = discountPercent ? Math.round(rawTotal * (1 - discountPercent / 100) * 100) / 100 : null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-base font-medium text-cyber-white", children: selectAmountLabel ?? "Select Amount" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: values.map((item, index) => {
      const isSelected = selectedIndexes.has(index);
      const isLongLabel = item.label && item.label.length > 6;
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleToggle(index),
          className: `py-4 px-4 rounded-md font-bold text-lg transition-all ${isSelected ? "bg-green-neon/20 border-2 border-green-neon text-green-neon" : "bg-purple-dark/30 border-2 border-purple-neon/30 text-cyber-white hover:border-purple-neon/60"} ${isLongLabel ? "col-span-2" : ""}`,
          style: {
            boxShadow: isSelected ? "0 0 8px rgba(16, 185, 129, 0.4)" : "none"
          },
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
            isSelected && /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-5 h-5 mb-1",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                style: {
                  filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))"
                },
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 3,
                    d: "M5 13l4 4L19 7"
                  }
                )
              }
            ),
            item.label ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-center", children: item.label }),
              /* @__PURE__ */ jsx("span", { className: "text-sm opacity-80", children: formatPrice(item.value) })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-xl font-bold", children: formatPrice(item.value) })
          ] })
        },
        `box-${index}`
      );
    }) }),
    selectedIndexes.size > 0 && /* @__PURE__ */ jsx("div", { className: "glass-effect rounded-md p-3 border border-green-neon/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-2 h-2 rounded-full bg-green-neon animate-pulse",
            style: { boxShadow: "0 0 5px rgba(16,185,129,0.8)" }
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-cyber-white/70", children: [
          selectedIndexes.size,
          " ",
          selectedIndexes.size > 1 ? amountPlural ?? "amounts" : amountSingular ?? "amount",
          " ",
          selectedText ?? "selected"
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-base font-bold text-green-neon", children: discountedTotal !== null ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "line-through opacity-40 text-sm mr-1", children: [
          "+",
          formatPrice(rawTotal)
        ] }),
        "+",
        formatPrice(discountedTotal)
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        "+",
        formatPrice(rawTotal)
      ] }) })
    ] }) })
  ] });
}
const BoxPrice$1 = memo(BoxPrice);

function BoxTitle({ options, onSelectionChange, selectedPrefix }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const handleToggle = useCallback((index, currentSelected) => {
    const newVal = currentSelected === index ? null : index;
    setSelectedOption(newVal);
    onSelectionChange?.(newVal !== null);
  }, [onSelectionChange]);
  if (options.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: options.map((option, index) => {
      const isLongLabel = option.label.length > 6;
      const isSelected = selectedOption === index;
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleToggle(index, selectedOption),
          className: `py-4 px-5 rounded-md font-semibold text-base transition-all text-center cursor-pointer ${isLongLabel ? "col-span-2" : ""} ${isSelected ? "bg-blue-neon/20 border-2 border-blue-neon text-blue-neon" : "bg-purple-dark/30 border-2 border-transparent text-cyber-white hover:border-purple-neon/50"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { children: option.label }),
            option.value && /* @__PURE__ */ jsx("span", { className: "text-sm opacity-80", children: option.value })
          ] })
        },
        `title-${index}`
      );
    }) }),
    selectedOption !== null && /* @__PURE__ */ jsx("div", { className: "glass-effect rounded-md p-3 border border-blue-neon/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-blue-neon", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-cyber-white/70", children: [
        selectedPrefix ?? "Selected:",
        " ",
        options[selectedOption].label
      ] })
    ] }) })
  ] });
}
const BoxTitle$1 = memo(BoxTitle);

function TitleService({ title }) {
  return /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", "aria-hidden": "true", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t-2 border-purple-neon/30" }) }),
    /* @__PURE__ */ jsx("div", { className: "relative flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "px-4 bg-purple-dark text-purple-neon font-bold text-lg uppercase tracking-wide", children: title }) })
  ] }) });
}
const TitleService$1 = memo(TitleService);

function makeOptionKey(index, value) {
  return `${index}:${value}`;
}
function parseOptionKey(key) {
  const parts = key.split(":");
  const num = parseFloat(parts[1]);
  return isNaN(num) ? 0 : num;
}
function CustomSelector({ title, options, onValueChange, onSelectionChange, selectorId, formatPrice, discountPercent = 0, choosePlaceholder }) {
  const [selectedKey, setSelectedKey] = useState("");
  useEffect(() => {
    setSelectedKey("");
    onValueChange(0);
  }, [selectorId, options]);
  const handleChange = (e) => {
    const raw = e.target.value;
    setSelectedKey(raw);
    if (raw === "") {
      onValueChange(0);
      onSelectionChange?.(false);
    } else {
      onValueChange(parseOptionKey(raw));
      onSelectionChange?.(true);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx("label", { htmlFor: selectorId, className: "block text-base font-medium text-cyber-white mb-3", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          id: selectorId,
          value: selectedKey,
          onChange: handleChange,
          style: {
            backgroundImage: "none"
          },
          className: "w-full bg-purple-dark/30 border-2 border-purple-neon/30 rounded-md py-4 px-4 pr-10 text-base text-cyber-white focus:border-purple-neon focus:outline-none transition-colors appearance-none cursor-pointer [&>option]:bg-[#1a0b2e] [&>option]:text-[#e0e7ff] [&>option]:py-3 [&>option]:px-4 [&>option:checked]:bg-purple-neon/20 [&>option:checked]:text-purple-neon",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: choosePlaceholder ?? "Choose..." }),
            options.map((option, index) => /* @__PURE__ */ jsxs("option", { value: makeOptionKey(index, option.value), children: [
              option.label,
              " ",
              option.value > 0 ? `+${formatPrice(discountPercent ? Math.round(option.value * (1 - discountPercent / 100) * 100) / 100 : option.value)}` : ""
            ] }, index))
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-purple-neon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
    ] })
  ] });
}

function ServiceGroupRenderer({ group, renderChild, hasValidationError }) {
  const collapseByDefault = group.data?.collapseByDefault ?? false;
  const [isOpen, setIsOpen] = useState(!collapseByDefault);
  const title = group.data?.title || "Options";
  const panelId = `group-panel-${group.id}`;
  const triggerId = `group-trigger-${group.id}`;
  const children = group.children ?? [];
  if (children.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-lg border border-purple-neon/30 overflow-hidden", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        id: triggerId,
        "aria-expanded": isOpen,
        "aria-controls": panelId,
        onClick: () => setIsOpen((prev) => !prev),
        className: "w-full flex items-center justify-between gap-3 px-4 py-3 glass-effect text-left transition-colors hover:bg-purple-neon/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-neon/60 focus-visible:ring-inset",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-cyber-white leading-tight", children: title }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            hasValidationError && /* @__PURE__ */ jsxs(
              "span",
              {
                "aria-label": "This group has required fields",
                className: "flex items-center gap-1 text-red-400 text-xs font-medium",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
                  "Required"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: `w-4 h-4 text-purple-neon transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        id: panelId,
        role: "region",
        "aria-labelledby": triggerId,
        className: `grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`,
        children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "px-4 pt-3 pb-1 border-t border-purple-neon/20", children: children.map((child) => renderChild(child)) }) })
      }
    )
  ] });
}

function ServiceTabGroupRenderer({
  group,
  activeTabIndex,
  onTabChange,
  hasValidationError,
  renderChild
}) {
  const tabs = group.data?.tabs ?? [];
  const tabBarRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const updateFades = useCallback(() => {
    const el = tabBarRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);
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
  return /* @__PURE__ */ jsxs("div", { className: `mb-6 rounded-lg overflow-hidden border transition-colors ${hasValidationError ? "border-red-500/50" : "border-cyan-400/30"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "relative border-b border-cyan-400/20 bg-cyan-400/5", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: `pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 transition-opacity duration-200 bg-linear-to-r from-slate-900/70 to-transparent ${showLeftFade ? "opacity-100" : "opacity-0"}`
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: tabBarRef,
          role: "tablist",
          className: "flex overflow-x-auto scroll-smooth",
          style: { scrollbarWidth: "none", msOverflowStyle: "none" },
          onScroll: updateFades,
          children: tabs.map((tab, i) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": activeTabIndex === i,
              onClick: () => onTabChange(i),
              className: `relative shrink-0 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset ${activeTabIndex === i ? "text-cyan-400 bg-cyan-400/10" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`,
              children: [
                tab.title,
                activeTabIndex === i && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" })
              ]
            },
            i
          ))
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: `pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 transition-opacity duration-200 bg-linear-to-l from-slate-900/70 to-transparent ${showRightFade ? "opacity-100" : "opacity-0"}`
        }
      )
    ] }),
    hasValidationError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-red-400 text-xs font-medium px-4 py-2 bg-red-500/5 border-b border-red-500/20", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
      "This section has required fields"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-4 pt-3 pb-1", children: activeChildren.length > 0 ? activeChildren.map((child, i) => /* @__PURE__ */ jsx("span", { children: renderChild(child) }, child.id ?? i)) : /* @__PURE__ */ jsx("p", { className: "text-center py-6 text-sm text-gray-500", children: "No options available in this tab" }) })
  ] });
}

function ServiceSelectGroupRenderer({
  group,
  selectedOptionIndex,
  onOptionChange,
  hasValidationError,
  renderChild
}) {
  const label = group.data?.label ?? "Select an option";
  const options = group.data?.options ?? [];
  if (options.length === 0) return null;
  const activeChildren = selectedOptionIndex >= 0 ? options[selectedOptionIndex]?.children ?? [] : [];
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-base font-medium text-cyber-white mb-3", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "select",
        {
          value: selectedOptionIndex >= 0 ? selectedOptionIndex : "",
          onChange: (e) => onOptionChange(e.target.value === "" ? -1 : Number(e.target.value)),
          className: `w-full bg-purple-dark/30 border-2 rounded-md py-3.5 pl-4 pr-10 text-base text-cyber-white appearance-none focus:outline-none transition-colors cursor-pointer ${hasValidationError ? "border-red-500/70 focus:border-red-400" : "border-pink-500/40 hover:border-pink-500/70 focus:border-pink-400"}`,
          children: options.map((opt, i) => /* @__PURE__ */ jsx("option", { value: i, className: "bg-slate-900 text-white", children: opt.title }, i))
        }
      ),
      /* @__PURE__ */ jsx("div", { className: `absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${hasValidationError ? "text-red-400" : "text-pink-400"}`, children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
    ] }),
    hasValidationError && selectedOptionIndex < 0 && /* @__PURE__ */ jsxs("p", { className: "text-red-400 text-xs mt-1.5 flex items-center gap-1", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
      "Selection required"
    ] }),
    activeChildren.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-pink-400/20", children: activeChildren.map((child, i) => /* @__PURE__ */ jsx("span", { children: renderChild(child) }, child.id ?? i)) })
  ] });
}

function RequiredError() {
  return /* @__PURE__ */ jsxs("p", { className: "text-red-400 text-xs -mt-4 mb-6 px-1 flex items-center gap-1", children: [
    /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
    "This field is required"
  ] });
}
function DiscountBadge({ percent }) {
  return /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 text-xs font-bold text-green-neon bg-green-neon/10 border border-green-neon/30 rounded-full px-3 py-1 mb-3", children: [
    /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" }) }),
    percent,
    "% discount applied"
  ] });
}
function ServiceComponentRenderer({
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
  tabGroupSelected,
  selectGroupSelected
}) {
  const renderChild = (child) => /* @__PURE__ */ jsx(
    ServiceComponentRenderer,
    {
      component: child,
      service,
      handlers,
      selectedPrice,
      customPrice,
      showValidation,
      isComponentSatisfied,
      formatPrice,
      currencySymbol,
      uiTexts,
      tabGroupSelected,
      selectGroupSelected
    },
    child.id
  );
  if (component.type === "group") {
    const groupHasError = showValidation && (component.children ?? []).some((child) => child.required && !isComponentSatisfied(child));
    return /* @__PURE__ */ jsx(
      ServiceGroupRenderer,
      {
        group: component,
        hasValidationError: groupHasError,
        renderChild
      }
    );
  }
  if (component.type === "tab-group") {
    const activeTabIndex = tabGroupSelected?.[component.id] ?? 0;
    const tabs = component.data?.tabs ?? [];
    const activeChildren = tabs[activeTabIndex]?.children ?? [];
    const tabGroupHasError = showValidation && activeChildren.some((child) => child.required && !isComponentSatisfied(child));
    return /* @__PURE__ */ jsx(
      ServiceTabGroupRenderer,
      {
        group: component,
        activeTabIndex,
        onTabChange: (tabIndex) => handlers.onTabGroupChange(component.id, tabIndex),
        hasValidationError: tabGroupHasError,
        renderChild
      }
    );
  }
  if (component.type === "select-group") {
    const selectedOptionIndex = selectGroupSelected?.[component.id] ?? -1;
    const options = component.data?.options ?? [];
    const activeChildren = selectedOptionIndex >= 0 ? options[selectedOptionIndex]?.children ?? [] : [];
    const selectGroupHasError = showValidation && (component.required && selectedOptionIndex < 0 || selectedOptionIndex >= 0 && activeChildren.some((child) => child.required && !isComponentSatisfied(child)));
    return /* @__PURE__ */ jsx(
      ServiceSelectGroupRenderer,
      {
        group: component,
        selectedOptionIndex,
        onOptionChange: (optIndex) => handlers.onSelectGroupChange(component.id, optIndex),
        hasValidationError: selectGroupHasError,
        renderChild
      }
    );
  }
  const hasError = showValidation && !!component.required && !isComponentSatisfied(component);
  const discountPercent = component.discount_percent ?? 0;
  let content = null;
  switch (component.type) {
    case "labeltitle":
      content = /* @__PURE__ */ jsx(TitleService$1, { title: component.data?.title || "" });
      break;
    case "bar":
      content = service.barPrice ? /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
        IncrementalBar$1,
        {
          barPrice: service.barPrice,
          onValueChange: handlers.onBarValueChange,
          title: service.barPrice.label,
          fromLabel: uiTexts?.barFrom,
          toLabel: uiTexts?.barTo
        }
      ) }) : null;
      break;
    case "box":
      content = service.boxPrice && service.boxPrice.length > 0 ? /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
        BoxPrice$1,
        {
          values: service.boxPrice,
          onSelectionChange: handlers.onBoxPriceChange,
          formatPrice,
          discountPercent,
          selectAmountLabel: uiTexts?.selectAmount,
          amountSingular: uiTexts?.amountSingular,
          amountPlural: uiTexts?.amountPlural,
          selectedText: uiTexts?.selected
        }
      ) }) : null;
      break;
    case "boxtitle":
      content = component.data?.options?.length > 0 ? /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
        BoxTitle$1,
        {
          options: component.data.options,
          onSelectionChange: (hasSelection) => handlers.onBoxTitleChange(component.id, hasSelection),
          selectedPrefix: uiTexts?.selectedPrefix
        }
      ) }) : null;
      break;
    case "custom":
      content = service.customPrice?.enabled ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-base font-medium text-cyber-white mb-3", children: service.customPrice.label || "Custom Amount" }),
        service.customPrice.presets && service.customPrice.presets.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 mb-4", children: service.customPrice.presets.map((preset) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handlers.onPresetPriceSelect(preset),
            className: `py-3 px-4 rounded-md font-semibold text-base transition-all ${selectedPrice === preset ? "bg-green-neon/20 border-2 border-green-neon text-green-neon" : "bg-purple-dark/30 border-2 border-transparent text-cyber-white hover:border-purple-neon/50"}`,
            children: formatPrice(preset)
          },
          preset
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-green-neon text-lg", children: currencySymbol }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: customPrice,
              onChange: handlers.onCustomPriceChange,
              placeholder: "Enter amount",
              className: "w-full bg-purple-dark/30 border-2 border-purple-neon/30 rounded-md py-4 pl-8 pr-4 text-base text-cyber-white placeholder-cyber-white/40 focus:border-purple-neon focus:outline-none transition-colors"
            }
          )
        ] })
      ] }) : null;
      break;
    case "selectors":
      content = service.selectors && Object.keys(service.selectors).length > 0 ? /* @__PURE__ */ jsx("div", { children: Object.entries(service.selectors).map(([title, options], idx) => {
        const selectorId = `${service.id}-selector-${idx}`;
        return /* @__PURE__ */ jsx(
          CustomSelector,
          {
            selectorId,
            title,
            options,
            onValueChange: (value) => handlers.onSelectorChange(selectorId, value),
            onSelectionChange: (hasSelection) => handlers.onSelectorSelectionChange(selectorId, hasSelection),
            formatPrice,
            discountPercent,
            choosePlaceholder: uiTexts?.choosePlaceholder
          },
          selectorId
        );
      }) }) : null;
      break;
    case "additional":
      content = service.additionalServices && Object.keys(service.additionalServices).length > 0 ? /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
        CheckGroup$1,
        {
          options: service.additionalServices,
          title: service.additionalServicesTitle,
          onSelectionChange: handlers.onAdditionalServicesChange,
          formatPrice,
          discountPercent,
          additionalSingular: uiTexts?.additionalSingular,
          additionalPlural: uiTexts?.additionalPlural,
          selectedText: uiTexts?.selected
        }
      ) }) : null;
      break;
    default:
      content = null;
  }
  if (!content) return null;
  const showsDiscount = discountPercent > 0 && ["bar", "box", "selectors", "additional", "custom"].includes(component.type);
  return /* @__PURE__ */ jsxs("div", { className: hasError ? "border-l-2 border-red-500/70 pl-2" : void 0, children: [
    showsDiscount && /* @__PURE__ */ jsx(DiscountBadge, { percent: discountPercent }),
    content,
    hasError && /* @__PURE__ */ jsx(RequiredError, {})
  ] });
}

function PayPalButton({
  amount,
  currency = "USD",
  description,
  onSuccess,
  onError,
  onCancel,
  disabled = false
}) {
  const paypalRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const clientId = "AVfhDIB5bfbge9c6liccHMLYtW7RHaKDvH8lQA9Fp6jKDc1C_-J97p7MKrqgQLOf_Q-F4HV0oQIVioI3";
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=en_US&intent=capture`;
    script.addEventListener("load", () => {
      setSdkReady(true);
    });
    script.addEventListener("error", () => {
      setError("Failed to load PayPal SDK");
    });
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [currency]);
  useEffect(() => {
    if (!sdkReady || !window.paypal || !paypalRef.current || disabled) {
      return;
    }
    paypalRef.current.innerHTML = "";
    try {
      window.paypal.Buttons({
        style: {
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 55
        },
        // Crear la orden
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description,
                amount: {
                  currency_code: currency,
                  value: amount.toFixed(2)
                }
              }
            ],
            application_context: {
              shipping_preference: "NO_SHIPPING"
            }
          });
        },
        // Aprobar el pago
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture();
            if (onSuccess) {
              onSuccess(details);
            }
            return details;
          } catch (error2) {
            console.error("Error capturing order:", error2);
            if (onError) {
              onError(error2);
            }
          }
        },
        // Manejo de errores
        onError: (err) => {
          console.error("PayPal error:", err);
          if (onError) {
            onError(err);
          }
        },
        // Cancelación del pago
        onCancel: () => {
          if (onCancel) {
            onCancel();
          }
        }
      }).render(paypalRef.current);
    } catch (err) {
      console.error("Error rendering PayPal button:", err);
      setError("Failed to render PayPal button");
    }
  }, [sdkReady, amount, currency, description, disabled, onSuccess, onError, onCancel]);
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "p-4 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-center", children: error });
  }
  if (!sdkReady) {
    return /* @__PURE__ */ jsx("div", { className: "w-full py-5 rounded-md bg-purple-dark/30 animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "text-center text-cyber-white/60", children: "Loading PayPal..." }) });
  }
  if (disabled) {
    return /* @__PURE__ */ jsx("div", { className: "w-full py-5 rounded-md bg-purple-dark/30 opacity-50 cursor-not-allowed", children: /* @__PURE__ */ jsx("div", { className: "text-center text-cyber-white/40", children: "PayPal button disabled" }) });
  }
  return /* @__PURE__ */ jsx("div", { ref: paypalRef, className: "w-full" });
}

function DiscountInput({
  code,
  status,
  error,
  applied,
  discountAmount,
  formatPrice,
  onCodeChange,
  onApply,
  onRemove,
  onKeyDown,
  codeLabel,
  placeholder,
  applyLabel,
  offLabel
}) {
  const isLoading = status === "loading";
  const off = offLabel ?? "off";
  if (status === "valid" && applied) {
    const label = applied.discount_type === "percent" ? `${applied.discount_value}% ${off}` : `${formatPrice(Number(applied.discount_value))} ${off}`;
    return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-cyber-white/60 mb-2 uppercase tracking-wide", children: codeLabel ?? "Discount Code" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3 rounded-md border border-green-neon/40 bg-green-neon/5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-green-neon shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-neon font-bold text-sm tracking-wider", children: applied.code }),
            /* @__PURE__ */ jsx("span", { className: "text-cyber-white/50 text-xs ml-2", children: label })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
          discountAmount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-green-neon text-sm font-semibold", children: [
            "−",
            formatPrice(discountAmount)
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onRemove,
              "aria-label": "Remove discount code",
              className: "text-cyber-white/40 hover:text-cyber-white transition-colors p-0.5",
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-cyber-white/60 mb-2 uppercase tracking-wide", children: codeLabel ?? "Discount Code" }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: code,
          onChange: (e) => onCodeChange(e.target.value),
          onKeyDown,
          placeholder: placeholder ?? "Enter code",
          maxLength: 50,
          disabled: isLoading,
          spellCheck: false,
          autoComplete: "off",
          "aria-label": "Discount code",
          className: `flex-1 bg-purple-dark/30 border-2 rounded-md py-2.5 px-3 text-sm font-mono text-cyber-white uppercase placeholder-cyber-white/30 focus:outline-none transition-colors disabled:opacity-50 ${status === "invalid" ? "border-red-500/60 focus:border-red-500" : "border-purple-neon/30 focus:border-purple-neon"}`
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onApply,
          disabled: isLoading || !code.trim(),
          className: "px-4 py-2.5 rounded-md text-sm font-semibold transition-all border border-purple-neon/40 bg-purple-neon/10 text-purple-neon hover:bg-purple-neon/25 disabled:opacity-40 disabled:cursor-not-allowed shrink-0",
          children: isLoading ? /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
          ] }) : applyLabel ?? "Apply"
        }
      )
    ] }),
    status === "invalid" && error && /* @__PURE__ */ jsxs("p", { role: "alert", className: "text-red-400 text-xs mt-1.5 flex items-center gap-1", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
      error
    ] })
  ] });
}

function formatTime(hours) {
  if (hours < 24) return `~${hours}h`;
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  return h > 0 ? `~${d}d ${h}h` : `~${d} day${d !== 1 ? "s" : ""}`;
}
function PaymentCheckout({
  finalPrice,
  basePrice,
  paymentDescription,
  estimatedTime,
  formatPrice,
  discountCode,
  discountStatus,
  discountError,
  discountApplied,
  discountAmount,
  onDiscountCodeChange,
  onDiscountApply,
  onDiscountRemove,
  onDiscountKeyDown,
  acceptedTerms,
  onTermsChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  showPayPalButton,
  onPaymentClick,
  onPayPalSuccess,
  onPayPalError,
  onPayPalCancel,
  paymentDisclaimer,
  uiTexts
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("label", { className: "flex items-start cursor-pointer", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: acceptedTerms,
          onChange: (e) => onTermsChange(e.target.checked),
          className: "mt-1 w-5 h-5 rounded border-2 border-purple-neon bg-purple-dark/30 text-pink-neon focus:ring-2 focus:ring-pink-neon focus:ring-offset-0 cursor-pointer"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "ml-3 text-base text-cyber-white/80", children: uiTexts?.acceptTerms ?? "I accept the service policies" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-base font-medium text-cyber-white mb-3", children: uiTexts?.paymentMethodLabel ?? "Payment Method" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onPaymentMethodChange("paypal"),
            className: `flex-1 flex items-center justify-center gap-2 py-5 px-5 rounded-md font-semibold text-base transition-all ${selectedPaymentMethod === "paypal" ? "bg-blue-neon/20 border-2 border-blue-neon" : "bg-purple-dark/30 border-2 border-transparent hover:border-purple-neon/50"}`,
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-blue-neon", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L9.718 7.08a.972.972 0 0 1 .957-.817h4.992c1.006 0 1.746.09 2.262.261.088.03.17.059.246.09.024.01.047.024.066.038.503.222.863.572 1.056 1.106.136.378.205.804.226 1.284a4.49 4.49 0 0 1-.015.436h.002z" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-blue-neon", children: uiTexts?.paypalLabel ?? "PayPal" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onPaymentMethodChange("card"),
            className: `flex-1 flex items-center justify-center gap-2 py-5 px-5 rounded-md font-semibold text-base transition-all ${selectedPaymentMethod === "card" ? "bg-green-neon/20 border-2 border-green-neon" : "bg-purple-dark/30 border-2 border-transparent hover:border-purple-neon/50"}`,
            children: [
              /* @__PURE__ */ jsxs("svg", { className: "w-6 h-6 text-green-neon", fill: "currentColor", viewBox: "0 0 48 32", children: [
                /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "48", height: "32", rx: "4", opacity: "0.3" }),
                /* @__PURE__ */ jsx("rect", { x: "4", y: "8", width: "40", height: "4" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-green-neon", children: uiTexts?.cardLabel ?? "Card" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3 flex items-start gap-2", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-yellow-500 shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-yellow-500 font-semibold text-sm mb-1", children: uiTexts?.importantNotice ?? "Important Notice" }),
          /* @__PURE__ */ jsx("p", { className: "text-yellow-200/90 text-xs leading-relaxed", children: paymentDisclaimer || "After completing your payment, please create a ticket in our Discord server to start your order. Join BattleBoost Discord community for support!" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        DiscountInput,
        {
          code: discountCode,
          status: discountStatus,
          error: discountError,
          applied: discountApplied,
          discountAmount,
          formatPrice,
          onCodeChange: onDiscountCodeChange,
          onApply: onDiscountApply,
          onRemove: onDiscountRemove,
          onKeyDown: onDiscountKeyDown,
          codeLabel: uiTexts?.discountCodeLabel,
          placeholder: uiTexts?.discountPlaceholder,
          applyLabel: uiTexts?.discountApply,
          offLabel: uiTexts?.discountOff
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "glass-effect rounded-md border border-purple-neon/30 overflow-hidden", children: [
        discountAmount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 pt-4 pb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-cyber-white/40 line-through", children: formatPrice(basePrice) }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-green-neon bg-green-neon/10 px-2 py-0.5 rounded-full", children: [
            "−",
            formatPrice(discountAmount),
            " ",
            uiTexts?.saved ?? "saved"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 pt-5 pb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-cyber-white font-medium text-base", children: uiTexts?.totalToPay ?? "Total to pay:" }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-3xl font-bold ${discountAmount > 0 ? "text-green-neon" : "text-cyber-white"}`,
              style: { textShadow: discountAmount > 0 ? "0 0 8px rgba(16,185,129,0.5), 0 0 16px rgba(16,185,129,0.3)" : "0 0 5px rgba(16,185,129,0.3), 0 0 10px rgba(16,185,129,0.2)" },
              children: formatPrice(finalPrice)
            }
          )
        ] }),
        estimatedTime > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-5 py-2.5 border-t border-purple-neon/15 bg-purple-neon/5", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-blue-neon shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-cyber-white/60", children: [
            uiTexts?.estimatedDelivery ?? "Estimated delivery:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-blue-neon font-semibold", children: formatTime(estimatedTime) })
          ] })
        ] })
      ] }),
      selectedPaymentMethod === "paypal" && showPayPalButton ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(
          PayPalButton,
          {
            amount: finalPrice,
            currency: "USD",
            description: paymentDescription,
            onSuccess: onPayPalSuccess,
            onError: onPayPalError,
            onCancel: onPayPalCancel,
            disabled: !acceptedTerms
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onPayPalCancel,
            className: "w-full py-3 rounded-md font-medium text-base bg-purple-dark/30 text-cyber-white hover:bg-purple-dark/50 transition-all",
            children: uiTexts?.cancel ?? "Cancel"
          }
        )
      ] }) : /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onPaymentClick,
          disabled: !acceptedTerms || !selectedPaymentMethod,
          className: `w-full py-5 rounded-md font-bold text-lg transition-all ${acceptedTerms && selectedPaymentMethod ? "bg-linear-to-r from-pink-neon to-purple-neon text-cyber-white hover:shadow-lg hover:shadow-pink-neon/50 hover:scale-105" : "bg-purple-dark/30 text-cyber-white/40 cursor-not-allowed"}`,
          children: uiTexts?.payNow ?? "Pay Now"
        }
      )
    ] })
  ] });
}

function PaymentSidebar({ service, isOpen, onClose, accordionContent, paymentDisclaimer, euroValue = 1.08, uiTexts }) {
  const { formatPrice, symbol } = useCurrency(euroValue);
  const ps = usePaymentState(service);
  const discount = useDiscount(service?.id ?? void 0);
  const { isVisible, imageError, setImageError, imageLoading, setImageLoading } = useSidebarEffects(isOpen, service?.id);
  const { getBasePrice, getFinalPrice, getDiscountAmount, getPaymentDescription, getEstimatedTime } = usePaymentPrice(service, {
    barMinValue: ps.barMinValue,
    barMaxValue: ps.barMaxValue,
    boxValues: ps.boxValues,
    selectorValues: ps.selectorValues,
    additionalValues: ps.additionalValues,
    selectedPrice: ps.selectedPrice,
    customPrice: ps.customPrice,
    selectedRegion: ps.selectedRegion,
    boxtitleSelected: ps.boxtitleSelected,
    appliedDiscount: discount.applied,
    tabGroupSelected: ps.tabGroupSelected,
    selectGroupSelected: ps.selectGroupSelected
  });
  if (!service) return null;
  const handlers = {
    onBarValueChange: ps.handleBarValueChange,
    onBoxPriceChange: ps.handleBoxPriceChange,
    onSelectorChange: ps.handleSelectorChange,
    onSelectorSelectionChange: ps.handleSelectorSelectionChange,
    onBoxTitleChange: ps.handleBoxTitleChange,
    onAdditionalServicesChange: ps.handleAdditionalServicesChange,
    onCustomPriceChange: ps.handleCustomPriceChange,
    onPresetPriceSelect: ps.handlePresetPriceSelect,
    onTabGroupChange: ps.handleTabGroupChange,
    onSelectGroupChange: ps.handleSelectGroupChange
  };
  return createPortal(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `fixed top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-200 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`,
          onClick: onClose
        }
      ),
      isOpen && /* @__PURE__ */ jsx("div", { className: "hidden lg:block fixed left-0 top-0 bottom-0 right-0 z-201 pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full pr-125 xl:pr-155 pl-20 py-16 pt-48", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-auto w-full max-w-3xl max-h-[calc(100vh-8rem)] overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "glass-effect rounded-lg p-6 border border-purple-neon/30 shadow-2xl", children: /* @__PURE__ */ jsx(Accordion, { content: accordionContent }) }) }) }) }),
      isOpen && /* @__PURE__ */ jsx(
        "aside",
        {
          className: `fixed top-0 right-0 h-full w-full sm:w-120 glass-effect border-l border-purple-neon/30 z-202 overflow-y-auto transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "p-6 pb-32 sm:pb-6 pt-32 lg:pt-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-pink-neon neon-text", children: uiTexts?.checkout ?? "Checkout" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "text-cyber-white hover:text-pink-neon transition-colors p-2",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              ServicePreview,
              {
                service,
                imageError,
                imageLoading,
                onImageLoad: () => setImageLoading(false),
                onImageError: () => {
                  setImageLoading(false);
                  setImageError(true);
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-base font-medium text-cyber-white mb-3", children: uiTexts?.selectRegion ?? "Select Region" }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: ["EU", "US"].map((region) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => ps.setSelectedRegion(region),
                  className: `flex-1 py-4 px-5 rounded-md font-semibold text-base transition-all ${ps.selectedRegion === region ? "bg-blue-neon/20 border-2 border-blue-neon text-blue-neon" : "bg-purple-dark/30 border-2 border-transparent text-cyber-white hover:border-purple-neon/50"}`,
                  children: region
                },
                region
              )) })
            ] }),
            service.components?.map((component, idx) => /* @__PURE__ */ jsx(
              ServiceComponentRenderer,
              {
                component,
                service,
                handlers,
                selectedPrice: ps.selectedPrice,
                customPrice: ps.customPrice,
                showValidation: ps.showValidation,
                isComponentSatisfied: ps.isComponentSatisfied,
                formatPrice,
                currencySymbol: symbol,
                uiTexts,
                tabGroupSelected: ps.tabGroupSelected,
                selectGroupSelected: ps.selectGroupSelected
              },
              `${component.id}-${idx}`
            )),
            /* @__PURE__ */ jsx(
              PaymentCheckout,
              {
                finalPrice: getFinalPrice(),
                basePrice: getBasePrice(),
                paymentDescription: getPaymentDescription(),
                estimatedTime: getEstimatedTime(),
                formatPrice,
                discountCode: discount.code,
                discountStatus: discount.status,
                discountError: discount.error,
                discountApplied: discount.applied,
                discountAmount: getDiscountAmount(),
                onDiscountCodeChange: discount.handleCodeChange,
                onDiscountApply: discount.apply,
                onDiscountRemove: discount.remove,
                onDiscountKeyDown: discount.handleKeyDown,
                acceptedTerms: ps.acceptedTerms,
                onTermsChange: (v) => ps.setAcceptedTerms(v),
                selectedPaymentMethod: ps.selectedPaymentMethod,
                onPaymentMethodChange: (m) => ps.setSelectedPaymentMethod(m),
                showPayPalButton: ps.showPayPalButton,
                onPaymentClick: ps.handlePayment,
                onPayPalSuccess: ps.handlePayPalSuccess,
                onPayPalError: ps.handlePayPalError,
                onPayPalCancel: ps.handlePayPalCancel,
                paymentDisclaimer,
                uiTexts
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "lg:hidden mt-6", children: /* @__PURE__ */ jsx("div", { className: "glass-effect rounded-lg p-4 border border-purple-neon/20", children: /* @__PURE__ */ jsx(Accordion, { content: accordionContent }) }) })
          ] })
        }
      )
    ] }),
    document.body
  );
}

export { PaymentSidebar as default };
