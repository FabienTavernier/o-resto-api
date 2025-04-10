import debug from 'debug';
import type { Cuisine } from '../../@types';
import restoDB from '../datasources/restoDB';

const log = debug('app:resolvers:cuisine');

const cuisine = {
  async restaurants(parent: Cuisine) {
    log(`get restaurants for cuisine ${parent.label}`);
    return await restoDB.restaurant.findByCuisine(parent.id);
  },
};

export default cuisine;
