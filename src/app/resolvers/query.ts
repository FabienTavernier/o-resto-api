import debug from 'debug';
import type { QueryArgs } from '../../@types';
import restoDB from '../datasources/restoDB';

const log = debug('app:resolvers:query');

const query = {
  async managers() {
    log('get all managers');

    // doit retourner un [Manager!]! → schemas/query.gql
    return await restoDB.manager.findAll();
  },

  async manager(_parent: null, { id }: QueryArgs) {
    log(`get the manager with the ID ${id}`);
    // doit retourner un Manager! → schemas/query.gql
    return await restoDB.manager.findByPk(id);
  },

  async cities() {
    log('get all cities');
    // doit retourner un [City!]! → schemas/query.gql
    return await restoDB.city.findAll();
  },

  async city(_parent: null, { id }: QueryArgs) {
    log(`get the city with the ID ${id}`);
    // doit retourner un City! → schemas/query.gql
    return await restoDB.city.findByPk(id);
  },

  async restaurants() {
    log('get all restaurants');
    return await restoDB.restaurant.findAll();
  },

  async restaurant(_parent: null, { id }: QueryArgs) {
    log(`get the restaurant with the ID ${id}`);
    return await restoDB.restaurant.findByPk(id);
  },

  async cuisines() {
    log('get all cuisines');
    return await restoDB.cuisine.findAll();
  },

  async cuisine(_parent: null, { id }: QueryArgs) {
    log(`get the cuisine with the ID ${id}`);
    return await restoDB.cuisine.findByPk(id);
  },
};

export default query;
