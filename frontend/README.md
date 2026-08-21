# AutoElite Frontend

Une plateforme web moderne et premium de vente, d'achat et de publication d'annonces automobiles destinée principalement au Sénégal (Dakar, Thiès, Saly, Saint-Louis, etc.) et à l'Afrique de l'Ouest.

## 🌟 Fonctionnalités Implémentées

### 🚙 Espace Public
- **Page d'Accueil** : Hero premium, barre de recherche rapide par marque/modèle/budget/année, carrousel de catégories, grilles de véhicules à la une et liste de nos services.
- **Catalogue & Recherche Avancée** : Moteur de filtrage en temps réel avec synchronisation directe dans l'URL. Supporte le tri (prix croissant/décroissant, popularité, récent).
- **Fiche Véhicule** : Galerie photo fluide, spécifications techniques, équipements détaillés, formulaire d'essai routier avec calendrier, et recommandations de voitures similaires.
- **Simulateur de Financement** : Calculateur de prêt en temps réel (apport, durée, taux) avec formulaire de demande de crédit.
- **Formulaire de Reprise** : Assistant d'évaluation de voiture pour échange de reprise.
- **Blog Automobile** : Articles d'actualités et conseils d'achats (douane, entretien des 4x4 au Sénégal, etc.).
- **FAQ interactive** : Accordéons classés par rubriques (Acheter, Vendre, Financement).

### 👤 Espace Client / Vendeur (`/compte`)
- **Tableau de bord** : Synthèse de vos annonces et statistiques de consultations.
- **Mon Profil** : Modification de vos coordonnées de contact.
- **Mes Annonces** : Tableau de gestion (marquer comme vendue, supprimer, aperçu).
- **Création d'Annonce Multi-étapes (Wizard)** : Formulaire pas à pas (1: Infos, 2: Options, 3: Photos, 4: Description, 5: Aperçu direct, 6: Soumission).

### 🛡️ Panneau d'Administration (`/admin`)
- **Dashboard Statistique** : Graphiques d'évolution et diagrammes de répartition (Recharts), comptage de dossiers.
- **Modération des Annonces** : Approuver ou rejeter les annonces en attente avant parution publique.
- **Inbox Demandes** : Gestion des demandes d'essais, crédits autos et reprises avec statuts modifiables.
- **Gestion des Utilisateurs** : Supervision des comptes et affectation de rôles.
- **Gestion du Blog** : Édition et suppression d'articles de conseil.

---

## 🛠️ Stack Technique

- **Framework** : React 19 (TypeScript)
- **Bundler** : Vite
- **Routage** : React Router DOM v7
- **Style** : Tailwind CSS v3 (Inter & Outfit Google Fonts)
- **Gestion d'État & Persistance** : Zustand + LocalStorage (Base de données simulée)
- **Analytics & Graphs** : Recharts
- **Iconographie** : Lucide React

---

## 🚀 Démarrage

### 1. Installation des dépendances
```bash
npm install --legacy-peer-deps
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```

### 3. Build de production
```bash
npm run build
```

---

## 💡 Rôles & Comptes de Test (Simulation)
Pour tester l'ensemble de la plateforme sans base de données, des raccourcis de connexion en un clic sont présents sur la page `/connexion` :
- **ADMIN** : `admin@autoelite.sn` (Accès complet à la console de gestion `/admin`)
- **SELLER** : `vendeur@autoelite.sn` (Accès aux formulaires de vente et tableau de bord)
- **USER** : `client@autoelite.sn` (Accès à ses demandes d'essais routiers et favoris)
