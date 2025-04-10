import debug from 'debug';
import type { Manager } from '../../@types';
import restoDB from '../datasources/restoDB';

const log = debug('app:resolvers:mutation');

const mutation = {
  async createManager(_parent, { input }: { input: Manager }) {
    log('create new manager');
    return await restoDB.manager.create(input);
  },
};

export default mutation;
