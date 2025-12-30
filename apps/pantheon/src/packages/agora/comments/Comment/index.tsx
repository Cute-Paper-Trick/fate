import { Content } from '@tiptap/core';
import { Avatar, Button } from 'antd';
import { cx } from 'antd-style';
import { ChevronsDownUp, ChevronsUpDown, Heart, MessageCircle } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import {
  V1ArticleInfoReply,
  V1CommentInfoReply,
  useCommentsReplay,
  useReactionsCreate,
  useReactionsDelete,
} from '@/lib/http';
import { queryClient } from '@/lib/query';
import { formatRelativeTime } from '@/packages/utils';

import CommentContent from '../Content';
import { useCommentReplies } from '../hooks/useReplies';
import ReplyEditor from './ReplyEditor';
import styles from './comment.module.scss';

interface CommentProps {
  depth?: number;
  comment: V1CommentInfoReply | V1ArticleInfoReply;
}

const Comment = memo<CommentProps>(({ comment, depth = 0 }) => {
  const { data, hasNextPage, fetchNextPage } = useCommentReplies({ commentId: comment.id });

  const repliesCount = data?.total ?? 0;

  const [collapsed, setCollapsed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const reply = useCommentsReplay({
    mutation: {
      onSuccess: () => {
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

  const content = JSON.parse(comment.content) as Content;

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
          <Avatar className={styles.commentAvatar} size={32} src={creatorAvatar}>
            {creatorName}
          </Avatar>
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
                    <button
                      className={styles.actionBtn}
                      onClick={() => setIsReplying(true)}
                      type="button"
                    >
                      <MessageCircle className={styles.actionIcon} size={18} strokeWidth={1.5} />
                      回复
                    </button>
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
