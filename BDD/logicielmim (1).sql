-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 15 déc. 2025 à 16:19
-- Version du serveur : 8.0.44
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `logicielmim`
--

-- --------------------------------------------------------

--
-- Structure de la table `champpersonnalise`
--

DROP TABLE IF EXISTS `champpersonnalise`;
CREATE TABLE IF NOT EXISTS `champpersonnalise` (
  `IdChamp` int NOT NULL AUTO_INCREMENT,
  `NomChamp` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `TypeDonnees` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EstRequisPourAlerte` tinyint(1) NOT NULL,
  `IdType` int NOT NULL,
  `AfficherDansTableau` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`IdChamp`),
  KEY `IX_ChampPersonnalise_IdType` (`IdType`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecart`
--

DROP TABLE IF EXISTS `ecart`;
CREATE TABLE IF NOT EXISTS `ecart` (
  `IdEcart` int NOT NULL AUTO_INCREMENT,
  `TypeControle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Action` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IdEquipement` int NOT NULL,
  `EmailNotification` varchar(255) DEFAULT NULL,
  `DateCreation` datetime(6) DEFAULT NULL,
  `IdUtilisateurCreateur` int DEFAULT NULL,
  PRIMARY KEY (`IdEcart`),
  KEY `IX_Ecart_IdEquipement` (`IdEquipement`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `ecart`
--

INSERT INTO `ecart` (`IdEcart`, `TypeControle`, `Description`, `Action`, `Status`, `IdEquipement`, `EmailNotification`, `DateCreation`, `IdUtilisateurCreateur`) VALUES
(1, 'Contrôle visuel', 'Regarde ICI', 'TEST\n\n[15/12/2025 17:18] Observation: JE fait', 'Cloture', 3601, 'romain.lafarge@foselev.fr', '2025-12-15 16:52:42.000000', 1);

-- --------------------------------------------------------

--
-- Structure de la table `equipement`
--

DROP TABLE IF EXISTS `equipement`;
CREATE TABLE IF NOT EXISTS `equipement` (
  `IdEquipement` int NOT NULL AUTO_INCREMENT,
  `NumeroInterne` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Affectation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Localisation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Observations` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IdType` int NOT NULL,
  PRIMARY KEY (`IdEquipement`),
  KEY `IX_Equipement_IdType` (`IdType`)
) ENGINE=InnoDB AUTO_INCREMENT=3799 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `logactivite`
--

DROP TABLE IF EXISTS `logactivite`;
CREATE TABLE IF NOT EXISTS `logactivite` (
  `IdLog` int NOT NULL AUTO_INCREMENT,
  `DateHeure` datetime(6) NOT NULL,
  `Action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IdUtilisateur` int NOT NULL,
  PRIMARY KEY (`IdLog`),
  KEY `IX_LogActivite_IdUtilisateur` (`IdUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages_ecart`
--

DROP TABLE IF EXISTS `messages_ecart`;
CREATE TABLE IF NOT EXISTS `messages_ecart` (
  `IdMessage` int NOT NULL AUTO_INCREMENT,
  `IdEcart` int NOT NULL,
  `IdUtilisateur` int DEFAULT NULL,
  `Message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `NouveauStatus` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DateCreation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Lu` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`IdMessage`),
  KEY `IX_messages_ecart_IdEcart` (`IdEcart`),
  KEY `IX_messages_ecart_IdUtilisateur` (`IdUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `messages_ecart`
--

INSERT INTO `messages_ecart` (`IdMessage`, `IdEcart`, `IdUtilisateur`, `Message`, `NouveauStatus`, `DateCreation`, `Lu`) VALUES
(1, 1, 3, 'JE fait', 'EnCours', '2025-12-15 17:18:05', 0),
(2, 1, 3, 'Écart marqué comme Clôturé', 'Cloture', '2025-12-15 17:18:38', 0);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `IdNotification` int NOT NULL AUTO_INCREMENT,
  `IdUtilisateur` int DEFAULT NULL,
  `Titre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'System',
  `Lu` tinyint(1) NOT NULL DEFAULT '0',
  `Lien` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DateCreation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`IdNotification`),
  KEY `IX_notifications_IdUtilisateur` (`IdUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `typeequipement`
--

DROP TABLE IF EXISTS `typeequipement`;
CREATE TABLE IF NOT EXISTS `typeequipement` (
  `IdType` int NOT NULL AUTO_INCREMENT,
  `NomType` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Famille` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`IdType`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `IdUtilisateur` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Prenom` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `MotDePasseHashe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DateCreation` datetime(6) NOT NULL,
  PRIMARY KEY (`IdUtilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `valeurchamp`
--

DROP TABLE IF EXISTS `valeurchamp`;
CREATE TABLE IF NOT EXISTS `valeurchamp` (
  `IdValeur` int NOT NULL AUTO_INCREMENT,
  `ValeurTexte` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ValeurDate` datetime(6) DEFAULT NULL,
  `ValeurNombre` int DEFAULT NULL,
  `IdChamp` int NOT NULL,
  `IdEquipement` int NOT NULL,
  PRIMARY KEY (`IdValeur`),
  KEY `IX_ValeurChamp_IdChamp` (`IdChamp`),
  KEY `IX_ValeurChamp_IdEquipement` (`IdEquipement`)
) ENGINE=InnoDB AUTO_INCREMENT=14095 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
CREATE TABLE IF NOT EXISTS `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `champpersonnalise`
--
ALTER TABLE `champpersonnalise`
  ADD CONSTRAINT `FK_ChampPersonnalise_TypeEquipement_IdType` FOREIGN KEY (`IdType`) REFERENCES `typeequipement` (`IdType`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ecart`
--
ALTER TABLE `ecart`
  ADD CONSTRAINT `FK_Ecart_Equipement_IdEquipement` FOREIGN KEY (`IdEquipement`) REFERENCES `equipement` (`IdEquipement`) ON DELETE CASCADE;

--
-- Contraintes pour la table `equipement`
--
ALTER TABLE `equipement`
  ADD CONSTRAINT `FK_Equipement_TypeEquipement_IdType` FOREIGN KEY (`IdType`) REFERENCES `typeequipement` (`IdType`) ON DELETE CASCADE;

--
-- Contraintes pour la table `logactivite`
--
ALTER TABLE `logactivite`
  ADD CONSTRAINT `FK_LogActivite_Utilisateurs_IdUtilisateur` FOREIGN KEY (`IdUtilisateur`) REFERENCES `utilisateurs` (`IdUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages_ecart`
--
ALTER TABLE `messages_ecart`
  ADD CONSTRAINT `FK_messages_ecart_Ecart_IdEcart` FOREIGN KEY (`IdEcart`) REFERENCES `ecart` (`IdEcart`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_messages_ecart_Utilisateurs_IdUtilisateur` FOREIGN KEY (`IdUtilisateur`) REFERENCES `utilisateurs` (`IdUtilisateur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK_notifications_Utilisateurs_IdUtilisateur` FOREIGN KEY (`IdUtilisateur`) REFERENCES `utilisateurs` (`IdUtilisateur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `valeurchamp`
--
ALTER TABLE `valeurchamp`
  ADD CONSTRAINT `FK_ValeurChamp_ChampPersonnalise_IdChamp` FOREIGN KEY (`IdChamp`) REFERENCES `champpersonnalise` (`IdChamp`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ValeurChamp_Equipement_IdEquipement` FOREIGN KEY (`IdEquipement`) REFERENCES `equipement` (`IdEquipement`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
