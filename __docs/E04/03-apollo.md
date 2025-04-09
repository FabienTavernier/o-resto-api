# GraphQL – Apollo Server

> <https://www.apollographql.com/docs/apollo-server>

## Installation

1. Node → type module ?
2. dépendances → `@apollo/server`, `graphql`
3. TS

> **NOTE** il sera peut-être nécessaire d'installer les dépendances
> dans le conteneur :
>
> `docker exec -it oresto-gql-api bash`

## Rappel

On a besoin de :

- **schémas** pour décrire les données
- **requêtes** auxquelles répondre
- **resolvers** pour les récupérer

## Schéma

> **ASTUCE**
> on peut installer l'[extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)
> pour l'auto-complétion, des snippets et la coloration syntaxique

- 5 [types scalaires](https://graphql.org/learn/schema/#scalar-types) :
  `Int`, `Float`, `String`, `Boolean`, `ID`

- 2 [_type modifiers_](https://graphql.org/learn/schema/#type-modifiers) :
  - `!` → « Non-Null »
  - `[Type]` → « List » : un tableau de ce type

  > **NOTE** les 2 peuvent être combinés :
  >
  > - `[String]!` : un tableau de chaînes de caractères **qui ne peut pas être nul**  
  >   → `null` KO
  >
  > - `[String!]` : un tableau de chaînes de caractères **qui ne peuvent pas être nulles**  
  >   → `['a', 'b', null]` KO
  >
  > - `[String!]!` : un tableau **non nul** de chaînes de caractères **non nulles**

On va tout de suite s'organiser. On crée un dossier `./src/app/schemas`.  
Et on définit notre premier schéma : `manager.gql` (ou `.graphql`).

```gql
type Manager {
  id: Int!
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  restaurants: [Restaurant!]!
}
```

> **NOTE** on ajoute `restaurants` pour l'association _One-to-Many_  
> → on pourra récupérer un gérant avec ses restaurants

On a donc besoin de créer d'autres types :
`Restaurant`, `City`, `Cuisine`…  
À vous de jouer !

Pour faciliter l'import de tous les schémas et leur utilisation dans JS,
je crée un « chef d'orchestre » (_barrel file_) qui regroupe tout sous forme de _string_  
→ `./src/app/schemas/index.ts`

## Requêtes

Pour définir les requêtes, on utilise un schéma « spécial » :
le **type Query**.

→ `./src/app/schemas/query.gql`

- quand on demandera (requête) les managers, on recevra (réponse) des managers
- quand on demandera **un manager par son ID**, on recevra un manager

## _Resolver_

Fonctions qui décrivent comment on récupère les informations demandées.

→ `./src/app/resolvers/query.ts`

> **ATTENTION**
> les requêtes définies dans le schéma Query **doivent être présentes**
> (même nom) dans les _resolvers_ :
>
> si la requête pour récupérer les gérants s'appelle `managers`,
> il **faut** une fonction `managers` dans les _resolvers_.

Pour faciliter l'import de tous les _resolvers_,
je crée un « chef d'orchestre » qui regroupe tout sous forme de _string_  
→ `./src/app/resolvers/index.ts`

## Instance d'Apollo Server

→ `./src/index.ts`

On a accès à un superbe outil : Apollo Sandbox !

- on peut choisir notre requête (grâce au schéma Query)
- il sait qu'il doit utiliser le _resolver_ du même nom
- on peut choisir les champs à afficher

  > si on coche `restaurants`, qui n'existe pas dans notre retour en dur,
  > il gère l'erreur lui-même…

## DataMapper

On remplace nos données en dur par un DataMapper  
→ `./src/app/datasources/restoDB/`

> **NOTE** on pense aussi à nos types TS → `./src/@types/index.ts`

```ts
import debug from "debug";
import restoDB from "../datasources/restoDB";

const log = debug("app:resolvers:query");

const query = {
  // managers
  async managers() {
    log("get all managers");
    return await restoDB.manager.findAll();
  }
};

export default query;

```

On ajoute le _resolvers_ `Query.restaurants`

```ts
// restaurants
async restaurants() {
  log("get all restaurants");
  return await restoDB.restaurant.findAll();
},
```

## Gestion des associations

Pour l'instant, si on veut récupérer les restaurants d'un manager,
on a rien (c'est comme ça que fonctionne le _dataMapper_).

Par contre, Apollo, quand il voit qu'on a une propriété non résolue `restaurants`,
il **va chercher automatiquement un _resolver_ spécifique** à `manager`
qui s'appelle `restaurants()`.

→ `./src/app/resolvers/manager.ts`

Il est nécessaire de comprendre qu'Apollo appelle les _resolvers_
avec des arguments.  
On peut donc les utiliser dans nos fonctions…

> **NOTE** ne pas oublier d'exporter `manager` dans l'index des _resolvers_

### Constat

Ça marche !!! Mais c'est long… Très long !

**Le problème :**

- quand je veux récupérer tous mes managers, il y a **1 requête SQL envoyée**
- par contre pour récupérer les **restaurants**, c'est **1 requête par manager**

> **NOTE** on peut voir le compteur de requêtes dans la console

**Solution :** on peut éviter ça et n'avoir que **2 requêtes SQL**…  
On verra ça plus tard !!! _#teasingInside_

### _Todo list_

- `restaurant`
  - manager → _dataMapper_ `manager.findByPk()`
  - city → _dataMapper_ `city.findByPk()`
  - cuisines → _dataMapper_ `cuisine.findByPk()`

- `manager` :
  - FAIT

- `cuisines` :
  - restaurants → _dataMapper_ `restaurant.findByCuisines()`

- `city` :
  - restaurants → _dataMapper_ `restaurant.findByCity()`

> **NOTE** ne pas oublier de tout exporter dans l'index des _resolvers_

## Récupérer UN enregistrement

On a prévu dans le type Query, un `manager` par exemple.
On s'y intéresse.

```gql
manager(id: Int!): Manager!
```

Dans le _resolver_, on doit donc récupérer ce paramètre `id` :

```ts
async manager(_: null, { id }: QueryArgs) {
  log(`get manager with id ${id}`);
  return await restoDB.manager.findByPk(id);
},
```

- dans `Query`, il n'y a pas de parent → 1er paramètre : null
- le deuxième paramètre est un objet qui contient tous les paramètres
  envoyés en même temps que la requête (dans notre cas, `id`)

Pour tester, dans la Sandbox :

```gql
query Query($managerId: Int!) {
  manager(id: $managerId) {
    email
    firstName
    lastName
  }
}
```

```json
// variables
{
  "managerId": 1
}
```

### À vous de jouer

Faire les autres méthodes de _query_

## En simultané

Maintenant qu'on commence à avoir des petites requêtes,
on peux demander des informations (totalement) indépendantes
dans une seule requête HTTP.

Exemple : le manager qui a l'ID 42 (avec ses restaurants et leur ville)
et le restaurant qui a l'ID 8 (avec son manager et sa ville)  
_impossible à faire en REST_
