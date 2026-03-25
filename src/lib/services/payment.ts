/**
 * Servicio para consultar configuración de pagos desde la base de datos
 */
import { sql } from '../db';
import { t, type Locale } from '../i18n';

export interface PaymentConfig {
  disclaimer: string;
  /** USD value of 1 EUR (e.g. 1.08 means 1 EUR = $1.08 USD) */
  euroValue: number;
}

/**
 * Obtiene la configuración de pagos
 */
export async function getPaymentConfig(locale: Locale = 'en'): Promise<PaymentConfig> {
  const configRows = await sql`
    SELECT payment_disclaimer, payment_disclaimer_es, euro_value
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  
  if (configRows.length === 0) {
    throw new Error('Site config not found in database');
  }
  
  const config = configRows[0];
  
  return {
    disclaimer: t(
      config.payment_disclaimer || 'After completing your payment, please create a ticket in our Discord server to start your order.',
      config.payment_disclaimer_es,
      locale,
    ),
    euroValue: Number(config.euro_value ?? 1.08),
  };
}
