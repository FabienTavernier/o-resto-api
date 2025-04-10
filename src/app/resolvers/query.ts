import debug from 'debug';
import type { QueryArgs } from '../../@types';

const log = debug('app:resolvers:query');

const query = {
  managers() {
    log('get all managers');

    // doit retourner un [Manager!]! → schemas/query.gql
    return [
      {
        id: 42,
        first_name: 'Dave',
        last_name: 'Lopper',
        email: 'dave@mail.io',
        restaurants: [], // tableau vide → valide
      },
    ];
  },

  manager(_parent: null, { id }: QueryArgs) {
    log(`get the manager with the ID ${id}`);
    // doit retourner un Manager! → schemas/query.gql
    return {
      id: 42,
      first_name: 'Dave',
      last_name: 'Lopper',
      email: 'dave@mail.io',
      restaurants: [],
    };
  },
};

export default query;
