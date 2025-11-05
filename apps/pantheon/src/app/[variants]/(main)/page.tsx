'use client';
import { useEffect } from 'react';

import { $client } from '@/lib/api';

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      const { data: res } = await $client.POST('/api/model/list', { body: {} });
      console.log('Model List:', res);
    };

    fetchData();
  }, []);

  // const { data, isLoading } = $api.useQuery('post', '/api/model/list', { body: {} });
  // console.log('modelQuery', data, isLoading);

  return (
    <main className="container mx-auto flex flex-col gap-4 p-6">
      <h1 className="font-bold text-2xl">Hello, world.</h1>
    </main>
  );
}
