/* eslint-disable react/button-has-type */
import { createStyles } from 'antd-style';
import { MessageCircleReply, PawPrint, ThumbsUp } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import Reply from './Replay';

const useStyles = createStyles(({ css }) => ({
  actions: css`
    color: #5c6c74;
    cursor: pointer;
    text-align: center;
    padding-block: 0.5rem;
  `,

  buttonGroup: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    &:first-child {
      margin-left: 0;
    }
  `,
  btn: css`
    color: #5c6c74;
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1rem;

    height: 2rem;
    padding: 0;
    border-width: 0;
    justify-content: center;
    align-items: center;
    display: inline-flex;

    background-color: transparent;

    padding-inline: 0.75rem;

    border-radius: 999px;

    :hover {
      background-color: #dee2e5;
    }
  `,

  btnCtn: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  `,

  actionIcon: css`
    flex-shrink: 0;
  `,
  actionLabel: css``,
}));

const ICON_SIZE = {
  size: 16,
  strokeWidth: 1.5,
} as const;

const DOWN_COLOR = '#6a5cff';
const UP_COLOR = '#d03900';

const downColored = {
  color: DOWN_COLOR,
  fill: DOWN_COLOR,
} as const;

const upColored = {
  color: UP_COLOR,
  fill: UP_COLOR,
} as const;

interface CommentActionsProps {
  liked?: boolean;
  unliked?: boolean;
  likedCount: number;
  unlikedCount: number;
  onLike: () => void;
  onUnLike: () => void;
  onReply: (text: string) => void;
}

export const CommentActions = memo<CommentActionsProps>(
  ({ liked, unliked, likedCount, unlikedCount, onLike, onUnLike, onReply }) => {
    const { styles } = useStyles();

    const isDownColored = unliked;
    const isUpColored = liked;

    const [replying, setReplying] = useState(false);

    const enableLike = false;

    return (
      <div className={styles.actions}>
        <div className={styles.buttonGroup}>
          {/* <button className={styles.btn}>
          <span className={styles.btnCtn}>
            <Heart {...ICON_SIZE} className={styles.actionIcon} />
            <span>{likedCount}</span>
            <span>喜欢</span>
          </span>
        </button> */}
          {enableLike && (
            <button className={styles.btn} onClick={onLike}>
              <span className={styles.btnCtn}>
                <ThumbsUp
                  {...ICON_SIZE}
                  className={styles.actionIcon}
                  {...(isUpColored ? upColored : {})}
                />
                <span>{likedCount}</span>
                <span>牛逼疯了</span>
              </span>
            </button>
          )}
          {enableLike && (
            <button className={styles.btn} onClick={onUnLike}>
              <span className={styles.btnCtn}>
                <PawPrint
                  {...ICON_SIZE}
                  className={styles.actionIcon}
                  {...(isDownColored ? downColored : {})}
                />
                <span>{unlikedCount}</span>
                <span>狗都不看</span>
              </span>
            </button>
          )}
          <button className={styles.btn} onClick={() => setReplying((r) => !r)}>
            <span className={styles.btnCtn}>
              <MessageCircleReply {...ICON_SIZE} className={styles.actionIcon} />
              <span>回复</span>
            </span>
          </button>
        </div>
        {replying && (
          <Flexbox style={{ marginBlock: '0.5rem' }}>
            <Reply autoFocus onCancel={() => setReplying(false)} onFinish={onReply} />
          </Flexbox>
        )}
      </div>
    );
  },
);
