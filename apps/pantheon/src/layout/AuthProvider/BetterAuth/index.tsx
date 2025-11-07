'use client';

import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { authClient } from '@/features/cerberus/client';

import UserUpdater from './UserUpdater';

function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { t } = useTranslate('auth');
  return (
    <AuthUIProvider
      Link={Link}
      authClient={authClient}
      avatar={{
        upload: async (file: File) => {
          console.log(file);
          return undefined;
        },
      }}
      credentials={{ username: true, rememberMe: true }}
      localization={{
        USERNAME: t('username'),
        PASSWORD: t('password'),
        SIGN_IN: t('sign_in'),
        SIGN_IN_DESCRIPTION: t('sign_in_description'),
        SIGN_UP: t('sign_up'),
        FORGOT_PASSWORD: t('forgot_password'),
        EMAIL_PLACEHOLDER: t('email_placeholder'),
        PASSWORD_PLACEHOLDER: t('password_placeholder'),
        MAGIC_LINK_EMAIL: t('magic_link_email'),
        FORGOT_PASSWORD_EMAIL: t('forgot_password_email'),
        FORGOT_PASSWORD_LINK: t('forgot_password_link'),
        RESET_PASSWORD_SUCCESS: t('reset_password_success'),
        CHANGE_PASSWORD_SUCCESS: t('change_password_success'),
        DELETE_ACCOUNT_SUCCESS: t('delete_account_success'),
        PASSWORD_REQUIRED: t('password_required'),
      }}
      navigate={router.push}
      onSessionChange={() => {
        router.refresh();
      }}
      replace={router.replace}
      signUp={false}
    >
      {children}
      <UserUpdater />
    </AuthUIProvider>
  );
}

export default AuthProvider;
