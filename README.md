# Application de Suivi des Dépenses personelles

Cette application de gestion financière, développée avec **Next.js**, **TypeScript**, **HTML**, **SCSS**, et **Firebase**, permet de suivre efficacement ses finances personnelles. Elle offre la possibilité d'ajouter des dépenses, de créer des comptes et des catégories spécifiques, ainsi que de suivre les ventes. L'application intègre également une fonctionnalité d'exportation des données en formats CSV ou Excel.

Le dashboard fournit une vue d'ensemble intuitive des finances, affichant le total des dépenses pour le mois sélectionné, un graphique détaillant les catégories où les dépenses sont les plus élevées, ainsi qu'un aperçu des dernières transactions.

## Fonctionnalités principales

- **Suivi des ventes :** Visualisez le nombre d'articles vendus, non vendus, les bénéfices, et les montants des ventes par mois pour une année donnée.
- **Ajout d'articles :** Ajoutez facilement de nouveaux articles à vendre, avec gestion des quantités et des tailles.
- **Filtres avancés :** Filtrez les articles par état (vendu ou non vendu), par mois et année.
- **Export de données :** Exportez les listes d'articles et les rapports de ventes en fichiers CSV ou Excel.
- **Interface utilisateur réactive :** Design adapté pour les appareils mobiles et de bureau, avec un style moderne.

## Technologies utilisées

- **Next JS & TypeScript :** Pour une architecture modulaire et un typage strict.
- **SCSS :** Pour une gestion avancée des styles avec un design réactif.
- **Firebase Firestore :** Base de données utilisée pour stocker et gérer les articles et les ventes.
- **i18next :** Pour la gestion des langues.

## Installation et démarrage

1. Clonez le dépôt :

```bash
git clone https://github.com/Andriamahay11master/money-mind.git
cd MoneyMind
```

2. Installez les dépendances :

```bash
npm install
```

3. Lancez l'application en mode développement :

```bash
npm run dev
```

4. Accédez à l'application sur `http://localhost:3000`.

## Structure du projet

- **src/** : Contient le code source de l'application.
  - **components/** : Composants réutilisables tels que les formulaires, alertes, tableaux, loader, breadcrumbs,etc.
  - **app/** : Pages principales de l'application et configuration firebase.
  - **assets/** : Fichiers SCSS pour la gestion des styles globaux et des composants.
  - **models/** : Pour le typage des données.
  - **data/** : Pour les données statiques utilisés par l'application.

## Commandes utiles

- **`npm run dev`** : Démarre l'application en mode développement.
- **`npm run build`** : Génère un build de production.
- **`npm run lint`** : Vérifie et corrige le code avec ESLint.

## Contribution

Les contributions sont les bienvenues. Si vous souhaitez contribuer, ouvrez un problème ou une pull request.
