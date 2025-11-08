'use client';
import { Grid, Icon } from '@lobehub/ui';
import { InfiniteData, useMutation, useQuery } from '@tanstack/react-query';
import { Avatar, Button, Card, Typography } from 'antd';
import clsx from 'clsx';
import { Heart, MessageSquare } from 'lucide-react';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';

import type { V1TaskTopicInfo as TopicVo } from '@/lib/http';

import { V1TaskTopicListRes, topicLikeService } from '@/lib/http';
import { queryClient } from '@/lib/query';

import { useOSS } from '../../components/useOSS';
import { TopicComments } from '../topic-comment';
import { TopicGallery } from '../topic-galary';
import styles from './topic-detail.module.scss';

interface TopicDetailProps {
  id: number;
  topic: TopicVo;
}

type ListData = InfiniteData<V1TaskTopicListRes, unknown>;

export function TopicDetail({ id, topic }: TopicDetailProps) {
  const [showComments, setShowComments] = useState(false);
  const { signature } = useOSS();

  const topicLike = useMutation({
    mutationFn: () => topicLikeService().topicLikeLike({ topic_id: topic.id }),
    onSuccess: (data) => {
      const newItem = data.info;
      queryClient.setQueriesData(
        { queryKey: ['topic', 'list'], exact: false },

        (oldData: ListData | undefined) => {
          if (!oldData) return;
          const res = {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              list: page.list.map((item) => {
                return item.id === topic.id ? newItem : item;
              }),
            })),
          };

          return res;
        },
      );
      queryClient.invalidateQueries({ queryKey: ['topic', topic.id] });
    },
  });

  const topicUnlike = useMutation({
    mutationFn: () => topicLikeService().topicLikeUnlike({ topic_id: topic.id }),
    onSuccess: (data) => {
      const newItem = data.info;
      queryClient.setQueriesData(
        { queryKey: ['topic', 'list'], exact: false },
        (oldData: ListData | undefined) => {
          if (!oldData) return;
          const res = {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              list: page.list.map((item) => (item.id === topic.id ? newItem : item)),
            })),
          };
          return res;
        },
      );
      queryClient.invalidateQueries({ queryKey: ['topic', topic.id] });
    },
  });

  const jsonData = useMemo(() => {
    return JSON.parse(topic.content) as {
      data: string;
      images?: { path: string }[];
      title: string;
    };
  }, [topic.content]);

  const plaintext = jsonData.data;
  const title = jsonData.title;

  const { data: images } = useQuery({
    queryKey: ['topic', id, 'images'],
    queryFn: async () => {
      const res = [];
      for (const img of jsonData.images ?? []) {
        if (!img.path) {
          return [];
        }
        res.push({
          thumbnail: await signature(img.path, 'image/resize,w_200,limit_0'),
          origin: await signature(img.path, 'image/resize,p_50'),
        });
      }
      return res;
    },
    staleTime: 60 * 60 * 60,
  });

  const handleLike = () => {
    if (topic.extra_account.like_status) {
      topicUnlike.mutate();
    } else {
      topicLike.mutate();
    }
  };

  function renderTopicContent(text: string | null | undefined): React.ReactNode {
    if (!text) return null;

    const regex = /#([^#\s]+)#/g;
    const matches = [...text.matchAll(regex)];
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      const fullMatch = match[0];
      const matchIndex = match.index ?? 0;

      const plainText = text.slice(lastIndex, matchIndex);
      if (plainText) {
        elements.push(<span key={`plain-${index}`}>{plainText}</span>);
      }

      elements.push(
        <span
          className={styles.height_text}
          key={`topic-${index}`}
          title={`点击查看话题: ${match[1]}`}
          // onClick={() => router.push(`/topic/${part.slice(1, -1)}`)}
        >
          {fullMatch}
        </span>,
      );

      lastIndex = matchIndex + fullMatch.length;
    });

    const remainder = text.slice(lastIndex);
    if (remainder) {
      elements.push(<span key={`plain-end`}>{remainder}</span>);
    }

    return <div>{elements}</div>;
  }

  return (
    <Card className={styles.topic_wrapper}>
      <div className={styles.topic}>
        <Avatar size={42} src={topic.avatar || null} style={{ minWidth: '42px' }}>
          {topic.account}
        </Avatar>
        <div className={styles.talk_head}>
          <div className={clsx(styles.talk_author)}>
            <span className="flex felx-col">
              <div className={styles.avatarText}>
                <div className={styles.name}>{topic.account}</div>
                <div className={styles.avatar_sub}>
                  {DateTime.fromISO(topic.created_at, { zone: 'utc' })
                    .setZone('Asia/Shanghai')
                    .toFormat('DD')}
                </div>
              </div>
            </span>
            <div style={{ color: '#b2b2b2', fontSize: '12px' }}>#{topic.id}</div>
          </div>

          <div className={styles.topic_title}>
            <Typography.Title level={3}>{title}</Typography.Title>
          </div>

          <div className={styles.talk_paragraphs}>
            <Typography.Paragraph
              className={clsx(styles.talk_content)}
              ellipsis={{
                rows: 10,
                expandable: 'collapsible',
              }}
            >
              {renderTopicContent(plaintext)}
            </Typography.Paragraph>
          </div>

          <TopicGallery images={images ?? []} />

          <Grid className={styles.topic_actions} gap={100} maxItemWidth={100} rows={3}>
            <Button
              className={clsx(styles.comment_btn, {
                [styles.commented as string]: showComments,
              })}
              icon={<Icon className={styles.action_icon} icon={MessageSquare} size="middle" />}
              onClick={() => setShowComments((show) => !show)}
              type="text"
            >
              {topic.extra.comment_count}
            </Button>
            <p />
            <Button
              className={clsx(styles.like_btn, {
                [styles.liked as string]: topic.extra_account?.like_status,
              })}
              icon={<Icon className={styles.action_icon} icon={Heart} size="middle" />}
              onClick={handleLike}
              type="text"
            >
              {topic.extra.like_count}
            </Button>
          </Grid>

          {showComments && (
            <TopicComments commentCount={topic.extra.comment_count} topicId={topic.id} />
          )}
        </div>
      </div>
    </Card>
  );
}
