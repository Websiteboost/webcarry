/**
 * Punto de entrada para todos los servicios de base de datos
 * Exporta todas las funciones de consulta en un solo lugar
 */
export type { Locale } from '../i18n';
export { readLocaleCookie } from '../i18n';

// Games
export { getAllGames, getGameById, getGamesByCategory } from './games';

// Categories
export { getAllCategories, getCategoryById, getCategoriesWithServices, getCategoriesWithServicesByGame } from './categories';

// Services
export { 
  getAllServices, 
  getServiceById, 
  getServicesByCategory,
  getServicesByGame 
} from './services';

// Home
export { getHomeContent } from './home';
export type { HomeContent, HomeFeature } from './home';

// Accordion
export { getAccordionContent } from './accordion';

// Footer
export { getFooterContent } from './footer';
export type { Footer, PaymentMethod } from './footer';
// Payment
export { getPaymentConfig } from './payment';
export type { PaymentConfig } from './payment';
// Policies
export { getPoliciesContent } from './policies';
export type { PoliciesContent, PolicySection } from './policies';

// UI Texts
export { getUiTexts } from './ui-texts';
export type { UiTexts } from './ui-texts';

/**
 * Función helper para obtener todo el contenido del sitio de una vez
 * Útil para páginas que necesitan múltiples datos
 */
export async function getSiteContent(locale: import('../i18n').Locale = 'en') {
  const [home, games, categories, services, accordion, footer] = await Promise.all([
    import('./home').then(m => m.getHomeContent(locale)),
    import('./games').then(m => m.getAllGames()),
    import('./categories').then(m => m.getCategoriesWithServices(locale)),
    import('./services').then(m => m.getAllServices(locale)),
    import('./accordion').then(m => m.getAccordionContent(locale)),
    import('./footer').then(m => m.getFooterContent(locale)),
  ]);
  
  return {
    home,
    games,
    categories,
    services,
    accordion,
    footer,
  };
}
