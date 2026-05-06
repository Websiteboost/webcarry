import { c as createComponent } from './astro-component_CcQDmYRh.mjs';
import { h as addAttribute, o as renderHead, p as renderSlot, r as renderTemplate, m as maybeRenderHead, l as renderComponent, q as Fragment } from './entrypoint_DdqMY4so.mjs';
import { s as sql } from './db_B9rpJ2n0.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';

const $$MainLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MainLayout;
  const {
    title = "BattleBoosting - Gaming Services",
    description = "Your trusted platform for professional gaming services"
  } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><title>${title}</title><!-- Favicons --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg"><link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg"><link rel="apple-touch-icon" href="/apple-touch-icon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@700&display=swap" rel="stylesheet">${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/DevCode/Repositories/Webcarry/src/layouts/MainLayout.astro", void 0);

function readLocaleCookie(cookies) {
  const val = cookies.get("bb_lang")?.value;
  return val === "ES" ? "es" : "en";
}
function t(en, es, locale) {
  if (locale === "es" && es != null && es.trim() !== "") return es.trim();
  return (en ?? "").trim();
}
function tArray(en, es, locale) {
  if (locale === "es" && es != null && es.length > 0) return es;
  return en ?? [];
}
function mergeConfigEs(type, config, configEs, locale) {
  if (locale === "en" || !configEs) return config;
  try {
    const merged = JSON.parse(JSON.stringify(config));
    switch (type) {
      case "bar":
        if (configEs.label_es) merged.label = configEs.label_es;
        break;
      case "box":
        if (Array.isArray(merged.options) && Array.isArray(configEs.options)) {
          merged.options = merged.options.map((opt, i) => {
            const es = configEs.options?.[i];
            return es?.label_es ? { ...opt, label: es.label_es } : opt;
          });
        }
        break;
      case "boxtitle":
        if (Array.isArray(merged.options) && Array.isArray(configEs.options)) {
          merged.options = merged.options.map((opt, i) => {
            const es = configEs.options?.[i];
            if (!es) return opt;
            return {
              ...opt,
              ...es.label_es && { label: es.label_es },
              ...es.data_es && { data: es.data_es }
            };
          });
        }
        break;
      case "selectors":
        for (const key of Object.keys(merged)) {
          const esOptions = configEs[key];
          if (!Array.isArray(merged[key]) || !Array.isArray(esOptions)) continue;
          merged[key] = merged[key].map((opt, i) => {
            const es = esOptions[i];
            return es?.label_es ? { ...opt, label: es.label_es } : opt;
          });
        }
        break;
      case "additional":
        if (configEs.title_es) merged.title = configEs.title_es;
        if (merged.options && configEs.options) {
          for (const key of Object.keys(merged.options)) {
            if (configEs.options[key]) merged.options[key].label = configEs.options[key];
          }
        }
        break;
      case "custom":
        if (configEs.label_es) merged.label = configEs.label_es;
        if (Array.isArray(merged.presets) && Array.isArray(configEs.presets)) {
          merged.presets = merged.presets.map((p, i) => {
            const es = configEs.presets?.[i];
            return es?.label_es ? { ...p, label: es.label_es } : p;
          });
        }
        break;
      case "labeltitle":
      case "group":
        if (configEs.title_es) merged.title = configEs.title_es;
        break;
    }
    return merged;
  } catch {
    return config;
  }
}

async function getAllGames() {
  const rows = await sql`
    SELECT id, title, category, image, created_at
    FROM games
    ORDER BY id ASC
  `;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image
  }));
}
async function getGameById(gameId) {
  const rows = await sql`
    SELECT id, title, category, image, created_at
    FROM games
    WHERE id = ${gameId}
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image
  };
}

async function getAllCategories(locale = "en") {
  const rows = await sql`
    SELECT id, name, name_es, description, description_es, icon
    FROM categories
    ORDER BY display_order ASC
  `;
  return rows.map((row) => ({
    id: row.id,
    name: t(row.name, row.name_es, locale),
    description: t(row.description, row.description_es, locale),
    icon: row.icon
  }));
}
async function getCategoriesWithServices(locale = "en") {
  const categories = await getAllCategories(locale);
  const categoriesWithServices = await Promise.all(
    categories.map(async (category) => {
      const services = await sql`
        SELECT id, title, title_es, price, image
        FROM services
        WHERE category_id = ${category.id}
        ORDER BY display_order ASC
      `;
      return {
        ...category,
        services: services.map((s) => ({
          id: s.id,
          title: t(s.title, s.title_es, locale),
          price: s.price,
          image: s.image
        }))
      };
    })
  );
  return categoriesWithServices;
}
async function getCategoriesWithServicesByGame(gameId, locale = "en") {
  const categoryRows = await sql`
    SELECT DISTINCT c.id, c.name, c.name_es, c.description, c.description_es, c.icon, c.created_at, c.display_order
    FROM categories c
    INNER JOIN category_games cg ON c.id = cg.category_id
    WHERE cg.game_id = ${gameId}
    ORDER BY c.display_order ASC
  `;
  const categoriesWithServices = await Promise.all(
    categoryRows.map(async (category) => {
      const services = await sql`
        SELECT DISTINCT s.id, s.title, s.title_es, s.price, s.image, s.created_at, s.display_order
        FROM services s
        INNER JOIN service_games sg ON s.id = sg.service_id
        WHERE s.category_id = ${category.id}
          AND sg.game_id = ${gameId}
        ORDER BY s.display_order ASC
      `;
      return {
        id: category.id,
        name: t(category.name, category.name_es, locale),
        description: t(category.description, category.description_es, locale),
        icon: category.icon,
        services: services.map((s) => ({
          id: s.id,
          title: t(s.title, s.title_es, locale),
          price: s.price,
          image: s.image
        }))
      };
    })
  );
  return categoriesWithServices.filter((cat) => cat.services.length > 0);
}

async function getAllServices(locale = "en") {
  const rows = await sql`
    SELECT id, title, title_es, category_id, price, image, description, description_es, service_points, service_points_es
    FROM services
    ORDER BY category_id, display_order ASC
  `;
  const services = await Promise.all(
    rows.map(async (row) => buildServiceFromRow(row, locale))
  );
  return services;
}
async function getServicesByGame(gameId, locale = "en") {
  const rows = await sql`
    SELECT DISTINCT s.id, s.title, s.title_es, s.category_id, s.price, s.image,
                    s.description, s.description_es, s.service_points, s.service_points_es, s.display_order
    FROM services s
    INNER JOIN service_games sg ON s.id = sg.service_id
    WHERE sg.game_id = ${gameId}
    ORDER BY s.category_id, s.display_order ASC
  `;
  const services = await Promise.all(
    rows.map(async (row) => buildServiceFromRow(row, locale))
  );
  return services;
}
function populateServiceData(service, type, config) {
  switch (type) {
    case "bar":
      if (!service.barPrice) service.barPrice = config;
      break;
    case "box":
      if (!service.boxPrice && config.options) {
        service.boxPrice = config.options;
      }
      break;
    case "custom":
      if (!service.customPrice) {
        service.customPrice = { enabled: true, ...config };
      }
      break;
    case "selectors":
      if (!service.selectors) service.selectors = config;
      break;
    case "additional": {
      if (!service.additionalServices) {
        const { title, ...opts } = config;
        service.additionalServices = opts;
        service.additionalServicesTitle = title || "Additional Services";
      }
      break;
    }
    case "boxtitle":
      if (!service.boxTitles && config.options) {
        service.boxTitles = config.options;
      }
      break;
  }
}
async function buildServiceFromRow(row, locale = "en") {
  const priceRows = await sql`
    SELECT id, type, config, config_es, display_order, required, estimated_time, discount_percent, group_id, created_at
    FROM service_prices
    WHERE service_id = ${row.id}
    ORDER BY display_order ASC, created_at ASC
  `;
  const gameRows = await sql`
    SELECT game_id
    FROM service_games
    WHERE service_id = ${row.id}
  `;
  const games = gameRows.map((g) => g.game_id);
  const service = {
    id: row.id,
    title: t(row.title, row.title_es, locale),
    categoryId: row.category_id,
    price: row.price,
    image: row.image,
    description: tArray(row.description, row.description_es, locale),
    service_points: (() => {
      const pts = tArray(
        row.service_points && row.service_points.length > 0 ? row.service_points : null,
        row.service_points_es,
        locale
      );
      return pts.length > 0 ? pts : void 0;
    })(),
    games: games.length > 0 ? games : void 0,
    components: []
  };
  const componentMap = /* @__PURE__ */ new Map();
  priceRows.forEach((priceRow) => {
    const resolvedConfig = mergeConfigEs(priceRow.type, priceRow.config, priceRow.config_es, locale);
    const component = {
      id: priceRow.id,
      type: priceRow.type,
      order: priceRow.display_order,
      required: priceRow.required,
      estimatedTime: priceRow.estimated_time ?? 0,
      discount_percent: priceRow.discount_percent ?? 0,
      groupId: priceRow.group_id
    };
    switch (priceRow.type) {
      case "group":
        component.data = resolvedConfig;
        component.children = [];
        break;
      case "bar":
        service.barPrice = resolvedConfig;
        component.data = resolvedConfig;
        break;
      case "box":
        service.boxPrice = resolvedConfig.options || [];
        component.data = resolvedConfig;
        break;
      case "custom":
        service.customPrice = { enabled: true, ...resolvedConfig };
        component.data = resolvedConfig;
        break;
      case "selectors":
        service.selectors = resolvedConfig;
        component.data = resolvedConfig;
        break;
      case "additional": {
        const { title, ...additionalOptions } = resolvedConfig;
        service.additionalServices = additionalOptions;
        service.additionalServicesTitle = title || "Additional Services";
        component.data = { title, options: additionalOptions };
        break;
      }
      case "boxtitle":
        if (!service.boxTitles) service.boxTitles = [];
        if (resolvedConfig.options && Array.isArray(resolvedConfig.options)) {
          service.boxTitles = resolvedConfig.options;
        }
        component.data = resolvedConfig;
        break;
      case "labeltitle":
        if (!service.serviceTitles) service.serviceTitles = [];
        service.serviceTitles.push({
          id: priceRow.id,
          title: resolvedConfig.title || "",
          order: service.serviceTitles.length
        });
        component.data = resolvedConfig;
        break;
      case "tab-group": {
        const rawTabs = priceRow.config?.tabs ?? [];
        const esTabs = priceRow.config_es?.tabs ?? [];
        const tabs = rawTabs.map((tab, tabIdx) => {
          const esTab = esTabs[tabIdx] ?? {};
          const tabTitle = locale === "es" && esTab.title ? esTab.title : tab.title ?? "";
          const children = (tab.children ?? []).map((child, childIdx) => {
            const childConfigEs = esTab.children?.[childIdx]?.config_es ?? null;
            const resolvedChildConfig = mergeConfigEs(child.type, child.config ?? {}, childConfigEs, locale);
            populateServiceData(service, child.type, resolvedChildConfig);
            return {
              id: `${priceRow.id}-t${tabIdx}-c${childIdx}`,
              type: child.type,
              data: resolvedChildConfig,
              order: child.display_order ?? childIdx,
              required: child.required ?? false,
              estimatedTime: child.estimated_time ?? 0,
              discount_percent: child.discount_percent ?? 0,
              groupId: priceRow.id
            };
          });
          return { title: tabTitle, children };
        });
        component.data = { tabs };
        break;
      }
      case "select-group": {
        const rawOptions = priceRow.config?.options ?? [];
        const esOptions = priceRow.config_es?.options ?? [];
        const label = locale === "es" && priceRow.config_es?.label ? priceRow.config_es.label : priceRow.config?.label ?? "";
        const options = rawOptions.map((opt, optIdx) => {
          const esOpt = esOptions[optIdx] ?? {};
          const optTitle = locale === "es" && esOpt.title ? esOpt.title : opt.title ?? "";
          const children = (opt.children ?? []).map((child, childIdx) => {
            const childConfigEs = esOpt.children?.[childIdx]?.config_es ?? null;
            const resolvedChildConfig = mergeConfigEs(child.type, child.config ?? {}, childConfigEs, locale);
            populateServiceData(service, child.type, resolvedChildConfig);
            return {
              id: `${priceRow.id}-o${optIdx}-c${childIdx}`,
              type: child.type,
              data: resolvedChildConfig,
              order: child.display_order ?? childIdx,
              required: child.required ?? false,
              estimatedTime: child.estimated_time ?? 0,
              discount_percent: child.discount_percent ?? 0,
              groupId: priceRow.id
            };
          });
          return { title: optTitle, children };
        });
        component.data = { label, options };
        break;
      }
    }
    componentMap.set(priceRow.id, component);
  });
  priceRows.forEach((priceRow) => {
    const component = componentMap.get(priceRow.id);
    if (priceRow.group_id) {
      const parent = componentMap.get(priceRow.group_id);
      if (parent?.children) {
        parent.children.push(component);
      }
    } else {
      service.components.push(component);
    }
  });
  return service;
}

async function getHomeContent(locale = "en") {
  const configRows = await sql`
    SELECT home_title, home_title_es, home_subtitle, home_subtitle_es,
           home_categories, home_categories_es, logo_text, logo_url, discord_link
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  if (configRows.length === 0) {
    throw new Error("Site config not found in database");
  }
  const config = configRows[0];
  const featureRows = await sql`
    SELECT icon, title, title_es, description, description_es
    FROM home_features
    ORDER BY display_order ASC
  `;
  return {
    title: t(config.home_title, config.home_title_es, locale),
    subtitle: t(config.home_subtitle, config.home_subtitle_es, locale),
    categories: tArray(config.home_categories, config.home_categories_es, locale),
    logoText: config.logo_text || "BATTLE BOOSTING",
    logoImage: config.logo_url || void 0,
    discordLink: config.discord_link,
    features: {
      title: "Why Choose Us",
      description: "Experience professional gaming services with industry-leading standards and guaranteed results",
      items: featureRows.map((row) => ({
        icon: row.icon,
        title: t(row.title, row.title_es, locale),
        description: t(row.description, row.description_es, locale)
      }))
    }
  };
}

