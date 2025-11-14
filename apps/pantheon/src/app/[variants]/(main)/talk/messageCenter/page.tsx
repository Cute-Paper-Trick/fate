'use client';
import { useTranslate } from '@tolgee/react';
import { Avatar, List, Modal, Space, Typography } from 'antd';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Flexbox } from 'react-layout-kit';

import { TopicDetail } from '@/features/Talk/TalkDetail';
import { useMessageCenterStore } from '@/store/messageCenter/store';

import styles from './page.module.scss';

const { Text, Paragraph } = Typography;

const getTextByType = (type: any, t: any) => {
  switch (type) {
    case 'comment': {
      return t('message.type.comment', '对我的话题发表了评论');
    }
    case 'reply': {
      return t('message.type.reply', '回复了我的评论');
    }
    case 'like': {
      return t('message.type.like', '点赞了我的话题');
    }
    default: {
      return '';
    }
  }
};

const InteractionList: React.FC = () => {
  const [page, setPage] = useState(1);
  const size = 20;
  const [allData, setAllData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const useFetchMessageList = useMessageCenterStore((s) => s.useFetchMessageList);
  const useGetTopicDetail = useMessageCenterStore((s) => s.useGetTopicDetail);
  const { data, isFetching, isLoading } = useFetchMessageList({ page, size });
  const {
    data: topicData,
    isLoading: isTopicLoading,
    isFetching: isTopicFetching,
  } = useGetTopicDetail({ id: selectedItemId || 0 });
  const { t } = useTranslate('talk');

  // 处理数据加载
  useEffect(() => {
    if (data) {
      if (page === 1) {
        setAllData(data.list);
        setInitialLoaded(true);
      } else {
        setAllData((prev) => [...prev, ...data.list]);
      }
      // 检查是否还有更多数据
      setHasMore(data.list.length > 0 && allData.length + data.list.length < data.total);
    }
  }, [data, page]);

  // 加载更多数据
  const loadMoreData = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);
  // 处理列表项点击事件
  const handleItemClick = (id: number) => {
    setSelectedItemId(id);
    setModalVisible(true);
  };

  // 关闭模态框
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItemId(null);
  };

  return (
    <Flexbox height={'100%'} horizontal style={{ position: 'relative' }} width="100%">
      <div className={styles.interactionList} id="scrollableDiv">
        <div className={styles.listContent}>
          <InfiniteScroll
            dataLength={allData.length}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                {t('noMoreData', '没有更多数据了', { ns: 'common' })}
              </p>
            }
            hasMore={hasMore}
            loader={
              <h4 style={{ textAlign: 'center' }}>{t('loading', '加载中...', { ns: 'common' })}</h4>
            }
            next={loadMoreData}
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={allData}
              itemLayout="horizontal"
              loading={isLoading && !initialLoaded}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  onClick={() => handleItemClick(item.topic_id)}
                  style={{
                    padding: '16px',
                    background: 'rgb(255, 255, 255)',
                    minHeight: '104px',
                    cursor: 'pointer',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`${item.from_user.avatar || undefined}`}
                        style={{
                          width: 52,
                          height: 52,
                        }}
                      />
                    }
                    description={
                      <div>
                        {item.content && (
                          <Paragraph ellipsis={{ rows: 3 }} style={{ margin: '8px 0' }}>
                            {item.content}
                          </Paragraph>
                        )}

                        <Text style={{ fontSize: '12px' }} type="secondary">
                          {DateTime.fromISO(item.created_at, { zone: 'utc' })
                            .setZone('Asia/Shanghai')
                            .toFormat('DD')}
                        </Text>
                      </div>
                    }
                    title={
                      <Space size="middle">
                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                          {item.from_user.nickname}
                        </span>
                        <Text type={'secondary'}>{getTextByType(item.type, t)}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
        <Modal
          footer={null}
          onCancel={handleModalClose}
          open={modalVisible}
          styles={{
            body: {
              maxHeight: '70vh',
              overflowY: 'auto',
              borderRadius: '4px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            },
          }}
          title={t('message.modal.title', '消息详情')}
          width={750}
        >
          {isTopicLoading || isTopicFetching ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
              }}
            >
              <div className={styles.loadingSpinner} />
            </div>
          ) : topicData ? (
            <div className={styles.topicDetail}>
              <TopicDetail id={topicData?.info?.id} topic={topicData?.info} />
            </div>
          ) : selectedItemId !== null ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>{t('noData', '暂无数据', { ns: 'common' })}</p>
            </div>
          ) : null}
        </Modal>
      </div>
    </Flexbox>
  );
};

export default InteractionList;
