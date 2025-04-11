import debug from 'debug';
import type { ContextValue, Restaurant } from '../../@types';

const log = debug('app:resolvers:restaurant');

const restaurant = {
  async manager(parent: Restaurant, _args, { dataSources }: ContextValue) {
    log(`get manager for restaurant ${parent.name}`);
    return await dataSources.restoDB.manager.findByPk(parent.managerId);
  },

  async city(parent: Restaurant, _args, { dataSources }: ContextValue) {
    log(`get city for restaurant ${parent.name}`);
    return await dataSources.restoDB.city.findByPk(parent.cityId);
  },

  async cuisines(parent: Restaurant, _args, { dataSources }: ContextValue) {
    log(`get cuisines for restaurant ${parent.name}`);
    return await dataSources.restoDB.cuisine.findByRestaurant(parent.id);
  },
};

export default restaurant;
