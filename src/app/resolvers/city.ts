import debug from 'debug';
import type { City } from '../../@types';
import restoDB from '../datasources/restoDB';
import weatherAPI from '../datasources/weatherAPI';

const log = debug('app:resolvers:city');

const city = {
  async restaurants(parent: City) {
    log(`get restaurants for city ${parent.name}`);
    return await restoDB.restaurant.findByCity(parent.id);
  },

  async weather(parent: City) {
    log(`get weather for city ${parent.name}`);
    return await weatherAPI.getWeatherForecast(parent.location);
  },
};

export default city;