async function getAccordionContent(locale = "en") {
  const configRows = await sql`
    SELECT accordion_title, accordion_title_es
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  const accordionTitle = configRows.length > 0 ? t(configRows[0].accordion_title, configRows[0].accordion_title_es, locale) : "Frequently Asked Questions";
  const rows = await sql`
    SELECT id, title, title_es, content, content_es
    FROM accordion_items
    ORDER BY display_order ASC
  `;
  return {
    title: accordionTitle,
    items: rows.map((row) => ({
      id: row.id,
      title: t(row.title, row.title_es, locale),
      content: t(row.content, row.content_es, locale)
    }))
  };
}

async function getFooterContent(locale = "en") {
  const configRows = await sql`
    SELECT footer_payment_title, footer_payment_title_es,
           footer_copyright, footer_copyright_es,
           disclaimer, disclaimer_es,
           discord_link, discord_work_us, euro_value,
           footer_community_label, footer_community_label_es,
           footer_discord_label, footer_discord_label_es,
           footer_work_us_label, footer_work_us_label_es
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  if (configRows.length === 0) {
    throw new Error("Site config not found in database");
  }
  const config = configRows[0];
  const paymentRows = await sql`
    SELECT name, type
    FROM payment_methods
    ORDER BY id ASC
  `;
  return {
    paymentMethodsTitle: t(config.footer_payment_title, config.footer_payment_title_es, locale),
    copyrightText: t(config.footer_copyright, config.footer_copyright_es, locale),
    disclaimer: t(config.disclaimer, config.disclaimer_es, locale) || "All services are provided for entertainment purposes only.",
    discordLink: config.discord_link,
    discordWorkUs: config.discord_work_us,
    euroValue: Number(config.euro_value ?? 1.08),
    communityLabel: t(config.footer_community_label ?? "Community", config.footer_community_label_es, locale),
    discordLabel: t(config.footer_discord_label ?? "Join Discord", config.footer_discord_label_es, locale),
    workUsLabel: t(config.footer_work_us_label ?? "Work with Us", config.footer_work_us_label_es, locale),
    paymentMethods: paymentRows.map((row) => ({
      name: row.name,
      type: row.type
    }))
  };
}

