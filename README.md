# O'resto – GraphQL API

## Installation

> **NOTE** assure-toi qu'aucun service ne tourne sur le port 5432

1. crée un fichier `.env` en s'inspirant du contenu du `.env.example`
2. lance Docker → `docker compose up --build`
3. vérifie si la console affiche « _We are ready!!!_ »

## _Seeding_ [optionnel]

Si tu veux générer de nouvelles données pour la base :

0. (hors Docker)
1. rends-toi dans le dossier `src` → `cd src/`
2. installe les dépendances → `pnpm i`
3. génère les données → `pnpm seed`
4. le fichier `./src/init-oresto-db/seeding.sql` doit être à jour

> **NOTE** tu peux modifier le nombre de données générées
> dans le fichier `./src/data-generation/seeding.mjs`
