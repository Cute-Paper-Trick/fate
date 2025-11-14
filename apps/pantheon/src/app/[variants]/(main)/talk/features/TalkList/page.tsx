'use client';
import { useTranslate } from '@tolgee/react';
import { Divider, List, Skeleton } from 'antd';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { TopicCreateInner } from '@/features/Talk/TalkCreate/topic-create-inner';
import { TopicDetail } from '@/features/Talk/TalkDetail';

import styles from './topic-list.module.scss';

interface TopicListProps {
  useTopicList: () => {
    topicListQuery: { data?: any[]; fetchNextPage: () => void };
    fetchNextPage: () => void;
    hasNextPage: boolean;
  };
}

export default function TopicList({ useTopicList }: TopicListProps) {
  const { t } = useTranslate('talk');

  const { topicListQuery: currentListQuery, fetchNextPage, hasNextPage } = useTopicList();
  const topicList = currentListQuery.data || [];

  const handleNextFetch = () => {
    currentListQuery.fetchNextPage?.();
    fetchNextPage?.();
  };

  const [createVisible, setCreateVisible] = useState(true);

  return (
    <div className={styles.topic_list_box}>
      <section className={styles.topic_main} id="scrollableDiv">
        <div>
          <TopicCreateInner onCreated={() => setCreateVisible(false)} open={createVisible} />

          <section className={styles.content_wrapper}>
            <InfiniteScroll
              dataLength={topicList.length}
              endMessage={<Divider plain>{t('comment.loading.end', '没有更多了')}</Divider>}
              hasMore={hasNextPage}
              loader={<Skeleton active avatar paragraph={{ rows: 1 }} />}
              next={handleNextFetch}
              scrollableTarget="scrollableDiv"
            >
              <List
                className={styles.topic_list}
                dataSource={topicList}
                renderItem={(item) => (
                  <List.Item key={item.id} style={{ padding: '0' }}>
                    <TopicDetail id={item.id} topic={item} />
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </section>
        </div>
      </section>
    </div>
  );
}
