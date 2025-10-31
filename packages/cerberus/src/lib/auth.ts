import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  apiKey,
  username,
  admin,
  organization,
  deviceAuthorization,
  lastLoginMethod,
  openAPI,
  jwt,
} from "better-auth/plugins";
import { authEnv } from "@/envs/auth";
import { db } from "./db";

export const auth = betterAuth({
  advanced: {
    cookiePrefix: 'fate'
  },
  baseURL: authEnv.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  plugins: [
    jwt(),
    openAPI(),
    apiKey({
      disableKeyHashing: false,
      enableSessionForAPIKeys: true,
      apiKeyHeaders: [authEnv.BETTER_AUTH_API_KEY_HEADER],
    }),
    username(),
    admin({
      adminRoles: authEnv.BETTER_AUTH_ADMIN_ROLES?.split(",").map((role) =>
        role.trim()
      ),
    }),
    organization(),
    deviceAuthorization(),
    lastLoginMethod(),
  ],
  emailAndPassword: {
    enabled: true,
  },
});
