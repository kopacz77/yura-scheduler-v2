import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.NEON_DATABASE_URL!);

// Type assertion to resolve the Neon type mismatch
export const db = drizzle(sql as any);

// For type safety in queries, we can create a typed version
export type Database = typeof db;