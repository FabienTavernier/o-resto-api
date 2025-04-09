# O'resto – Atelier

L'objectif de cet atelier est de connecter une application
**React Native** à une **API GraphQL** et d'implémenter un
**système de notation** permettant aux utilisateurs d'évaluer
les restaurants.

On en profitera pour remplir un objectif secondaire :
savoir chercher et lire une documentation !  
Certaines étapes seront donc volontairement floues…

## 1. Connecter l'application React Native à l'API GraphQL

L'application React Native doit être connectée à une API GraphQL afin de récupérer et envoyer des données.

### Tâches à réaliser

- **Trouver comment rattacher notre API à React Native**  
   → dès que c'est fait, envoie nous un MP (sur Slack) pour décrire votre trouvaille
- Configurer la connexion à l'API GraphQL existante.
- Tester la récupération des restaurants via une requête GraphQL (`getRestaurants` – nom libre).
- Afficher la liste des restaurants avec les données récupérées depuis l’API.

> **NOTE** on veut pouvoir récupérer les restaurants ET LEUR NOTES…  
> Il y a peut-être quelque chose à modifier dans le
> [datamapper](./src/app/datasources/restoDB/restaurant.ts)

<details>
  <summary>Indice</summary>

  T'aurais pas vu une _view_ ?
</details>

### Détails d'un restaurant

Pour le moment les données d'un restaurant sont en dur (`./front/data/restaurant.ts`) :

- analyser le fichier source pour écrire une requête GraphQL qui permet de récupérer les champs voulus
- récupérer le segment dynamique `id` pour cibler le bon restaurant
- remplacer le code en dur par les données de l'API

## 2. Implémenter un systèmes de notation des restaurants

L'objectif est de permettre aux utilisateurs de donner
une note aux restaurants sur une échelle de 1 à 5 étoiles.

### 2.1 Côté API

- Créer la mutation `rateRestaurantById` dans le **schéma** GraphQL
  - peut-être faudra-t-il des paramètres ?
  - voir la table SQL `rating` pour déterminer nos besoins

- Implémenter le **_resolver_** correspondant dans l’API

- Mettre à jour la base de données pour stocker les notes
  - créer le dataMapper correspondant  
   → `./src/app/datasources/restoDB/rating.ts`
   (s'inspirer de l'existant)

- S'assurer que la note moyenne d’un restaurant et
  le nombre d'avis sont recalculés après chaque
  nouveau vote  
  → dans la _sandbox_ Apollo (`localhost:4000`)

### 2.2 Côté Front

Permettre aux utilisateurs de donner une note aux
restaurants depuis l'interface mobile.
(page détails d'un restaurant)

- Ajouter une interface utilisateur pour la notation
  (système de 5 étoiles cliquables).

- Envoyer la note de l'utilisateur à l'API via
  la mutation `rateRestaurantById`.

- Afficher la note moyenne du restaurant en fonction des évaluations des utilisateurs
  - mise à jour en temps réel de la note moyenne après soumission

## Bonus

1. Utiliser un système de _Toast_ ou _SnackBar_
   confirmant l'enregistrement de la note.

2. Sur la page détails d'un restaurant, ajouter une
   carte pour marquer la localisation d'un restaurant.

## Méga-bonus

1. N'autoriser qu'un seul vote par utilisateur et
   lui permettre de modifier son vote

   - enregistrement dans le _localStorage_
   - ajouter un système de _token_  
    (pour qu'il ne puisse pas modifier un autre vote)
     - ajouter `token` dans la table SQL
     - générer un token unique par enregistrement
     - enregistrer le token avec la note dans le LS
   - ajouter la mutation, le resolver et le model (dataMapper)

2. Utiliser le [Cache d'Apollo](https://www.apollographql.com/docs/react/caching/overview)
   pour éviter de recharger les données après l'envoi
   d'un avis
