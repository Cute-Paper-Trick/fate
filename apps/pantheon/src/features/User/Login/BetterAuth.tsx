'use client';

import { Button } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const UserLogin = memo<{ onClick?: () => void }>(({ onClick }) => {
  const { t } = useTranslate('auth');
  const posthog = usePostHog();
  const router = useRouter();

  const handleLogin = () => {
    posthog.capture('login_attempted', { spm: 'app.login_button' });
    router.replace('/auth/sign-in');
    onClick?.();
  };

  return (
    <Flexbox paddingBlock={12} paddingInline={16} width={'100%'}>
      <Button block onClick={handleLogin} type="primary">
        {t('login')}
      </Button>
    </Flexbox>
  );
});

export default UserLogin;
