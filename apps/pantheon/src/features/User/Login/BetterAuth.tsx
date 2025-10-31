'use client';

import { Button } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { usePostHog } from 'posthog-js/react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import LoginModal from './LoginModal';

const UserLogin = memo<{ onClick?: () => void }>(({ onClick }) => {
  const { t } = useTranslate('auth');
  const posthog = usePostHog();
  const [showModal, setShowModal] = useState(false);

  const handleLogin = () => {
    posthog.capture('login_attempted', { spm: 'app.login_button' });
    setShowModal(true);
    onClick?.();
  };

  return (
    <>
      <Flexbox paddingBlock={12} paddingInline={16} width={'100%'}>
        <Button block onClick={handleLogin} type="primary">
          {t('login')}
        </Button>
      </Flexbox>
      <LoginModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
});

UserLogin.displayName = 'UserLogin';

export default UserLogin;
