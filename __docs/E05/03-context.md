# GraphQL – Contexte

> <https://www.apollographql.com/docs/apollo-server/data/resolvers#resolver-arguments>

Un contexte est un objet partagé entre tous les _resolvers_.

Pour définir un contexte, on se sert d'une fonction (asynchrone)
qui retourne un objet.

Cette fonction sera :

- passée dans l'option `context` de la création du serveur (`startStandaloneServer`)
- exécutée à chaque requête

Cet objet sera accessible via le paramètre `contextValue` des _resolvers_.

→ <https://www.apollographql.com/docs/apollo-server/data/context>

## Création

On se sert de ce context pour renvoyer nos sources de données
(`restoDB` et `weatherAPI`).

→ `./src/index.ts`

> **ATTENTION** on doit modifier notre code pour satisfaire TS :
>
> on ne renvoie plus une instance de RestoDB, mais la classe elle-même ;
> pareil pour WeatherAPI

On crée le type `ContextValue` et on instancie les classes directement
dans la fonction `createContext()` :

```ts
function createContext(): Promise<ContextValue> {
  return {
    dataSources: {
      restoDB: new RestoDB(),
      weatherAPI: new WeatherAPI(), 
    }
  }
}
```

## Utilisation

Dans le _resolver_ `city`, par exemple, on :

- supprime les imports
- récupère les dépendances depuis le contexte

```ts
import debug from "debug";
import { City } from "../../types";

const log = debug("app:resolvers:city");

const city = {
  async restaurants(parent: City, _: null, { dataSources }: ContextValue) {
    log(`resolve restaurants from ${parent.name}`);
    const restaurants = await dataSources.restoDB.restaurant.findByCity(parent.id);
    log(`${restaurants.length} restaurants found`);

    return restaurants;
  },

  async weather(parent: City, _: null, { dataSources }: ContextValue) {
    log(`resolve weather from ${parent.name}`);
    return dataSources.weatherAPI.getWeatherForecast(parent.location)
  }
};

export default city;

```
