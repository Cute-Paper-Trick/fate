import { Content } from '@tiptap/core';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import CommentEditor from '../Editor';

const useStyles = createStyles(({ css }) => ({
  replyEditor: css`
    margin-top: 0.75rem;

    .notion-like-editor {
      min-height: 6rem;
    }
  `,
  actions: css`
    margin-top: 0.75rem;
  `,
}));

interface ReplyEditorProps {
  onFinish: (content: Content) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ReplyEditor = memo<ReplyEditorProps>(({ onFinish, onCancel, loading }) => {
  const { styles } = useStyles();
  const [content, setContent] = useState<Content>({});

  return (
    <div className={styles.replyEditor}>
      <CommentEditor onChange={setContent} />
      <Flexbox className={styles.actions} gap={'.5rem'} horizontal>
        <Button
          htmlType="submit"
          loading={loading}
          onClick={() => onFinish(content)}
          type="primary"
        >
          回复
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </Flexbox>
    </div>
  );
});

export default ReplyEditor;
