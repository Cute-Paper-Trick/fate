import { Avatar } from 'antd';
import { createStyles } from 'antd-style/lib/functions';
import { CirclePlus } from 'lucide-react';
import { memo } from 'react';

import { formatRelativeTime } from '@/packages/utils';

const AVATAR_SIZE = 32;

const useStyles = createStyles(({ css }) => ({
  detail: css`
    display: grid;
    grid-template-columns: ${AVATAR_SIZE}px minmax(0px, 1fr);

    & > * {
      white-space: nowrap;
    }
  `,
  commentAvatar: css`
    margin-inline-end: 0.75rem;
    margin-block: 0.25rem;
  `,
  commentMeta: css`
    font-size: 0.75rem;
    line-height: 1rem;

    display: flex;
    flex-direction: row;
    overflow: hidden;
    align-items: center;

    margin-inline-start: 0.5rem;
  `,
  commentAuthor: css`
    color: #131517;
    font-weight: 700;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    a {
      text-decoration: none;
    }
  `,
  commentAt: css`
    color: #616864;
  `,
  op: css`
    margin-left: 0.25rem;
    display: inline-flex;
    align-items: center;

    color: #115bca;
    font-weight: 600;
    letter-spacing: 0.025em;
  `,
  separator: css`
    padding-inline: 0.25rem;
  `,
  id: css`
    color: #b0b8bc;
  `,
}));

interface CommentMetaProps {
  id: number;
  user?: {
    name: string;
    avatar?: string;
  };
  isOp?: boolean;
  createAt?: string;

  open?: boolean;
  onOpen?: () => void;
}

const CommentMeta = memo<CommentMetaProps>(({ id, open, user, isOp, createAt, onOpen }) => {
  const { styles } = useStyles();
  return (
    <div className={styles.detail}>
      {open ? (
        <Avatar className={styles.commentAvatar} size={AVATAR_SIZE} src={user?.avatar}>
          {user?.name}
        </Avatar>
      ) : (
        <CirclePlus size={16} strokeWidth={1} onClick={onOpen} />
      )}
      <div className={styles.commentMeta}>
        <div className={styles.commentAuthor}>
          <a>{user?.name}</a>
        </div>
        {isOp && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.op}>
              <span>OP</span>
            </span>
          </>
        )}
        <span className={styles.separator}>·</span>
        <time className={styles.commentAt}>{formatRelativeTime(createAt ?? '')}</time>
        <span className={styles.separator}>·</span>
        <span className={styles.id}>no.{id}</span>
      </div>
    </div>
  );
});

export default CommentMeta;
