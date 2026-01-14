/**
 * Servicio para consultar servicios desde la base de datos
 */
import { sql } from '../db';
import type { Service, BarPriceConfig, BoxPriceItem, CustomPriceConfig, SelectorConfig } from '../../types';

interface ServiceRow {
  id: string;
  title: string;
  category_id: string;
  price: number;
  image: string;
  description: string[];
}

interface ServicePriceRow {
  type: 'bar' | 'box' | 'custom' | 'selectors' | 'additional';
  config: any;
}

/**
 * Obtiene todos los servicios con sus configuraciones de precio y juegos asociados
 */
export async function getAllServices(): Promise<Service[]> {
  const rows = await sql`
    SELECT id, title, category_id, price, image, description, created_at, updated_at
    FROM services
    ORDER BY category_id, display_order ASC
  ` as ServiceRow[];
  
  // Para cada servicio, obtener sus precios y juegos
  const services = await Promise.all(
    rows.map(async (row) => {
      const service = await buildServiceFromRow(row);
      return service;
    })
  );
  
  return services;
}

/**
 * Obtiene un servicio por su ID
 */
export async function getServiceById(serviceId: string): Promise<Service | null> {
  const rows = await sql`
    SELECT id, title, category_id, price, image, description, created_at, updated_at
    FROM services
    WHERE id = ${serviceId}
    LIMIT 1
  ` as ServiceRow[];
  
  if (rows.length === 0) return null;
  
  return await buildServiceFromRow(rows[0]);
}

/**
 * Obtiene servicios por categoría
 */
export async function getServicesByCategory(categoryId: string): Promise<Service[]> {
  const rows = await sql`
    SELECT id, title, category_id, price, image, description, created_at, updated_at
    FROM services
    WHERE category_id = ${categoryId}
    ORDER BY display_order ASC
  ` as ServiceRow[];
  
  const services = await Promise.all(
    rows.map(async (row) => await buildServiceFromRow(row))
  );
  
  return services;
}

/**
 * Obtiene servicios disponibles para un juego específico
 */
export async function getServicesByGame(gameId: string): Promise<Service[]> {
  const rows = await sql`
    SELECT DISTINCT s.id, s.title, s.category_id, s.price, s.image, s.description, s.created_at, s.updated_at, s.display_order
    FROM services s
    INNER JOIN service_games sg ON s.id = sg.service_id
    WHERE sg.game_id = ${gameId}
    ORDER BY s.category_id, s.display_order ASC
  ` as ServiceRow[];
  
  const services = await Promise.all(
    rows.map(async (row) => await buildServiceFromRow(row))
  );
  
  return services;
}

/**
 * Construye un objeto Service completo desde un row de base de datos
 */
async function buildServiceFromRow(row: ServiceRow): Promise<Service> {
  // Obtener configuraciones de precios
  const priceRows = await sql`
    SELECT type, config
    FROM service_prices
    WHERE service_id = ${row.id}
  ` as ServicePriceRow[];
  
  // Obtener juegos asociados
  const gameRows = await sql`
    SELECT game_id
    FROM service_games
    WHERE service_id = ${row.id}
  `;
  const games = gameRows.map(g => g.game_id);
  
  // Construir objeto service
  const service: Service = {
    id: row.id,
    title: row.title,
    categoryId: row.category_id,
    price: row.price,
    image: row.image,
    description: row.description,
    games: games.length > 0 ? games : undefined,
  };
  
  // Procesar configuraciones de precios
  for (const priceRow of priceRows) {
    switch (priceRow.type) {
      case 'bar':
        service.barPrice = priceRow.config as BarPriceConfig;
        break;
      case 'box':
        service.boxPrice = (priceRow.config.options || []) as BoxPriceItem[];
        break;
      case 'custom':
        service.customPrice = {
          enabled: true,
          ...priceRow.config,
        } as CustomPriceConfig;
        break;
      case 'selectors':
        service.selectors = priceRow.config as SelectorConfig;
        break;
      case 'additional':
        service.additionalServices = priceRow.config;
        break;
    }
  }
  
  return service;
}
