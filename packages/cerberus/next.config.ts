import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  // crossOrigin: 'anonymous',
  // async headers() {
  //   return [
  //     {
  //       source: "/api/auth/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "http://localhost:5090" },
  //         { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
  //         { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, x-api-key" },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
