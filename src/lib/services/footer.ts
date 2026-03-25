/**
 * Servicio para consultar footer desde la base de datos
 */
import { sql } from '../db';
import { t, type Locale } from '../i18n';

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
  communityLabel: string;
  discordLabel: string;
  workUsLabel: string;
}

/**
 * Obtiene el contenido del footer
 */
export async function getFooterContent(locale: Locale = 'en'): Promise<Footer> {
  // Obtener site_config para los textos
  const configRows = await sql`
    SELECT footer_payment_title, footer_payment_title_es,
           footer_copyright, footer_copyright_es,
           disclaimer, disclaimer_es,
           discord_link, discord_work_us, euro_value,
           footer_community_label, footer_community_label_es,
           footer_discord_label, footer_discord_label_es,
           footer_work_us_label, footer_work_us_label_es
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
    paymentMethodsTitle: t(config.footer_payment_title, config.footer_payment_title_es, locale),
    copyrightText: t(config.footer_copyright, config.footer_copyright_es, locale),
    disclaimer: t(config.disclaimer, config.disclaimer_es, locale) || 'All services are provided for entertainment purposes only.',
    discordLink: config.discord_link,
    discordWorkUs: config.discord_work_us,
    euroValue: Number(config.euro_value ?? 1.08),
    communityLabel: t(config.footer_community_label ?? 'Community',   config.footer_community_label_es, locale),
    discordLabel:   t(config.footer_discord_label   ?? 'Join Discord', config.footer_discord_label_es,   locale),
    workUsLabel:    t(config.footer_work_us_label   ?? 'Work with Us', config.footer_work_us_label_es,   locale),
    paymentMethods: paymentRows.map(row => ({
      name: row.name,
      type: row.type as 'paypal' | 'card',
    })),
  };
}
