# GraphQL – Mutations et Sources

## Correction

_code review_ si correction donnée la veille

## Mutations

- [ajout](./01-mutations.md)

## Ajout d'une autre source de données

On veut prendre en compte la météo ; bien entendu, ça ne sera pas en BDD…
On va se servir d'une API REST : [Tomorrow](https://app.tomorrow.io/home).

Alors, oui on pourrait le faire côté client avec un `fetch` mais
on va profiter des pouvoirs de GraphQL afin de limiter le nombre
de requêtes HTTP.

→ [fetch data](https://www.apollographql.com/docs/apollo-server/data/fetching-rest)

- [weather api](./02-api-meteo.md)

## Rattacher l'API à GraphQL

### Schéma

Notre but :
« je voudrai récupérer les données météo d'une ville ».

On ajoute donc une propriété `weather` dans `city.gql`.

→ `./src/app/schemas/weather.gql`

> **NOTE** on les rend disponible dans le _barrel file_…

### _Resolvers_

Avec ce schéma, `weather` devient disponible.
Lors d'une requête, quand on demande la météo, Apollo Server ne va rien
trouver, il va donc chercher une fonction `weather` dans le _resolver_ `city`.

→ `./src/app/resolvers/city.ts`

### On essaie

On teste sur 1 ville `Query > city()` (l'API a un _rate-limit_…)

### Conclusion

On commence à apercevoir un des gros intérêts de GraphQL :
on utilise une seule API avec un seul _endpoint_ qui réunit une multitude
de sources de données (BDD, API REST, API GraphQL, fichiers…)

## Couplage

> <https://fr.wikipedia.org/wiki/Couplage_(informatique)>

Si, par exemple, on regarde nos _resolvers_, on voit qu'ils importent
tous une ou plusieurs dépendances (_datasources_).

Ça les rend assez « rigides » : difficile à lire, à maintenir, à tester,
à ré-utiliser…

Exemples :

- si une source de données change de nom, de chemin… On doit
modifier tous nos _resolvers_…
- si on veut tester un _resolver_, on voudra surement utiliser des fausses données,
  donc pas vraiment notre fonction importée qui `fetch` (et consomme un crédit API)…

En POO et en architecture logicielle, on aime écrire du code **modulaire**,
**maintenable** et **testable**.  
On va donc essayer au maximum de limiter les `import` :
on aimerait avoir une technique qui transmettra ces dépendances
dans un paramètre de nos fonctions…

C'est l'**injection de dépendance**.

Pour tester, il suffira de modifier le paramètre ;
pour modifier, il suffira de modifier le paramètre…

Bonne nouvelle, nos _resolvers_ pourront recevoir un 3ème paramètre :
un **contexte**.

→ [contexte GraphQL](./03-context.md)

## Challenge

Énoncé :

1. modifier les _resolvers_ pour se servir du Contexte  
  (étape obligatoire parce que tout est cassé !)

2. finir les mutations :
   - `updateManager()`, `deleteManager()`
   - CUD pour restaurants, ville, style de cuisine

3. ajouter 2 mutations pour gérer l'association restaurant-style de cuisine :
   - `associateRestaurantAndCuisine` → dataMapper `restaurant.associateWithCuisine`
   - `dissociateRestaurantAndCuisine` → dataMapper `restaurant.dissociateWithCuisine`

Bonus : on anticipe pour le dernier jour…
On réglera le problèmes des « N+1 requêtes ». Il faudrait lire :

- <https://www.apollographql.com/docs/graphos/schema-design/guides/handling-n-plus-one>
- <https://github.com/graphql/dataloader>
