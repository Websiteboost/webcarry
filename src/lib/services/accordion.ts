/**
 * Servicio para consultar items del accordion desde la base de datos
 */
import { sql } from '../db';
import type { AccordionContent } from '../../types';

/**
 * Obtiene el contenido del accordion (FAQ)
 */
export async function getAccordionContent(): Promise<AccordionContent> {
  // Obtener el título desde site_config
  const configRows = await sql`
    SELECT accordion_title
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  
  const accordionTitle = configRows.length > 0 
    ? configRows[0].accordion_title 
    : 'Frequently Asked Questions';
  
  // Obtener los items del accordion
  const rows = await sql`
    SELECT id, title, content
    FROM accordion_items
    ORDER BY display_order ASC
  `;
  
  return {
    title: accordionTitle,
    items: rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
    })),
  };
}
