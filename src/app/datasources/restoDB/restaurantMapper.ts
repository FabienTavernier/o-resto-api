import type { Restaurant } from '../../../@types';
import type { SQLQuery } from '../../../@types/db';
import CoreDataMapper from './coreDataMapper';

class RestaurantMapper extends CoreDataMapper<Restaurant> {
  tableName = 'restaurant_with_rating';

  async findByManager(managerId: number): Promise<Restaurant[]> {
    const preparedQuery: SQLQuery = {
      text: 'SELECT * FROM "restaurant" WHERE manager_id = $1',
      values: [managerId],
    };
    const results = await this.client.query<Restaurant>(preparedQuery);
    return results.rows.map(
      (row) => this.mapKeysToCamelCase(row) as Restaurant,
    );
  }

  async findByCity(cityId: number): Promise<Restaurant[]> {
    const preparedQuery: SQLQuery = {
      text: 'SELECT * FROM "restaurant" WHERE "city_id"=$1',
      values: [cityId],
    };
    const results = await this.client.query<Restaurant>(preparedQuery);
    return results.rows.map(
      (row) => this.mapKeysToCamelCase(row) as Restaurant,
    );
  }

  async findByCuisine(cuisineId: number): Promise<Restaurant[]> {
    const preparedQuery: SQLQuery = {
      text: `SELECT r.*, rcs.cuisine_id
              FROM "restaurant" r
              JOIN restaurant_has_cuisine rcs ON rcs.restaurant_id = r.id
              WHERE rcs.cuisine_id = $1`,
      values: [cuisineId],
    };
    const results = await this.client.query<Restaurant>(preparedQuery);
    return results.rows.map(
      (row) => this.mapKeysToCamelCase(row) as Restaurant,
    );
  }

  async associateWithCuisine(
    restaurantId: number,
    cuisineId: number,
  ): Promise<Restaurant> {
    const preparedQuery: SQLQuery = {
      text: 'INSERT INTO "restaurant_has_cuisine" ("restaurant_id", "cuisine_id") VALUES ($1, $2)',
      values: [restaurantId, cuisineId],
    };
    await this.client.query(preparedQuery);
    return this.findByPk(restaurantId);
  }

  async dissociateWithCuisine(
    restaurantId: number,
    cuisineId: number,
  ): Promise<Restaurant> {
    const preparedQuery: SQLQuery = {
      text: 'DELETE FROM "restaurant_has_cuisine" WHERE "restaurant_id"= $1 AND "cuisine_id"=$2',
      values: [restaurantId, cuisineId],
    };
    await this.client.query(preparedQuery);
    return this.findByPk(restaurantId);
  }
}

export default RestaurantMapper;
