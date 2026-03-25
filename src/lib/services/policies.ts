/**
 * Servicio para consultar políticas desde la base de datos
 */
import { sql } from '../db';
import { type Locale } from '../i18n';

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
  
  const titleMatch = html.match(/<h3>(.*?)<\/h3>/);
  const title = titleMatch ? titleMatch[1] : '';
  
  const contentMatch = html.match(/<span>(.*?)<\/span>/);
  const content = contentMatch ? contentMatch[1] : '';
  
  if (!title && !content) return null;
  
  return { title, content };
}

/**
 * Obtiene todas las secciones de políticas desde la base de datos
 */
export async function getPoliciesContent(locale: Locale = 'en'): Promise<PoliciesContent> {
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
    throw new Error('Policies not found in database');
  }
  
  const policy = rows[0];
  const sections: PolicySection[] = [];
  
  for (let i = 1; i <= 9; i++) {
    const enKey = `section_${i}` as keyof typeof policy;
    const esKey = `section_${i}_es` as keyof typeof policy;
    
    // Elegir la versión ES si existe y el locale es es, si no usar EN
    const rawEs = policy[esKey] as string | null;
    const rawEn = policy[enKey] as string | null;
    const raw = (locale === 'es' && rawEs && rawEs.trim() !== '') ? rawEs : rawEn;
    
    const parsed = parsePolicySection(raw as string | null);
    if (parsed) sections.push(parsed);
  }
  
  return { sections };
}
