'use client';

import { Button, Input } from 'antd';
import { createStyles } from 'antd-style';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => ({
  commentInput: css`
    border-radius: 16px;
    border: 1px solid #d9d9d9;
    padding: 8px;
  `,
}));

interface ReplyProps {
  onCancel?: () => void;
  onFinish: (text: string) => Promise<void> | void;
  loading?: boolean;

  autoFocus?: boolean;
}

const Reply = memo<ReplyProps>(({ autoFocus, loading, onCancel, onFinish }) => {
  const { styles } = useStyles();
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState('');

  const clear = () => {
    setFocus(false);
    setText('');
    onCancel?.();
  };

  const onSend = async () => {
    await onFinish(text);
    clear();
  };

  return (
    <Flexbox className={styles.commentInput}>
      <Input.TextArea
        autoFocus={autoFocus}
        autoSize
        disabled={loading}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setFocus(true)}
        placeholder="你有啥想说的..."
        value={text}
        variant="borderless"
      />
      {focus ? (
        <Flexbox gap={8} horizontal justify="end">
          <Button loading={loading} onClick={clear}>
            {'取消'}
          </Button>
          <Button loading={loading} onClick={onSend} type="primary">
            {'发送'}
          </Button>
        </Flexbox>
      ) : null}
    </Flexbox>
  );
});

export default Reply;
