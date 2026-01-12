/**
 * Conexión a Neon PostgreSQL
 * Usa el driver serverless de Neon con pooling automático
 */
import { neon } from '@neondatabase/serverless';

// Validar que existe la variable de entorno
if (!import.meta.env.DATABASE_URL && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida en .env.local');
}

// Obtener la URL de conexión (pooled para mejor rendimiento)
const DATABASE_URL = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

// Crear cliente SQL ejecutable
export const sql = neon(DATABASE_URL);

// Helper type para resultados de queries
export type QueryResult<T> = T[];
