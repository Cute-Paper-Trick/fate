'use client';

import { UpdateAvatarCard, UpdateNameCard } from '@daveyplate/better-auth-ui';
import { Skeleton } from 'antd';
import { memo } from 'react';

const Client = memo<{ mobile?: boolean }>(({ mobile }) => {
  const loading = false;

  if (loading) {
    return (
      <Skeleton
        active
        paragraph={{ rows: 6 }}
        style={{ padding: mobile ? 16 : undefined }}
        title={false}
      />
    );
  }
  return (
    <>
      <UpdateAvatarCard localization={{}} />
      <UpdateNameCard />
    </>
  );
});

Client.displayName = 'ProfileHomeClient';

export default Client;
