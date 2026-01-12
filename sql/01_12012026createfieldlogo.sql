-- ============================================================================
-- MIGRACIÓN: Añadir campo logo_text a site_config
-- Fecha: 12/01/2026
-- Descripción: Agrega el campo logo_text para almacenar el texto del logo
--              que se mostrará en el componente GlitchLogo
-- ============================================================================

-- Añadir el campo logo_text a la tabla site_config
ALTER TABLE site_config 
ADD COLUMN logo_text VARCHAR(255) NOT NULL DEFAULT 'BATTLE BOOSTING';

-- Actualizar el registro existente con los valores por defecto
UPDATE site_config 
SET logo_text = 'BATTLE BOOSTING' 
WHERE id = 1;

-- Comentario de la columna para documentación
COMMENT ON COLUMN site_config.logo_text IS 'Texto del logo (se divide por espacios para crear líneas múltiples)';
