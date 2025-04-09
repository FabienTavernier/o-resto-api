# DataLoader

DataLoader est une classe qui permet de gérer efficacement le batching et le caching dans les requêtes GraphQL. Il est particulièrement utile pour éviter les problèmes de N+1 query lorsque plusieurs requêtes similaires sont effectuées, notamment lors du résolve de relations entre entités.

## Concepts clés

1. Batching : Grouper plusieurs requêtes identiques ou similaires en une seule pour optimiser les performances.

2. Caching : Stocker les résultats des requêtes précédentes afin de ne pas refaire les mêmes appels plusieurs fois.

## Installation

Pour pouvoir utiliser `DataLoader` vous devez avant tout l'installer

```bash
npm install dataloader
```

## Création d'un dataLoader

Prenons un exemple où vous avez une base de données avec deux tables : Article et Auteur, et vous souhaitez récupérer une liste des titres des articles et pour chaque article, son auteur.

La requête graphQL ressemblerait à :

```gql
{
  articles {
    title
    author {
      name
    }
  }
}
```

Si il y a 20 articles, il faudrait une première requête, pour récupérer les titres des 20 articles, puis 20 requêtes pour récupérer leurs auteur (N+1 = 21)

L'utilisation d'un dataLoader va permettre de réduire le nombre de requêtes à 2. une première pour récupérer les articles et une seconde pour récupérer tous les auteurs des articles.

Voici à quoi ressemblerait notre dataLoader

```javascript
import DataLoader from 'dataloader';

const authorsLoader = new DataLoader(async (authorIds) => {
// la requête pour récupérer tous les auteurs
const result = await db.query('SELECT * FROM author WHERE id = ANY($1)', [authorIds]);
// on renvoie un tableau dans lequel les résultats sont dans le même ordre que les demandes
return authorIds.map((authorId) => result.rows.find((author) => (author.id = authorId)));
});
```

## Utilisation

Les _dataloaders_ possèdent une méthode `load` qui permet d'ajouter à la file d'attente une demande de données pour une clef particulière (ici, notre dataloader attend d'id d'un auteur).

imaginons que je souhaite récupérer les auteurs 2,7 et 8

```javascript
authorsLoader.load(2);
authorsLoader.load(7);
authorsLoader.load(8);
```

À chaque appel de la méthode load, le dataloader ajoute l'id de l'auteur demandé à un tableau stocké par le dataloader.
Lorsque ces appels sont terminés, le dataloader execute la callback que nous lui avons passée en argument à sa création, en lui transmettant le tableau contenant les ids de tous les auteurs dont on souhaite récupérer les données.

la callback va effectuer la requête, remettre les résultats dans l'ordre des demandes et résoudre les promesses renvoyées par la fonction `load` avec la bonne valeur.

## Cache

En plus de sa fonctionnalité de traitement par lots, la classe `Dataloader` dispose d'un mécanisme de mise en cache de la réponse reçue pour une clef donnée, évitant ainsi l'envoi de requêtes redondantes.
