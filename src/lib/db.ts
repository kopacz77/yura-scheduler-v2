import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// Utility function for transactions
export async function withTransaction<T>(
  fn: (db: typeof global.db) => Promise<T>
): Promise<T> {
  const result = await sql.transaction(async (tx) => {
    const transactionDb = drizzle(tx);
    return await fn(transactionDb);
  });
  return result;
}