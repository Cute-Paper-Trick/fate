import { jwtClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

// make sure to import from better-auth/react

export const authClient = createAuthClient({
  plugins: [jwtClient(), usernameClient()],
  //you can pass client configuration here
  // baseURL: 'http://localhost:5090',
});

export const { signIn, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
