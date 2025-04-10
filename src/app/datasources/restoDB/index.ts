import type { DBConfig } from '../../../@types/db';

import client from './config/db';

import CityMapper from './cityMapper';
import CuisineMapper from './cuisineMapper';
import ManagerMapper from './managerMapper';
import RestaurantMapper from './restaurantMapper';

class RestoDB {
  manager;
  restaurant;
  city;
  cuisine;

  constructor(options: DBConfig = {}) {
    options.client = options.client || client;
    this.manager = new ManagerMapper(options);
    this.restaurant = new RestaurantMapper(options);
    this.city = new CityMapper(options);
    this.cuisine = new CuisineMapper(options);
  }
}

export default new RestoDB();
