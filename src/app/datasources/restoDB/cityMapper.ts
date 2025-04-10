import type { City } from '../../../@types';
import CoreDataMapper from './coreDataMapper';

class CityMapper extends CoreDataMapper<City> {
  tableName = 'city';
}

export default CityMapper;
