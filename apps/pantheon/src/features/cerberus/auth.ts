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

import { db } from './db';

export const auth = betterAuth({
  baseURL: `${authEnv.APP_URL}/api/auth`,
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  advanced: {
    cookiePrefix: 'fate',
    crossSubDomainCookies: {
      enabled: true,
      domains: ['.vercel.app', '.chieh.ren', 'localhost'],
    },
  },
  trustedOrigins: [
    authEnv.APP_URL,
    'http://localhost:5090',
    'http://localhost:3000',
    'https://fate-pantheon.chieh.ren',
  ],
  emailAndPassword: {
    enabled: true,
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
