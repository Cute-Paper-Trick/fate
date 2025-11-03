'use client';

import { useEffect } from 'react';

import { authClient, useSession } from '@/features/cerberus/client';

export default function Home() {
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
