import { Button } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import { message } from '@/components/AntdStaticMethods';
import {
  collectionsDetailQueryKey,
  useCollectionSubscriptionsSubscribe,
  useCollectionSubscriptionsUnsubscribe,
  useCollectionsDetail,
} from '@/lib/http';
import { queryClient } from '@/lib/query';

const useStyles = createStyles(({ css }) => ({
  sub: css``,
  cancel: css``,
}));

const CollectionSubscription = memo(() => {
  const { styles, cx } = useStyles();

  const [id] = useQueryState('collectionId', parseAsInteger);

  const { data, isPending } = useCollectionsDetail(
    { id: id! },
    { query: { enabled: Boolean(id) } },
  );

  const collection = data?.collection;

  const subscribed = collection?.is_subscribed ?? false;
  const subscription = collection?.subscribe_count ?? 0;

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: collectionsDetailQueryKey({ id: id! }) });
  };

  const subscribe = useCollectionSubscriptionsSubscribe({
    mutation: {
      onSuccess: () => {
        message.success('关注成功');
        refetch();
      },
    },
  });

  const unsubscribe = useCollectionSubscriptionsUnsubscribe({
    mutation: {
      onSuccess: () => refetch(),
    },
  });

  const onClick = () => {
    if (subscribed) {
      unsubscribe.mutate({ data: { collection_id: id! } });
      return;
    }

    subscribe.mutate({ data: { collection_id: id! } });
  };

  if (!id || isPending) {
    return <Skeleton.Button />;
  }

  return (
    <Center gap={16} horizontal>
      {subscription} 人已订阅
      <Button
        className={cx(!subscribed && styles.sub, subscribed && styles.cancel)}
        loading={subscribe.isPending || unsubscribe.isPending}
        onClick={onClick}
        variant={subscribed ? 'filled' : 'outlined'}
      >
        {subscribed ? '已订阅' : '订阅'}
      </Button>
    </Center>
  );
});

export default CollectionSubscription;
