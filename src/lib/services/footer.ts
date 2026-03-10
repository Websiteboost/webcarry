/**
 * Servicio para consultar footer desde la base de datos
 */
import { sql } from '../db';

export interface PaymentMethod {
  name: string;
  type: 'paypal' | 'card';
}

export interface Footer {
  paymentMethodsTitle: string;
  copyrightText: string;
  disclaimer: string;
  discordLink?: string;
  discordWorkUs?: string;
  paymentMethods: PaymentMethod[];
  /** USD value of 1 EUR (e.g. 1.08 means 1 EUR = $1.08 USD) */
  euroValue: number;
}

/**
 * Obtiene el contenido del footer
 */
export async function getFooterContent(): Promise<Footer> {
  // Obtener site_config para los textos
  const configRows = await sql`
    SELECT footer_payment_title, footer_copyright, disclaimer, discord_link, discord_work_us, euro_value
    FROM site_config
    WHERE id = 1
    LIMIT 1
  `;
  
  if (configRows.length === 0) {
    throw new Error('Site config not found in database');
  }
  
  const config = configRows[0];
  
  // Obtener métodos de pago
  const paymentRows = await sql`
    SELECT name, type
    FROM payment_methods
    ORDER BY id ASC
  `;
  
  return {
    paymentMethodsTitle: config.footer_payment_title,
    copyrightText: config.footer_copyright,
    disclaimer: config.disclaimer || 'All services are provided for entertainment purposes only.',
    discordLink: config.discord_link,
    discordWorkUs: config.discord_work_us,
    euroValue: Number(config.euro_value ?? 1.08),
    paymentMethods: paymentRows.map(row => ({
      name: row.name,
      type: row.type as 'paypal' | 'card',
    })),
  };
}
