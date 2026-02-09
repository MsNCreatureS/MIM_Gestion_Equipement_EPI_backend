-- =============================================
-- MIM Feedback Database Setup Script
-- Consolidated SQL for full database setup
-- =============================================

-- 1. Create the main remontees table (feedback entries)
CREATE TABLE IF NOT EXISTS remontees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    societe_agence VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    lieu_client VARCHAR(255),
    type_probleme VARCHAR(100) NOT NULL,
    description TEXT,
    causes TEXT,
    consequences TEXT,
    action TEXT,
    status ENUM('En attente', 'En cours', 'Résolu', 'Rejeté') DEFAULT 'En attente',
    action_admin TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create the problem_types table
CREATE TABLE IF NOT EXISTS problem_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default problem types (if table is empty)
INSERT INTO problem_types (label) 
SELECT * FROM (SELECT 'AMELIORATION' AS label) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM problem_types LIMIT 1)
UNION ALL
SELECT * FROM (SELECT 'NON CONFORMITE') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM problem_types LIMIT 1)
UNION ALL
SELECT * FROM (SELECT 'SITUATION DANGEREUSE') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM problem_types LIMIT 1)
UNION ALL
SELECT * FROM (SELECT 'INFORMATION SUITE A UNE CAUSERIE') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM problem_types LIMIT 1);

-- 3. Create the email_recipients table
CREATE TABLE IF NOT EXISTS email_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default recipient (if table is empty)
INSERT INTO email_recipients (email, name)
SELECT 'erwan.gimenez@mim-sa.com', 'Admin MIM' 
WHERE NOT EXISTS (SELECT 1 FROM email_recipients LIMIT 1);
