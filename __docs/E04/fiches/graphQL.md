# Introduction à GraphQL

**GraphQL** est un langage de requête pour les API qui permet aux clients de demander exactement les données dont ils ont besoin. Contrairement aux API REST traditionnelles, où les données sont souvent structurées en plusieurs points de terminaison, GraphQL permet de centraliser toutes les requêtes dans un seul endpoint.

## Pourquoi utiliser GraphQL ?

- **Flexibilité des requêtes** : Les clients peuvent demander exactement les champs dont ils ont besoin, rien de plus.
- **Moins de surcharge réseau** : Réduit les problèmes de sur-fetching (trop de données renvoyées) et de sous-fetching (pas assez de données).
- **Typage fort** : Le schéma GraphQL permet de définir de manière claire les types de données, les relations entre elles, et les opérations possibles.
- **Une seule porte d'entrée** : Toutes les requêtes passent par un seul endpoint, facilitant la gestion et la documentation.

## GraphQL côté serveur avec Apollo 4

**Apollo Server** est un serveur GraphQL performant et facile à utiliser. Il permet de définir des schémas et des résolveurs pour structurer l'API.

### Étapes clés pour créer un serveur GraphQL avec Apollo 4

1. **Installation des dépendances**

   ```bash
   npm install @apollo/server graphql
   ```

2. **Définition des schéma**

   - Utilisez la syntaxe SDL (Schema Definition Language) pour décrire les types et opérations.

   ```graphql
   type Query {
     books: [Book]
   }

   type Book {
     title: String
     author: String
   }
   ```

3. **Créer les résolveurs**

   - Les résolveurs sont des fonctions qui indiquent au serveur comment obtenir les données pour chaque type ou champ du schéma.

   ```javascript
   const resolvers = {
     Query: {
       books: () => [
         {
           title: 'GraphQL Guide',
           author: 'John Doe',
         },
       ],
     },
   };
   ```

4. **Configurer Apollo Server**

   - Utilisez Apollo 4 pour créer et démarrer votre serveur.

   ```javascript
   const { ApolloServer } = require('@apollo/server');
   const { startStandaloneServer } = require('@apollo/server/standalone');

   const server = new ApolloServer({
     typeDefs,
     resolvers,
   });

   const { url } = await startStandaloneServer(server, {
     listen: { port: 4000 },
   });

   console.log(`🚀 Server ready at ${url}`);
   ```

5. **Exécution des requêtes**
   - Une fois le serveur en route, vous pouvez envoyer des requêtes comme celle-ci :

   ```graphql
   query {
     books {
       title
       author
     }
   }
   ```

#### Concepts clés

- **Schéma GraphQL** : Définit les types, les requêtes (Query), les mutations (Modification des données), et les souscriptions (Subscription).
- **TypeDefs** : Une structure qui décrit les types et leurs relations.
- **Résolveurs** : Fonctions responsables de récupérer les données pour les types ou champs spécifiés dans le schéma.
- **Mutations** : Utilisées pour effectuer des opérations d’écriture (création, mise à jour, suppression de données).
- **Subscriptions** : Permet d’écouter des événements en temps réel sur le serveur.

## Types

GraphQL supporte nativement un ensemble de types de données scalaires et de types définis pour structurer les schémas. Voici une liste des types natifs inclus dans la spécification GraphQL :

---

### **Types scalaires natifs**

Les types scalaires représentent des valeurs atomiques. Ce sont les blocs de construction fondamentaux dans GraphQL.

1. **`Int`**

   - Un entier signé de 32 bits.
   - Exemple : `1`, `42`, `-100`.

2. **`Float`**

   - Un nombre à virgule flottante de précision double.
   - Exemple : `3.14`, `-0.1`.

3. **`String`**

   - Une chaîne de texte encodée en UTF-8.
   - Exemple : `"Hello, world!"`.

4. **`Boolean`**

   - Un type booléen, acceptant seulement `true` ou `false`.

5. **`ID`**
   - Une chaîne unique utilisée comme identifiant. Bien qu'il s'agisse techniquement d'une chaîne (`String`), il est sémantiquement destiné à être utilisé comme identifiant unique.
   - Exemple : `"1234"`, `"uuid-5678"`.

---

### **Types complexes construits à partir de types scalaires**

GraphQL permet de créer des types plus complexes :

1. **Objets (`type`)**

   - Contiennent un ensemble de champs, chacun ayant un type spécifié.
   - Exemple :

     ```graphql
     type User {
       id: ID
       name: String
       age: Int
     }
     ```

2. **Listes (`[Type]`)**

   - Représentent une liste d'éléments d'un type donné.
   - Exemple : `[String]` pour une liste de chaînes.
   - Exemple d'utilisation :

     ```graphql
     type Query {
       tags: [String]
     }
     ```

3. **Nullabilité**

   - Par défaut, tous les types peuvent être `null`.
   - Pour indiquer qu'un type ne peut pas être nul, on utilise `!`.
   - Exemple : `String!` signifie une chaîne non nulle.

4. **Types d'entrée (`input`)**

   - Similaires aux objets, mais utilisés pour structurer les arguments d'entrée dans des mutations ou requêtes.
   - Exemple :

     ```graphql
     input CreateUserInput {
       name: String!
       age: Int
     }
     ```

5. **Enums**
   - Représentent un ensemble fixe de valeurs constantes.
   - Exemple :

     ```graphql
     enum Role {
       ADMIN
       USER
       GUEST
     }
     ```

---

### **Types spéciaux pour les schémas**

1. **Query**

   - Représente les opérations de lecture.
   - Exemple :

     ```graphql
     type Query {
       getUser(id: ID!): User
     }
     ```

2. **Mutation**

   - Représente les opérations d'écriture ou de modification.
   - Exemple :

     ```graphql
     type Mutation {
       createUser(input: CreateUserInput!): User
     }
     ```

3. **Subscription**
   - Représente des opérations en temps réel via WebSockets ou autres protocoles.
   - Exemple :

     ```graphql
     type Subscription {
       userCreated: User
     }
     ```

---

### **Extensions et types personnalisés**

Bien que non natifs, des scalaires personnalisés peuvent être définis pour représenter des types comme les dates, les URL ou les emails en utilisant des bibliothèques comme [`graphql-scalars`](https://the-guild.dev/graphql/scalars).

Exemple de scalaires personnalisés courants :

- `DateTime`
- `URL`
- `Email`
- `JSON`

Pour définir un scalaire personnalisé, on peut utiliser une déclaration comme :

```graphql
scalar DateTime
```

Et fournir une implémentation côté serveur pour la validation et la sérialisation.

---

### Résumé des types natifs

| Type      | Description                          |
| --------- | ------------------------------------ |
| `Int`     | Entier signé de 32 bits              |
| `Float`   | Nombre à virgule flottante           |
| `String`  | Chaîne UTF-8                         |
| `Boolean` | Valeur booléenne (`true` ou `false`) |
| `ID`      | Identifiant unique (chaîne)          |

En combinant ces types scalaires avec les structures complexes, vous pouvez modéliser la plupart des cas d'utilisation dans GraphQL.
