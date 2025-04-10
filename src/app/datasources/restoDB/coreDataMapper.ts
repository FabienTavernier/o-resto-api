import debug from 'debug';
import type { DBConfig, Queryable, SQLQuery } from '../../../@types/db';

const log = debug('app:datasources:coreDataMapper');

abstract class CoreDataMapper<T extends Record<string, unknown>> {
  protected abstract tableName: string;
  protected client: Queryable;

  constructor(options: DBConfig) {
    if (!options.client) {
      throw new Error('Client and cache are required');
    }
    this.client = options.client;
  }

  /**
   * Convert camelCase (JS, GraphQL) and PascalCase to snake_case (SQL)
   */
  toSnakeCase(str: string) {
    return str.replace(/[A-Z]/g, (letter, index) => {
      return index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`;
    });
  }

  toCamelCase(str: string) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  mapKeysToCamelCase(obj: Record<string, unknown>) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        acc[this.toCamelCase(key)] = value;
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  async findAll(): Promise<T[]> {
    log(`get all ${this.tableName}s`);

    const preparedQuery: SQLQuery = {
      text: `SELECT * FROM "${this.tableName}"`,
    };
    const results = await this.client.query<T>(preparedQuery);

    return results.rows.map((row) => this.mapKeysToCamelCase(row) as T);
  }

  async findByPk(id: number): Promise<T | undefined> {
    log(`get ${this.tableName} with id ${id}`);

    const preparedQuery: SQLQuery = {
      text: `SELECT * FROM "${this.tableName}" WHERE id=$1`,
      values: [id],
    };
    const results = await this.client.query<T>(preparedQuery);

    const row = results.rows[0];
    return row ? (this.mapKeysToCamelCase(row) as T) : undefined;
  }

  async create(inputData: Partial<T>): Promise<T> {
    const fields: string[] = [];
    const placeholders: string[] = [];
    const values: (string | number)[] = [];

    let placeholderIndex = 1;

    for (const [prop, value] of Object.entries(inputData)) {
      fields.push(`"${this.toSnakeCase(prop)}"`);
      placeholders.push(`$${placeholderIndex}`);
      placeholderIndex += 1;

      if (prop === 'location') {
        values.push(`(${value.x}, ${value.y})`);
      } else {
        values.push(value);
      }
    }

    const preparedQuery = {
      text: `INSERT INTO ${this.tableName}
              (${fields})
              VALUES (${placeholders})
              RETURNING *`,
      values,
    };

    const results = await this.client.query<T>(preparedQuery);

    const row = results.rows[0];
    return row ? (this.mapKeysToCamelCase(row) as T) : undefined;
  }

  async update(id: number, inputData: Partial<T>): Promise<T> {
    const fieldsAndPlaceHolders: string[] = [];
    const values: (string | number)[] = [];

    let placeholderIndex = 1;

    for (const [prop, value] of Object.entries(inputData)) {
      fieldsAndPlaceHolders.push(
        `"${this.toSnakeCase(prop)}"=$${placeholderIndex}`,
      );
      placeholderIndex += 1;

      if (prop === 'location') {
        values.push(`(${value.x}, ${value.y})`);
      } else {
        values.push(value);
      }
    }

    values.push(id);

    const preparedQuery = {
      text: `UPDATE "${this.tableName}"
              SET ${fieldsAndPlaceHolders}, "updated_at"=now() 
              WHERE id = $${placeholderIndex} 
              RETURNING *`,
      values,
    };

    const results = await this.client.query<T>(preparedQuery);

    const row = results.rows[0];
    return row ? (this.mapKeysToCamelCase(row) as T) : undefined;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.client.query(
      `DELETE FROM "${this.tableName}" WHERE id = $1`,
      [id],
    );

    return !!result.rowCount;
  }
}

export default CoreDataMapper;
