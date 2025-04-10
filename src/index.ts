import debug from 'debug';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import type { ContextValue } from './@types';
import RestoDB from './app/datasources/restoDB';
import WeatherAPI from './app/datasources/weatherAPI';
import resolvers from './app/resolvers';
import typeDefs from './app/schemas';

const PORT = Number(process.env.PORT || 4000);

const log = debug('app:server');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Je crée un contexte:
// - une fonction asynchrone qui retourne un objet
// - qui sera exécutée à chaque requête
async function createContext(): Promise<ContextValue> {
  return {
    dataSources: {
      restoDB: new RestoDB(),
      weatherAPI: new WeatherAPI(),
    },
  };
}

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: createContext, // je n'appelle pas ici, Apollo s'en charge à chaque requête
});

log(`🚀  Server ready at: ${url}`);
