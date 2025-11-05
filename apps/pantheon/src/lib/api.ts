import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

import { appEnv } from '@/envs/app';
import { paths } from '@/types/api/schema.generated';

// const middleware: Middleware = {
//   // async onRequest({ request }) {
//   //   // if (!token) {
//   //   //   const res = await authClient.token();
//   //   //   token = res.data?.token || '';
//   //   //   localStorage.setItem('pantheon_token', token);
//   //   // }

//   //   request.headers.set('Authorization', `Bearer ${token}`);
//   //   return request;
//   // },
//   // async onResponse({ response }) {
//   //   const data = await response.clone().json();
//   //   console.log('API Response:', data);
//   //   return new Response(JSON.stringify(data.data));
//   // },
// };

const fetchClient = createFetchClient<paths>({
  baseUrl: appEnv.NEXT_PUBLIC_BACKEND_URL,
});

// fetchClient.use(middleware);

export const $client = fetchClient;

export const $api = createClient(fetchClient);
