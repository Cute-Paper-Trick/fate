import { Content } from '@tiptap/core';
import { createStyles } from 'antd-style';
import { memo } from 'react';

import CommentEditor from '../Editor';

const useStyles = createStyles(({ css }) => ({
  content: css`
    .notion-like-editor {
      padding: 0 0.75rem !important;
      margin: 0.5rem 0 1rem 0;
    }
  `,
}));

const CommentContent = memo<{ content: Content }>(({ content }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.content}>
      <CommentEditor content={content} editable={false} variant="borderless" />
    </div>
  );
});

export default CommentContent;
