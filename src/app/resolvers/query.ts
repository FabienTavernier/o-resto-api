import debug from 'debug';
import type { QueryArgs } from '../../@types';
import restoDB from '../datasources/restoDB';

const log = debug('app:resolvers:query');

const query = {
  async managers() {
    log('get all managers');

    // doit retourner un [Manager!]! → schemas/query.gql
    return await restoDB.manager.findAll();
  },

  async manager(_parent: null, { id }: QueryArgs) {
    log(`get the manager with the ID ${id}`);
    // doit retourner un Manager! → schemas/query.gql
    return await restoDB.manager.findByPk(id);
  },
};

export default query;
