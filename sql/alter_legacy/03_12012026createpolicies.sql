-- ============================================================================
-- MIGRACIÓN: Crear tabla policies
-- Fecha: 12/01/2026
-- Descripción: Crea la tabla policies para almacenar las secciones de 
--              política del sitio. Cada sección contiene HTML con <h3> 
--              para títulos y <span> para contenido
-- ============================================================================

-- Crear la tabla policies
CREATE TABLE IF NOT EXISTS policies (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  section_1 TEXT,
  section_2 TEXT,
  section_3 TEXT,
  section_4 TEXT,
  section_5 TEXT,
  section_6 TEXT,
  section_7 TEXT,
  section_8 TEXT,
  section_9 TEXT,
  section_10 TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_policies_updated_at 
BEFORE UPDATE ON policies 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos por defecto
INSERT INTO policies (
  id,
  section_1,
  section_2,
  section_3,
  section_4,
  section_5,
  section_6,
  section_7,
  section_8,
  section_9,
  section_10
) VALUES (
  1,
  '<h3>1. Service Agreement</h3><span>By using BattleBoosting services, you agree to these terms and conditions. Our services are provided for entertainment purposes and to enhance your gaming experience. We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.</span>',
  '<h3>2. Account Security</h3><span>We take account security extremely seriously. All boosters are required to use VPN services matching your region. We never share your account information with third parties. Two-factor authentication codes should be provided through our secure messaging system only. We employ industry-standard encryption for all sensitive data.</span>',
  '<h3>3. Service Delivery</h3><span>Service delivery times are estimates based on average completion rates. Actual times may vary depending on game difficulty, server conditions, and booster availability. We will notify you of any significant delays. Priority queue options are available for faster service. Progress updates are provided regularly through your dashboard.</span>',
  '<h3>4. Payment and Refunds</h3><span>All payments are processed securely through PayPal or major credit cards. Prices are displayed in USD and are subject to change. Refunds are available if we fail to deliver the promised service or if there are issues on our end. Refund requests must be submitted within 48 hours of service completion. Partial refunds may be issued for partially completed services.</span>',
  '<h3>5. User Responsibilities</h3><span>You must provide accurate account information and credentials. You are responsible for maintaining the confidentiality of your account. Do not change account passwords during active services. Notify us immediately of any security concerns. You must not use our services for accounts you do not own or have permission to use.</span>',
  '<h3>6. Prohibited Activities</h3><span>You may not use our services for fraudulent purposes or to violate game terms of service knowingly. Account sharing outside of our service agreement is prohibited. Attempting to charge back payments after service completion is not allowed. We reserve the right to refuse service to anyone violating these terms.</span>',
  '<h3>7. Limitation of Liability</h3><span>We are not liable for any account actions taken by game developers or publishers. While we take all precautions to ensure account safety, we cannot guarantee against all possible risks. Our liability is limited to the amount paid for the specific service. We are not responsible for indirect damages or losses.</span>',
  '<h3>8. Privacy Policy</h3><span>We collect only necessary information to provide our services. Your personal data is protected under GDPR and international data protection laws. We do not sell or share your information with third parties for marketing purposes. Account credentials are stored securely and deleted after service completion. You have the right to request data deletion at any time.</span>',
  '<h3>9. Communication</h3><span>All official communication will come from our verified email addresses or through our website dashboard. We offer 24/7 customer support via live chat and email. Response times are typically under 2 hours. You can track your order status in real-time through your account dashboard.</span>',
  '<h3>10. Termination</h3><span>We reserve the right to terminate services for violation of these terms. Upon termination, you will receive a prorated refund for incomplete services. You may cancel services at any time before work begins for a full refund. Active services can be paused or cancelled with partial refunds based on completion percentage.</span>'
);

-- Comentarios de documentación
COMMENT ON TABLE policies IS 'Almacena las secciones de política del sitio, cada sección contiene HTML con <h3> para títulos y <span> para contenido';
COMMENT ON COLUMN policies.section_1 IS 'Sección 1 de políticas con HTML';
COMMENT ON COLUMN policies.section_2 IS 'Sección 2 de políticas con HTML';
COMMENT ON COLUMN policies.section_3 IS 'Sección 3 de políticas con HTML';
COMMENT ON COLUMN policies.section_4 IS 'Sección 4 de políticas con HTML';
COMMENT ON COLUMN policies.section_5 IS 'Sección 5 de políticas con HTML';
COMMENT ON COLUMN policies.section_6 IS 'Sección 6 de políticas con HTML';
COMMENT ON COLUMN policies.section_7 IS 'Sección 7 de políticas con HTML';
COMMENT ON COLUMN policies.section_8 IS 'Sección 8 de políticas con HTML';
COMMENT ON COLUMN policies.section_9 IS 'Sección 9 de políticas con HTML';
COMMENT ON COLUMN policies.section_10 IS 'Sección 10 de políticas con HTML';
