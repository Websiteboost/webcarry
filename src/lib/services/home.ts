/**
 * Servicio para consultar contenido de la home desde la base de datos
 */
import { sql } from '../db';

export interface HomeFeature {
  icon: string;
  title: string;
  description: string;
}

export interface HomeContent {
  title: string;
  subtitle: string;
  categories: string[];
  features: {
    title: string;
    description: string;
    items: HomeFeature[];
  };
}

/**
 * Obtiene el contenido de la home page
 */
export async function getHomeContent(): Promise<HomeContent> {
  // Obtener site_config (singleton)
  const configRows = await sql`
    SELECT home_title, home_subtitle, home_categories
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
    SELECT icon, title, description
    FROM home_features
    ORDER BY display_order ASC
  `;
  
  return {
    title: config.home_title,
    subtitle: config.home_subtitle,
    categories: config.home_categories,
    features: {
      title: 'Why Choose Us',
      description: 'Experience professional gaming services with industry-leading standards and guaranteed results',
      items: featureRows.map(row => ({
        icon: row.icon,
        title: row.title,
        description: row.description,
      })),
    },
  };
}
