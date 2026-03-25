-- 19/01/2026 - Agregar soporte para componentes "boxtitle" y "labeltitle"
-- boxtitle: Componente visual tipo caja que solo muestra label y value (no afecta precio)
-- labeltitle: Separador visual de secciones que muestra un título como divisor

ALTER TABLE service_prices DROP CONSTRAINT IF EXISTS service_prices_type_check;
ALTER TABLE service_prices ADD CONSTRAINT service_prices_type_check 
  CHECK (type IN ('bar', 'box', 'custom', 'selectors', 'additional', 'boxtitle', 'labeltitle'));

-- Ejemplos de inserción para cajas con label y value
-- INSERT INTO service_prices (service_id, type, config) VALUES
-- ('ejemplo-servicio', 'boxtitle', '{"options": [{"label": "ETA", "value": "1-3 days"}, {"label": "Support", "value": "24/7"}]}'::jsonb);

-- Ejemplos de inserción para separadores de título
-- INSERT INTO service_prices (service_id, type, config) VALUES
-- ('ejemplo-servicio', 'labeltitle', '{"title": "Additional Options"}'::jsonb);

