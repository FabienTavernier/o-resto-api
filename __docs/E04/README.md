# GraphQL

## Introduction

- [intro](./01-introduction.md)

## Mise en place

- [étapes](./02-mise-en-place.md)
- [apollo](./03-apollo.md)

## Challenge

→ créer un O'challenge à partir du dépôt du jour

Énoncé :

- finir les _resolvers_ dans `Query`
- finir les _resolvers_ des associations

## Fiche recap'

→ [recap](./fiches/graphQL.md)

## Bonus

Faire une requête autre part que dans la sandbox…  
Exemple sur REST Client

```http
### Get all restaurants
POST http://localhost:4000/graphql
Content-Type: application/json

{
  "query": "query { restaurants { id name} }"
}

### Get a manager by ID
POST http://localhost:4000/graphql
Content-Type: application/json

{
  "query": "query Query($managerId: Int!) { manager(id: $managerId) { email } }",
  "variables": {
    "managerId": 1
  }
}
```
