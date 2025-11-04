'use client';

import { useEffect } from 'react';

import { authClient, useSession } from '@/features/cerberus/client';
// import { $api } from '@/lib/api';
import { paths } from '@/types/api/schema';

export default function Home() {
  // const { data } = $api.useQuery('post', '/api/model/list', {});
  useEffect(() => {
    const fetchToken = async () => {
      const token = await authClient.token();
      console.log('Auth Token:', token);

      const res = await fetch('https://dev-daily-backend.goood.space/api/model/list', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.data?.token}`,
        },
      });
      const data: paths['/api/model/list']['post']['responses']['200']['content']['application/json'] =
        await res.json();

      console.log(res);
    };
    fetchToken();
  }, []);

  return (
    <main className="container mx-auto flex flex-col gap-4 p-6">
      <h1 className="font-bold text-2xl">Hello, world.</h1>
    </main>
  );
}
