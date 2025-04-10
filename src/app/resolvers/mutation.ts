import debug from 'debug';
import { GraphQLError } from 'graphql';
import type { Manager } from '../../@types';
import restoDB from '../datasources/restoDB';

const log = debug('app:resolvers:mutation');

const mutation = {
  async createManager(_parent, { input }: { input: Manager }) {
    log('create new manager');
    return await restoDB.manager.create(input);
  },

  async updateManager(_, args: { id: number; input: Manager }) {
    log(`update manager with ID ${args.id}`);

    // On peut personnaliser la validation des données
    // → https://www.apollographql.com/docs/apollo-server/data/errors
    if (!args.input.email.includes('@')) {
      throw new GraphQLError('manque arobase dans email', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    return await restoDB.manager.update(args.id, args.input);
  },
};

export default mutation;
