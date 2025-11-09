'use client';

import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { authClient } from '@/features/cerberus/client';
import SonnerProvider from '@/layout/GlobalProvider/Sonner';
import { accountService } from '@/lib/http';

import { useLocalization } from './useLocalization';
import UserUpdater from './UserUpdater';

function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const localization = useLocalization();
  return (
    <AuthUIProvider
      Link={Link}
      authClient={authClient}
      avatar={{
        upload: async (file: File) => {
          console.log(file);
          const res = await accountService().accountAvatar(
            { file },
            { headers: { 'Content-Type': 'multipart/form-data' } },
          );
          return res.avatar;
        },
      }}
      credentials={{ username: true, rememberMe: true }}
      localization={localization}
      navigate={router.push}
      onSessionChange={() => {
        router.refresh();
      }}
      replace={router.replace}
      signUp={false}
    >
      <SonnerProvider>{children}</SonnerProvider>
      <UserUpdater />
    </AuthUIProvider>
  );
}

export default AuthProvider;
