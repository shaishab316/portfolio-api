import { betterAuth } from 'better-auth';
import { type DB, drizzleAdapter } from '@better-auth/drizzle-adapter';
import { admin } from 'better-auth/plugins';
import * as schema from '../database/schema';

export function createAuth(db: DB) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,

    trustedOrigins: ['http://localhost:8001'],

    emailAndPassword: {
      enabled: true,
    },

    plugins: [admin()],
  });
}
