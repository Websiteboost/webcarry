/**
 * Servicio para consultar políticas desde la base de datos
 */
import { sql } from '../db';

export interface PolicySection {
  title: string;
  content: string;
}

export interface PoliciesContent {
  sections: PolicySection[];
}

/**
 * Parsea una sección de política con HTML para extraer título y contenido
 */
function parsePolicySection(html: string | null): PolicySection | null {
  if (!html) return null;
  
  // Extraer el título entre <h3></h3>
  const titleMatch = html.match(/<h3>(.*?)<\/h3>/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Extraer el contenido entre <span></span>
  const contentMatch = html.match(/<span>(.*?)<\/span>/);
  const content = contentMatch ? contentMatch[1] : '';
  
  // Solo retornar si tiene al menos título o contenido
  if (!title && !content) return null;
  
  return { title, content };
}

/**
 * Obtiene todas las secciones de políticas desde la base de datos
 */
export async function getPoliciesContent(): Promise<PoliciesContent> {
  // Obtener todas las secciones de políticas
  const rows = await sql`
    SELECT 
      section_1, section_2, section_3, section_4, section_5,
      section_6, section_7, section_8, section_9, section_10
    FROM policies
    WHERE id = 1
    LIMIT 1
  `;
  
  if (rows.length === 0) {
    throw new Error('Policies not found in database');
  }
  
  const policy = rows[0];
  
  // Parsear todas las secciones y filtrar las que estén vacías
  const sections: PolicySection[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const sectionKey = `section_${i}` as keyof typeof policy;
    const parsed = parsePolicySection(policy[sectionKey] as string | null);
    if (parsed) {
      sections.push(parsed);
    }
  }
  
  return {
    sections,
  };
}
