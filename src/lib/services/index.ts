/**
 * Punto de entrada para todos los servicios de base de datos
 * Exporta todas las funciones de consulta en un solo lugar
 */

// Games
export { getAllGames, getGameById, getGamesByCategory } from './games';

// Categories
export { getAllCategories, getCategoryById, getCategoriesWithServices } from './categories';

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

/**
 * Función helper para obtener todo el contenido del sitio de una vez
 * Útil para páginas que necesitan múltiples datos
 */
export async function getSiteContent() {
  const [home, games, categories, services, accordion, footer] = await Promise.all([
    import('./home').then(m => m.getHomeContent()),
    import('./games').then(m => m.getAllGames()),
    import('./categories').then(m => m.getCategoriesWithServices()),
    import('./services').then(m => m.getAllServices()),
    import('./accordion').then(m => m.getAccordionContent()),
    import('./footer').then(m => m.getFooterContent()),
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
