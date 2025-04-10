import debug from 'debug';
import pg from 'pg';
import type { Queryable } from '../../../../@types/db';

const log = debug('app:datasource:restodb');

const pool = new pg.Pool();

let queryCount = 0;

/* database connection test */
(async () => {
  try {
    const client = await pool.connect();
    log('✅ Connexion à la base de données réussie !');
    client.release();
  } catch (err) {
    log('❌ Erreur de connexion à la base de données :', err);
  }
})();

export default {
  originalClient: pool,
  async query(query, valuesArray) {
    const text = (query instanceof Object ? query.text : query)
      .replace(/\s+/g, ' ')
      .trim();
    const values = query instanceof Object ? query.values : valuesArray;
    log(text);
    log(values);
    queryCount += 1;
    log(`Requête n°${queryCount}`);
    return this.originalClient.query(text, values);
  },
} as Queryable;
