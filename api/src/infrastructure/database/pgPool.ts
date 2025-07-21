import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.DB_USER || 'rick',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'rickandmorty',
  password: process.env.DB_PASSWORD || 'morty',
  port: Number(process.env.DB_PORT) || 5432,
});
