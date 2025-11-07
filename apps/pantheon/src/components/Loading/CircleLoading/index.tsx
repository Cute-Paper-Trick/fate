'use client';

import { Icon, Text } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { LoaderCircle } from 'lucide-react';
import { Center, Flexbox } from 'react-layout-kit';

const CircleLoading = () => {
  const { t } = useTranslate('common');
  return (
    <Center height={'100%'} width={'100%'}>
      <Flexbox align={'center'} gap={8}>
        <div>
          <Icon icon={LoaderCircle} size={'large'} spin />
        </div>
        <Text style={{ letterSpacing: '0.1em' }} type={'secondary'}>
          {t('loading')}
        </Text>
      </Flexbox>
    </Center>
  );
};

export default CircleLoading;