async function getSiteContent(locale = "en") {
  const [home, games, categories, services, accordion, footer] = await Promise.all([
    getHomeContent(locale),
    getAllGames(),
    getCategoriesWithServices(locale),
    getAllServices(locale),
    getAccordionContent(locale),
    getFooterContent(locale)
  ]);
  return {
    home,
    games,
    categories,
    services,
    accordion,
    footer
  };
}

const LS_CURRENCY = "bb_currency";
const LS_EURO_VALUE = "bb_euro_value";
const DISPATCH_EVENT = "bb:currency";
const EUROPE_TZ_RE = /^Europe\/|^Atlantic\/(Azores|Canary|Madeira|Faroe)/;
function detectCurrencyFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return EUROPE_TZ_RE.test(tz) ? "EUR" : "USD";
  } catch {
    return "USD";
  }
}
function readStoredCurrency() {
  try {
    const v = localStorage.getItem(LS_CURRENCY);
    if (v === "USD" || v === "EUR") return v;
  } catch {
  }
  return null;
}
function readStoredRate(fallback) {
  try {
    const raw = localStorage.getItem(LS_EURO_VALUE);
    const n = raw ? parseFloat(raw) : NaN;
    if (!isNaN(n) && n > 0) return n;
  } catch {
  }
  return fallback;
}
function useCurrency(euroValue = 1.08) {
  const [currency, setCurrency] = useState("USD");
  const [rate, setRate] = useState(euroValue);
  useEffect(() => {
    const detected = readStoredCurrency() ?? detectCurrencyFromTimezone();
    const cachedRate = readStoredRate(euroValue);
    setCurrency(detected);
    setRate(cachedRate);
  }, []);
  useEffect(() => {
    if (euroValue > 0) {
      setRate(euroValue);
      try {
        localStorage.setItem(LS_EURO_VALUE, String(euroValue));
      } catch {
      }
    }
  }, [euroValue]);
  useEffect(() => {
    const handler = (e) => {
      const { currency: c, rate: r } = e.detail;
      setCurrency(c);
      if (r > 0) setRate(r);
    };
    window.addEventListener(DISPATCH_EVENT, handler);
    return () => window.removeEventListener(DISPATCH_EVENT, handler);
  }, []);
  const changeCurrency = useCallback((next) => {
    setCurrency(next);
    try {
      localStorage.setItem(LS_CURRENCY, next);
    } catch {
    }
    window.dispatchEvent(
      new CustomEvent(DISPATCH_EVENT, { detail: { currency: next, rate } })
    );
  }, [rate]);
  const formatPrice = useCallback((usdPrice) => {
    const n = typeof usdPrice === "string" ? parseFloat(usdPrice) : Number(usdPrice);
    const safe = isNaN(n) ? 0 : n;
    if (currency === "EUR") {
      return `€${(safe / rate).toFixed(2)}`;
    }
    return `$${safe.toFixed(2)}`;
  }, [currency, rate]);
  const symbol = currency === "EUR" ? "€" : "$";
  return { currency, changeCurrency, formatPrice, symbol, rate };
}

