import debug from 'debug';
import type { City, ContextValue } from '../../@types';

const log = debug('app:resolvers:city');

const city = {
  async restaurants(parent: City, _args, { dataSources }: ContextValue) {
    log(`get restaurants for city ${parent.name}`);
    return await dataSources.restoDB.restaurant.findByCity(parent.id);
  },

  async weather(parent: City, _args, { dataSources }: ContextValue) {
    log(`get weather for city ${parent.name}`);
    return await dataSources.weatherAPI.getWeatherForecast(parent.location);
  },
};

export default city;
