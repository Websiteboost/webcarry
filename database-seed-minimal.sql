-- ============================================================================
-- PARTE 1: LIMPIEZA Y ESTRUCTURA DE BASE DE DATOS
-- ============================================================================
-- Ejecuta esta parte primero para limpiar y crear todas las tablas
-- ============================================================================

DROP TABLE IF EXISTS service_prices CASCADE;
DROP TABLE IF EXISTS service_games CASCADE;
DROP TABLE IF EXISTS category_games CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS accordion_items CASCADE;
DROP TABLE IF EXISTS home_features CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

CREATE TABLE IF NOT EXISTS users (id VARCHAR(21) PRIMARY KEY,email VARCHAR(255) UNIQUE NOT NULL,password_hash TEXT NOT NULL,role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin','user')),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS sessions (id VARCHAR(40) PRIMARY KEY,user_id VARCHAR(21) NOT NULL,expires_at TIMESTAMP NOT NULL,FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS games (id VARCHAR(50) PRIMARY KEY,title VARCHAR(255) NOT NULL,category VARCHAR(100) NOT NULL,image TEXT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_games_category ON games(category);

CREATE TABLE IF NOT EXISTS categories (id VARCHAR(100) PRIMARY KEY,name VARCHAR(255) NOT NULL,description TEXT NOT NULL,icon VARCHAR(50) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS category_games (category_id VARCHAR(100) NOT NULL,game_id VARCHAR(50) NOT NULL,PRIMARY KEY (category_id,game_id),FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE);
CREATE INDEX idx_category_games_category_id ON category_games(category_id);
CREATE INDEX idx_category_games_game_id ON category_games(game_id);

CREATE TABLE IF NOT EXISTS services (id VARCHAR(50) PRIMARY KEY,title VARCHAR(255) NOT NULL,category_id VARCHAR(100) NOT NULL,price DECIMAL(10,2) NOT NULL,image TEXT NOT NULL,description TEXT[] NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_price ON services(price);

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS service_games (service_id VARCHAR(50) NOT NULL,game_id VARCHAR(50) NOT NULL,PRIMARY KEY (service_id,game_id),FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE);
CREATE INDEX idx_service_games_service_id ON service_games(service_id);
CREATE INDEX idx_service_games_game_id ON service_games(game_id);

CREATE TABLE IF NOT EXISTS service_prices (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),service_id VARCHAR(50) NOT NULL,type VARCHAR(50) NOT NULL CHECK (type IN ('bar','box','custom','selectors','additional')),config JSONB NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE);
CREATE INDEX idx_service_prices_service_id ON service_prices(service_id);
CREATE INDEX idx_service_prices_type ON service_prices(type);
CREATE INDEX idx_service_prices_config ON service_prices USING GIN (config);

CREATE TABLE IF NOT EXISTS accordion_items (id VARCHAR(50) PRIMARY KEY,title VARCHAR(255) NOT NULL,content TEXT NOT NULL,display_order INTEGER NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_accordion_items_order ON accordion_items(display_order);

CREATE TABLE IF NOT EXISTS home_features (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),icon VARCHAR(50) NOT NULL,title VARCHAR(255) NOT NULL,description TEXT NOT NULL,display_order INTEGER NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_home_features_order ON home_features(display_order);

CREATE TABLE IF NOT EXISTS payment_methods (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),name VARCHAR(100) NOT NULL,icon VARCHAR(50) NOT NULL,type VARCHAR(50) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS site_config (id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),home_title VARCHAR(255) NOT NULL,home_subtitle TEXT NOT NULL,home_categories TEXT[] NOT NULL,logo_text VARCHAR(255) NOT NULL DEFAULT 'BATTLE BOOSTING',accordion_title VARCHAR(255) NOT NULL DEFAULT 'Frequently Asked Questions',footer_payment_title VARCHAR(255) NOT NULL,footer_copyright TEXT NOT NULL,disclaimer TEXT NOT NULL DEFAULT 'All services are provided for entertainment purposes only. We are not affiliated with or endorsed by any game developers or publishers.',updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS policies (id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),section_1 TEXT,section_2 TEXT,section_3 TEXT,section_4 TEXT,section_5 TEXT,section_6 TEXT,section_7 TEXT,section_8 TEXT,section_9 TEXT,section_10 TEXT,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PARTE 2: DATOS BASE - JUEGOS Y CATEGORÍAS
-- ============================================================================
-- Ejecuta esta parte después de la PARTE 1
-- Inserta los juegos y categorías (datos fundamentales)
-- ============================================================================

-- Usuario administrador por defecto
-- Email: admin@battleboost.com
-- Password: Admin123!
INSERT INTO users (id,email,password_hash,role) VALUES 
('admin_default_user_1','admin@battleboost.com','$2b$10$eJQMEYnprXM16upaeFrN4OfkYZfbSdEUkoypbJMTlHy3pSVjZDpLS','admin');

INSERT INTO games (id,title,category,image) VALUES 
('game-1','Nexus Warriors','MMO','/images/games/nexus-warriors.jpg'),
('game-2','Void Legends','MOBA','/images/games/void-legends.jpg'),
('game-3','Eternal Realms','RPG','/images/games/eternal-realms.jpg'),
('game-4','Cyber Strike','FPS','/images/games/cyber-strike.jpg');

INSERT INTO categories (id,name,description,icon) VALUES 
('power-leveling','Power Leveling','Fast and efficient character leveling services to reach maximum level quickly','Zap'),
('ranked-boosting','Ranked Boosting','Professional rank climbing services by experienced players to reach your desired tier','Trophy'),
('achievement-hunting','Achievement Hunting','Complete difficult achievements and unlock exclusive rewards and titles','Award'),
('gear-farming','Gear Farming','Obtain the best equipment and legendary items with optimized farming strategies','Shield'),
('dungeon-carries','Dungeon Carries','Expert dungeon runs with guaranteed loot and efficient completion times','Swords'),
('pvp-training','PvP Training','Learn advanced PvP techniques and strategies from professional players','Sword'),
('raid-completion','Raid Completion','Full raid clears with experienced teams, including all bosses and exclusive rewards','Users'),
('character-customization','Character Customization','Transform your character with premium cosmetics, skins and exclusive appearance items','Palette');

-- ============================================================================
-- PARTE 2.5: RELACIONES CATEGORÍA-JUEGO
-- ============================================================================
-- Ejecuta esta parte después de categorías y juegos
-- Define qué categorías están disponibles en qué juegos
-- ============================================================================

INSERT INTO category_games (category_id,game_id) VALUES 
('power-leveling','game-1'),
('power-leveling','game-3'),
('ranked-boosting','game-2'),
('ranked-boosting','game-4'),
('achievement-hunting','game-1'),
('achievement-hunting','game-2'),
('achievement-hunting','game-3'),
('achievement-hunting','game-4'),
('gear-farming','game-1'),
('gear-farming','game-3'),
('dungeon-carries','game-1'),
('pvp-training','game-2'),
('pvp-training','game-4'),
('raid-completion','game-1'),
('raid-completion','game-3'),
('character-customization','game-1'),
('character-customization','game-2'),
('character-customization','game-3'),
('character-customization','game-4');

-- ============================================================================
-- PARTE 3: SERVICIOS
-- ============================================================================
-- Ejecuta esta parte después de la PARTE 2
-- Inserta los 16 servicios disponibles
-- ============================================================================

INSERT INTO services (id,title,category_id,price,image,description) VALUES 
('pl-1','Level 1-50 Express','power-leveling',25.00,'/images/services/leveling-1.jpg',ARRAY['Fast boost from level 1 to 50','Completed in 24-48 hours','Basic equipment included']),
('pl-2','Max Level Premium','power-leveling',45.00,'/images/services/leveling-2.jpg',ARRAY['Maximum level guaranteed','Epic equipment included','24/7 support']),
('rb-1','Bronze to Gold','ranked-boosting',35.00,'/images/services/ranked-1.jpg',ARRAY['Guaranteed climb to Gold','Professional players','Live streaming available']),
('rb-2','Platinum Package','ranked-boosting',65.00,'/images/services/ranked-2.jpg',ARRAY['Reach Platinum rank','Priority queue','Coaching included']),
('ah-1','Achievement Bundle Basic','achievement-hunting',20.00,'/images/services/achievement-1.jpg',ARRAY['10 achievements of your choice','Completed in 3-5 days','Detailed guide included']),
('ah-2','100% Completion','achievement-hunting',75.00,'/images/services/achievement-2.jpg',ARRAY['All game achievements','Rare titles and rewards','Completion guarantee']),
('gf-1','Epic Gear Set','gear-farming',30.00,'/images/services/gear-1.jpg',ARRAY['Complete epic gear set','Optimized stats','Efficient farming']),
('gf-2','Legendary Weapons','gear-farming',50.00,'/images/services/gear-2.jpg',ARRAY['Exclusive legendary weapons','Premium enchants','Improved drop rate']),
('dc-1','Normal Dungeon Pack','dungeon-carries',15.00,'/images/services/dungeon-1.jpg',ARRAY['5 normal dungeons','All loot reserved for you','Completed in 2 hours']),
('dc-2','Mythic+ Bundle','dungeon-carries',55.00,'/images/services/dungeon-2.jpg',ARRAY['Mythic+15 dungeons','Experienced group','Guaranteed loot']),
('pvp-1','PvP Basics','pvp-training',25.00,'/images/services/pvp-1.jpg',ARRAY['PvP combat fundamentals','5 training sessions','Replay analysis']),
('pvp-2','Arena Mastery','pvp-training',60.00,'/images/services/pvp-2.jpg',ARRAY['Advanced arena training','Team strategies','Personalized coaching']),
('rc-1','Normal Raid Clear','raid-completion',40.00,'/images/services/raid-1.jpg',ARRAY['Full raid on normal difficulty','All loot reserved','Organized group']),
('rc-2','Heroic Full Clear','raid-completion',80.00,'/images/services/raid-2.jpg',ARRAY['Full heroic raid','Mounts and titles included','Top guild carry']),
('cc-1','Appearance Makeover','character-customization',10.00,'/images/services/custom-1.jpg',ARRAY['Complete appearance change','Style consultation','Exclusive skins']),
('cc-2','Premium Cosmetics','character-customization',35.00,'/images/services/custom-2.jpg',ARRAY['Premium cosmetics pack','Seasonal items','Special effects']);

-- ============================================================================
-- PARTE 4: RELACIONES SERVICIO-JUEGO (43 relaciones)
-- ============================================================================
-- Ejecuta esta parte después de la PARTE 3
-- Conecta servicios con los juegos donde están disponibles
-- ============================================================================

INSERT INTO service_games (service_id,game_id) VALUES 
('pl-1','game-1'),
('pl-1','game-3'),
('pl-2','game-1'),
('pl-2','game-3'),
('rb-1','game-2'),
('rb-1','game-4'),
('rb-2','game-2'),
('rb-2','game-4'),
('ah-1','game-1'),
('ah-1','game-2'),
('ah-1','game-3'),
('ah-1','game-4'),
('ah-2','game-1'),
('ah-2','game-2'),
('ah-2','game-3'),
('ah-2','game-4'),
('gf-1','game-1'),
('gf-1','game-3'),
('gf-2','game-1'),
('gf-2','game-3'),
('dc-1','game-1'),
('dc-2','game-1'),
('pvp-1','game-2'),
('pvp-1','game-4'),
('pvp-2','game-2'),
('rc-1','game-1'),
('rc-1','game-3'),
('rc-2','game-1'),
('rc-2','game-3'),
('cc-1','game-1'),
('cc-1','game-2'),
('cc-1','game-3'),
('cc-1','game-4'),
('cc-2','game-1'),
('cc-2','game-2'),
('cc-2','game-3'),
('cc-2','game-4');

-- ============================================================================
-- PARTE 5: CONFIGURACIONES DE PRECIOS (25 configuraciones)
-- ============================================================================
-- Ejecuta esta parte después de la PARTE 4
-- Inserta las configuraciones de precios flexibles en JSONB
-- ============================================================================

INSERT INTO service_prices (service_id,type,config) VALUES 
('pl-1','bar','{"initValue":1,"finalValue":50,"step":1,"label":"Select Level"}'::jsonb),
('pl-1','additional','{"addOption1":{"type":"checkbox","value":10,"label":"Priority Queue"},"addOption2":{"type":"checkbox","value":15,"label":"Express Boost (12h)"},"addOption3":{"type":"checkbox","value":8,"label":"Stream Service"}}'::jsonb),
('pl-2','box','{"options":[{"label":"Basic","value":10},{"label":"Standard","value":20},{"label":"Advanced","value":30},{"label":"Premium","value":45},{"label":"Elite","value":60},{"label":"Ultimate","value":80}]}'::jsonb),
('rb-1','bar','{"initValue":500,"finalValue":2000,"step":100,"label":"Select Rating (MMR)"}'::jsonb),
('rb-1','additional','{"addOption1":{"type":"checkbox","value":20,"label":"Duo Queue"},"addOption2":{"type":"checkbox","value":12,"label":"Specific Champion"}}'::jsonb),
('rb-2','box','{"options":[{"label":"Bronze","value":15},{"label":"Silver","value":25},{"label":"Gold","value":40},{"label":"Platinum","value":65},{"label":"Diamond","value":90}]}'::jsonb),
('ah-1','box','{"options":[{"label":"Starter","value":5},{"label":"Basic","value":10},{"label":"Standard","value":20},{"label":"Advanced","value":35},{"label":"Pro","value":50},{"label":"Master","value":75}]}'::jsonb),
('ah-2','bar','{"initValue":10,"finalValue":100,"step":5,"label":"Select Achievement Count"}'::jsonb),
('ah-2','box','{"options":[{"label":"$15","value":15},{"label":"$30","value":30},{"label":"$50","value":50},{"label":"$75","value":75}]}'::jsonb),
('ah-2','additional','{"addOption1":{"type":"checkbox","value":25,"label":"Rare Achievements"},"addOption2":{"type":"checkbox","value":15,"label":"Secret Achievements"}}'::jsonb),
('gf-1','bar','{"initValue":100,"finalValue":300,"step":10,"label":"Select Item Level"}'::jsonb),
('gf-1','additional','{"addOption1":{"type":"checkbox","value":25,"label":"Best in Slot Items"},"addOption2":{"type":"checkbox","value":15,"label":"Enchant All Items"},"addOption3":{"type":"checkbox","value":10,"label":"Socket Gems"}}'::jsonb),
('gf-2','box','{"options":[{"label":"Common","value":20},{"label":"Rare","value":35},{"label":"Epic","value":50},{"label":"Legendary","value":70},{"label":"Mythic","value":100}]}'::jsonb),
('dc-1','custom','{"label":"Select Amount","presets":[5,10,15,25]}'::jsonb),
('dc-1','selectors','{"Choose number of characters":[{"label":"1 Character","value":0},{"label":"2 Characters","value":90},{"label":"5 Characters","value":375},{"label":"6 Characters","value":470},{"label":"12 Characters","value":1070}]}'::jsonb),
('dc-2','bar','{"initValue":5,"finalValue":20,"step":1,"label":"Select Mythic+ Level"}'::jsonb),
('dc-2','additional','{"addOption1":{"type":"checkbox","value":30,"label":"Timed Run Guarantee"},"addOption2":{"type":"checkbox","value":20,"label":"Specific Loot Priority"}}'::jsonb),
('pvp-1','custom','{"label":"Training Sessions","presets":[10,25,40,60]}'::jsonb),
('pvp-2','custom','{"label":"Advanced Coaching","presets":[30,60,90,120]}'::jsonb),
('pvp-2','selectors','{"Select Difficulty":[{"label":"Beginner","value":0},{"label":"Intermediate","value":25},{"label":"Advanced","value":50},{"label":"Expert","value":85},{"label":"Master","value":120}],"Choose Arena Type":[{"label":"2v2 Arena","value":0},{"label":"3v3 Arena","value":35},{"label":"5v5 Battleground","value":45}]}'::jsonb),
('rc-1','custom','{"label":"Select Price","presets":[20,40,60,80]}'::jsonb),
('rc-2','custom','{"label":"Choose Amount","presets":[50,80,100,150]}'::jsonb),
('rc-2','selectors','{"Raid Group Size":[{"label":"10 Players","value":0},{"label":"15 Players","value":45},{"label":"20 Players","value":80},{"label":"25 Players","value":120}]}'::jsonb),
('cc-1','custom','{"label":"Select Price","presets":[5,10,15,20]}'::jsonb),
('cc-2','custom','{"label":"Custom Amount","presets":[20,35,50,75]}'::jsonb);

-- ============================================================================
-- PARTE 6: CONTENIDO - ACORDEÓN FAQ (15 items)
-- ============================================================================
-- Ejecuta esta parte después de la PARTE 5
-- Inserta preguntas frecuentes del acordeón
-- ============================================================================

INSERT INTO accordion_items (id,title,content,display_order) VALUES 
('item-1','What is your boosting process?','Our boosting process is completely secure and confidential. We use VPN protection and work during your preferred schedule. All our boosters are verified professionals with years of experience in the gaming industry.',1),
('item-2','How long does delivery take?','Delivery times vary depending on the service selected. Most orders are completed within 24-48 hours. For larger orders, we provide a detailed timeline before starting the service.',2),
('item-3','Is my account safe?','Absolutely! We take account security very seriously. All boosters use VPN services, we never share your information with third parties, and we follow strict security protocols to ensure your account remains protected.',3),
('item-4','What payment methods do you accept?','We accept PayPal and all major credit/debit cards. All transactions are processed securely through encrypted payment gateways to ensure your financial information is protected.',4),
('item-5','Do you offer refunds?','Yes, we offer refunds under specific circumstances. If we fail to deliver the service as promised or if there are issues on our end, you are eligible for a full refund. Please review our refund policy for more details.',5),
('item-6','Can I track my order progress?','Absolutely! Once your order is confirmed, you''ll receive access to our real-time tracking dashboard. You can monitor progress 24/7, communicate with your booster, and receive instant notifications about milestones and completion.',6),
('item-7','What regions do you support?','We provide services for all major regions including NA, EU, Asia, OCE, and Latin America. Our boosters are distributed globally to ensure optimal connection quality and service availability in your region.',7),
('item-8','Do you use VPN protection?','Yes, all our boosters are required to use premium VPN services that match your location. This ensures your account remains secure and undetected, maintaining the highest level of protection throughout the entire service.',8),
('item-9','How experienced are your boosters?','All our boosters are carefully vetted professionals with minimum 5 years of gaming experience. They maintain top rankings in their respective games and undergo regular performance evaluations to ensure quality service delivery.',9),
('item-10','Can I pause my order?','Yes, you can pause your order at any time through your dashboard or by contacting our support team. We understand that life happens, and we''re flexible to accommodate your schedule and needs.',10),
('item-11','What if I''m not satisfied with the service?','Customer satisfaction is our priority. If you''re not happy with our service, contact us within 48 hours of completion. We''ll either redo the service at no extra cost or provide a full refund based on the circumstances.',11),
('item-12','Do you offer coaching services?','Yes! In addition to boosting, we offer personalized coaching sessions where expert players will teach you strategies, mechanics, and game knowledge to help you improve your own skills and climb the ranks independently.',12),
('item-13','Is there a loyalty program?','Absolutely! Our loyalty program rewards returning customers with points for every purchase, exclusive discounts, priority queue access, and special offers. Points can be redeemed for discounts on future orders.',13),
('item-14','How do you handle my personal information?','We take data privacy seriously. All personal information is encrypted using industry-standard protocols, stored securely, and never shared with third parties. We comply with GDPR and other international data protection regulations.',14),
('item-15','Can I request a specific booster?','Yes! If you''ve had a positive experience with a particular booster, you can request them for your next order. While we can''t always guarantee availability, we''ll do our best to accommodate your preference.',15);

-- ============================================================================
-- PARTE 7: CONFIGURACIONES FINALES
-- ============================================================================
-- Ejecuta esta parte al final
-- Inserta features del home, métodos de pago y configuración del sitio
-- ============================================================================

INSERT INTO home_features (icon,title,description,display_order) VALUES 
('Shield','Secure & Safe','Advanced encryption and account protection throughout the entire boosting process',1),
('Zap','Fast Delivery','Professional players ensure quick and efficient service completion',2),
('Crown','Premium Quality','Top-tier boosters with proven track records and excellent reviews',3),
('Headphones','24/7 Support','Always available customer support to assist you anytime, anywhere',4);

INSERT INTO payment_methods (name,icon,type) VALUES 
('PayPal','paypal','paypal'),
('Visa/Mastercard','credit-card','card');

INSERT INTO site_config (id,home_title,home_subtitle,home_categories,logo_text,accordion_title,footer_payment_title,footer_copyright,disclaimer) VALUES 
(1,'BattleBoosting Gaming Services','Your trusted platform for professional gaming services',ARRAY['MMO Boosting','Ranked Services','Power Leveling','Achievement Hunting'],'BATTLE BOOSTING','Frequently Asked Questions','Accepted payment methods','© 2025 BattleBoosting. All rights reserved.','All services are provided for entertainment purposes only. We are not affiliated with or endorsed by any game developers or publishers. Account security is our top priority, and we use industry-standard protection measures. By using our services, you acknowledge that you have read and agree to our terms of service and privacy policy.');

INSERT INTO policies (id,section_1,section_2,section_3,section_4,section_5,section_6,section_7,section_8,section_9,section_10) VALUES 
(1,'<h3>1. Service Agreement</h3><span>By using BattleBoosting services, you agree to these terms and conditions. Our services are provided for entertainment purposes and to enhance your gaming experience. We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.</span>','<h3>2. Account Security</h3><span>We take account security extremely seriously. All boosters are required to use VPN services matching your region. We never share your account information with third parties. Two-factor authentication codes should be provided through our secure messaging system only. We employ industry-standard encryption for all sensitive data.</span>','<h3>3. Service Delivery</h3><span>Service delivery times are estimates based on average completion rates. Actual times may vary depending on game difficulty, server conditions, and booster availability. We will notify you of any significant delays. Priority queue options are available for faster service. Progress updates are provided regularly through your dashboard.</span>','<h3>4. Payment and Refunds</h3><span>All payments are processed securely through PayPal or major credit cards. Prices are displayed in USD and are subject to change. Refunds are available if we fail to deliver the promised service or if there are issues on our end. Refund requests must be submitted within 48 hours of service completion. Partial refunds may be issued for partially completed services.</span>','<h3>5. User Responsibilities</h3><span>You must provide accurate account information and credentials. You are responsible for maintaining the confidentiality of your account. Do not change account passwords during active services. Notify us immediately of any security concerns. You must not use our services for accounts you do not own or have permission to use.</span>','<h3>6. Prohibited Activities</h3><span>You may not use our services for fraudulent purposes or to violate game terms of service knowingly. Account sharing outside of our service agreement is prohibited. Attempting to charge back payments after service completion is not allowed. We reserve the right to refuse service to anyone violating these terms.</span>','<h3>7. Limitation of Liability</h3><span>We are not liable for any account actions taken by game developers or publishers. While we take all precautions to ensure account safety, we cannot guarantee against all possible risks. Our liability is limited to the amount paid for the specific service. We are not responsible for indirect damages or losses.</span>','<h3>8. Privacy Policy</h3><span>We collect only necessary information to provide our services. Your personal data is protected under GDPR and international data protection laws. We do not sell or share your information with third parties for marketing purposes. Account credentials are stored securely and deleted after service completion. You have the right to request data deletion at any time.</span>','<h3>9. Communication</h3><span>All official communication will come from our verified email addresses or through our website dashboard. We offer 24/7 customer support via live chat and email. Response times are typically under 2 hours. You can track your order status in real-time through your account dashboard.</span>','<h3>10. Termination</h3><span>We reserve the right to terminate services for violation of these terms. Upon termination, you will receive a prorated refund for incomplete services. You may cancel services at any time before work begins for a full refund. Active services can be paused or cancelled with partial refunds based on completion percentage.</span>');
