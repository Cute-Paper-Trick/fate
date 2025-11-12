'use client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import { Divider, List, Skeleton, Tabs, type TabsProps } from 'antd';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// import AppNavigationDrawer from '@/app/[variants]/(main)/talk/features/TopicSideMenu';
// import { talkSelectors } from '@/store/talk/selectors';
// import { useTalkStore } from '@/store/talk/store';
import { TopicCreateInner } from '@/features/Talk/TalkCreate/topic-create-inner';
import { TopicDetail } from '@/features/Talk/TalkDetail';
import { getNextPageParam } from '@/features/Talk/TalkDetail/components/useInfiniteList';
import { V1TaskTopicInfo, accountService, taskTopicService } from '@/lib/http';

import styles from './topic-list.module.scss';

function useTopicList({
  type,
  currentUserId,
}: {
  type: 'all' | 'mine';
  currentUserId?: number | null;
}) {
  const queryKey = ['topic', 'list', type, type === 'mine' ? currentUserId : undefined];
  const enabled = type === 'all' || (type === 'mine' && !!currentUserId);
  const topicListQuery = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => taskTopicService().taskTopicList(pageParam),
    initialPageParam: { page: 1, size: 20 },
    getNextPageParam: getNextPageParam,
    select: (data) => {
      const allTopics = data.pages.flatMap((d) => d.list);

      if (type === 'mine' && currentUserId) {
        return allTopics.filter((topic) => (topic as V1TaskTopicInfo).account_id === currentUserId);
      }
      return allTopics;
    },
    staleTime: 300_000,
    enabled: enabled,
  });
  return { topicListQuery };
}

//获取"我的"分页等信息
function usePaginationStatus({
  type,
  currentUserId,
  enabled,
}: {
  type: 'all' | 'mine';
  currentUserId?: number | null;
  enabled: boolean;
}) {
  const useAccountApi = type === 'mine';
  const queryKey = ['topic', 'pagination', type, type === 'mine' ? currentUserId : undefined];
  const paginationQuery = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      if (useAccountApi) {
        return accountService().accountTopicList(pageParam);
      } else {
        return taskTopicService().taskTopicList(pageParam);
      }
    },
    initialPageParam: { page: 1, size: 20 },
    getNextPageParam: getNextPageParam,
    staleTime: 0,
    enabled: enabled,
    select: () => undefined,
  });

  return {
    hasNextPage: paginationQuery.hasNextPage,
    isFetching: paginationQuery.isFetching,
    fetchNextPage: paginationQuery.fetchNextPage,
  };
}

