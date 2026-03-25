-- Add missing ui_currency_label column to site_config
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_currency_label VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_currency_label_es VARCHAR(100);

-- Pre-fill Spanish translation
UPDATE site_config SET
  ui_currency_label    = 'Currency',
  ui_currency_label_es = 'Moneda'
WHERE id = 1;
