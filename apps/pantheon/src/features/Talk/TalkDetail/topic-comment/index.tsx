'use client';
import { Icon } from '@lobehub/ui';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import { Avatar, Button, Form, Input } from 'antd';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  V1TaskTopicListRes,
  V1TopicCommentInfo,
  V1TopicCommentSubInfo,
  accountService,
  commentLikeService,
  taskTopicService,
  topicCommentService,
} from '@/lib/http';
import { queryClient } from '@/lib/query';

import { getNextPageParam } from '../components/useInfiniteList';
import { TopicInfo } from '../topic-info';
import styles from './topic-comment.module.scss';

interface CommentProps {
  type?: 'root';
  comment: V1TopicCommentInfo;
  commentDict: Record<number, V1TopicCommentInfo | V1TopicCommentSubInfo>;
}

interface SubCommentProps {
  type?: 'sub';
  comment: V1TopicCommentSubInfo;
  commentDict: Record<number, V1TopicCommentInfo | V1TopicCommentSubInfo>;
}

type ListData = InfiniteData<V1TaskTopicListRes, unknown>;

const useRefreshTopic = (topicId: number) => {
  return useMutation({
    mutationFn: () => taskTopicService().taskTopicDetail({ id: topicId }),
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
              list: page.list.map((item) => (item.id === topicId ? newItem : item)),
            })),
          };
          return res;
        },
      );
    },
  });
};

