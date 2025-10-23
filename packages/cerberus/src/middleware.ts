import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
import debug from "debug";
import { authEnv } from "@/envs/auth";
import { auth } from "@/lib/auth";

const logDefault = debug("middleware:default");
const logBetterAuth = debug("middleware:better-auth");
const logAuthApi = debug("middleware:auth-api");

const backendApiEndpoints: string[] = [];

function defaultMiddleware(request: NextRequest) {
  const url = new URL(request.url);
  logDefault("Processing request: %s %s", request.method, request.url);

  // skip all auth api requests
  if (backendApiEndpoints.some((path) => url.pathname.startsWith(path))) {
    logDefault("Skipping  backend API request: %s", url.pathname);
    return NextResponse.next();
  }

  return NextResponse.next();
}

function authApiMiddleware(request: NextRequest) {
  logAuthApi("Skipping BetterAuth request: %s %s", request.method, request.url);

  return NextResponse.next();
}

function betterAuthMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

async function apiKeyAuthMiddleware(request: NextRequest) {
  const apiKey = request.headers.get(authEnv.BETTER_AUTH_API_KEY_HEADER);

  console.log('apiKey >>>>>>.', apiKey);

  try {
    const session = await auth.api.getSession(request);
    if (session == null) {
      return NextResponse.json(
        { verified: false, error: "Invalid API Key" },
        { status: 401 }
      );
    }
    console.log('session >>>>>>> ', session);
  } catch (err) {
    console.error('eeeee', err);
    throw err;
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  defaultMiddleware(request);

  const url = new URL(request.url);

  if (url.pathname.startsWith(`/api/auth`)) {
    return authApiMiddleware(request);
  }

  if (url.pathname.startsWith(`/api/verify`)) {
    return apiKeyAuthMiddleware(request);
  }

  // return betterAuthMiddleware(request);
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/verify", "/api/auth(.*)"],
};
