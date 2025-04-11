import debug from 'debug';
import { GraphQLError } from 'graphql';
import type {
  City,
  ContextValue,
  Cuisine,
  Manager,
  Restaurant,
} from '../../@types';

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

  async createCity(_, args: { input: City }, { dataSources }: ContextValue) {
    log('create new city');
    return await dataSources.restoDB.city.create(args.input);
  },
  async updateCity(
    _,
    args: { id: number; input: City },
    { dataSources }: ContextValue,
  ) {
    log(`update city with id ${args.id}`);
    return await dataSources.restoDB.city.update(args.id, args.input);
  },
  async deleteCity(_, args: { id: number }, { dataSources }: ContextValue) {
    log(`delete city with ID ${args.id}`);
    return await dataSources.restoDB.city.delete(args.id);
  },

  async createCuisine(
    _,
    args: { input: Cuisine },
    { dataSources }: ContextValue,
  ) {
    log('create new cuisine');
    return await dataSources.restoDB.cuisine.create(args.input);
  },
  async updateCuisine(
    _,
    args: { id: number; input: Cuisine },
    { dataSources }: ContextValue,
  ) {
    log(`update cuisine with id ${args.id}`);
    return await dataSources.restoDB.cuisine.update(args.id, args.input);
  },
  async deleteCuisine(_, args: { id: number }, { dataSources }: ContextValue) {
    log(`delete cuisine with ID ${args.id}`);
    return await dataSources.restoDB.cuisine.delete(args.id);
  },

  async associateRestaurantAndCuisine(
    _,
    args: { restaurantId: number; cuisineId: number },
    { dataSources }: ContextValue,
  ) {
    log(
      `associate restaurant with id ${args.restaurantId} and cuisine with id ${args.cuisineId}`,
    );
    return await dataSources.restoDB.restaurant.associateWithCuisine(
      args.restaurantId,
      args.cuisineId,
    );
  },
  async dissociateRestaurantAndCuisine(
    _,
    args: { restaurantId: number; cuisineId: number },
    { dataSources }: ContextValue,
  ) {
    log(
      `dissociate restaurant with id ${args.restaurantId} and cuisine with id ${args.cuisineId}`,
    );
    return await dataSources.restoDB.restaurant.dissociateWithCuisine(
      args.restaurantId,
      args.cuisineId,
    );
  },
};

export default mutation;
