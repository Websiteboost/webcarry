/**
 * Servicio para consultar servicios desde la base de datos
 */
import { sql } from '../db';
import type { Service, BarPriceConfig, BoxPriceItem, CustomPriceConfig, SelectorConfig } from '../../types';
import { t, tArray, mergeConfigEs, type Locale } from '../i18n';

interface ServiceRow {
  id: string;
  title: string;
  title_es?: string;
  category_id: string;
  price: number;
  image: string;
  description: string[];
  description_es?: string[];
  service_points?: string[];
  service_points_es?: string[];
}

interface ServicePriceRow {
  id: string;
  type: 'bar' | 'box' | 'custom' | 'selectors' | 'additional' | 'boxtitle' | 'labeltitle' | 'group';
  config: any;
  config_es: any;
  display_order: number;
  required: boolean;
  estimated_time: number;
  discount_percent: number;
  group_id: string | null;
  created_at: Date;
}

/**
 * Obtiene todos los servicios con sus configuraciones de precio y juegos asociados
 */
export async function getAllServices(locale: Locale = 'en'): Promise<Service[]> {
  const rows = await sql`
    SELECT id, title, title_es, category_id, price, image, description, description_es, service_points, service_points_es
    FROM services
    ORDER BY category_id, display_order ASC
  ` as ServiceRow[];
  
  const services = await Promise.all(
    rows.map(async (row) => buildServiceFromRow(row, locale))
  );
  
  return services;
}

/**
 * Obtiene un servicio por su ID
 */
export async function getServiceById(serviceId: string, locale: Locale = 'en'): Promise<Service | null> {
  const rows = await sql`
    SELECT id, title, title_es, category_id, price, image, description, description_es, service_points, service_points_es
    FROM services
    WHERE id = ${serviceId}
    LIMIT 1
  ` as ServiceRow[];
  
  if (rows.length === 0) return null;
  
  return buildServiceFromRow(rows[0], locale);
}

/**
 * Obtiene servicios por categoría
 */
export async function getServicesByCategory(categoryId: string, locale: Locale = 'en'): Promise<Service[]> {
  const rows = await sql`
    SELECT id, title, title_es, category_id, price, image, description, description_es, service_points, service_points_es
    FROM services
    WHERE category_id = ${categoryId}
    ORDER BY display_order ASC
  ` as ServiceRow[];
  
  const services = await Promise.all(
    rows.map(async (row) => buildServiceFromRow(row, locale))
  );
  
  return services;
}

/**
 * Obtiene servicios disponibles para un juego específico
 */
export async function getServicesByGame(gameId: string, locale: Locale = 'en'): Promise<Service[]> {
  const rows = await sql`
    SELECT DISTINCT s.id, s.title, s.title_es, s.category_id, s.price, s.image,
                    s.description, s.description_es, s.service_points, s.service_points_es, s.display_order
    FROM services s
    INNER JOIN service_games sg ON s.id = sg.service_id
    WHERE sg.game_id = ${gameId}
    ORDER BY s.category_id, s.display_order ASC
  ` as ServiceRow[];
  
  const services = await Promise.all(
    rows.map(async (row) => buildServiceFromRow(row, locale))
  );
  
  return services;
}

/**
 * Construye un objeto Service completo desde un row de base de datos
 */
async function buildServiceFromRow(row: ServiceRow, locale: Locale = 'en'): Promise<Service> {
  // Obtener configuraciones de precios con order y group_id
  const priceRows = await sql`
    SELECT id, type, config, config_es, display_order, required, estimated_time, discount_percent, group_id, created_at
    FROM service_prices
    WHERE service_id = ${row.id}
    ORDER BY display_order ASC, created_at ASC
  ` as ServicePriceRow[];
  
  // Obtener juegos asociados
  const gameRows = await sql`
    SELECT game_id
    FROM service_games
    WHERE service_id = ${row.id}
  `;
  const games = gameRows.map(g => g.game_id);
  
  // Construir objeto service con campos traducidos
  const service: Service = {
    id: row.id,
    title: t(row.title, row.title_es, locale),
    categoryId: row.category_id,
    price: row.price,
    image: row.image,
    description: tArray(row.description, row.description_es, locale),
    service_points: (() => {
      const pts = tArray(
        row.service_points && row.service_points.length > 0 ? row.service_points : null,
        row.service_points_es,
        locale,
      );
      return pts.length > 0 ? pts : undefined;
    })(),
    games: games.length > 0 ? games : undefined,
    components: [],
  };
  
  // Pasada 1: crear todos los componentes y poblar datos a nivel de servicio
  const componentMap = new Map<string, import('../../types').ServiceComponent>();

  priceRows.forEach((priceRow) => {
    // Resolver config con traducción si aplica
    const resolvedConfig = mergeConfigEs(priceRow.type, priceRow.config, priceRow.config_es, locale);

    const component: import('../../types').ServiceComponent = {
      id: priceRow.id,
      type: priceRow.type,
      order: priceRow.display_order,
      required: priceRow.required,
      estimatedTime: priceRow.estimated_time ?? 0,
      discount_percent: priceRow.discount_percent ?? 0,
      groupId: priceRow.group_id,
    };

    switch (priceRow.type) {
      case 'group':
        component.data = resolvedConfig;
        component.children = [];
        break;
      case 'bar':
        service.barPrice = resolvedConfig as BarPriceConfig;
        component.data = resolvedConfig;
        break;
      case 'box':
        service.boxPrice = (resolvedConfig.options || []) as BoxPriceItem[];
        component.data = resolvedConfig;
        break;
      case 'custom':
        service.customPrice = { enabled: true, ...resolvedConfig } as CustomPriceConfig;
        component.data = resolvedConfig;
        break;
      case 'selectors':
        service.selectors = resolvedConfig as SelectorConfig;
        component.data = resolvedConfig;
        break;
      case 'additional': {
        const { title, ...additionalOptions } = resolvedConfig;
        service.additionalServices = additionalOptions;
        service.additionalServicesTitle = title || 'Additional Services';
        component.data = { title, options: additionalOptions };
        break;
      }
      case 'boxtitle':
        if (!service.boxTitles) service.boxTitles = [];
        if (resolvedConfig.options && Array.isArray(resolvedConfig.options)) {
          service.boxTitles = resolvedConfig.options;
        }
        component.data = resolvedConfig;
        break;
      case 'labeltitle':
        if (!service.serviceTitles) service.serviceTitles = [];
        service.serviceTitles.push({
          id: priceRow.id,
          title: resolvedConfig.title || '',
          order: service.serviceTitles.length,
        });
        component.data = resolvedConfig;
        break;
    }

    componentMap.set(priceRow.id, component);
  });

  // Pasada 2: vincular hijos a sus grupos y recopilar componentes raíz
  priceRows.forEach((priceRow) => {
    const component = componentMap.get(priceRow.id)!;
    if (priceRow.group_id) {
      const parent = componentMap.get(priceRow.group_id);
      if (parent?.children) {
        parent.children.push(component);
      }
    } else {
      service.components!.push(component);
    }
  });

  return service;
}
