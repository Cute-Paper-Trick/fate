import { adminClient, jwtClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { authEnv } from '@/envs/cerberus';

// make sure to import from better-auth/react

export const authClient = createAuthClient({
  plugins: [jwtClient(), usernameClient(), adminClient()],
  //you can pass client configuration here
  baseURL: authEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
