/**
 * Servicio para consultar categorías desde la base de datos
 */
import { sql } from '../db';
import type { Category } from '../../types';

interface CategoryWithServices extends Omit<Category, 'services'> {
  services: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
  }>;
}

/**
 * Obtiene todas las categorías
 */
export async function getAllCategories(): Promise<Category[]> {
  const rows = await sql`
    SELECT id, name, description, icon, created_at
    FROM categories
    ORDER BY created_at ASC
  `;
  
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
  }));
}

/**
 * Obtiene una categoría por su ID
 */
export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const rows = await sql`
    SELECT id, name, description, icon, created_at
    FROM categories
    WHERE id = ${categoryId}
    LIMIT 1
  `;
  
  if (rows.length === 0) return null;
  
  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
  };
}

/**
 * Obtiene categorías con sus servicios asociados
 */
export async function getCategoriesWithServices(): Promise<CategoryWithServices[]> {
  const categories = await getAllCategories();
  
  // Para cada categoría, obtener sus servicios
  const categoriesWithServices = await Promise.all(
    categories.map(async (category) => {
      const services = await sql`
        SELECT id, title, price, image
        FROM services
        WHERE category_id = ${category.id}
        ORDER BY created_at ASC
      `;
      
      return {
        ...category,
        services: services.map(s => ({
          id: s.id as string,
          title: s.title as string,
          price: s.price as number,
          image: s.image as string,
        })),
      };
    })
  );
  
  return categoriesWithServices;
}
