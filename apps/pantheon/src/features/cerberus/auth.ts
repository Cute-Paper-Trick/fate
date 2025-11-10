import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  apiKey,
  jwt,
  lastLoginMethod,
  openAPI,
  organization,
  username,
} from 'better-auth/plugins';

import { authEnv } from '@/envs/cerberus';
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/email';

import { db } from './db';

export const auth = betterAuth({
  baseURL: `${authEnv.APP_URL}/api/auth`,
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  user: {
    changeEmail: {
      enabled: true,
      // sendChangeEmailVerification: async ({ user, newEmail, url }) => {
      //   await sendVerificationEmail(newEmail, url);
      // },
      sendOnSignIn: true,
    },
  },
  advanced: {
    useSecureCookies: true,
    cookiePrefix: 'fate',
    crossSubDomainCookies: {
      enabled: true,
      domains: ['.vercel.app', '.chieh.ren', 'localhost', '.goood.space'],
    },
  },
  trustedOrigins: [
    authEnv.APP_URL,
    'http://localhost:5090',
    'https://dev-daily-backend.goood.space',
  ],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.log('Sending verification email to:', user.email, 'with url:', url);
      await sendVerificationEmail(user.email, url);
    },
    sendOnSignIn: true,
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      console.log('Sending reset password email to:', user.email, 'with url:', url);
      await sendResetPasswordEmail(user.email, url);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 60 * 24,
    // 启用 cookie 缓存以提高性能
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  plugins: [
    nextCookies(),
    jwt({
      jwt: {
        issuer: authEnv.APP_URL,
        audience: authEnv.APP_URL,
      },
    }),
    apiKey({
      disableKeyHashing: false,
      enableSessionForAPIKeys: true,
      apiKeyHeaders: [authEnv.BETTER_AUTH_API_KEY_HEADER],
    }),
    username(),
    admin({
      adminRoles: authEnv.BETTER_AUTH_ADMIN_ROLES?.split(',').map((role) => role.trim()),
    }),
    organization(),
    lastLoginMethod(),
    openAPI(),
  ],
});

export type Session = typeof auth.$Infer.Session;
