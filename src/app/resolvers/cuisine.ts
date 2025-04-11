import debug from 'debug';
import type { ContextValue, Cuisine } from '../../@types';

const log = debug('app:resolvers:cuisine');

const cuisine = {
  async restaurants(parent: Cuisine, _args, { dataSources }: ContextValue) {
    log(`get restaurants for cuisine ${parent.label}`);
    return await dataSources.restoDB.restaurant.findByCuisine(parent.id);
  },
};

export default cuisine;
