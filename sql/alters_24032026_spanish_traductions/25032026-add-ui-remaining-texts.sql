-- ====================================================================
-- Textos UI faltantes — resto de strings hardcodeados en componentes
-- ====================================================================

-- PaymentSidebar
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_checkout VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_checkout_es VARCHAR(100);

-- PaymentCheckout
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_paypal_label VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_paypal_label_es VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_card_label VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_card_label_es VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_saved VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_saved_es VARCHAR(100);

-- DiscountInput
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_discount_off VARCHAR(50);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_discount_off_es VARCHAR(50);

-- ServiceSearch
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_search_placeholder VARCHAR(200);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_search_placeholder_es VARCHAR(200);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_search_no_results VARCHAR(200);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_search_no_results_es VARCHAR(200);

-- GamePageView — contador de servicios en tarjetas de categoría
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_service_singular VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_service_singular_es VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_service_plural VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_service_plural_es VARCHAR(100);

-- BoxPrice
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_select_amount VARCHAR(200);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_select_amount_es VARCHAR(200);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_amount_singular VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_amount_singular_es VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_amount_plural VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_amount_plural_es VARCHAR(100);

-- BoxTitle
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_selected_prefix VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_selected_prefix_es VARCHAR(100);

-- BoxPrice + CheckGroup — texto "selected" compartido
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_selected VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_selected_es VARCHAR(100);

-- CheckGroup
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_additional_singular VARCHAR(200);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_additional_singular_es VARCHAR(200);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_additional_plural VARCHAR(200);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_additional_plural_es VARCHAR(200);

-- CustomSelector
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_choose_placeholder VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_choose_placeholder_es VARCHAR(100);

-- IncrementalBar
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_bar_from VARCHAR(50);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_bar_from_es VARCHAR(50);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_bar_to VARCHAR(50);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_bar_to_es VARCHAR(50);

-- Footer
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS footer_community_label VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS footer_community_label_es VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS footer_discord_label VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS footer_discord_label_es VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS footer_work_us_label VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS footer_work_us_label_es VARCHAR(100);

-- ====================================================================
-- Pre-fill de traducciones al español
-- ====================================================================
UPDATE site_config SET
  ui_checkout              = 'Checkout',              ui_checkout_es              = 'Pago',
  ui_paypal_label          = 'PayPal',                ui_paypal_label_es          = 'PayPal',
  ui_card_label            = 'Card',                  ui_card_label_es            = 'Tarjeta',
  ui_saved                 = 'saved',                 ui_saved_es                 = 'ahorrado',
  ui_discount_off          = 'off',                   ui_discount_off_es          = 'desc.',
  ui_search_placeholder    = 'Search services…',      ui_search_placeholder_es    = 'Buscar servicios…',
  ui_search_no_results     = 'No services match',     ui_search_no_results_es     = 'Sin resultados para',
  ui_service_singular      = 'service',               ui_service_singular_es      = 'servicio',
  ui_service_plural        = 'services',              ui_service_plural_es        = 'servicios',
  ui_select_amount         = 'Select Amount',         ui_select_amount_es         = 'Seleccionar cantidad',
  ui_amount_singular       = 'amount',                ui_amount_singular_es       = 'cantidad',
  ui_amount_plural         = 'amounts',               ui_amount_plural_es         = 'cantidades',
  ui_selected_prefix       = 'Selected:',             ui_selected_prefix_es       = 'Seleccionado:',
  ui_selected              = 'selected',              ui_selected_es              = 'seleccionado',
  ui_additional_singular   = 'additional service',    ui_additional_singular_es   = 'servicio adicional',
  ui_additional_plural     = 'additional services',   ui_additional_plural_es     = 'servicios adicionales',
  ui_choose_placeholder    = 'Choose...',             ui_choose_placeholder_es    = 'Elegir...',
  ui_bar_from              = 'From',                  ui_bar_from_es              = 'Desde',
  ui_bar_to                = 'To',                    ui_bar_to_es                = 'Hasta',
  footer_community_label   = 'Community',             footer_community_label_es   = 'Comunidad',
  footer_discord_label     = 'Join Discord',          footer_discord_label_es     = 'Únete al Discord',
  footer_work_us_label     = 'Work with Us',          footer_work_us_label_es     = 'Trabaja con Nosotros'
WHERE id = 1;
