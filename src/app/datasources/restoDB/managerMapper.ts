import type { Manager } from '../../../@types';
import CoreDataMapper from './coreDataMapper';

class ManagerMapper extends CoreDataMapper<Manager> {
  tableName = 'manager';
}

export default ManagerMapper;
