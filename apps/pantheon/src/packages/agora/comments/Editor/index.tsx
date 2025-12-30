'use client';

import { createStyles } from 'antd-style';
import { forwardRef, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import '@/components/tiptap-node/image-node/image-node.scss';
import {
  EditorConfigContext,
  EditorProviderProps,
  NotionEditor,
  NotionEditorRef,
} from '@/components/tiptap-templates/notion-like/notion-like-editor';
import '@/components/tiptap-templates/notion-like/notion-like-editor.scss';
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button';

import { useCardStyles } from '../../style-card';
import './editor.scss';

const useStyles = createStyles(({ css }) => ({
  editor: css`
    min-height: 6rem;
  `,
  editorWrapper: css``,
  toolbar: css`
    padding: 0.5rem;
    border-top: 1px solid rgba(23, 23, 23, 0.033);
  `,
}));

interface CommentEditorProps extends EditorProviderProps {
  variant?: 'borderless';
  className?: string;
  onFocus?: () => void;
}

const CommentEditor = memo(
  forwardRef<NotionEditorRef, CommentEditorProps>(function CommentEditor(
    { variant, editable = true, content, onChange, onFocus, className },
    ref,
  ) {
    const { styles: cardStyles, cx } = useCardStyles();
    const { styles } = useStyles();

    return (
      <Flexbox className={cx(cardStyles.card, className, 'commentEditor', variant)}>
        <div className={styles.editorWrapper}>
          <EditorConfigContext.Provider
            value={{
              showHeader: false,
              enableAudio: false,
              enableVideo: false,
              enableTable: false,
              enableDragContext: false,
              enableSlash: false,
              extraNodes: editable ? (
                <Flexbox className={styles.toolbar} horizontal>
                  <ImageUploadButton />
                </Flexbox>
              ) : null,
            }}
          >
            <NotionEditor
              content={content}
              editable={editable}
              onChange={onChange}
              onFocus={onFocus}
              ref={ref}
            />
          </EditorConfigContext.Provider>
        </div>
      </Flexbox>
    );
  }),
);

CommentEditor.displayName = 'CommentEditor';

export default CommentEditor;
