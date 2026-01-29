-- Script de création pour la base de données MIM_Feedback

CREATE DATABASE IF NOT EXISTS MIM_Feedback;
USE MIM_Feedback;

CREATE TABLE IF NOT EXISTS remontees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    societe_agence VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    lieu_client VARCHAR(255),
    type_probleme VARCHAR(255) NOT NULL,
    description TEXT,
    action TEXT,
    status VARCHAR(50) DEFAULT 'En attente',
    action_admin TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
