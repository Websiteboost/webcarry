-- Add missing ui_buy_button columns to site_config
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_buy_button VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS ui_buy_button_es VARCHAR(100);

-- Pre-fill Spanish translation
UPDATE site_config SET
  ui_buy_button    = 'Buy',
  ui_buy_button_es = 'Comprar'
WHERE id = 1;
