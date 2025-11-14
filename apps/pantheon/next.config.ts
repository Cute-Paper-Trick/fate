import { withSentryConfig } from '@sentry/nextjs';
import { NextConfig } from 'next';
import { Rewrite } from 'next/dist/lib/load-custom-routes';

const nextConfig: NextConfig = {
  crossOrigin: 'anonymous',
  experimental: {
    authInterrupts: true,
  },
  serverExternalPackages: [
    'require-in-the-middle',
    '@mediapipe/pose',
    '@tensorflow-models/pose-detection',
    '@tensorflow-models/knn-classifier',
    '@tensorflow-models/mobilenet',
    '@tensorflow-models/speech-commands',
    '@tensorflow/tfjs',
    '@tensorflow/tfjs-backend-webgl',
  ],
  // Turbopack 在客户端自动忽略 Node.js 内置模块，无需手动配置
  async rewrites() {
    const rewrites: Rewrite[] = [
      {
        source: '/external/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ];

    return rewrites;
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/lab',
        permanent: true,
      },
    ];
  },

  turbopack: {
    resolveAlias: {
      'fs': './turbopack-empty-module.js',
      '@mediapipe/pose': './turbopack-empty-module.js',
    },
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // 禁用 fs
        path: false, // 禁用 path
        os: false, // 禁用 os
      };
    }

    return config;
  },
};

const withSentry = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'jc-3c',

  project: 'pantheon',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});

export default withSentry;
