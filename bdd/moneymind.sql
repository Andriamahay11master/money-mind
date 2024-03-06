-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  mer. 06 mars 2024 à 08:22
-- Version du serveur :  5.7.17
-- Version de PHP :  7.1.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `moneymind`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `idCategory` bigint(20) NOT NULL,
  `description` varchar(200) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`idCategory`, `description`) VALUES
(1, 'Alimentation'),
(2, 'Pharmacie'),
(3, 'Loisirs'),
(4, 'Véhicule'),
(5, 'Sortie'),
(6, 'Carburant'),
(7, 'Divers'),
(8, 'Services'),
(9, 'Apprentissage'),
(10, 'Autres');

-- --------------------------------------------------------

--
-- Structure de la table `compte`
--

CREATE TABLE `compte` (
  `idCompte` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `compte`
--

INSERT INTO `compte` (`idCompte`, `description`) VALUES
(1, 'Janvier 2024'),
(2, 'Février 2024'),
(3, 'Mars 2024');

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `compteexpense`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `compteexpense` (
`idExpenses` bigint(20)
,`descriptionForm` varchar(255)
,`valueExpenses` bigint(20)
,`dateExpenses` date
,`categoryExpenses` varchar(255)
,`idCompte` bigint(20)
,`compteDescription` varchar(255)
);

-- --------------------------------------------------------

--
-- Structure de la table `expenses`
--

CREATE TABLE `expenses` (
  `idExpenses` bigint(20) NOT NULL,
  `descriptionForm` varchar(255) DEFAULT NULL,
  `valueExpenses` bigint(20) DEFAULT NULL,
  `dateExpenses` date DEFAULT NULL,
  `categoryExpenses` varchar(255) DEFAULT NULL,
  `idCompte` bigint(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `expenses`
--

INSERT INTO `expenses` (`idExpenses`, `descriptionForm`, `valueExpenses`, `dateExpenses`, `categoryExpenses`, `idCompte`) VALUES
(1, 'Petit déjeuner leader', 50000, '2024-01-03', 'Alimentation', 3),
(2, 'Voyage à Ampefy', 450000, '2024-01-11', 'Loisirs', 1),
(3, 'Achat Lait bébé', 43600, '2024-02-14', 'Pharmacie', 2),
(4, 'Achat lait bébé', 43600, '2024-02-21', 'Pharmacie', 2),
(5, 'Déjeuner Jovenna', 9400, '2024-02-23', 'Alimentation', 2),
(6, 'Achat Gasoil', 50000, '2024-02-16', 'Carburant', 2),
(7, 'Déjeuner leader', 22500, '2024-02-28', 'Alimentation', 2),
(8, 'Gasoil Jovenna', 50000, '2024-02-27', 'Carburant', 2),
(9, 'Menage Noro', 12400, '2024-02-27', 'Alimentation', 2),
(10, 'Achat leader', 27243, '2024-02-27', 'Alimentation', 2),
(11, 'Achat divers', 15000, '2024-02-28', 'Divers', 2),
(12, 'Achat leader kaly DA', 40000, '2024-03-01', 'Alimentation', 3),
(13, 'Achat Médicaments Mighty', 55000, '2024-03-04', 'Pharmacie', 1),
(14, 'Nettoyage maison', 12000, '2024-03-04', 'Services', 3),
(15, 'Lavage voiture ', 10000, '2024-03-04', 'Véhicule', 3),
(16, 'Lavage Voiture ', 10000, '2024-01-31', 'Véhicule', 1),
(17, 'Nettoyage voiture', 10000, '2024-02-28', 'Véhicule', 2),
(18, 'Partie tennis', 5000, '2024-03-02', 'Loisirs', 3),
(19, 'Partie tennis', 10000, '2024-01-13', 'Loisirs', 1),
(20, 'Internet mois de mars', 132500, '2024-03-04', 'Services', 3),
(21, 'Achat gouter leader', 10000, '2024-03-04', 'Alimentation', 3),
(22, 'Achat gasoil', 100000, '2024-02-16', 'Carburant', 2);

-- --------------------------------------------------------

--
-- Structure de la vue `compteexpense`
--
DROP TABLE IF EXISTS `compteexpense`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `compteexpense`  AS  select `e`.`idExpenses` AS `idExpenses`,`e`.`descriptionForm` AS `descriptionForm`,`e`.`valueExpenses` AS `valueExpenses`,`e`.`dateExpenses` AS `dateExpenses`,`e`.`categoryExpenses` AS `categoryExpenses`,`c`.`idCompte` AS `idCompte`,`c`.`description` AS `compteDescription` from (`expenses` `e` join `compte` `c` on((`e`.`idCompte` = `c`.`idCompte`))) ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`idCategory`);

--
-- Index pour la table `compte`
--
ALTER TABLE `compte`
  ADD PRIMARY KEY (`idCompte`);

--
-- Index pour la table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`idExpenses`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `idCategory` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT pour la table `compte`
--
ALTER TABLE `compte`
  MODIFY `idCompte` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `idExpenses` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
