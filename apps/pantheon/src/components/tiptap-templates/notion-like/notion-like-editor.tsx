'use client';

import type { Content } from '@tiptap/core';
// import { Ai } from '@tiptap-pro/extension-ai';
// import type { TiptapCollabProvider } from '@tiptap-pro/provider';
import {
  // Collaboration,
  isChangeOrigin,
} from '@tiptap/extension-collaboration';
// import { CollaborationCaret } from '@tiptap/extension-collaboration-caret';
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji';
import { Highlight } from '@tiptap/extension-highlight';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Mathematics } from '@tiptap/extension-mathematics';
import { Mention } from '@tiptap/extension-mention';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { Typography } from '@tiptap/extension-typography';
import { UniqueID } from '@tiptap/extension-unique-id';
import { Placeholder, Selection } from '@tiptap/extensions';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

// import type { Doc as YDoc } from 'yjs';

import { ListNormalizationExtension } from '@/components/tiptap-extension/list-normalization-extension';
import { NodeAlignment } from '@/components/tiptap-extension/node-alignment-extension';
import { NodeBackground } from '@/components/tiptap-extension/node-background-extension';
import { UiState } from '@/components/tiptap-extension/ui-state-extension';
import { Audio } from '@/components/tiptap-node/audio-node/audio-node-extension';
import '@/components/tiptap-node/audio-node/audio-node.scss';
import { AudioUploadNode } from '@/components/tiptap-node/audio-upload-node/audio-upload-node-extension';
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss';
import '@/components/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-node/heading-node/heading-node.scss';
// --- Custom Extensions ---
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension';
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss';
import { Image } from '@/components/tiptap-node/image-node/image-node-extension';
import '@/components/tiptap-node/image-node/image-node.scss';
// --- Tiptap Node ---
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension';
import '@/components/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';
import { TableHandleExtension } from '@/components/tiptap-node/table-node/extensions/table-handle';
// --- Table Node ---
import { TableKit } from '@/components/tiptap-node/table-node/extensions/table-node-extension';
import '@/components/tiptap-node/table-node/styles/prosemirror-table.scss';
import '@/components/tiptap-node/table-node/styles/table-node.scss';
import { TableCellHandleMenu } from '@/components/tiptap-node/table-node/ui/table-cell-handle-menu';
import { TableExtendRowColumnButtons } from '@/components/tiptap-node/table-node/ui/table-extend-row-column-button';
import { TableHandle } from '@/components/tiptap-node/table-node/ui/table-handle/table-handle';
import { TableSelectionOverlay } from '@/components/tiptap-node/table-node/ui/table-selection-overlay';
import { Video } from '@/components/tiptap-node/video-node/video-node-extension';
import '@/components/tiptap-node/video-node/video-node-view.scss';
import '@/components/tiptap-node/video-node/video-node.scss';
import { VideoUploadNode } from '@/components/tiptap-node/video-upload-node/video-upload-node-extension';
// --- Content ---
// import { NotionEditorHeader } from '@/components/tiptap-templates/notion-like/notion-like-editor-header';
import { MobileToolbar } from '@/components/tiptap-templates/notion-like/notion-like-editor-mobile-toolbar';
import { NotionToolbarFloating } from '@/components/tiptap-templates/notion-like/notion-like-editor-toolbar-floating';
// --- Styles ---
import '@/components/tiptap-templates/notion-like/notion-like-editor.scss';
import { AiMenu } from '@/components/tiptap-ui/ai-menu';
import { useScrollToHash } from '@/components/tiptap-ui/copy-anchor-link-button/use-scroll-to-hash';
import { DragContextMenu } from '@/components/tiptap-ui/drag-context-menu';
// --- Tiptap UI ---
import { EmojiDropdownMenu } from '@/components/tiptap-ui/emoji-dropdown-menu';
import { MentionDropdownMenu } from '@/components/tiptap-ui/mention-dropdown-menu';
import { SlashDropdownMenu } from '@/components/tiptap-ui/slash-dropdown-menu';
// import { AiProvider, useAi } from '@/contexts/ai-context';
// --- Contexts ---
import { AppProvider } from '@/contexts/app-context';
// import { CollabProvider, useCollab } from '@/contexts/collab-context';
// import { UserProvider, useUser } from '@/contexts/user-context';
// --- Hooks ---
import { useUiEditorState } from '@/hooks/use-ui-editor-state';
// import { convertToOpenAIRequest, createTiptapCompatibleStream } from '@/lib/tiptap-ai-utils';
// import { TIPTAP_AI_APP_ID } from '@/lib/tiptap-collab-utils';
// --- Lib ---
import {
  MAX_AUDIO_FILE_SIZE,
  MAX_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  // handleAudioUpload,
  // handleImageUpload,
  // handleVideoUpload,
} from '@/lib/tiptap-utils';
import { genFilePath } from '@/packages/agora/helper';
import { useUpload } from '@/packages/pithos';

