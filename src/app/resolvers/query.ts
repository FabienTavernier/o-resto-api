import debug from 'debug';
import type { ContextValue, QueryArgs } from '../../@types';

const log = debug('app:resolvers:query');

const query = {
  async managers(_parent, __args, { dataSources }: ContextValue) {
    log('get all managers');
    return await dataSources.restoDB.manager.findAll();
  },

  async manager(
    _parent: null,
    { id }: QueryArgs,
    { dataSources }: ContextValue,
  ) {
    log(`get the manager with the ID ${id}`);
    return await dataSources.restoDB.manager.findByPk(id);
  },

  async cities(_parent, __args, { dataSources }: ContextValue) {
    log('get all cities');
    return await dataSources.restoDB.city.findAll();
  },

  async city(_parent: null, { id }: QueryArgs, { dataSources }: ContextValue) {
    log(`get the city with the ID ${id}`);
    return await dataSources.restoDB.city.findByPk(id);
  },

  async restaurants(_parent, __args, { dataSources }: ContextValue) {
    log('get all restaurants');
    return await dataSources.restoDB.restaurant.findAll();
  },

  async restaurant(
    _parent: null,
    { id }: QueryArgs,
    { dataSources }: ContextValue,
  ) {
    log(`get the restaurant with the ID ${id}`);
    return await dataSources.restoDB.restaurant.findByPk(id);
  },

  async cuisines(_parent, __args, { dataSources }: ContextValue) {
    log('get all cuisines');
    return await dataSources.restoDB.cuisine.findAll();
  },

  async cuisine(
    _parent: null,
    { id }: QueryArgs,
    { dataSources }: ContextValue,
  ) {
    log(`get the cuisine with the ID ${id}`);
    return await dataSources.restoDB.cuisine.findByPk(id);
  },
};

export default query;
