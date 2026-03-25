/**
 * Servicio para consultar items del accordion desde la base de datos
 */
import { sql } from '../db';
import type { AccordionContent } from '../../types';
import { t, type Locale } from '../i18n';

/**
 * Obtiene el contenido del accordion (FAQ)
 */
export async function getAccordionContent(locale: Locale = 'en'): Promise<AccordionContent> {
  // Obtener el título desde site_config
  const configRows = await sql`
    SELECT accordion_title, accordion_title_es
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  
  const accordionTitle = configRows.length > 0 
    ? t(configRows[0].accordion_title, configRows[0].accordion_title_es, locale)
    : 'Frequently Asked Questions';
  
  // Obtener los items del accordion
  const rows = await sql`
    SELECT id, title, title_es, content, content_es
    FROM accordion_items
    ORDER BY display_order ASC
  `;
  
  return {
    title: accordionTitle,
    items: rows.map(row => ({
      id: row.id,
      title: t(row.title, row.title_es, locale),
      content: t(row.content, row.content_es, locale),
    })),
  };
}
