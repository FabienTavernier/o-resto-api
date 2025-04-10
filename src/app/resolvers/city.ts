import debug from 'debug';
import type { City } from '../../@types';
import restoDB from '../datasources/restoDB';

const log = debug('app:resolvers:city');

const city = {
  async restaurants(parent: City) {
    log(`get restaurants for city ${parent.name}`);
    return await restoDB.restaurant.findByCity(parent.id);
  },
};

export default city;
