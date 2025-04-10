import type { Pool, QueryResult } from 'pg';

export type SQLQuery = string | { text: string; values?: unknown[] };

export type Queryable = {
  originalClient: Pool;
  query<T = unknown>(
    query: SQLQuery,
    valuesArray?: unknown[],
  ): Promise<QueryResult<T>>;
};

export type DBConfig = {
  client?: Queryable;
};
