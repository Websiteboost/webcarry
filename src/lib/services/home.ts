/**
 * Servicio para consultar contenido de la home desde la base de datos
 */
import { sql } from '../db';
import { t, tArray, type Locale } from '../i18n';

export interface HomeFeature {
  icon: string;
  title: string;
  description: string;
}

export interface HomeContent {
  title: string;
  subtitle: string;
  categories: string[];
  logoText: string;
  logoImage?: string;
  discordLink?: string;
  features: {
    title: string;
    description: string;
    items: HomeFeature[];
  };
}

/**
 * Obtiene el contenido de la home page
 */
export async function getHomeContent(locale: Locale = 'en'): Promise<HomeContent> {
  // Obtener site_config (singleton)
  const configRows = await sql`
    SELECT home_title, home_title_es, home_subtitle, home_subtitle_es,
           home_categories, home_categories_es, logo_text, logo_url, discord_link
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  
  if (configRows.length === 0) {
    throw new Error('Site config not found in database');
  }
  
  const config = configRows[0];
  
  // Obtener home features
  const featureRows = await sql`
    SELECT icon, title, title_es, description, description_es
    FROM home_features
    ORDER BY display_order ASC
  `;
  
  return {
    title: t(config.home_title, config.home_title_es, locale),
    subtitle: t(config.home_subtitle, config.home_subtitle_es, locale),
    categories: tArray(config.home_categories, config.home_categories_es, locale),
    logoText: config.logo_text || 'BATTLE BOOSTING',
    logoImage: config.logo_url || undefined,
    discordLink: config.discord_link,
    features: {
      title: 'Why Choose Us',
      description: 'Experience professional gaming services with industry-leading standards and guaranteed results',
      items: featureRows.map(row => ({
        icon: row.icon,
        title: t(row.title, row.title_es, locale),
        description: t(row.description, row.description_es, locale),
      })),
    },
  };
}
