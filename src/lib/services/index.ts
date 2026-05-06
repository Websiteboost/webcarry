/**
 * Punto de entrada para todos los servicios de base de datos
 * Exporta todas las funciones de consulta en un solo lugar
 */
import { readLocaleCookie, type Locale } from '../i18n';
import { getAllGames, getGameById, getGamesByCategory } from './games';
import { getAllCategories, getCategoryById, getCategoriesWithServices, getCategoriesWithServicesByGame } from './categories';
import { getAllServices, getServiceById, getServicesByCategory, getServicesByGame } from './services';
import { getHomeContent, type HomeContent, type HomeFeature } from './home';
import { getAccordionContent } from './accordion';
import { getFooterContent, type Footer, type PaymentMethod } from './footer';
import { getPaymentConfig, type PaymentConfig } from './payment';
import { getPoliciesContent, type PoliciesContent, type PolicySection } from './policies';
import { getUiTexts, type UiTexts } from './ui-texts';

export type { Locale };
export { readLocaleCookie };

// Games
export { getAllGames, getGameById, getGamesByCategory };

// Categories
export { getAllCategories, getCategoryById, getCategoriesWithServices, getCategoriesWithServicesByGame };

// Services
export { getAllServices, getServiceById, getServicesByCategory, getServicesByGame };

// Home
export { getHomeContent };
export type { HomeContent, HomeFeature };

// Accordion
export { getAccordionContent };

// Footer
export { getFooterContent };
export type { Footer, PaymentMethod };

// Payment
export { getPaymentConfig };
export type { PaymentConfig };

// Policies
export { getPoliciesContent };
export type { PoliciesContent, PolicySection };

// UI Texts
export { getUiTexts };
export type { UiTexts };

/**
 * Función helper para obtener todo el contenido del sitio de una vez
 * Útil para páginas que necesitan múltiples datos
 */
export async function getSiteContent(locale: Locale = 'en') {
  const [home, games, categories, services, accordion, footer] = await Promise.all([
    getHomeContent(locale),
    getAllGames(),
    getCategoriesWithServices(locale),
    getAllServices(locale),
    getAccordionContent(locale),
    getFooterContent(locale),
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
