import { Content } from '@tiptap/core';
import { Avatar, Button } from 'antd';
import { cx } from 'antd-style';
import { ChevronsDownUp, ChevronsUpDown, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { modal } from '@/components/AntdStaticMethods';
import {
  V1ArticleInfoReply,
  V1CommentInfoReply,
  useCommentsDelete,
  useCommentsReplay,
  useReactionsCreate,
  useReactionsDelete,
} from '@/lib/http';
import { queryClient } from '@/lib/query';
import { RemoteWrapper } from '@/packages/pithos';
import { formatRelativeTime } from '@/packages/utils';

import CommentContent from '../Content';
import { useCommentReplies } from '../hooks/useReplies';
import styles from './comment.module.scss';
import ReplyEditor from './ReplyEditor';

interface CommentProps {
  depth?: number;
  comment: V1CommentInfoReply | V1ArticleInfoReply;
}

const Comment = memo<CommentProps>(({ comment, depth = 0 }) => {
  // const hasReply = comment.redundant.reply_count > 0;
  const { data, hasNextPage, fetchNextPage } = useCommentReplies({
    commentId: comment.id,
    hasReply: true,
  });

  const repliesCount = data?.total ?? 0;

  const [collapsed, setCollapsed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const [articleId] = useQueryState('id', parseAsInteger);

  const reply = useCommentsReplay({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['commentReplies', comment.parent_id] });
        queryClient.invalidateQueries({ queryKey: ['commentReplies', comment.id] });
        setIsReplying(false);
      },
    },
  });

  const {
    created_at: createdAt,
    creator_name: creatorName,
    creator_avatar: creatorAvatar,
    extra_account: meta,
  } = comment;

  const parseContent = () => {
    try {
      const content = JSON.parse(comment.content) as Content;
      return content;
    } catch {
      return comment.content as Content;
    }
  };

  const content = parseContent();

  const [liked, setLiked] = useState(meta.is_liked);
  const [likeCount, setLikeCount] = useState(comment.redundant.like_count);

  const onCollapse = () => {
    setCollapsed(true);
  };

  const onExpand = () => {
    setCollapsed(false);
  };

  const like = useReactionsCreate();
  const unlike = useReactionsDelete();
  const deleteComment = useCommentsDelete({
    mutation: {
      onSuccess: () => {
        if (comment.parent_id === 0) {
          queryClient.refetchQueries({ queryKey: ['articleReplies', articleId] });
        }
        queryClient.refetchQueries({ queryKey: ['commentReplies', comment.id] });
        queryClient.refetchQueries({ queryKey: ['commentReplies', comment.parent_id] });
      },
    },
  });

  const onLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((count) => count - 1);
      unlike.mutate({
        data: {
          reactable_id: comment.id,
          reactable_type: 'comment',
          category: 'like',
        },
      });
      return;
    }
    setLiked(true);
    setLikeCount((count) => count + 1);
    like.mutate({
      data: {
        reactable_id: comment.id,
        reactable_type: 'comment',
        category: 'like',
      },
    });
  };

  return (
    <details
      className={cx(
        styles.commentWrapper,
        depth === 1 && styles.indent1,
        depth > 1 && styles.indentN,
      )}
      open={!collapsed}
    >
      <summary onClick={(e) => e.preventDefault()}>
        <Flexbox
          align="center"
          className={cx(styles.summaryInner)}
          gap={8}
          horizontal
          onClick={() => collapsed && onExpand()}
          width={'100%'}
        >
          <ChevronsUpDown
            className={cx(styles.expanded)}
            onClick={onExpand}
            size={16}
            strokeWidth={2}
          />
          <ChevronsDownUp
            className={cx(styles.collapsed)}
            onClick={onCollapse}
            size={16}
            strokeWidth={2}
          />
          <span className={styles.collapseContent}>
            {creatorName}
            {repliesCount ? `+ ${repliesCount} 回复` : null}
          </span>
        </Flexbox>
      </summary>
      <div className={styles.commentNode}>
        <Flexbox className={styles.commentInner} gap={'0.5rem'} horizontal>
          <RemoteWrapper avatar path={creatorAvatar || ''}>
            {(realPath) => (
              <Avatar className={styles.commentAvatar} size={32} src={realPath}>
                {creatorName}
              </Avatar>
            )}
          </RemoteWrapper>
          <div className={styles.commentDetail}>
            <Flexbox>
              <Flexbox className={styles.innerComment}>
                <Flexbox align="center" className={styles.commentHeader} horizontal>
                  <Flexbox align="center" className={styles.profile} gap={'.5rem'} horizontal>
                    <span>{creatorName}</span>
                    {/* {<Tooltip title="作者">
                  <CircleStar color="#115bca" fillOpacity={0.5} size={18} strokeWidth={2} />
                </Tooltip>} */}
                  </Flexbox>
                  <span className={styles.separator}>•</span>
                  <time className={styles.createdAt}>{formatRelativeTime(createdAt)}</time>
                </Flexbox>
                <CommentContent content={content} />
              </Flexbox>
              <footer>
                {isReplying ? (
                  <ReplyEditor
                    loading={reply.isPending}
                    onCancel={() => setIsReplying(false)}
                    onFinish={(content: Content) => {
                      reply.mutate({
                        data: {
                          content: JSON.stringify(content),
                          comment_id: comment.id,
                          extra: {
                            userAgent: navigator.userAgent as any,
                          },
                        },
                      });
                    }}
                  />
                ) : (
                  <Flexbox className={styles.actions} horizontal>
                    {!(comment as any).is_deleted && (
                      <button
                        className={styles.actionBtn}
                        disabled={like.isPending || unlike.isPending}
                        onClick={onLike}
                        type="button"
                      >
                        <Heart
                          className={styles.actionIcon}
                          color={liked ? '#dc2626' : '#717171'}
                          fill={liked ? '#dc2626' : '#fff'}
                          size={19}
                          strokeWidth={1.5}
                        />
                        <span>{likeCount}</span>
                        <span>&nbsp;喜欢</span>
                      </button>
                    )}
                    {!(comment as any).is_deleted && (
                      <button
                        className={styles.actionBtn}
                        onClick={() => setIsReplying(true)}
                        type="button"
                      >
                        <MessageCircle className={styles.actionIcon} size={18} strokeWidth={1.5} />
                        回复
                      </button>
                    )}
                    {!(comment as any).is_deleted && comment.extra_account.is_self_comment && (
                      <button
                        className={styles.actionBtn}
                        onClick={() => {
                          modal.confirm({
                            title: '确定删除该评论吗？',
                            content: '删除后所有的回复也会被删除。',
                            okText: '删除',
                            okType: 'danger',
                            onOk: () => {
                              deleteComment.mutate({ data: { id: comment.id } });
                            },
                          });
                        }}
                        style={{ color: '#dc2626' }}
                        type="button"
                      >
                        <Trash2 className={styles.actionIcon} size={18} strokeWidth={1.5} />
                        删除
                      </button>
                    )}
                  </Flexbox>
                )}
              </footer>
            </Flexbox>
          </div>
        </Flexbox>
        <Flexbox width={'100%'}>
          {data?.replies?.map((reply) => (
            <Comment comment={reply} depth={depth + 1} key={reply.id} />
          ))}
          {hasNextPage && (
            <Button onClick={() => fetchNextPage()} type="link">
              加载更多...
            </Button>
          )}
        </Flexbox>
      </div>
    </details>
  );
});

export default Comment;
