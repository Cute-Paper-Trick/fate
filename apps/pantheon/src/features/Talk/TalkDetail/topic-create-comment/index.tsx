'use client';

import { useTranslate } from '@tolgee/react';
import { Avatar, Button, Form, Input } from 'antd';
import { FC } from 'react';

import styles from './topic-comment.module.scss';

interface CommentInputProps {
  profile: { avatar?: string; account?: string } | undefined;
  form: any;
  onSubmit: () => void;
  buttonText?: string;
  placeholder?: string;
  avatarSize?: number;
}

export const CommentInput: FC<CommentInputProps> = ({
  profile,
  form,
  onSubmit,
  buttonText,
  placeholder,
  avatarSize = 40,
}) => {
  const { t } = useTranslate('talk');

  return (
    <div className={styles.talk}>
      <div className={styles.comments_input_container}>
        <Avatar className={styles.avatar} size={avatarSize} src={profile?.avatar}>
          {profile?.account}
        </Avatar>
        <div className={styles.input_wrapper}>
          <Form form={form}>
            <Form.Item name="content" noStyle>
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 8 }}
                className={styles.talk_input}
                placeholder={placeholder ?? t('comment.reply.description', '有什么想说的...')}
              />
            </Form.Item>
          </Form>
        </div>
        <Button className={styles.comment_send} onClick={onSubmit}>
          {buttonText ?? t('comment.reply.send', '发送')}
        </Button>
      </div>
    </div>
  );
};
