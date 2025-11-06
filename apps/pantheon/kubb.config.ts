import { defineConfig } from '@kubb/core';
import { pluginClient } from '@kubb/plugin-client';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

export default defineConfig({
  input: {
    path: './api.json',
  },
  output: {
    clean: true,
    extension: {
      '.ts': '',
    },
    path: 'src/lib/blueprint/generated',
  },
  plugins: [
    pluginOas(),
    pluginTs({
      dateType: 'date',
      enumType: 'asConst',
      group: {
        name: ({ group }) => `${group}Types`,
        type: 'tag',
      },
      optionalType: 'questionTokenAndUndefined',
      output: {
        banner: '/* eslint-disable @typescript-eslint/no-explicit-any */',
        path: 'types',
      },
      unknownType: 'unknown',
    }),
    pluginZod({
      dateType: 'stringOffset',
      group: {
        name: ({ group }) => `${group}Schemas`,
        type: 'tag',
      },
      output: {
        banner: '/* eslint-disable @typescript-eslint/no-explicit-any */',
        path: 'zod',
      },
      typed: true,
      unknownType: 'unknown',
    }),
    pluginClient({
      output: {
        path: 'clients/axios',
        barrelType: 'named',
        banner: '/* eslint-disable no-alert, no-console */',
      },
      group: {
        name: ({ group }) => `${group}Service`,
        type: 'tag',
      },
      operations: true,
      parser: 'client',
      dataReturnType: 'data',
      importPath: '@/lib/http/fetcher',
    }),
    pluginReactQuery({
      client: {
        dataReturnType: 'data',
        importPath: '@/lib/http/fetcher',
      },
      group: {
        name: ({ group }) => `${group}Hooks`,
        type: 'tag',
      },
      // mutation: {
      //   methods: ['put', 'patch', 'delete', 'post'],
      // },
      output: {
        banner: '/* eslint-disable @typescript-eslint/no-explicit-any */',
        path: 'hooks',
      },
      override: [
        {
          options: {
            mutation: false,
          },
          pattern: /list/,
          type: 'operationId',
        },
      ],
      // query: {
      //   methods: ['get', 'post'],
      // },
    }),
  ],
  root: '.',
});
