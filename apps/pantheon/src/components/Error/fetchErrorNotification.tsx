import { FluentEmoji } from '@lobehub/ui';
import { T } from '@tolgee/react';

import { notification } from '@/components/AntdStaticMethods';

import Description from './Description';

export const fetchErrorNotification = {
  error: ({ status, errorMessage }: { errorMessage: string; status: number }) => {
    notification.error({
      description: <Description message={errorMessage} status={status} />,
      icon: <FluentEmoji emoji={'🤧'} size={24} />,
      message: (
        <T key="fetchError.title" ns="error">
          Error
        </T>
      ),
      type: 'error',
    });
  },
};
