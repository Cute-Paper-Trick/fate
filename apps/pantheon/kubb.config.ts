import { defineConfig } from '@kubb/core';
// import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginClient } from '@kubb/plugin-client';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

// import { defineFileTransformPlugin } from './kubb-plugins';

export default defineConfig({
  input: {
    path: './api.json',
  },
  output: {
    clean: true,
    extension: {
      '.ts': '',
    },
    path: 'src/lib/openapi',
  },
  plugins: [
    // 自定义插件：在 pluginOas 之前运行，转换非标准的 type: "file" 为标准格式
    // defineFileTransformPlugin({
    //   verbose: true, // 开启日志输出，查看转换过程
    // }),
    pluginOas({
      // validate: false, // 跳过 OpenAPI 规范验证
    }),
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
      // transformers: {
      //   name: (name) => `${name}Client`,
      // },
      operations: true,
      parser: 'client',
      // pathParamsType: 'object',
      dataReturnType: 'data',
      client: 'axios',
    }),
    // pluginReactQuery({
    //   client: {
    //     dataReturnType: 'data',
    //   },
    //   group: {
    //     name: ({ group }) => `${group}Hooks`,
    //     type: 'tag',
    //   },
    //   mutation: {
    //     methods: ['put', 'patch', 'delete'],
    //   },
    //   output: {
    //     banner: '/* eslint-disable @typescript-eslint/no-explicit-any */',
    //     path: 'hooks',
    //   },
    //   override: [
    //     {
    //       options: {
    //         mutation: false,
    //       },
    //       pattern: /list/,
    //       type: 'operationId',
    //     },
    //   ],
    //   query: {
    //     methods: ['get', 'post'],
    //   },
    // }),
  ],
  root: '.',
});
