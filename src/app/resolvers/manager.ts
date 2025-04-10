import debug from 'debug';
import type { Manager } from '../../@types';
import restoDB from '../datasources/restoDB';

const log = debug('app:resolvers:manager');

const manager = {
  async restaurants(parent: Manager) {
    log(`get restaurants for manager ${parent.email}`);
    return await restoDB.restaurant.findByManager(parent.id);
  },
};

export default manager;
