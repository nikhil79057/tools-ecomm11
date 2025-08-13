import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  throw new Error(
    "DATABASE_URL or DB credentials must be set. Did you forget to provision a database?",
  );
}

// Build connection string from individual credentials if DATABASE_URL not provided
const connectionString = process.env.DATABASE_URL || 
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const connection = mysql.createPool(connectionString);
export const db = drizzle(connection, { schema });