/**
 * Servicio para consultar configuración de pagos desde la base de datos
 */
import { sql } from '../db';

export interface PaymentConfig {
  disclaimer: string;
}

/**
 * Obtiene la configuración de pagos
 */
export async function getPaymentConfig(): Promise<PaymentConfig> {
  const configRows = await sql`
    SELECT payment_disclaimer
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  
  if (configRows.length === 0) {
    throw new Error('Site config not found in database');
  }
  
  const config = configRows[0];
  
  return {
    disclaimer: config.payment_disclaimer || 'After completing your payment, please create a ticket in our Discord server to start your order.',
  };
}