export type EditorConfigContextValue = {
  showHeader?: boolean;
  enableVideo?: boolean;
  enableAudio?: boolean;
  enableMention?: boolean;
  enableTable?: boolean;
  enableEmoji?: boolean;
  enableDragContext?: boolean;
  enableSlash?: boolean;
  enableAI?: boolean;
  extraNodes?: React.ReactNode;
};

export const EditorConfigContext = createContext<EditorConfigContextValue>({
  showHeader: true,
  enableVideo: true,
  enableAudio: true,
  enableMention: false,
  enableTable: true,
  enableEmoji: false,
  enableDragContext: true,
  enableSlash: true,
  enableAI: false,
});

export interface NotionEditorProps {
  // room: string;
  placeholder?: string;
}

export interface EditorProviderProps {
  // provider: TiptapCollabProvider;
  // ydoc: YDoc;
  placeholder?: string;
  content?: Content;
  onChange?: (content: Content) => void;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  // aiToken: string | null;
}

export interface NotionEditorRef {
  setContent: (content: Content) => void;
}

/**
 * Loading spinner component shown while connecting to the notion server
 */
export function LoadingSpinner({ text = 'Connecting...' }: { text?: string }) {
  return (
    <div className="spinner-container">
      <div className="spinner-content">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" />
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <div className="spinner-loading-text">{text}</div>
      </div>
    </div>
  );
}

/**
 * EditorContent component that renders the actual editor
 */
export function EditorContentArea() {
  const { editor } = useContext(EditorContext)!;
  const config = useContext(EditorConfigContext);

  const { aiGenerationIsLoading, aiGenerationIsSelection, aiGenerationHasMessage, isDragging } =
    useUiEditorState(editor);

  // Selection based effect to handle AI generation acceptance
  useEffect(() => {
    if (!editor) return;

    if (!aiGenerationIsLoading && aiGenerationIsSelection && aiGenerationHasMessage) {
      editor.chain().focus().aiAccept().run();
      editor.commands.resetUiState();
    }
  }, [aiGenerationHasMessage, aiGenerationIsLoading, aiGenerationIsSelection, editor]);

  useScrollToHash();

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      className="notion-like-editor-content"
      editor={editor}
      role="presentation"
      style={{
        cursor: isDragging ? 'grabbing' : 'auto',
      }}
    >
      {config.enableDragContext ? <DragContextMenu /> : null}
      {config.enableAI ? <AiMenu /> : null}
      <EmojiDropdownMenu />
      <MentionDropdownMenu />
      {config.enableSlash ? <SlashDropdownMenu /> : null}

      <NotionToolbarFloating />

      {createPortal(<MobileToolbar />, document.body)}
    </EditorContent>
  );
}

/**
 * Component that creates and provides the editor instance
 */
