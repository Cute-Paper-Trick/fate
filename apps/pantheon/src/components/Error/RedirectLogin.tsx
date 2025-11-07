import { useTranslate } from '@tolgee/react';
import { useTimeout } from 'ahooks';
import { memo } from 'react';

import { authClient } from '@/features/cerberus/client';

const RedirectLogin = memo<{ timeout: number }>(({ timeout = 2000 }) => {
  const { signOut } = authClient;
  const { t } = useTranslate('error');

  useTimeout(() => {
    signOut();
  }, timeout);

  return <div style={{ cursor: 'pointer', fontSize: 12 }}>{t('loginRequired.desc')}</div>;
});

export default RedirectLogin;
