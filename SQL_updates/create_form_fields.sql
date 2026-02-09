-- Create the table for form configuration
CREATE TABLE IF NOT EXISTS form_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_key VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(255) NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    is_required BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0
);

-- Seed default values (ignore if they already exist to avoid duplicates)
INSERT IGNORE INTO form_fields (field_key, label, is_visible, is_required, order_index) VALUES 
('societe', '1. SOCIÉTÉ / AGENCE', TRUE, FALSE, 1),
('date', '2. DATE', TRUE, TRUE, 2),
('nom', '3. NOM', TRUE, TRUE, 3),
('prenom', 'PRÉNOM', TRUE, TRUE, 4),
('lieu', '4. LIEU - CLIENT', TRUE, TRUE, 5),
('type', '5. TYPE : PROBLÈME RENCONTRÉ', TRUE, TRUE, 6),
('description', "6. DESCRIPTION DE L'INFORMATION", TRUE, FALSE, 7),
('action', '7. ACTION À RÉALISER', TRUE, FALSE, 8);
