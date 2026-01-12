-- ============================================================================
-- BattleBoosting - PostgreSQL Database Seed
-- Creado: 11 de enero de 2026
-- Base de datos: Neon PostgreSQL
-- 
-- Este script crea todas las tablas y las puebla con los datos actuales
-- del contenido en archivos Markdown.
-- ============================================================================

-- ============================================================================
-- SECCIÓN 0: LIMPIAR BASE DE DATOS (Opcional)
-- ============================================================================
-- Descomentar estas líneas si quieres borrar todo y empezar de cero:
DROP TABLE IF EXISTS service_prices CASCADE;
DROP TABLE IF EXISTS service_games CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS accordion_items CASCADE;
DROP TABLE IF EXISTS home_features CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- ============================================================================
-- SECCIÓN 1: CREACIÓN DE TABLAS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tabla: users (Sistema de autenticación)
-- ----------------------------------------------------------------------------
-- NOTA: Esta tabla está intencionalmente VACÍA en el seed.
-- Se llenará dinámicamente cuando:
--   1. Los usuarios se registren en la aplicación
--   2. Un administrador cree cuentas manualmente
--   3. Durante desarrollo/testing
-- 
-- El DEFAULT 'user' y CHECK (role IN ('admin', 'user')) son REGLAS, NO insertan datos.
-- Solo definen:
--   - DEFAULT 'user': Si no especificas rol al crear usuario, será 'user'
--   - CHECK: Solo permite valores 'admin' o 'user' para el campo role
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(21) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por email
CREATE INDEX idx_users_email ON users(email);

-- ----------------------------------------------------------------------------
-- Tabla: sessions (Gestión de sesiones de Lucia Auth)
-- ----------------------------------------------------------------------------
-- NOTA: Esta tabla también está vacía. Se llena automáticamente cuando los
-- usuarios inician sesión. Las sesiones expiradas se limpian automáticamente.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(40) PRIMARY KEY,
    user_id VARCHAR(21) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índice para búsquedas por user_id y expiración
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ----------------------------------------------------------------------------
-- Tabla: games (Juegos disponibles en la plataforma)
-- ----------------------------------------------------------------------------
-- NOTA: created_at se registra automáticamente (DEFAULT CURRENT_TIMESTAMP)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por categoría
CREATE INDEX idx_games_category ON games(category);

