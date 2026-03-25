-- ============================================================================
-- MIGRACIÓN: Añadir campo disclaimer a site_config
-- Fecha: 12/01/2026
-- Descripción: Agrega el campo disclaimer para almacenar el mensaje de
--              liberación de responsabilidad que se mostrará en el footer
-- ============================================================================

-- Añadir el campo disclaimer a la tabla site_config
ALTER TABLE site_config 
ADD COLUMN disclaimer TEXT NOT NULL DEFAULT 'All services are provided for entertainment purposes only. We are not affiliated with or endorsed by any game developers or publishers. Account security is our top priority, and we use industry-standard protection measures. By using our services, you acknowledge that you have read and agree to our terms of service and privacy policy.';

-- Actualizar el registro existente con el valor por defecto
UPDATE site_config 
SET disclaimer = 'All services are provided for entertainment purposes only. We are not affiliated with or endorsed by any game developers or publishers. Account security is our top priority, and we use industry-standard protection measures. By using our services, you acknowledge that you have read and agree to our terms of service and privacy policy.' 
WHERE id = 1;

-- Comentario de la columna para documentación
COMMENT ON COLUMN site_config.disclaimer IS 'Mensaje de liberación de responsabilidad que se muestra en el footer';