const OPTIONS = [
  { value: "USD", symbol: "$", label: "USD" },
  { value: "EUR", symbol: "€", label: "EUR" }
];
function CurrencySelector({ euroValue, label }) {
  const { currency, changeCurrency } = useCurrency(euroValue);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", role: "group", "aria-label": "Currency selector", children: [
    /* @__PURE__ */ jsx("span", { className: "text-cyber-white/35 text-[10px] font-semibold uppercase tracking-widest select-none", children: label ?? "Currency" }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative flex items-center rounded-md overflow-hidden",
        style: {
          border: "1px solid rgba(168,85,247,0.25)",
          background: "rgba(26,11,46,0.6)"
        },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "absolute inset-y-0 w-1/2 rounded-[3px] transition-transform duration-200 ease-out",
              style: {
                background: "rgba(168,85,247,0.15)",
                border: "1px solid rgba(168,85,247,0.5)",
                transform: currency === "EUR" ? "translateX(100%)" : "translateX(0%)"
              }
            }
          ),
          OPTIONS.map(({ value, symbol, label: label2 }) => {
            const isActive = currency === value;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => changeCurrency(value),
                "aria-pressed": isActive,
                className: `relative z-10 flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wider transition-colors duration-150 ${isActive ? "text-purple-neon" : "text-cyber-white/35 hover:text-cyber-white/60"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { children: symbol }),
                  /* @__PURE__ */ jsx("span", { children: label2 })
                ]
              },
              value
            );
          })
        ]
      }
    )
  ] });
}

const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Footer;
  const locale = readLocaleCookie(Astro2.cookies);
  const footer = await getFooterContent(locale);
  return renderTemplate`${maybeRenderHead()}<footer class="w-full relative mt-8"> <!-- Top glow border --> <div class="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-neon/60 to-transparent"></div> <div class="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-pink-neon/40 to-transparent blur-sm"></div> <div class="bg-linear-to-b from-purple-dark/60 to-purple-dark/95 backdrop-blur-md"> <!-- Disclaimer --> ${footer.disclaimer && renderTemplate`<div class="border-b border-purple-neon/10 px-6 py-4"> <p class="text-cyber-white/50 text-xs leading-relaxed text-center max-w-4xl mx-auto"> ${footer.disclaimer} </p> </div>`} <!-- Main footer grid --> <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start"> <!-- Col 1: Brand + currency --> <div class="flex flex-col items-center md:items-start gap-4"> <div class="flex items-center gap-2"> <!-- Neon dot accent --> <span class="w-2 h-2 rounded-full bg-pink-neon shadow-[0_0_8px_rgba(244,114,182,0.8)]"></span> <span class="text-cyber-white font-bold text-base tracking-wide uppercase">BattleBoost</span> </div> <!-- Currency --> ${renderComponent($$result, "CurrencySelector", CurrencySelector, { "client:load": true, "euroValue": footer.euroValue, "client:component-hydration": "load", "client:component-path": "C:/DevCode/Repositories/Webcarry/src/components/react/CurrencySelector", "client:component-export": "default" })} </div> <!-- Col 2: Payment methods (center) --> <div class="flex flex-col items-center gap-4"> <p class="text-cyber-white/40 text-[10px] font-semibold uppercase tracking-widest">${footer.paymentMethodsTitle}</p> <div class="flex flex-wrap justify-center gap-2"> ${footer.paymentMethods.map((method) => method.type === "paypal" ? renderTemplate`<div class="flex items-center gap-2 bg-blue-neon/5 border border-blue-neon/20 px-4 py-2 rounded-full hover:border-blue-neon/50 hover:bg-blue-neon/10 transition-all duration-200"> <svg class="w-4 h-4 text-blue-neon" fill="currentColor" viewBox="0 0 24 24"> <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L9.718 7.08a.972.972 0 0 1 .957-.817h4.992c1.006 0 1.746.09 2.262.261.088.03.17.059.246.09.024.01.047.024.066.038.503.222.863.572 1.056 1.106.136.378.205.804.226 1.284a4.49 4.49 0 0 1-.015.436h.002z"></path> <path d="M10.265 7.634a.817.817 0 0 1 .805-.695h5.593c.66 0 1.218.047 1.676.143.557.116.982.332 1.287.672.286.318.484.72.614 1.227.066.267.107.558.123.877.014.27.006.57-.024.905-.24 2.468-1.605 3.712-3.975 3.712h-2.268a.973.973 0 0 0-.96.816l-.645 4.087-.028.135a.483.483 0 0 1-.477.404H9.152a.36.36 0 0 1-.355-.419l1.468-9.864z"></path> </svg> <span class="text-blue-neon font-semibold text-xs">${method.name}</span> </div>` : renderTemplate`<div class="flex items-center gap-2 bg-green-neon/5 border border-green-neon/20 px-4 py-2 rounded-full hover:border-green-neon/50 hover:bg-green-neon/10 transition-all duration-200"> <svg class="w-4 h-4 text-green-neon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"> <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" fill="none"></rect> <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor"></line> </svg> <span class="text-green-neon font-semibold text-xs">${method.name}</span> </div>`)} </div> </div> <!-- Col 3: Community links --> <div class="flex flex-col items-center md:items-end gap-4"> ${(footer.discordLink || footer.discordWorkUs) && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` <p class="text-cyber-white/40 text-[10px] font-semibold uppercase tracking-widest">${footer.communityLabel}</p> <div class="flex flex-row flex-wrap gap-2 items-center md:justify-end"> ${footer.discordLink && renderTemplate`<a${addAttribute(footer.discordLink, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 bg-[#5865F2]/5 border border-[#5865F2]/25 px-4 py-2.5 rounded-full hover:border-[#5865F2]/60 hover:bg-[#5865F2]/15 transition-all duration-200 group"> <svg class="w-4 h-4 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24"> <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"></path> </svg> <span class="text-[#5865F2] font-semibold text-xs group-hover:text-white transition-colors">${footer.discordLabel}</span> </a>`} ${footer.discordWorkUs && renderTemplate`<a${addAttribute(footer.discordWorkUs, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 bg-purple-neon/5 border border-purple-neon/25 px-4 py-2.5 rounded-full hover:border-purple-neon/60 hover:bg-purple-neon/15 transition-all duration-200 group"> <svg class="w-4 h-4 text-purple-neon" fill="currentColor" viewBox="0 0 24 24"> <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path> </svg> <span class="text-purple-neon font-semibold text-xs group-hover:text-white transition-colors">${footer.workUsLabel}</span> </a>`} </div> ` })}`} </div> </div> <!-- Bottom bar --> <div class="border-t border-white/5 px-6 py-4"> <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left"> <p class="text-cyber-white/30 text-xs">${footer.copyrightText}</p> <p class="text-cyber-white/25 text-xs">
Developed by${" "} <a href="https://azanorivers.com" target="_blank" rel="noopener noreferrer" class="text-purple-neon/60 hover:text-pink-neon transition-colors font-medium">
AzanoRivers
</a> </p> </div> </div> </div> </footer>`;
}, "C:/DevCode/Repositories/Webcarry/src/components/astro/Footer.astro", void 0);

const $$GlitchLogo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$GlitchLogo;
  const { logoText = "BATTLE BOOSTING", logoImage } = Astro2.props;
  function isValidImageUrl(url) {
    if (!url) return false;
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
  }
  const useImage = isValidImageUrl(logoImage);
  const logoLines = logoText.split(" ");
  return renderTemplate`${maybeRenderHead()}<a href="/"${addAttribute(useImage ? "logo-image-link" : "glitch-logo", "class")} data-astro-cid-zvprd6hk> ${useImage ? renderTemplate`<img${addAttribute(logoImage, "src")}${addAttribute(logoText, "alt")} class="logo-image" loading="eager" decoding="async" data-astro-cid-zvprd6hk>` : renderTemplate`<div class="logo-wrapper" data-astro-cid-zvprd6hk> ${logoLines.map((text) => renderTemplate`<span class="glitch-text"${addAttribute(text, "data-text")} data-astro-cid-zvprd6hk>${text}</span>`)} </div>`} </a>`;
}, "C:/DevCode/Repositories/Webcarry/src/components/astro/GlitchLogo.astro", void 0);

const $$BackgroundLogo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="fixed inset-0 pointer-events-none overflow-hidden z-0"> <!-- Left BB Watermark --> <div class="absolute -left-10 top-1/4 w-125 h-125 opacity-[0.03]"> <svg viewBox="0 0 300 200" class="w-full h-full"> <defs> <filter id="glow-purple"> <feGaussianBlur stdDeviation="4" result="coloredBlur"></feGaussianBlur> <feMerge> <feMergeNode in="coloredBlur"></feMergeNode> <feMergeNode in="SourceGraphic"></feMergeNode> </feMerge> </filter> <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" style="stop-color:rgb(168,85,247);stop-opacity:1"></stop> <stop offset="100%" style="stop-color:rgb(139,92,246);stop-opacity:1"></stop> </linearGradient> </defs> <text x="20" y="140" font-family="'Orbitron', 'Rajdhani', 'Press Start 2P', monospace" font-size="120" font-weight="900" letter-spacing="10" fill="url(#gradient-purple)" stroke="rgba(168, 85, 247, 0.8)" stroke-width="3" filter="url(#glow-purple)">BB</text> </svg> </div> <!-- Right BB Watermark --> <div class="absolute -right-10 bottom-1/4 w-125 h-125 opacity-[0.03] rotate-12"> <svg viewBox="0 0 300 200" class="w-full h-full"> <defs> <filter id="glow-blue"> <feGaussianBlur stdDeviation="4" result="coloredBlur"></feGaussianBlur> <feMerge> <feMergeNode in="coloredBlur"></feMergeNode> <feMergeNode in="SourceGraphic"></feMergeNode> </feMerge> </filter> <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" style="stop-color:rgb(56,189,248);stop-opacity:1"></stop> <stop offset="100%" style="stop-color:rgb(14,165,233);stop-opacity:1"></stop> </linearGradient> </defs> <text x="20" y="140" font-family="'Orbitron', 'Rajdhani', 'Press Start 2P', monospace" font-size="120" font-weight="900" letter-spacing="10" fill="url(#gradient-blue)" stroke="rgba(56, 189, 248, 0.8)" stroke-width="3" filter="url(#glow-blue)">BB</text> </svg> </div> </div>`;
}, "C:/DevCode/Repositories/Webcarry/src/components/astro/BackgroundLogo.astro", void 0);

export { $$MainLayout as $, CurrencySelector as C, getServicesByGame as a, getCategoriesWithServicesByGame as b, getSiteContent as c, $$GlitchLogo as d, $$BackgroundLogo as e, $$Footer as f, getGameById as g, readLocaleCookie as r, t, useCurrency as u };
