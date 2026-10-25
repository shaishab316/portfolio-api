import { loadEnvironment } from './src/config/env.loader';
import { defineConfig } from 'drizzle-kit';

loadEnvironment();

export default defineConfig({
  schema: './src/database/schema/**/*.schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
