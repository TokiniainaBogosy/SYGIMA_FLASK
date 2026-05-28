-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 28 mai 2026 à 08:13
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sygima_flask`
--

-- --------------------------------------------------------

--
-- Structure de la table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
CREATE TABLE IF NOT EXISTS `alembic_version` (
  `version_num` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `alembic_version`
--

INSERT INTO `alembic_version` (`version_num`) VALUES
('036caff9d0ae');

-- --------------------------------------------------------

--
-- Structure de la table `categories_materiel`
--

DROP TABLE IF EXISTS `categories_materiel`;
CREATE TABLE IF NOT EXISTS `categories_materiel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entreprise_id` int NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_global` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `_nom_entreprise_uc` (`nom`,`entreprise_id`),
  KEY `ix_categories_materiel_entreprise_id` (`entreprise_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories_materiel`
--

INSERT INTO `categories_materiel` (`id`, `entreprise_id`, `nom`, `description`, `is_global`) VALUES
(9, 1, 'toky', 'bogosy', 0),
(8, 2, 'Plastic', 'slkdv ljvsd', 0),
(7, 2, 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaa', 0),
(10, 1, 'retcvgjhbknl,m;', 'trcyvgjhbkl,m;ù:', 0),
(11, 2, 'hgjhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', 'gggggggggggggggggggggggggggg', 0);

-- --------------------------------------------------------

--
-- Structure de la table `demandes`
--

DROP TABLE IF EXISTS `demandes`;
CREATE TABLE IF NOT EXISTS `demandes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entreprise_id` int NOT NULL,
  `reference` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `demandeur_id` int NOT NULL,
  `departement_id` int NOT NULL,
  `responsable_id` int DEFAULT NULL,
  `traite_par` int DEFAULT NULL,
  `statut` enum('BROUILLON','SOUMISE','EN_TRAITEMENT','APPROUVEE1','APPROUVEE2','REJETEE1','REJETEE2','EN_ATTENTE_STOCK','LIVREE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `justification` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motif_rejet` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_soumission` datetime NOT NULL DEFAULT (now()),
  `date_traitement` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_demandes_reference` (`reference`),
  KEY `ix_demandes_demandeur_id` (`demandeur_id`),
  KEY `ix_demandes_departement_id` (`departement_id`),
  KEY `ix_demandes_entreprise_id` (`entreprise_id`),
  KEY `responsable_id` (`responsable_id`),
  KEY `traite_par` (`traite_par`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `demandes`
--

INSERT INTO `demandes` (`id`, `entreprise_id`, `reference`, `demandeur_id`, `departement_id`, `responsable_id`, `traite_par`, `statut`, `justification`, `motif_rejet`, `date_soumission`, `date_traitement`) VALUES
(18, 1, 'DEM-CBC85BB0', 2, 1, 1, NULL, 'SOUMISE', 'fdhfddfhdhdfh', NULL, '2026-05-26 20:38:20', NULL),
(17, 2, 'DEM-78E8CE8C', 15, 2, 2, 15, 'APPROUVEE1', 'aaaaaaaaaaaaaaaa', NULL, '2026-05-25 19:55:26', '2026-05-25 19:56:09'),
(16, 1, 'DEM-9F617169', 2, 1, 1, 2, 'APPROUVEE1', 'retdfguyjikolp', '[gfhjk]: qsfqsfq', '2026-05-25 19:54:31', '2026-05-25 19:57:14');

-- --------------------------------------------------------

--
-- Structure de la table `departements`
--

DROP TABLE IF EXISTS `departements`;
CREATE TABLE IF NOT EXISTS `departements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entreprise_id` int NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `_code_entreprise_uc` (`code`,`entreprise_id`),
  KEY `ix_departements_code` (`code`),
  KEY `ix_departements_entreprise_id` (`entreprise_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `departements`
--

INSERT INTO `departements` (`id`, `entreprise_id`, `code`, `nom`, `created_at`) VALUES
(1, 1, 'RSI-001', 'RSI', '2026-05-07 10:35:27'),
(2, 2, 'GG', 'Glace', '2026-05-25 19:11:48');

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

DROP TABLE IF EXISTS `entreprises`;
CREATE TABLE IF NOT EXISTS `entreprises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_entreprises_code` (`code`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `entreprises`
--

INSERT INTO `entreprises` (`id`, `nom`, `code`, `logo_url`, `adresse`, `is_active`, `created_at`) VALUES
(1, 'ASECNA', 'ASECN-00', NULL, 'tana', 1, '2026-05-06 10:30:44'),
(2, 'POPO', 'PP', NULL, 'Tana', 1, '2026-05-25 10:37:22');

-- --------------------------------------------------------

--
-- Structure de la table `lignes_demande`
--

DROP TABLE IF EXISTS `lignes_demande`;
CREATE TABLE IF NOT EXISTS `lignes_demande` (
  `id` int NOT NULL AUTO_INCREMENT,
  `demande_id` int NOT NULL,
  `materiel_id` int NOT NULL,
  `qte_demandee` int NOT NULL,
  `qte_accordee` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_lignes_demande_demande_id` (`demande_id`),
  KEY `ix_lignes_demande_materiel_id` (`materiel_id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `lignes_demande`
--

INSERT INTO `lignes_demande` (`id`, `demande_id`, `materiel_id`, `qte_demandee`, `qte_accordee`) VALUES
(27, 18, 7, 1, NULL),
(26, 18, 7, 1, NULL),
(25, 17, 8, 1, 1),
(24, 16, 7, 1, 1),
(23, 16, 7, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `materiels`
--

DROP TABLE IF EXISTS `materiels`;
CREATE TABLE IF NOT EXISTS `materiels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entreprise_id` int NOT NULL,
  `categorie_id` int NOT NULL,
  `departement_id` int DEFAULT NULL,
  `reference` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unite` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_global` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_materiels_categorie_id` (`categorie_id`),
  KEY `ix_materiels_departement_id` (`departement_id`),
  KEY `ix_materiels_entreprise_id` (`entreprise_id`),
  KEY `ix_materiels_reference` (`reference`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `materiels`
--

INSERT INTO `materiels` (`id`, `entreprise_id`, `categorie_id`, `departement_id`, `reference`, `designation`, `unite`, `is_global`) VALUES
(7, 1, 9, 1, 'MAT-00001', 'gfhjk', 'xgfchjbkl,m', 0),
(8, 2, 8, 1, 'MAT-00001', 'qsdsqdqs', 'qsdqsd', 0);

-- --------------------------------------------------------

--
-- Structure de la table `mouvements_stock`
--

DROP TABLE IF EXISTS `mouvements_stock`;
CREATE TABLE IF NOT EXISTS `mouvements_stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entreprise_id` int NOT NULL,
  `materiel_id` int NOT NULL,
  `departement_id` int NOT NULL,
  `demande_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `type_mouvement` enum('ENTREE','SORTIE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` int NOT NULL,
  `signature_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_mouvement` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ix_mouvements_stock_departement_id` (`departement_id`),
  KEY `ix_mouvements_stock_entreprise_id` (`entreprise_id`),
  KEY `ix_mouvements_stock_materiel_id` (`materiel_id`),
  KEY `ix_mouvements_stock_user_id` (`user_id`),
  KEY `demande_id` (`demande_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entreprise_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('INFO','WARNING','ERROR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ix_notifications_entreprise_id` (`entreprise_id`),
  KEY `ix_notifications_user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `responsable_departements`
--

DROP TABLE IF EXISTS `responsable_departements`;
CREATE TABLE IF NOT EXISTS `responsable_departements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `departement_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `_user_departement_uc` (`user_id`,`departement_id`),
  KEY `ix_responsable_departements_departement_id` (`departement_id`),
  KEY `ix_responsable_departements_user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `responsable_departements`
--

INSERT INTO `responsable_departements` (`id`, `user_id`, `departement_id`) VALUES
(1, 12, 1),
(2, 15, 2);

-- --------------------------------------------------------

--
-- Structure de la table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
CREATE TABLE IF NOT EXISTS `stocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entreprise_id` int NOT NULL,
  `materiel_id` int NOT NULL,
  `departement_id` int NOT NULL,
  `quantite_actuelle` int NOT NULL,
  `seuil_alerte` int NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `_materiel_departement_uc` (`materiel_id`,`departement_id`),
  KEY `ix_stocks_departement_id` (`departement_id`),
  KEY `ix_stocks_entreprise_id` (`entreprise_id`),
  KEY `ix_stocks_materiel_id` (`materiel_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `stocks`
--

INSERT INTO `stocks` (`id`, `entreprise_id`, `materiel_id`, `departement_id`, `quantite_actuelle`, `seuil_alerte`, `updated_at`) VALUES
(6, 2, 8, 2, 3, 5, '2026-05-25 19:16:37'),
(7, 1, 7, 1, 2, 5, '2026-05-25 19:56:39');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('EMPLOYE','RESPONSABLE','MAGASINIER','ADMIN','SUPER_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `departement_id` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `departement_id` (`departement_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password_hash`, `role`, `departement_id`, `is_active`, `created_at`) VALUES
(1, 'Admin', 'Asecn', 'admin@asecna.mg', '$2b$12$tfxHBrzSqwRA6FeUCEelke5b9zRKE2uL97QUrwrORin5pfd4mFOaO', 'ADMIN', 1, 1, '2026-05-06 10:30:45'),
(2, 'Toky', 'eeeh', 'Responsable@asecna.mg', '$2b$12$MNshymMOs9qOSQjh2Cs2Du/Oh/DHkhsVEsbV3RkNLTSwjoSaKId2C', 'RESPONSABLE', 1, 1, '2026-05-07 10:47:56'),
(13, 'erd', 'dqssq', 'tokiniainaratefi@gmail.com', '$2b$12$U562eetk5Uda3O3jNGwOce/.bO/NElGk5UTwBOPX2xvQsuD5VmHcO', 'EMPLOYE', 1, 1, '2026-05-19 10:25:42'),
(12, 'RATEFIARIBENJA', 'kjhbvf', 'Tokiniaina1@gmail.com', '$2b$12$/PLTISjfrY1W5OtXl2qVGO7JD5GGmo0x7r17Y/QAdBdyWr85GQElW', 'RESPONSABLE', 1, 1, '2026-05-12 10:23:06'),
(14, 'Toky', 'Ratefi', 'adminPopo@gmail.com', '$2b$12$XiIDg39ixr/7YuSGYheK4.0NXqigG0s755m75G3uVHO.8ZL1iMYa2', 'ADMIN', NULL, 1, '2026-05-25 10:37:23'),
(15, 'aa', 'aa', 'aaaa@gmail.com', '$2b$12$6kUdHP45/lPYmF8WvzCy4OhDr5JMLeJoD.IXklNvnohYF6Q6ho1NG', 'RESPONSABLE', 2, 1, '2026-05-25 19:14:23');

-- --------------------------------------------------------

--
-- Structure de la table `user_entreprises`
--

DROP TABLE IF EXISTS `user_entreprises`;
CREATE TABLE IF NOT EXISTS `user_entreprises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `entreprise_id` int NOT NULL,
  `role_entreprise` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_user_entreprises_entreprise_id` (`entreprise_id`),
  KEY `ix_user_entreprises_user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_entreprises`
--

INSERT INTO `user_entreprises` (`id`, `user_id`, `entreprise_id`, `role_entreprise`, `is_active`) VALUES
(1, 1, 1, 'admin', 1),
(2, 2, 1, 'Responsable', 1),
(14, 14, 2, 'ADMIN', 1),
(12, 12, 1, 'Responsable', 1),
(13, 13, 1, 'Employe', 1),
(15, 15, 2, 'Responsable', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
