import debug from 'debug';
import { GraphQLError } from 'graphql';
import type { ContextValue, Manager, Restaurant } from '../../@types';

const log = debug('app:resolvers:mutation');

const mutation = {
  async createManager(
    _parent,
    { input }: { input: Manager },
    { dataSources }: ContextValue,
  ) {
    log('create new manager');
    return await dataSources.restoDB.manager.create(input);
  },
  async updateManager(
    _,
    args: { id: number; input: Manager },
    { dataSources }: ContextValue,
  ) {
    log(`update manager with ID ${args.id}`);

    if (!args.input.email.includes('@')) {
      throw new GraphQLError('manque arobase dans email', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    return await dataSources.restoDB.manager.update(args.id, args.input);
  },
  async deleteManager(_, args: { id: number }, { dataSources }: ContextValue) {
    log(`delete manager with ID ${args.id}`);
    return await dataSources.restoDB.manager.delete(args.id);
  },

  async createRestaurant(
    _,
    args: { input: Restaurant },
    { dataSources }: ContextValue,
  ) {
    log('create new restaurant');
    return await dataSources.restoDB.restaurant.create(args.input);
  },
  async updateRestaurant(
    _,
    args: { id: number; input: Restaurant },
    { dataSources }: ContextValue,
  ) {
    log(`update restaurant with id ${args.id}`);
    return await dataSources.restoDB.restaurant.update(args.id, args.input);
  },
  async deleteRestaurant(
    _,
    args: { id: number },
    { dataSources }: ContextValue,
  ) {
    log(`delete restaurant with ID ${args.id}`);
    return await dataSources.restoDB.restaurant.delete(args.id);
  },
};

export default mutation;
