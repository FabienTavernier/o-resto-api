# GraphQl ‑ Mutations

Pour modifier les données : CUD.

## Définir le schéma

Grâce au type « spécial » `Mutation`

1. on définit le champ pour la modification  
   → ex : `createManager()` pour ajouter un gérant

   on va recevoir des données, on les type grâce à un
   [Input Object Type](https://graphql.org/learn/schema/#input-object-types),
   **mot-clé `input`** ;
   c'est ce qui permettra à Apollo de valider les entrées et d'éventuellement
   renvoyer une erreur type 400

2. on définit le schéma de validation dans `manager.gql`

## Définir les _resolvers_

On met en place les _resolvers_ dans un `resolvers/mutation.ts`
qui reçoivent automatiquement des arguments dont notre `input`

> **NOTE** on n'oublie pas d'ajouter les `mutation.XYZ` aux `index.ts`

On teste…  
On n'hésite pas à faire une nouvelle requête `Query` avec l'ID retourné.

Si on essaie de lancer une requête mal formatée (champ manquant),
Apollo nous retourne l'erreur SQL (`NOT NULL`)

> **REMARQUE** GraphQL retourne toujours une réponse 200 même en cas d'erreur

### Bonne pratique

Il est préférable de **valider les données** d'abord les données au niveau du
serveur **avant d'envoyer une requête**.

Pour cela on a besoin de 2 types d'input distincts :

- pour le `create` où tout est `!` (comme indiquer dans le SQL)
- pour le `update` où tout est optionnel (je peux vouloir modifier qu'un champ)

## Autres modifications

1. mise à jour `update`
2. suppression `delete`
