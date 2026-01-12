/**
 * Servicio para consultar juegos desde la base de datos
 */
import { sql } from '../db';
import type { Game } from '../../types';

/**
 * Obtiene todos los juegos
 */
export async function getAllGames(): Promise<Game[]> {
  const rows = await sql`
    SELECT id, title, category, image, created_at
    FROM games
    ORDER BY id ASC
  `;
  
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image,
  }));
}

/**
 * Obtiene un juego por su ID
 */
export async function getGameById(gameId: string): Promise<Game | null> {
  const rows = await sql`
    SELECT id, title, category, image, created_at
    FROM games
    WHERE id = ${gameId}
    LIMIT 1
  `;
  
  if (rows.length === 0) return null;
  
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image,
  };
}

/**
 * Obtiene juegos por categoría
 */
export async function getGamesByCategory(category: string): Promise<Game[]> {
  const rows = await sql`
    SELECT id, title, category, image, created_at
    FROM games
    WHERE category = ${category}
    ORDER BY id ASC
  `;
  
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image,
  }));
}
