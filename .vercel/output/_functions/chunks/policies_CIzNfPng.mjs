import { c as createComponent } from './astro-component_CcQDmYRh.mjs';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_DdqMY4so.mjs';
import { r as readLocaleCookie, c as getSiteContent, $ as $$MainLayout, e as $$BackgroundLogo, d as $$GlitchLogo, f as $$Footer } from './BackgroundLogo_D-tsnhIl.mjs';
import { s as sql } from './db_B9rpJ2n0.mjs';

function parsePolicySection(html) {
  if (!html) return null;
  const titleMatch = html.match(/<h3>(.*?)<\/h3>/);
  const title = titleMatch ? titleMatch[1] : "";
  const contentMatch = html.match(/<span>(.*?)<\/span>/);
  const content = contentMatch ? contentMatch[1] : "";
  if (!title && !content) return null;
  return { title, content };
}
async function getPoliciesContent(locale = "en") {
  const rows = await sql`
    SELECT 
      section_1, section_1_es,
      section_2, section_2_es,
      section_3, section_3_es,
      section_4, section_4_es,
      section_5, section_5_es,
      section_6, section_6_es,
      section_7, section_7_es,
      section_8, section_8_es,
      section_9, section_9_es
    FROM policies
    WHERE id = 1
    LIMIT 1
  `;
  if (rows.length === 0) {
    throw new Error("Policies not found in database");
  }
  const policy = rows[0];
  const sections = [];
  for (let i = 1; i <= 9; i++) {
    const enKey = `section_${i}`;
    const esKey = `section_${i}_es`;
    const rawEs = policy[esKey];
    const rawEn = policy[enKey];
    const raw = locale === "es" && rawEs && rawEs.trim() !== "" ? rawEs : rawEn;
    const parsed = parsePolicySection(raw);
    if (parsed) sections.push(parsed);
  }
  return { sections };
}

const $$Policies = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Policies;
  const locale = readLocaleCookie(Astro2.cookies);
  const policies = await getPoliciesContent(locale);
  const siteContent = await getSiteContent(locale);
  const { home } = siteContent;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `Service Policies | ${home.title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full max-w-full overflow-x-hidden min-h-screen flex flex-col relative"> <!-- Background BB Watermark --> ${renderComponent($$result2, "BackgroundLogo", $$BackgroundLogo, {})} <!-- Logo: fixed top-left --> <div class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-purple-dark/30 border-b border-purple-neon/20"> <div class="p-6"> ${renderComponent($$result2, "GlitchLogo", $$GlitchLogo, { "logoText": home.logoText })} </div> </div> <main class="flex-1 py-4 flex flex-col items-center relative z-10"> <!-- Header Section --> <div class="text-center px-6 w-full flex flex-col items-center mb-8 mt-32 sm:mt-28"> <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold w-full mb-4"> <span class="neon-text">Service Policies</span> </h1> <p class="text-base sm:text-lg text-cyber-white/70 leading-relaxed text-center max-w-3xl">
Please read our terms and conditions carefully before using our services
</p> </div> <!-- Policies Content --> <div class="w-full max-w-5xl px-4 sm:px-6 md:px-8 mb-12"> <div class="glass-effect border border-purple-neon/30 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-md"> <div class="space-y-8"> ${policies.sections.map((section, index) => renderTemplate`<div class="policy-section"> <h3 class="text-xl sm:text-2xl font-bold text-cyber-white mb-4 flex items-center gap-3"> <span class="w-2 h-2 rounded-full bg-linear-to-r from-blue-neon to-pink-neon animate-pulse"></span> ${section.title} </h3> <p class="text-cyber-white/80 text-sm sm:text-base leading-relaxed pl-5"> ${section.content} </p> ${index < policies.sections.length - 1 && renderTemplate`<div class="mt-6 border-b border-purple-neon/20"></div>`} </div>`)} </div> <!-- Back to Home Button --> <div class="mt-10 pt-8 border-t border-purple-neon/20 flex justify-center"> <a href="/" class="px-8 py-3 bg-linear-to-r from-purple-neon to-pink-neon text-cyber-white font-bold rounded-lg hover:shadow-neon-purple transition-all duration-300 transform hover:scale-105">
Back to Home
</a> </div> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> ` })}`;
}, "C:/DevCode/Repositories/Webcarry/src/pages/policies.astro", void 0);

const $$file = "C:/DevCode/Repositories/Webcarry/src/pages/policies.astro";
const $$url = "/policies";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Policies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
