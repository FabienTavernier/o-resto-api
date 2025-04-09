# GraphQL – Dataloader

## Correction

_code review_ si correction donnée la veille

## Dataloader

### Constat

N+1 requêtes SQL → ex : restaurants

### Introduction

C'est un utilitaire à utiliser dans la couche qui s'occupe de la récupération
des données de notre application. Il s'appuie sur :

- du **_batching_** → traitement par lot
- de la mise en cache

On a pas UN _dataloader_ mais **une instance par requête** qui représente un cache unique.
Ça évite que des utilisateurs voient les requêtes des autres.

### _Batching_

On crée une instance en lui donnant en paramètre une fonction de traitement par lot.

Dans notre cas, ça sera un fonction qui permettra de faire une seule requête SQL en lui
donnant plein d'identifiants :  
au lieu de récupérer LA ville d'UN restaurant,
on va récupérer LES villes de TOUS LES restaurants

Exemple :

```SQL
SELECT * FROM my_table WHERE id IN (...);
```

> « Then load individual values from the loader.
> DataLoader will coalesce all individual loads which occur within a single frame of execution
> (a single tick of the event loop) and then call your batch function with all requested keys. »
>
> Le _dataloader_ regroupera toutes les chargements individuels (_load_) qui se produisent au cours
> d'un même cycle d'exécution (un seul _tick_ de l'_event loop_),
> pui appellera la fonction de traitement par lot avec toutes les clés demandées
>
> → <https://www.youtube.com/watch?v=eiC58R16hb8>

```js
const userLoader = new DataLoader(keys => myBatchGetUsers(keys));

const user = await userLoader.load(1);                          // USER #1
const invitedBy = await userLoader.load(user.invitedByID);      // USER #3 (exemple)
console.log(`User 1 was invited by ${invitedBy}`);

// Elsewhere in your application
const user = await userLoader.load(2);                          // USER #2
const lastInvited = await userLoader.load(user.lastInvitedID);  // USER #12
console.log(`User 2 last invited ${lastInvited}`);
```

→ ces 4 lignes chargent (_load_) 4 utilisateurs différents.
En passant par le _dataloader_, il va ajouter chaque identifiant
dans le tableau `keys` de la fonction de _batching_ qui sera
exécutée à la fin du cycle d'exécution.

#### Batch function

```js
async function batchFunction(keys) {
  const results = await db.fetchAllKeys(keys);
  return keys.map(key => results[key] || new Error(`No result for ${key}`));
}
```

La dernière ligne s'assure de retourner les résultats dans le même ordre que les clés
données : plus facile pour qu'il s'y retrouve…  
Et gère les éventuelles erreurs.

> **NOTE** en SQL, si pas de `ORDER BY`, il retourne les valeurs par ordre d'insertion…
> Mais si on modifie une valeur, elle se retrouve à la fin.

### Mise en place

On va essayer de regrouper nos requêtes qui récupèrent les villes des restaurants  
→ _resolver_ `Restaurant.city()` : `findByPk` dans le _coreDataMapper_

```js
import Dataloader from 'dataloader';
```

```ts
constructor(options: DBConfig) {
  if (!options.client) {
    throw new Error('Client and cache are required');
  }
  this.client = options.client;

  // définition du dataloader
  this.findByPkLoader = new DataLoader(async (ids) => {
    const preparedQuery = {
      text: `SELECT * FROM "${this.tableName}" WHERE id = ANY($1)`,
      values: [ids],
    };

    const results = await this.client.query(preparedQuery);

    // je m'assure que les valeurs retournées soient dans le même ordre que `ids`
    // → pour chaque clé, je retrouve sa ligne dans le tableau de résultats par son ID
    return ids.map((id: number) => results.rows.find((row: { id: number}) => row.id === id));
  });
}
```

Je remplace donc mes appels à `findByPk` par ce dataloader

```ts
async findByPk<T>(id: number): Promise<T> {
  log(`get ${this.tableName} with id ${id}`);
  return await this.findByPkLoader.load(id);
}
```
