import { codeBlockOptions } from '@blocknote/code-block';
import {
  type Block,
  BlockNoteEditorOptions,
  BlockNoteSchema,
  createCodeBlockSpec,
} from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { zh } from '@blocknote/core/locales';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { forwardRef, useImperativeHandle } from 'react';

import './editor.css';

export type { Block } from '@blocknote/core';

interface EditorProps {
  editable?: boolean;
  initialContent?: Block[];
  onChange?: (blocks: Block[]) => void;

  uploadFile?: BlockNoteEditorOptions<any, any, any>['uploadFile'];
  resolveFileUrl?: BlockNoteEditorOptions<any, any, any>['resolveFileUrl'];
}

export interface EditorRef {
  setContent: (blocks: Block[]) => void;
  getContent: () => Block[];
  clear: () => void;
  editor: ReturnType<typeof useCreateBlockNote>;
}

const Editor = forwardRef<EditorRef, EditorProps>(
  ({ editable, initialContent, onChange, uploadFile, resolveFileUrl }, ref) => {
    const editor = useCreateBlockNote({
      dictionary: zh,
      resolveUsers: async (userIds: string[]) => {
        console.log(userIds);
      },
      comments: {
        threadStore: {},
      },
      schema: BlockNoteSchema.create().extend({
        blockSpecs: {
          codeBlock: createCodeBlockSpec({
            ...codeBlockOptions,
            indentLineWithTab: true,
            defaultLanguage: 'text',
          } as any),
        },
      }),
      initialContent: initialContent?.length === 0 ? undefined : initialContent,
      uploadFile,
      resolveFileUrl,
      tables: {
        splitCells: true,
        cellBackgroundColor: true,
        cellTextColor: true,
        headers: true,
      },
    });

    useImperativeHandle(ref, () => ({
      setContent: (blocks: Block[]) => {
        editor.replaceBlocks(editor.document, blocks);
      },
      getContent: () => editor.document,
      clear: () => {
        editor.replaceBlocks(editor.document, []);
      },
      editor,
    }));

    return (
      <BlockNoteView
        editable={editable}
        editor={editor}
        onChange={() => {
          onChange?.(editor.document);
        }}
      />
    );
  },
);

Editor.displayName = 'Editor';

export default Editor;
