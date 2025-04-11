import debug from 'debug';
import type { ContextValue, Manager } from '../../@types';

const log = debug('app:resolvers:manager');

const manager = {
  async restaurants(parent: Manager, _args, { dataSources }: ContextValue) {
    log(`get restaurants for manager ${parent.email}`);
    return await dataSources.restoDB.restaurant.findByManager(parent.id);
  },
};

export default manager;
