'use client';

import { IEditor, ReactCodeblockPlugin } from '@lobehub/editor';
import { Editor, useEditor } from '@lobehub/editor/react';
import { useTranslate } from '@tolgee/react';
import { memo, useCallback } from 'react';
import { Flexbox } from 'react-layout-kit';

interface TalkEditorProps {
  content?: string;
  onChange: (content: string) => void;
}

const TalkEditor = memo<TalkEditorProps>(({ onChange, content = '' }) => {
  const { t } = useTranslate('common');
  const editor = useEditor();
  // const [content, setContent] = useState<string>('###123###');

  const handleInit = useCallback(
    (editor: IEditor) => console.log('Editor initialized:', editor),
    [],
  );

  return (
    <Flexbox
      as="section"
      paddingBlock={8}
      paddingInline={8}
      style={{ border: '1px solid #eee', minHeight: 100, borderRadius: 8 }}
      width={'100%'}
    >
      <Editor
        content={content}
        editor={editor}
        enablePasteMarkdown={false}
        markdownOption={false}
        onChange={(editor) => {
          const text = String(editor.getDocument('markdown') || '').trimEnd();
          onChange(text);
        }}
        onInit={handleInit}
        placeholder={t('editor.placeholder')}
        plugins={[ReactCodeblockPlugin]}
        type="text"
        variant="chat"
      />
    </Flexbox>
  );
});

TalkEditor.displayName = 'TalkEditor';

export default TalkEditor;
