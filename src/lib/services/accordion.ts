/**
 * Servicio para consultar items del accordion desde la base de datos
 */
import { sql } from '../db';
import type { AccordionContent } from '../../types';

/**
 * Obtiene el contenido del accordion (FAQ)
 */
export async function getAccordionContent(): Promise<AccordionContent> {
  const rows = await sql`
    SELECT id, title, content
    FROM accordion_items
    ORDER BY display_order ASC
  `;
  
  return {
    title: 'Accordion Title',
    items: rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
    })),
  };
}