function Comment({ comment, commentDict }: CommentProps | SubCommentProps) {
  // const parentId = comment.comment_id;
  // const parent = commentDict[parentId];
  const { t } = useTranslate('talk');
  const rootId = comment.root_comment_id || comment.comment_id || comment.id;

  const [likeCount, setLikeCount] = useState(comment.extra?.like_count || 0);
  const [liked, setLiked] = useState(comment.extra_account.like_status || false);

  const [commentForm] = Form.useForm();

  const [showComment, setShowComment] = useState(false);

  const refreshTopic = useRefreshTopic(comment.topic_id);

  const addSubComment = useMutation({
    mutationFn: (content: string) =>
      topicCommentService().topicCommentAdd({
        topic_id: comment.topic_id,
        root_comment_id: rootId,
        // 回复的是本条评论
        comment_id: comment.id,
        content: content,
        material: '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['topic', comment.topic_id, 'comment'],
      });
      commentForm.setFieldValue('content', '');
      setShowComment(false);
      refreshTopic.mutate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const sendComment = () => {
    const content = commentForm.getFieldValue('content');
    addSubComment.mutate(content);
  };

  const like = useMutation({
    mutationFn: () => commentLikeService().commentLikeLike({ comment_id: comment.id }),
    onSuccess: () => {
      setLikeCount((count: number) => count + 1);
      setLiked(true);
    },
  });

  const unlike = useMutation({
    mutationFn: () => commentLikeService().commentLikeUnlike({ comment_id: comment.id }),
    onSuccess: () => {
      setLikeCount((count: number) => count - 1);
      setLiked(false);
    },
  });

  const profileQuery = useQuery({
    queryKey: ['/api/account/proifle'],
    queryFn: async () => await accountService().accountProfile(),
  });

  return (
    <li className={clsx(styles.comment, 'w-full')}>
      {/* <div className={styles.comment_avatar}>
        <Avatar size={42} src={comment.avatar}>
          {comment.nickname || comment.account}
        </Avatar>
      </div> */}
      <div className={styles.comment_main}>
        {/* <div className={styles.comment_name}>
          <strong className={styles.author}>{comment.account}</strong>
          {parent?.account && (
            <small>
              <CaretRightFilled style={{ margin: '0 4px' }} />
              {parent?.account}
            </small>
          )}
          <small>
            {' · '}
            {DateTime.fromISO(comment.created_at, { zone: 'utc' })
              .setZone('Asia/Shanghai')
              .toFormat('DD')}
          </small>
        </div> */}
        <TopicInfo topic={comment} />

        <div className={styles.comment_body}>
          <span>{comment.content}</span>
        </div>
        <div className={styles.comment_bottom}>
          <span className={clsx(styles.vote, styles.vote_up)}>
            {/* <LikeFilled
              className={clsx({ [styles.liked]: liked })}
              onClick={() => (liked ? unlike.mutate() : like.mutate())}
            /> */}
            <Icon
              className={clsx({ [styles.liked as string]: liked })}
              icon={Heart}
              onClick={() => (liked ? unlike.mutate() : like.mutate())}
            />
            <span className={styles.action_num}>{likeCount}</span>
          </span>

          <a
            className={clsx(styles.comment_action, {
              [styles.comment_action_activce as string]: showComment,
            })}
            onClick={() => setShowComment((show) => !show)}
          >
            {/* <Icon icon={MessageSquare} /> */}
            {t('comment.reply.title', '回复')}
          </a>
          {/* {" · "} */}
          {/* <a className={styles.comment_action}>举报</a> */}
        </div>

        {showComment && (
          <div className={clsx(styles.talk, 'w-full')}>
            <div className={styles.comments_input_container}>
              <Avatar className={styles.avatar} size={45}>
                {profileQuery?.data?.account}
              </Avatar>
              <div className={styles.input_wrapper}>
                <Form form={commentForm}>
                  <Form.Item name="content" noStyle>
                    <Input.TextArea
                      autoSize={{ minRows: 1, maxRows: 8 }}
                      className={styles.talk_input}
                      placeholder={t('comment.reply.description', '有什么想说的...')}
                    />
                  </Form.Item>
                </Form>
              </div>
              <Button className={styles.comment_send} onClick={sendComment}>
                {t('comment.reply.title', '回复')}
              </Button>
            </div>
          </div>
        )}

        <div>
          <ul className={styles.comment_list}>
            {(comment as V1TopicCommentInfo).sub_list?.map((child) => (
              <Comment comment={child} commentDict={commentDict} key={child.id} />
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function TopicComments({
  topicId,
  commentCount,
}: {
  topicId: number;
  commentCount: number;
}) {
  // const user = useStore(appStore, (state) => state.user);
  const { t } = useTranslate('talk');
  const profileQuery = useQuery({
    queryKey: ['/api/account/proifle'],
    queryFn: async () => await accountService().accountProfile(),
  });

  const [commentForm] = Form.useForm();

  const refreshTopic = useRefreshTopic(topicId);

  const commentQuery = useInfiniteQuery({
    queryKey: ['topic', topicId, 'comment'],
    queryFn: ({ pageParam }) => topicCommentService().topicCommentList(pageParam),
    initialPageParam: { topic_id: topicId, page: 1, size: 20 },
    getNextPageParam: getNextPageParam,
    select: (data) => data.pages.flatMap((d) => d.list),
  });

  const commentDict = useMemo(() => {
    const res: Record<number, V1TopicCommentInfo | V1TopicCommentSubInfo> = {};
    commentQuery.data?.forEach((item) => {
      res[item.id] = item;
      if (item.sub_list) {
        item.sub_list.forEach((sub) => {
          res[sub.id] = sub;
        });
      }
    });
    return res;
  }, [commentQuery.data]);

  const addComment = useMutation({
    mutationFn: (content: string) =>
      topicCommentService().topicCommentAdd({
        topic_id: topicId,
        root_comment_id: 0,
        comment_id: 0,
        content: content,
        material: '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['topic', topicId, 'comment'],
      });
      commentForm.setFieldValue('content', '');
      refreshTopic.mutate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const sendComment = () => {
    const content = commentForm.getFieldValue('content');
    addComment.mutate(content);
  };

  return (
    <>
      <div className={styles.comments}>
        <div className={styles.talk}>
          <div className={styles.comments_input_container}>
            <Avatar className={styles.avatar} size={40} src={profileQuery?.data?.avatar}>
              {profileQuery?.data?.account}
            </Avatar>
            <div className={styles.input_wrapper}>
              <Form form={commentForm}>
                <Form.Item name="content" noStyle>
                  <Input.TextArea
                    autoSize={{ minRows: 1, maxRows: 8 }}
                    className={styles.talk_input}
                    placeholder={t('comment.reply.description', '有什么想说的...')}
                  />
                </Form.Item>
              </Form>
            </div>
            <Button className={styles.comment_send} onClick={sendComment}>
              {t('comment.reply.send', '发送')}
            </Button>
          </div>
        </div>

        <p className={styles.comment_tabs}>
          <span>
            {t('comment.reply.all', '共')} {commentCount} {t('comment.reply.unit', '条评论')}
          </span>
          <span />
        </p>
      </div>

      <ul className={styles.comment_list}>
        {commentQuery.data?.map((comment) => (
          <Comment comment={comment} commentDict={commentDict} key={comment.id} />
        ))}
      </ul>
      <div style={{ textAlign: 'center' }}>
        <Button
          disabled={!commentQuery.hasNextPage}
          loading={commentQuery.isFetchingNextPage}
          onClick={() => commentQuery.fetchNextPage()}
          style={{ color: commentQuery.hasNextPage ? 'orange' : 'grey' }}
          type="link"
        >
          {commentQuery.hasNextPage
            ? t('comment.loading.more', '点击加载更多')
            : t('comment.loading.end', '没有更多了')}
        </Button>
      </div>
    </>
  );
}
