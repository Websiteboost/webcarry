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
    ORDER BY display_order ASC
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
        ORDER BY display_order ASC
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

/**
 * Obtiene categorías con servicios filtradas por juego
 * Solo devuelve categorías que tienen servicios disponibles para el juego especificado
 */
export async function getCategoriesWithServicesByGame(gameId: string): Promise<CategoryWithServices[]> {
  // Obtener todas las categorías que tienen relación con el juego
  const categoryRows = await sql`
    SELECT DISTINCT c.id, c.name, c.description, c.icon, c.created_at, c.display_order
    FROM categories c
    INNER JOIN category_games cg ON c.id = cg.category_id
    WHERE cg.game_id = ${gameId}
    ORDER BY c.display_order ASC
  `;
  
  // Para cada categoría, obtener solo los servicios que están disponibles para este juego
  const categoriesWithServices = await Promise.all(
    categoryRows.map(async (category) => {
      const services = await sql`
        SELECT DISTINCT s.id, s.title, s.price, s.image, s.created_at, s.display_order
        FROM services s
        INNER JOIN service_games sg ON s.id = sg.service_id
        WHERE s.category_id = ${category.id}
          AND sg.game_id = ${gameId}
        ORDER BY s.display_order ASC
      `;
      
      return {
        id: category.id as string,
        name: category.name as string,
        description: category.description as string,
        icon: category.icon as string,
        services: services.map(s => ({
          id: s.id as string,
          title: s.title as string,
          price: s.price as number,
          image: s.image as string,
        })),
      };
    })
  );
  
  // Filtrar categorías que no tienen servicios para este juego
  return categoriesWithServices.filter(cat => cat.services.length > 0);
}
