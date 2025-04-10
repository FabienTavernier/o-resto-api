import debug from 'debug';
import type { Restaurant } from '../../@types';
import restoDB from '../datasources/restoDB';

const log = debug('app:resolvers:restaurant');

const restaurant = {
  async manager(parent: Restaurant) {
    log(`get manager for restaurant ${parent.name}`);
    return await restoDB.manager.findByPk(parent.managerId);
  },

  async city(parent: Restaurant) {
    log(`get city for restaurant ${parent.name}`);
    return await restoDB.city.findByPk(parent.cityId);
  },

  async cuisines(parent: Restaurant) {
    log(`get cuisines for restaurant ${parent.name}`);
    return await restoDB.cuisine.findByRestaurant(parent.id);
  },
};

export default restaurant;
