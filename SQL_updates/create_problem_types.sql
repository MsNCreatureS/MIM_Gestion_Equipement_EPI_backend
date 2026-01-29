-- Script de création pour la table des types de problèmes

USE MIM_Feedback;

CREATE TABLE IF NOT EXISTS problem_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des types par défaut
INSERT IGNORE INTO problem_types (label) VALUES 
('AMELIORATION'), 
('NON CONFORMITE'), 
('SITUATION DANGEREUSE'), 
('INFORMATION SUITE A UNE CAUSERIE');
