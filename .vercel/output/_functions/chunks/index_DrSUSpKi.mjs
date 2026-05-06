import { c as createComponent } from './astro-component_CcQDmYRh.mjs';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate, l as renderComponent } from './entrypoint_DdqMY4so.mjs';
import { r as renderScript, L as LanguageSelector } from './LanguageSelector_C5Iwq1ab.mjs';
import { c as getSiteContent, r as readLocaleCookie, $ as $$MainLayout, e as $$BackgroundLogo, d as $$GlitchLogo, f as $$Footer } from './BackgroundLogo_D-tsnhIl.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

const $$CategoryBadges = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$CategoryBadges;
  const { categories } = Astro2.props;
  const colors = [
    "text-pink-neon border-pink-neon/30 hover:border-pink-neon hover:shadow-pink-neon/20",
    "text-blue-neon border-blue-neon/30 hover:border-blue-neon hover:shadow-blue-neon/20",
    "text-green-neon border-green-neon/30 hover:border-green-neon hover:shadow-green-neon/20",
    "text-purple-neon border-purple-neon/30 hover:border-purple-neon hover:shadow-purple-neon/20"
  ];
  return renderTemplate`${categories && categories.length > 0 && renderTemplate`${maybeRenderHead()}<div class="flex flex-wrap justify-center gap-4">${categories.map((category, index) => renderTemplate`<span${addAttribute(`glass-effect px-6 py-3 rounded-md text-base font-semibold transition-smooth cursor-pointer ${colors[index % colors.length]} hover:shadow-lg`, "class")}>${category}</span>`)}</div>`}`;
}, "C:/DevCode/Repositories/Webcarry/src/components/astro/CategoryBadges.astro", void 0);

function GameCards({ initialGames }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  useEffect(() => {
    const timer = setTimeout(() => {
      setGames(initialGames);
      setLoading(false);
    }, 1e3);
    return () => clearTimeout(timer);
  }, [initialGames]);
  if (loading || games.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center", children: [...Array(4)].map((_, index) => /* @__PURE__ */ jsxs("div", { className: "glass-effect rounded-md overflow-hidden border border-purple-neon/20 w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "skeleton h-64 w-full" }),
      /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "skeleton h-6 w-3/4 mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-1/2" })
      ] })
    ] }, index)) });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center", children: games.map((game) => /* @__PURE__ */ jsxs(
    "a",
    {
      href: `/game/${game.id}`,
      className: "glass-effect rounded-md overflow-hidden border border-purple-neon/20 card-hover group cursor-pointer w-full",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-64 w-full overflow-hidden bg-linear-to-br from-purple-neon/20 to-blue-neon/20", children: [
          imageErrors[game.id] || !game.image ? /* @__PURE__ */ jsx("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-20 h-20 text-purple-neon/40", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) : /* @__PURE__ */ jsx(
            "img",
            {
              src: game.image,
              alt: game.title,
              className: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-300",
              loading: "lazy",
              onError: () => setImageErrors((prev) => ({ ...prev, [game.id]: true }))
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-linear-to-t from-purple-dark via-transparent to-transparent opacity-60" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-cyber-white mb-2 group-hover:text-pink-neon transition-colors", children: game.title }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-blue-neon", children: game.category })
        ] })
      ]
    },
    game.id
  )) });
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const siteContent = await getSiteContent(readLocaleCookie(Astro2.cookies));
  const { home, games } = siteContent;
  const iconComponents = {};
  for (const feature of home.features.items) {
    const iconName = feature.icon;
    if (LucideIcons[iconName]) {
      iconComponents[feature.icon] = LucideIcons[iconName];
    }
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": home.title }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full max-w-full overflow-x-hidden min-h-screen flex flex-col relative"> <!-- Background BB Watermark --> ${renderComponent($$result2, "BackgroundLogo", $$BackgroundLogo, {})} <!-- Logo: fixed top-left con backdrop blur al hacer scroll --> <div id="home-logo-container" class="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out"> <div class="p-6"> ${renderComponent($$result2, "GlitchLogo", $$GlitchLogo, { "logoText": home.logoText, "logoImage": home.logoImage })} </div> </div> <!-- Language selector: fixed top-right --> <div class="fixed top-4 right-4 z-50"> ${renderComponent($$result2, "LanguageSelector", LanguageSelector, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/DevCode/Repositories/Webcarry/src/components/react/LanguageSelector", "client:component-export": "default" })} </div> <main class="flex-1 py-4 flex flex-col items-center"> <!-- Header Section --> <div id="home-header" class="text-center px-6 w-full flex flex-col items-center mb-2 mt-24 sm:mt-20"> <h1 class="text-4xl sm:text-2xl md:text-2xl lg:text-5xl font-bold w-full mb-6"> <span class="neon-text ml-3">${home.title.split(" ").slice(1).join(" ")}</span> </h1> <p class="text-base sm:text-lg md:text-xl text-blue-neon leading-relaxed text-center w-full"> ${home.subtitle} </p> </div> <!-- Category Badges --> ${home.categories && home.categories.length > 0 && renderTemplate`<div class="px-6 w-full mb-12"> ${renderComponent($$result2, "CategoryBadges", $$CategoryBadges, { "categories": home.categories })} </div>`} <!-- Game Cards (React Component with loading) --> <div class="px-6 flex justify-center w-full mb-8"> <div class="w-full max-w-7xl"> ${renderComponent($$result2, "GameCards", GameCards, { "client:load": true, "initialGames": games, "client:component-hydration": "load", "client:component-path": "C:/DevCode/Repositories/Webcarry/src/components/react/GameCards", "client:component-export": "default" })} </div> </div> <!-- Features Section --> <div class="px-6 w-full mb-16 flex justify-center"> <div class="w-full max-w-7xl"> <!-- Section Header --> <div class="text-center mb-12"> <h2 class="text-3xl sm:text-4xl font-bold text-pink-neon neon-text mb-4"> ${home.features.title} </h2> <p class="text-base sm:text-lg text-cyber-white/80 max-w-2xl mx-auto"> ${home.features.description} </p> </div> <!-- Features Grid --> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"> ${home.features.items.map((feature) => {
    const IconComponent = iconComponents[feature.icon];
    return renderTemplate`<div class="glass-effect rounded-md p-6 border border-purple-neon/20 hover:border-pink-neon/50 transition-all duration-300 group">  <div class="flex justify-center mb-4"> <div class="p-4 rounded-full bg-purple-neon/10 border-2 border-purple-neon/30 group-hover:border-pink-neon/50 group-hover:bg-pink-neon/10 transition-all duration-300"> ${IconComponent && renderTemplate`${renderComponent($$result2, "IconComponent", IconComponent, { "className": "w-8 h-8 text-purple-neon group-hover:text-pink-neon transition-colors duration-300", "strokeWidth": 2 })}`} </div> </div>  <h3 class="text-xl font-bold text-cyber-white text-center mb-3 group-hover:text-pink-neon transition-colors"> ${feature.title} </h3> <p class="text-sm text-cyber-white/70 text-center leading-relaxed"> ${feature.description} </p> </div>`;
  })} </div> </div> </div> </main> <!-- Footer --> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> ` })} ${renderScript($$result, "C:/DevCode/Repositories/Webcarry/src/pages/index.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/DevCode/Repositories/Webcarry/src/pages/index.astro", void 0);

const $$file = "C:/DevCode/Repositories/Webcarry/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