-- ----------------------------------------------------------------------------
-- Tabla: categories (Categorías de servicios)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Tabla: services (Servicios ofrecidos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT NOT NULL,
    description TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Índices para búsquedas y relaciones
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_price ON services(price);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- Tabla: service_games (Relación Many-to-Many entre servicios y juegos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_games (
    service_id VARCHAR(50) NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (service_id, game_id),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Índices para búsquedas bidireccionales
CREATE INDEX idx_service_games_service_id ON service_games(service_id);
CREATE INDEX idx_service_games_game_id ON service_games(game_id);

-- ----------------------------------------------------------------------------
-- Tabla: service_prices (Configuraciones de precios flexibles)
-- ----------------------------------------------------------------------------
-- NOTAS SOBRE CAMPOS ESPECIALES:
--   - id: Se genera automáticamente un UUID único (gen_random_uuid())
--   - type: CHECK obliga a usar solo: 'bar', 'box', 'custom', 'selectors', 'additional'
--           (NO tiene DEFAULT, DEBES especificarlo siempre al insertar)
--   - created_at: Se registra automáticamente la fecha/hora de creación
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('bar', 'box', 'custom', 'selectors', 'additional')),
    config JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Índices para búsquedas y queries JSONB
CREATE INDEX idx_service_prices_service_id ON service_prices(service_id);
CREATE INDEX idx_service_prices_type ON service_prices(type);
CREATE INDEX idx_service_prices_config ON service_prices USING GIN (config);

-- ----------------------------------------------------------------------------
-- Tabla: accordion_items (Items del acordeón FAQ)
-- ----------------------------------------------------------------------------
-- NOTA: created_at se registra automáticamente al insertar
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accordion_items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para ordenamiento
CREATE INDEX idx_accordion_items_order ON accordion_items(display_order);

-- ----------------------------------------------------------------------------
-- Tabla: home_features (Características destacadas en home)
-- ----------------------------------------------------------------------------
-- NOTAS: id UUID se genera automáticamente, created_at también es automático
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS home_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para ordenamiento
CREATE INDEX idx_home_features_order ON home_features(display_order);

-- ----------------------------------------------------------------------------
-- Tabla: payment_methods (Métodos de pago aceptados)
-- ----------------------------------------------------------------------------
-- NOTAS: id UUID se genera automáticamente, created_at también es automático
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Tabla: site_config (Configuración global del sitio - Singleton)
-- ----------------------------------------------------------------------------
-- PATRÓN SINGLETON:
--   - id: DEFAULT 1 y CHECK (id = 1) GARANTIZAN que solo exista 1 registro
--   - Si intentas insertar otro registro, PostgreSQL rechazará la operación
--   - Siempre habrá exactamente 1 fila con id=1 (configuración global única)
--   - updated_at: Se actualiza automáticamente con el trigger
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    home_title VARCHAR(255) NOT NULL,
    home_subtitle TEXT NOT NULL,
    home_categories TEXT[] NOT NULL,
    footer_payment_title VARCHAR(255) NOT NULL,
    footer_copyright TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para actualizar updated_at en site_config
CREATE TRIGGER update_site_config_updated_at
    BEFORE UPDATE ON site_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECCIÓN 2: INSERCIÓN DE DATOS (SEED)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- NOTA IMPORTANTE: Tabla 'users' vacía
-- ----------------------------------------------------------------------------
-- La tabla 'users' NO tiene datos insertados aquí porque:
--   - Se debe llenar cuando los usuarios se registren en la aplicación
--   - Las contraseñas deben hashearse con bcrypt/argon2 según tu auth system
--   - Para desarrollo, puedes crear un admin manualmente después con tu app
-- 
-- Si necesitas un usuario admin de prueba, créalo con tu aplicación o con:
-- INSERT INTO users (id, email, password_hash, role) VALUES
-- ('admin_001', 'admin@battleboosting.com', '$2a$10$...hash...', 'admin');
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- Insertar Games (4 juegos)
-- ----------------------------------------------------------------------------
INSERT INTO games (id, title, category, image) VALUES ('game-1','Nexus Warriors','MMO','/images/games/nexus-warriors.jpg'),('game-2','Void Legends','MOBA','/images/games/void-legends.jpg'),('game-3','Eternal Realms','RPG','/images/games/eternal-realms.jpg'),('game-4','Cyber Strike','FPS','/images/games/cyber-strike.jpg');

-- ----------------------------------------------------------------------------
-- Insertar Categories (8 categorías)
-- ----------------------------------------------------------------------------
INSERT INTO categories (id, name, description, icon) VALUES
('power-leveling','Power Leveling','Fast and efficient character leveling services to reach maximum level quickly','Zap'),
('ranked-boosting','Ranked Boosting','Professional rank climbing services by experienced players to reach your desired tier','Trophy'),
('achievement-hunting','Achievement Hunting','Complete difficult achievements and unlock exclusive rewards and titles','Award'),
('gear-farming','Gear Farming','Obtain the best equipment and legendary items with optimized farming strategies','Shield'),
('dungeon-carries','Dungeon Carries','Expert dungeon runs with guaranteed loot and efficient completion times','Swords'),
('pvp-training','PvP Training','Learn advanced PvP techniques and strategies from professional players','Sword'),
('raid-completion','Raid Completion','Full raid clears with experienced teams, including all bosses and exclusive rewards','Users'),
('character-customization','Character Customization','Transform your character with premium cosmetics, skins and exclusive appearance items','Palette');

-- ----------------------------------------------------------------------------
-- Insertar Services (16 servicios)
-- ----------------------------------------------------------------------------
INSERT INTO services (id, title, category_id, price, image, description) VALUES
-- Power Leveling
('pl-1', 'Level 1-50 Express', 'power-leveling', 25.00, '/images/services/leveling-1.jpg', 
 ARRAY['Fast boost from level 1 to 50', 'Completed in 24-48 hours', 'Basic equipment included']),
('pl-2', 'Max Level Premium', 'power-leveling', 45.00, '/images/services/leveling-2.jpg', 
 ARRAY['Maximum level guaranteed', 'Epic equipment included', '24/7 support']),

-- Ranked Boosting
('rb-1', 'Bronze to Gold', 'ranked-boosting', 35.00, '/images/services/ranked-1.jpg', 
 ARRAY['Guaranteed climb to Gold', 'Professional players', 'Live streaming available']),
('rb-2', 'Platinum Package', 'ranked-boosting', 65.00, '/images/services/ranked-2.jpg', 
 ARRAY['Reach Platinum rank', 'Priority queue', 'Coaching included']),

-- Achievement Hunting
('ah-1', 'Achievement Bundle Basic', 'achievement-hunting', 20.00, '/images/services/achievement-1.jpg', 
 ARRAY['10 achievements of your choice', 'Completed in 3-5 days', 'Detailed guide included']),
('ah-2', '100% Completion', 'achievement-hunting', 75.00, '/images/services/achievement-2.jpg', 
 ARRAY['All game achievements', 'Rare titles and rewards', 'Completion guarantee']),

-- Gear Farming
('gf-1', 'Epic Gear Set', 'gear-farming', 30.00, '/images/services/gear-1.jpg', 
 ARRAY['Complete epic gear set', 'Optimized stats', 'Efficient farming']),
('gf-2', 'Legendary Weapons', 'gear-farming', 50.00, '/images/services/gear-2.jpg', 
 ARRAY['Exclusive legendary weapons', 'Premium enchants', 'Improved drop rate']),

-- Dungeon Carries
('dc-1', 'Normal Dungeon Pack', 'dungeon-carries', 15.00, '/images/services/dungeon-1.jpg', 
 ARRAY['5 normal dungeons', 'All loot reserved for you', 'Completed in 2 hours']),
('dc-2', 'Mythic+ Bundle', 'dungeon-carries', 55.00, '/images/services/dungeon-2.jpg', 
 ARRAY['Mythic+15 dungeons', 'Experienced group', 'Guaranteed loot']),

-- PvP Training
('pvp-1', 'PvP Basics', 'pvp-training', 25.00, '/images/services/pvp-1.jpg', 
 ARRAY['PvP combat fundamentals', '5 training sessions', 'Replay analysis']),
('pvp-2', 'Arena Mastery', 'pvp-training', 60.00, '/images/services/pvp-2.jpg', 
 ARRAY['Advanced arena training', 'Team strategies', 'Personalized coaching']),

-- Raid Completion
('rc-1', 'Normal Raid Clear', 'raid-completion', 40.00, '/images/services/raid-1.jpg', 
 ARRAY['Full raid on normal difficulty', 'All loot reserved', 'Organized group']),
('rc-2', 'Heroic Full Clear', 'raid-completion', 80.00, '/images/services/raid-2.jpg', 
 ARRAY['Full heroic raid', 'Mounts and titles included', 'Top guild carry']),

-- Character Customization
('cc-1', 'Appearance Makeover', 'character-customization', 10.00, '/images/services/custom-1.jpg', 
 ARRAY['Complete appearance change', 'Style consultation', 'Exclusive skins']),
('cc-2', 'Premium Cosmetics', 'character-customization', 35.00, '/images/services/custom-2.jpg', 
 ARRAY['Premium cosmetics pack', 'Seasonal items', 'Special effects']);

-- ----------------------------------------------------------------------------
-- Insertar Service-Games Relations (Many-to-Many)
-- ----------------------------------------------------------------------------
INSERT INTO service_games (service_id, game_id) VALUES
-- pl-1: game-1, game-3
('pl-1', 'game-1'),
('pl-1', 'game-3'),

-- pl-2: game-1, game-3
('pl-2', 'game-1'),
('pl-2', 'game-3'),

-- rb-1: game-2, game-4
('rb-1', 'game-2'),
('rb-1', 'game-4'),

-- rb-2: game-2, game-4
('rb-2', 'game-2'),
('rb-2', 'game-4'),

-- ah-1: todos los juegos
('ah-1', 'game-1'),
('ah-1', 'game-2'),
('ah-1', 'game-3'),
('ah-1', 'game-4'),

-- ah-2: todos los juegos
('ah-2', 'game-1'),
('ah-2', 'game-2'),
('ah-2', 'game-3'),
('ah-2', 'game-4'),

-- gf-1: game-1, game-3
('gf-1', 'game-1'),
('gf-1', 'game-3'),

-- gf-2: game-1, game-3
('gf-2', 'game-1'),
('gf-2', 'game-3'),

-- dc-1: game-1
('dc-1', 'game-1'),

-- dc-2: game-1
('dc-2', 'game-1'),

-- pvp-1: game-2, game-4
('pvp-1', 'game-2'),
('pvp-1', 'game-4'),

-- pvp-2: game-2
('pvp-2', 'game-2'),

-- rc-1: game-1, game-3
('rc-1', 'game-1'),
('rc-1', 'game-3'),

-- rc-2: game-1, game-3
('rc-2', 'game-1'),
('rc-2', 'game-3'),

-- cc-1: todos los juegos
('cc-1', 'game-1'),
('cc-1', 'game-2'),
('cc-1', 'game-3'),
('cc-1', 'game-4'),

-- cc-2: todos los juegos
('cc-2', 'game-1'),
('cc-2', 'game-2'),
('cc-2', 'game-3'),
('cc-2', 'game-4');

-- ----------------------------------------------------------------------------
-- Insertar Service Prices (Configuraciones de precios)
-- ----------------------------------------------------------------------------

-- pl-1: BarPrice + AdditionalServices
INSERT INTO service_prices (service_id, type, config) VALUES
('pl-1', 'bar', '{
  "initValue": 1,
  "finalValue": 50,
  "step": 1,
  "label": "Select Level"
}'::jsonb),
('pl-1', 'additional', '{
  "addOption1": {
    "type": "checkbox",
    "value": 10,
    "label": "Priority Queue"
  },
  "addOption2": {
    "type": "checkbox",
    "value": 15,
    "label": "Express Boost (12h)"
  },
  "addOption3": {
    "type": "checkbox",
    "value": 8,
    "label": "Stream Service"
  }
}'::jsonb);

-- pl-2: BoxPrice
INSERT INTO service_prices (service_id, type, config) VALUES
('pl-2', 'box', '{
  "options": [
    {"label": "Basic", "value": 10},
    {"label": "Standard", "value": 20},
    {"label": "Advanced", "value": 30},
    {"label": "Premium", "value": 45},
    {"label": "Elite", "value": 60},
    {"label": "Ultimate", "value": 80}
  ]
}'::jsonb);

-- rb-1: BarPrice + AdditionalServices
INSERT INTO service_prices (service_id, type, config) VALUES
('rb-1', 'bar', '{
  "initValue": 500,
  "finalValue": 2000,
  "step": 100,
  "label": "Select Rating (MMR)"
}'::jsonb),
('rb-1', 'additional', '{
  "addOption1": {
    "type": "checkbox",
    "value": 20,
    "label": "Duo Queue"
  },
  "addOption2": {
    "type": "checkbox",
    "value": 12,
    "label": "Specific Champion"
  }
}'::jsonb);

-- rb-2: BoxPrice
INSERT INTO service_prices (service_id, type, config) VALUES
('rb-2', 'box', '{
  "options": [
    {"label": "Bronze", "value": 15},
    {"label": "Silver", "value": 25},
    {"label": "Gold", "value": 40},
    {"label": "Platinum", "value": 65},
    {"label": "Diamond", "value": 90}
  ]
}'::jsonb);

-- ah-1: BoxPrice
INSERT INTO service_prices (service_id, type, config) VALUES
('ah-1', 'box', '{
  "options": [
    {"label": "Starter", "value": 5},
    {"label": "Basic", "value": 10},
    {"label": "Standard", "value": 20},
    {"label": "Advanced", "value": 35},
    {"label": "Pro", "value": 50},
    {"label": "Master", "value": 75}
  ]
}'::jsonb);

-- ah-2: BarPrice + BoxPrice + AdditionalServices
INSERT INTO service_prices (service_id, type, config) VALUES
('ah-2', 'bar', '{
  "initValue": 10,
  "finalValue": 100,
  "step": 5,
  "label": "Select Achievement Count"
}'::jsonb),
('ah-2', 'box', '{
  "options": [
    {"label": "$15", "value": 15},
    {"label": "$30", "value": 30},
    {"label": "$50", "value": 50},
    {"label": "$75", "value": 75}
  ]
}'::jsonb),
('ah-2', 'additional', '{
  "addOption1": {
    "type": "checkbox",
    "value": 25,
    "label": "Rare Achievements"
  },
  "addOption2": {
    "type": "checkbox",
    "value": 15,
    "label": "Secret Achievements"
  }
}'::jsonb);

-- gf-1: BarPrice + AdditionalServices
INSERT INTO service_prices (service_id, type, config) VALUES
('gf-1', 'bar', '{
  "initValue": 100,
  "finalValue": 300,
  "step": 10,
  "label": "Select Item Level"
}'::jsonb),
('gf-1', 'additional', '{
  "addOption1": {
    "type": "checkbox",
    "value": 25,
    "label": "Best in Slot Items"
  },
  "addOption2": {
    "type": "checkbox",
    "value": 15,
    "label": "Enchant All Items"
  },
  "addOption3": {
    "type": "checkbox",
    "value": 10,
    "label": "Socket Gems"
  }
}'::jsonb);

-- gf-2: BoxPrice
INSERT INTO service_prices (service_id, type, config) VALUES
('gf-2', 'box', '{
  "options": [
    {"label": "Common", "value": 20},
    {"label": "Rare", "value": 35},
    {"label": "Epic", "value": 50},
    {"label": "Legendary", "value": 70},
    {"label": "Mythic", "value": 100}
  ]
}'::jsonb);

-- dc-1: CustomPrice + Selectors
INSERT INTO service_prices (service_id, type, config) VALUES
('dc-1', 'custom', '{
  "label": "Select Amount",
  "presets": [5, 10, 15, 25]
}'::jsonb),
('dc-1', 'selectors', '{
  "Choose number of characters": [
    {"label": "1 Character", "value": 0},
    {"label": "2 Characters", "value": 90},
    {"label": "5 Characters", "value": 375},
    {"label": "6 Characters", "value": 470},
    {"label": "12 Characters", "value": 1070}
  ]
}'::jsonb);

-- dc-2: BarPrice + AdditionalServices
INSERT INTO service_prices (service_id, type, config) VALUES
('dc-2', 'bar', '{
  "initValue": 5,
  "finalValue": 20,
  "step": 1,
  "label": "Select Mythic+ Level"
}'::jsonb),
('dc-2', 'additional', '{
  "addOption1": {
    "type": "checkbox",
    "value": 30,
    "label": "Timed Run Guarantee"
  },
  "addOption2": {
    "type": "checkbox",
    "value": 20,
    "label": "Specific Loot Priority"
  }
}'::jsonb);

-- pvp-1: CustomPrice
INSERT INTO service_prices (service_id, type, config) VALUES
('pvp-1', 'custom', '{
  "label": "Training Sessions",
  "presets": [10, 25, 40, 60]
}'::jsonb);

-- pvp-2: CustomPrice + Selectors
INSERT INTO service_prices (service_id, type, config) VALUES
('pvp-2', 'custom', '{
  "label": "Advanced Coaching",
  "presets": [30, 60, 90, 120]
}'::jsonb),
('pvp-2', 'selectors', '{
  "Select Difficulty": [
    {"label": "Beginner", "value": 0},
    {"label": "Intermediate", "value": 25},
    {"label": "Advanced", "value": 50},
    {"label": "Expert", "value": 85},
    {"label": "Master", "value": 120}
  ],
  "Choose Arena Type": [
    {"label": "2v2 Arena", "value": 0},
    {"label": "3v3 Arena", "value": 35},
    {"label": "5v5 Battleground", "value": 45}
  ]
}'::jsonb);

-- rc-1: CustomPrice
INSERT INTO service_prices (service_id, type, config) VALUES
('rc-1', 'custom', '{
  "label": "Select Price",
  "presets": [20, 40, 60, 80]
}'::jsonb);

-- rc-2: CustomPrice + Selectors
INSERT INTO service_prices (service_id, type, config) VALUES
('rc-2', 'custom', '{
  "label": "Choose Amount",
  "presets": [50, 80, 100, 150]
}'::jsonb),
('rc-2', 'selectors', '{
  "Raid Group Size": [
    {"label": "10 Players", "value": 0},
    {"label": "15 Players", "value": 45},
    {"label": "20 Players", "value": 80},
    {"label": "25 Players", "value": 120}
  ]
}'::jsonb);

-- cc-1: CustomPrice
INSERT INTO service_prices (service_id, type, config) VALUES
('cc-1', 'custom', '{
  "label": "Select Price",
  "presets": [5, 10, 15, 20]
}'::jsonb);

-- cc-2: CustomPrice
INSERT INTO service_prices (service_id, type, config) VALUES
('cc-2', 'custom', '{
  "label": "Custom Amount",
  "presets": [20, 35, 50, 75]
}'::jsonb);

-- ----------------------------------------------------------------------------
-- Insertar Accordion Items (15 items FAQ)
-- ----------------------------------------------------------------------------
INSERT INTO accordion_items (id, title, content, display_order) VALUES
('item-1', 'What is your boosting process?', 'Our boosting process is completely secure and confidential. We use VPN protection and work during your preferred schedule. All our boosters are verified professionals with years of experience in the gaming industry.', 1),
('item-2', 'How long does delivery take?', 'Delivery times vary depending on the service selected. Most orders are completed within 24-48 hours. For larger orders, we provide a detailed timeline before starting the service.', 2),
('item-3', 'Is my account safe?', 'Absolutely! We take account security very seriously. All boosters use VPN services, we never share your information with third parties, and we follow strict security protocols to ensure your account remains protected.', 3),
('item-4', 'What payment methods do you accept?', 'We accept PayPal and all major credit/debit cards. All transactions are processed securely through encrypted payment gateways to ensure your financial information is protected.', 4),
('item-5', 'Do you offer refunds?', 'Yes, we offer refunds under specific circumstances. If we fail to deliver the service as promised or if there are issues on our end, you are eligible for a full refund. Please review our refund policy for more details.', 5),
('item-6', 'Can I track my order progress?', 'Absolutely! Once your order is confirmed, you''ll receive access to our real-time tracking dashboard. You can monitor progress 24/7, communicate with your booster, and receive instant notifications about milestones and completion.', 6),
('item-7', 'What regions do you support?', 'We provide services for all major regions including NA, EU, Asia, OCE, and Latin America. Our boosters are distributed globally to ensure optimal connection quality and service availability in your region.', 7),
('item-8', 'Do you use VPN protection?', 'Yes, all our boosters are required to use premium VPN services that match your location. This ensures your account remains secure and undetected, maintaining the highest level of protection throughout the entire service.', 8),
('item-9', 'How experienced are your boosters?', 'All our boosters are carefully vetted professionals with minimum 5 years of gaming experience. They maintain top rankings in their respective games and undergo regular performance evaluations to ensure quality service delivery.', 9),
('item-10', 'Can I pause my order?', 'Yes, you can pause your order at any time through your dashboard or by contacting our support team. We understand that life happens, and we''re flexible to accommodate your schedule and needs.', 10),
('item-11', 'What if I''m not satisfied with the service?', 'Customer satisfaction is our priority. If you''re not happy with our service, contact us within 48 hours of completion. We''ll either redo the service at no extra cost or provide a full refund based on the circumstances.', 11),
('item-12', 'Do you offer coaching services?', 'Yes! In addition to boosting, we offer personalized coaching sessions where expert players will teach you strategies, mechanics, and game knowledge to help you improve your own skills and climb the ranks independently.', 12),
('item-13', 'Is there a loyalty program?', 'Absolutely! Our loyalty program rewards returning customers with points for every purchase, exclusive discounts, priority queue access, and special offers. Points can be redeemed for discounts on future orders.', 13),
('item-14', 'How do you handle my personal information?', 'We take data privacy seriously. All personal information is encrypted using industry-standard protocols, stored securely, and never shared with third parties. We comply with GDPR and other international data protection regulations.', 14),
('item-15', 'Can I request a specific booster?', 'Yes! If you''ve had a positive experience with a particular booster, you can request them for your next order. While we can''t always guarantee availability, we''ll do our best to accommodate your preference.', 15);

-- ----------------------------------------------------------------------------
-- Insertar Home Features (4 características)
-- ----------------------------------------------------------------------------
INSERT INTO home_features (icon, title, description, display_order) VALUES
('Shield', 'Secure & Safe', 'Advanced encryption and account protection throughout the entire boosting process', 1),
('Zap', 'Fast Delivery', 'Professional players ensure quick and efficient service completion', 2),
('Crown', 'Premium Quality', 'Top-tier boosters with proven track records and excellent reviews', 3),
('Headphones', '24/7 Support', 'Always available customer support to assist you anytime, anywhere', 4);

-- ----------------------------------------------------------------------------
-- Insertar Payment Methods (2 métodos)
-- ----------------------------------------------------------------------------
INSERT INTO payment_methods (name, icon, type) VALUES
('PayPal', 'paypal', 'paypal'),
('Visa/Mastercard', 'credit-card', 'card');

-- ----------------------------------------------------------------------------
-- Insertar Site Config (Configuración global - Singleton)
-- ----------------------------------------------------------------------------
INSERT INTO site_config (
    id, 
    home_title, 
    home_subtitle, 
    home_categories, 
    footer_payment_title, 
    footer_copyright
) VALUES (
    1,
    'BattleBoosting Gaming Services',
    'Your trusted platform for professional gaming services',
    ARRAY['MMO Boosting', 'Ranked Services', 'Power Leveling', 'Achievement Hunting'],
    'Accepted payment methods',
    '© 2025 BattleBoosting. All rights reserved.'
);

-- ============================================================================
-- SECCIÓN 3: VERIFICACIÓN Y COMMIT
-- ============================================================================

-- Verificar conteo de registros insertados
DO $$
DECLARE
    games_count INTEGER;
    categories_count INTEGER;
    services_count INTEGER;
    service_games_count INTEGER;
    service_prices_count INTEGER;
    accordion_count INTEGER;
    features_count INTEGER;
    payments_count INTEGER;
    config_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO games_count FROM games;
    SELECT COUNT(*) INTO categories_count FROM categories;
    SELECT COUNT(*) INTO services_count FROM services;
    SELECT COUNT(*) INTO service_games_count FROM service_games;
    SELECT COUNT(*) INTO service_prices_count FROM service_prices;
    SELECT COUNT(*) INTO accordion_count FROM accordion_items;
    SELECT COUNT(*) INTO features_count FROM home_features;
    SELECT COUNT(*) INTO payments_count FROM payment_methods;
    SELECT COUNT(*) INTO config_count FROM site_config;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RESUMEN DE DATOS INSERTADOS:';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Games: %', games_count;
    RAISE NOTICE 'Categories: %', categories_count;
    RAISE NOTICE 'Services: %', services_count;
    RAISE NOTICE 'Service-Games Relations: %', service_games_count;
    RAISE NOTICE 'Service Prices: %', service_prices_count;
    RAISE NOTICE 'Accordion Items: %', accordion_count;
    RAISE NOTICE 'Home Features: %', features_count;
    RAISE NOTICE 'Payment Methods: %', payments_count;
    RAISE NOTICE 'Site Config: %', config_count;
    RAISE NOTICE '========================================';
    
    -- Validación de integridad
    IF games_count != 4 THEN
        RAISE EXCEPTION 'Error: Se esperaban 4 games, se insertaron %', games_count;
    END IF;
    
    IF categories_count != 8 THEN
        RAISE EXCEPTION 'Error: Se esperaban 8 categories, se insertaron %', categories_count;
    END IF;
    
    IF services_count != 16 THEN
        RAISE EXCEPTION 'Error: Se esperaban 16 services, se insertaron %', services_count;
    END IF;
    
    IF config_count != 1 THEN
        RAISE EXCEPTION 'Error: Se esperaba 1 site_config, se insertaron %', config_count;
    END IF;
    
    RAISE NOTICE 'Validación completada exitosamente!';
END $$;

-- ============================================================================
-- INFORMACIÓN ADICIONAL
-- ============================================================================
-- 
-- ESTRUCTURA DE RELACIONES:
-- 
-- 1. categories (independiente)
--    └── services (FK: category_id) [ON DELETE RESTRICT]
--        ├── service_games (Many-to-Many con games) [ON DELETE CASCADE]
--        └── service_prices (FK: service_id) [ON DELETE CASCADE]
-- 
-- 2. games (independiente)
--    └── service_games (Many-to-Many con services)
-- 
-- 3. users (independiente)
--    └── sessions (FK: user_id) [ON DELETE CASCADE]
-- 
-- 4. Tablas independientes sin relaciones:
--    - accordion_items
--    - home_features
--    - payment_methods
--    - site_config (singleton)
-- 
-- CONSTRAINTS IMPORTANTES:
-- - No se puede eliminar una categoría si tiene servicios asociados (RESTRICT)
-- - Al eliminar un servicio, se eliminan automáticamente sus precios y relaciones con juegos (CASCADE)
-- - Al eliminar un juego, se eliminan sus relaciones con servicios (CASCADE)
-- - Al eliminar un usuario, se eliminan sus sesiones (CASCADE)
-- - site_config solo permite 1 registro (CHECK id = 1)
-- 
-- ÍNDICES CREADOS PARA OPTIMIZACIÓN:
-- - Búsquedas por email en users
-- - Búsquedas por categoría en games y services
-- - Búsquedas bidireccionales en service_games
-- - Búsquedas en JSONB de service_prices (GIN index)
-- - Ordenamiento en accordion_items y home_features
-- 
-- ============================================================================
