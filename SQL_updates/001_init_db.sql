-- Création de la base de données
CREATE DATABASE IF NOT EXISTS mim_feedback;

-- Utilisation de la base de données
USE mim_feedback;

-- Création de la table des remontées d'informations
CREATE TABLE IF NOT EXISTS remontees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    societe_agence VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    lieu_client VARCHAR(255) NOT NULL,
    type_probleme VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'En attente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
