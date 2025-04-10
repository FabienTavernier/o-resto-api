import type { Cuisine } from '../../../@types';
import type { SQLQuery } from '../../../@types/db';
import CoreDataMapper from './coreDataMapper';

class CuisineMapper extends CoreDataMapper<Cuisine> {
  tableName = 'cuisine';

  async findByRestaurant(restaurantId: number): Promise<Cuisine[]> {
    const preparedQuery: SQLQuery = {
      text: `SELECT cs.* FROM "cuisine" cs
              JOIN "restaurant_has_cuisine" rcs ON rcs.cuisine_id = cs.id
              WHERE rcs.restaurant_id = $1`,
      values: [restaurantId],
    };
    const results = await this.client.query<Cuisine>(preparedQuery);
    return results.rows.map((row) => this.mapKeysToCamelCase(row) as Cuisine);
  }
}

export default CuisineMapper;