export const NotionEditor = forwardRef<NotionEditorRef, EditorProviderProps>(
  function NotionEditor(props, ref) {
    const { multipartUpload } = useUpload();

    const {
      // provider,
      // ydoc,
      editable = true,
      onChange,
      content,
      onFocus,
      onBlur,
      placeholder = 'Start writing...',
      // aiToken
    } = props;

    const config = useContext(EditorConfigContext);
    const isInitializedRef = useRef(false);

    // const { user } = useUser();

    const editor = useEditor({
      editable,
      immediatelyRender: false,
      content: content || '',
      onFocus: () => onFocus?.(),
      onBlur: () => onBlur?.(),
      onCreate: () => {
        // 标记编辑器已完成初始化
        isInitializedRef.current = true;
      },
      onUpdate: ({ editor }) => {
        // 跳过初始化阶段的 onChange 调用
        if (!isInitializedRef.current) return;
        onChange?.(editor.getJSON());
      },
      editorProps: {
        attributes: {
          class: 'notion-like-editor',
        },
      },
      extensions: [
        StarterKit.configure({
          // undoRedo: false,
          horizontalRule: false,
          dropcursor: {
            width: 2,
          },
          link: { openOnClick: false },
        }),
        HorizontalRule,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        // Collaboration.configure({ document: ydoc }),
        // CollaborationCaret.configure({
        //   provider,
        //   user: { id: user.id, name: user.name, color: user.color },
        // }),
        Placeholder.configure({
          placeholder,
          emptyNodeClass: 'is-empty with-slash',
        }),
        config.enableMention ? Mention : null,
        config.enableEmoji
          ? Emoji.configure({
              emojis: gitHubEmojis.filter((emoji) => !emoji.name.includes('regional')),
              forceFallbackImages: true,
            })
          : null,
        config.enableTable
          ? TableKit.configure({
              table: {
                resizable: true,
                cellMinWidth: 120,
              },
            })
          : null,
        NodeBackground,
        NodeAlignment,
        TextStyle,
        Mathematics,
        Superscript,
        Subscript,
        Color,
        TaskList,
        TaskItem.configure({ nested: true }),
        Highlight.configure({ multicolor: true }),
        Selection,
        TableHandleExtension,
        ListNormalizationExtension,
        Image,
        ImageUploadNode.configure({
          accept: 'image/*',
          maxSize: MAX_FILE_SIZE,
          limit: 3,
          upload: async (file) => {
            const res = await multipartUpload(genFilePath(file.name), file);
            return res.name;
          },
          onError: (error) => console.error('Upload failed:', error),
        }),
        config.enableVideo ? Video : null,
        config.enableVideo
          ? VideoUploadNode.configure({
              accept: 'video/*',
              maxSize: MAX_VIDEO_FILE_SIZE,
              limit: 3,
              upload: async (file) => {
                const res = await multipartUpload(genFilePath(file.name), file);
                return res.name;
              },
              onError: (error) => console.error('Upload failed:', error),
            })
          : null,
        config.enableAudio ? Audio : null,
        config.enableAudio
          ? AudioUploadNode.configure({
              accept: 'audio/*',
              maxSize: MAX_AUDIO_FILE_SIZE,
              limit: 3,
              upload: async (file) => {
                const res = await multipartUpload(genFilePath(file.name), file);
                return res.name;
              },
              onError: (error) => console.error('Upload failed:', error),
            })
          : null,
        UniqueID.configure({
          types: [
            'table',
            'paragraph',
            'bulletList',
            'orderedList',
            'taskList',
            'heading',
            'blockquote',
            'codeBlock',
          ],
          filterTransaction: (transaction) => !isChangeOrigin(transaction),
        }),
        Typography,
        UiState,
        // Ai.configure({
        //   appId: TIPTAP_AI_APP_ID,
        //   token: aiToken || undefined,
        //   autocompletion: false,
        //   showDecorations: true,
        //   hideDecorationsOnStreamEnd: false,
        //   onLoading: (context) => {
        //     context.editor.commands.aiGenerationSetIsLoading(true);
        //     context.editor.commands.aiGenerationHasMessage(false);
        //   },
        //   onChunk: (context) => {
        //     context.editor.commands.aiGenerationSetIsLoading(true);
        //     context.editor.commands.aiGenerationHasMessage(true);
        //   },
        //   onSuccess: (context) => {
        //     const hasMessage = !!context.response;
        //     context.editor.commands.aiGenerationSetIsLoading(false);
        //     context.editor.commands.aiGenerationHasMessage(hasMessage);
        //   },
        //   aiStreamResolver: async (options) => {
        //     const { action, text, textOptions } = options;

        //     // 转换为 OpenAI 格式的请求 (内部会调用 buildSystemPrompt)
        //     const openAIRequest = convertToOpenAIRequest(
        //       action,
        //       text,
        //       textOptions,
        //       'gemini-2.0-flash',
        //     );
        //     console.log('OpenAI Request:', openAIRequest);

        //     const response = await fetch('http://localhost:3010/webapi/chat/pantheon', {
        //       method: 'POST',
        //       credentials: 'include',
        //       headers: {
        //         'X-lobe-chat-auth':
        //           'N00XFi0HK0TgjQItC1JSeRdVdEJWV35NTxSnhBNhVlJQelgAflxTB38XVkOk0hVuQ0AXPRsWJQIHNToaFEmm0lJuVUAVKRsWJAoNC2oI',
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify({
        //         ...openAIRequest,
        //         frequency_penalty: 0,
        //         presence_penalty: 0,
        //         top_p: 1,
        //         apiMode: 'chatCompletion',
        //       }),
        //     });

        //     if (!response.ok) {
        //       throw new Error(`AI request failed: ${response.status}`);
        //     }

        //     // 将 OpenAI SSE 响应转换为 Tiptap 兼容的纯文本流
        //     return createTiptapCompatibleStream(response);
        //   },
        // }),
      ].filter((item) => item !== null),
    });

    useImperativeHandle(ref, () => ({
      setContent: (content: Content) => {
        editor?.commands.setContent(content, { emitUpdate: false });
      },
    }));

    if (!editor) {
      return <LoadingSpinner />;
    }

    return (
      <AppProvider>
        <div className="notion-like-editor-wrapper">
          <EditorContext.Provider value={{ editor }}>
            {/* {config.showHeader && <NotionEditorHeader />} */}
            <EditorContentArea />

            <TableExtendRowColumnButtons />
            <TableHandle />
            <TableSelectionOverlay
              cellMenu={(props) => (
                <TableCellHandleMenu
                  editor={props.editor}
                  onMouseDown={(e) => props.onResizeStart?.('br')(e)}
                />
              )}
              showResizeHandles={true}
            />
            {config.extraNodes}
          </EditorContext.Provider>
        </div>
      </AppProvider>
    );
  },
);

/**
 * Internal component that handles the editor loading state
 */
// export function NotionEditorContent({ placeholder }: { placeholder?: string }) {
//   // const { provider, ydoc } = useCollab();
//   // const { aiToken } = useAi();

//   // if (!provider || !aiToken) {
//   //   return <LoadingSpinner />;
//   // }

//   return (
//     <EditorProvider
//       // aiToken={aiToken}
//       placeholder={placeholder}
//       // provider={provider}
//       // ydoc={ydoc}
//     />
//   );
// }

/**
 * Full editor with all necessary providers, ready to use with just a room ID
 */
// export function NotionEditor({
//   // room,
//   placeholder = 'Start writing...',
// }: NotionEditorProps) {
//   return (
//     // <UserProvider>
//     // <AppProvider>
//       {/* <CollabProvider room={room}> */}
//       {/* <AiProvider> */}
//       {/* <NotionEditorContent placeholder={placeholder} /> */}
//       <EditorProvider
//         // aiToken={aiToken}
//         placeholder={placeholder}
//         // provider={provider}
//         // ydoc={ydoc}
//       />
//       {/* </AiProvider> */}
//       {/* </CollabProvider> */}
//     // </AppProvider>
//     // </UserProvider>
//   );
// }
