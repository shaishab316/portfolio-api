import { betterAuth } from 'better-auth';
import { type DB, drizzleAdapter } from '@better-auth/drizzle-adapter';
import { admin, magicLink, twoFactor } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import * as schema from '../database/schema';

export function createAuth({
  db,
  sendEmail,
}: {
  db: DB;
  sendEmail: ({}: any) => Promise<any>;
}) {
  return betterAuth({
    appName: 'shaishab316.me',

    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,

    trustedOrigins: [process.env.FRONTEND_URL!],

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,

      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: 'Reset your password',
          text: `Reset your password: ${url}`,
        });
      },
    },

    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: 'Verify your email',
          text: `Verify your email: ${url}`,
        });
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },

    plugins: [
      admin(),

      twoFactor({
        issuer: 'shaishab316.me',
      }),

      magicLink({
        expiresIn: 5 * 60,

        sendMagicLink: async ({ email, url }) => {
          await sendEmail({
            to: email,
            subject: 'Your sign-in link',
            text: `Sign in to your account: ${url}`,
          });
        },
      }),

      passkey(),
    ],

    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },
  });
}
