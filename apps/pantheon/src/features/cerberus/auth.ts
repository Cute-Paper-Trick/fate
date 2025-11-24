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

import { appEnv } from '@/envs/app';
import { authEnv } from '@/envs/cerberus';
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/email';

import { db } from './db';

export const auth = betterAuth({
  baseURL: `${authEnv.APP_URL}/api/auth`,
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  databaseHooks: {
    user: {
      update: {
        after: async (user) => {
          fetch(`${appEnv.NEXT_PUBLIC_BACKEND_URL}/api/account/change_nickname`, {
            method: 'POST',
            body: JSON.stringify({
              accountKey: user.id,
              nickname: /^\d+$/.test(user.name)
                ? user.name.replace(/^\d+/, '*')
                : user.name || '未设置昵称',
              code: appEnv.BACKEND_SECRET_CODE,
            }),
          });
        },
      },
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        const res = await sendVerificationEmail({ email: newEmail, verificationLink: url });
        console.log(res);
      },
      sendOnSignIn: true,
    },
  },
  advanced: {
    useSecureCookies: true,
    cookiePrefix: 'fate',
    crossSubDomainCookies: {
      enabled: true,
      domain: appEnv.COOKIE_DOMAIN,
    },
  },
  trustedOrigins: [appEnv.APP_URL, appEnv.NEXT_PUBLIC_BACKEND_URL, appEnv.NEXT_PUBLIC_CHAT_APP_URL],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.log('Sending verification email to:', user.email, 'with url:', url);
      const res = await sendVerificationEmail({
        email: user.email,
        verificationLink: url,
      });
      console.log(res);
    },
    sendOnSignIn: true,
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      console.log('Sending reset password email to:', user.email, 'with url:', url);
      await sendResetPasswordEmail({ email: user.email, resetPasswordLink: url });
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
    username({
      minUsernameLength: 1,
      usernameValidator: (username) => /^[a-zA-Z0-9_.\u4E00-\u9FA5-]{1,30}$/.test(username),
    }),
    admin({
      adminRoles: authEnv.BETTER_AUTH_ADMIN_ROLES?.split(',').map((role) => role.trim()),
    }),
    organization(),
    lastLoginMethod(),
    openAPI(),
  ],
});

export type Session = typeof auth.$Infer.Session;