export default function TopicList() {
  // const topicListing = useTalkStore(talkSelectors.topicListing);
  // const usetopicList = useTalkStore((s) => s.useFetchTaskTopicList);

  // const getList = useTaskTopicAdd({
  //   mutation: {
  //     onMutate: (_, context) => {
  //       context.client.invalidateQueries({ queryKey: ['task', 'list'] });
  //     },
  //   },
  // });
  // const { data: topicListNew } = usetopicList({ page: 1, size: 20 });
  const { t } = useTranslate('talk');

  const useProfile = useQuery({
    queryKey: ['profile'],
    queryFn: async () => accountService().accountProfile(),
  });

  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };
  const isHome = activeTab === '1';
  const type = isHome ? 'all' : 'mine';

  const currentUserId = useProfile.data?.id;
  const { topicListQuery: currentListQuery } = useTopicList({ type, currentUserId });
  const topicList = currentListQuery.data || [];

  const { hasNextPage: hasNextPageStatus, fetchNextPage: fetchNextPageStatus } =
    usePaginationStatus({
      type: type,
      currentUserId: currentUserId,
      enabled: !isHome && !!currentUserId,
    });
  const hasMore = isHome ? currentListQuery.hasNextPage : hasNextPageStatus;

  const handleNextFetch = () => {
    if (isHome) {
      currentListQuery.fetchNextPage();
    } else {
      currentListQuery.fetchNextPage();
      fetchNextPageStatus();
    }
  };

  const [createVisible, setCreateVisible] = useState(true);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span
          onClick={() => {
            handleTabChange('1');
          }}
        >
          {t('talk.list.chat.title', '畅聊')}
        </span>
      ),
      children: (
        <>
          <TopicCreateInner onCreated={() => setCreateVisible(false)} open={createVisible} />

          <section className={styles.content_wrapper}>
            <InfiniteScroll
              dataLength={topicList.length}
              endMessage={<Divider plain>{t('comment.loading.end', '没有更多了')}</Divider>}
              hasMore={hasMore}
              loader={<Skeleton active avatar paragraph={{ rows: 1 }} />}
              next={handleNextFetch}
              scrollableTarget="scrollableDiv"
              // scrollThreshold="90%"
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
        </>
      ),
    },
    // {
    //   key: '2',
    //   label: t('talk.list.chat.text_mission', '文本任务'),
    //   children: (
    //     <>
    //       <TopicCreateInner onCreated={() => setCreateVisible(false)} open={createVisible} />

    //       <section className={styles.content_wrapper}>
    //         <InfiniteScroll
    //           dataLength={topicList.length}
    //           endMessage={<Divider plain>{t('comment.loading.end', '没有更多了')}</Divider>}
    //           hasMore={hasMore}
    //           loader={<Skeleton active avatar paragraph={{ rows: 1 }} />}
    //           next={handleNextFetch}
    //           scrollableTarget="scrollableDiv"
    //           // scrollThreshold="90%"
    //         >
    //           <List
    //             className={styles.topic_list}
    //             dataSource={topicList}
    //             renderItem={(item) => (
    //               <List.Item key={item.id} style={{ padding: '0' }}>
    //                 <TopicDetail id={item.id} topic={item} />
    //               </List.Item>
    //             )}
    //           />
    //         </InfiniteScroll>
    //       </section>
    //     </>
    //   ),
    // },
    // {
    //   key: '3',
    //   label: t('talk.list.chat.vocal_mission', '音频任务'),
    //   children: (
    //     <>
    //       <TopicCreateInner onCreated={() => setCreateVisible(false)} open={createVisible} />

    //       <section className={styles.content_wrapper}>
    //         <InfiniteScroll
    //           dataLength={topicList.length}
    //           endMessage={<Divider plain>{t('comment.loading.end', '没有更多了')}</Divider>}
    //           hasMore={hasMore}
    //           loader={<Skeleton active avatar paragraph={{ rows: 1 }} />}
    //           next={handleNextFetch}
    //           scrollableTarget="scrollableDiv"
    //           // scrollThreshold="90%"
    //         >
    //           <List
    //             className={styles.topic_list}
    //             dataSource={topicList}
    //             renderItem={(item) => (
    //               <List.Item key={item.id} style={{ padding: '0' }}>
    //                 <TopicDetail id={item.id} topic={item} />
    //               </List.Item>
    //             )}
    //           />
    //         </InfiniteScroll>
    //       </section>
    //     </>
    //   ),
    // },
    // {
    //   key: '4',
    //   label: t('talk.list.chat.video_mission', '视频任务'),
    //   children: (
    //     <>
    //       <TopicCreateInner onCreated={() => setCreateVisible(false)} open={createVisible} />

    //       <section className={styles.content_wrapper}>
    //         <InfiniteScroll
    //           dataLength={topicList.length}
    //           endMessage={<Divider plain>{t('comment.loading.end', '没有更多了')}</Divider>}
    //           hasMore={hasMore}
    //           loader={<Skeleton active avatar paragraph={{ rows: 1 }} />}
    //           next={handleNextFetch}
    //           scrollableTarget="scrollableDiv"
    //           // scrollThreshold="90%"
    //         >
    //           <List
    //             className={styles.topic_list}
    //             dataSource={topicList}
    //             renderItem={(item) => (
    //               <List.Item key={item.id} style={{ padding: '0' }}>
    //                 <TopicDetail id={item.id} topic={item} />
    //               </List.Item>
    //             )}
    //           />
    //         </InfiniteScroll>
    //       </section>
    //     </>
    //   ),
    // },
    {
      key: '5',
      label: (
        <span
          onClick={() => {
            handleTabChange('2');
          }}
        >
          {t('talk.list.chat.mine', '我的')}
        </span>
      ),
      children: (
        <>
          <TopicCreateInner onCreated={() => setCreateVisible(false)} open={createVisible} />

          <section className={styles.content_wrapper}>
            <InfiniteScroll
              dataLength={topicList.length}
              endMessage={<Divider plain>{t('comment.loading.end', '没有更多了')}</Divider>}
              hasMore={hasMore}
              loader={<Skeleton active avatar paragraph={{ rows: 1 }} />}
              next={handleNextFetch}
              scrollableTarget="scrollableDiv"
              // scrollThreshold="90%"
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
        </>
      ),
    },
  ];

  return (
    <div className={styles.topic_list_box}>
      {/* <section className={styles.topic_side}>
        <Menu
          {...options}
          items={groupItems}
          onClick={({ key }) => setActiveKey(key)}
          selectedKeys={activeKey ? [activeKey] : undefined}
        />
        <AppNavigationDrawer currentTab={activeTab} onTabChange={handleTabChange} />
      </section> */}

      <section className={styles.topic_main} id="scrollableDiv">
        <Tabs defaultActiveKey="1" items={items} />
      </section>
    </div>
  );
}
