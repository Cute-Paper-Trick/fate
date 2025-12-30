import { Content } from '@tiptap/react';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { NotionEditorRef } from '@/components/tiptap-templates/notion-like/notion-like-editor';
import { useArticlesReplay } from '@/lib/http';
import { queryClient } from '@/lib/query';

import CommentEditor from '../comments/Editor';

const useStyles = createStyles(({ css }) => ({
  editor: css`
    box-shadow: 0 0 0 1px #3b49df !important;
  `,
}));

const ReplyArticle = memo(() => {
  const editorRef = useRef<NotionEditorRef>(null);
  const { styles, cx } = useStyles();

  const [id] = useQueryState('id', parseAsInteger);
  const [content, setContent] = useState<Content>({});
  const [focus, setFocus] = useState(false);

  const { mutate, isPending } = useArticlesReplay({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['articleReplies', Number(id)] });
        editorRef.current?.setContent(null);
        setFocus(false);
      },
    },
  });

  const handleFinish = () => {
    mutate({
      data: {
        article_id: id!,
        content: JSON.stringify(content),
        extra: {
          userAgent: navigator.userAgent as any,
        },
      },
    });
  };

  return (
    <Flexbox width={'100%'}>
      <CommentEditor
        className={cx(focus && styles.editor)}
        onChange={setContent}
        onFocus={() => setFocus(true)}
        ref={editorRef}
      />
      {focus && (
        <Flexbox horizontal style={{ paddingTop: '0.75rem' }} width={'100%'}>
          <Button loading={isPending} onClick={handleFinish} type="primary">
            提交
          </Button>
        </Flexbox>
      )}
    </Flexbox>
  );
});

export default ReplyArticle;
