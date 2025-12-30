'use client';

// import { CollaborationUsers } from '@/components/tiptap-templates/notion-like/notion-like-editor-collaboration-users';
// --- Styles ---
import '@/components/tiptap-templates/notion-like/notion-like-editor-header.scss';
import { ThemeToggle } from '@/components/tiptap-templates/notion-like/notion-like-editor-theme-toggle';
import { ButtonGroup } from '@/components/tiptap-ui-primitive/button';
import { Separator } from '@/components/tiptap-ui-primitive/separator';
// --- UI Primitives ---
import { Spacer } from '@/components/tiptap-ui-primitive/spacer';
// --- Tiptap UI ---
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button';

export function NotionEditorHeader() {
  return (
    <header className="notion-like-editor-header">
      <Spacer />
      <div className="notion-like-editor-header-actions">
        <ButtonGroup orientation="horizontal">
          <UndoRedoButton action="undo" />
          <UndoRedoButton action="redo" />
        </ButtonGroup>

        <Separator />

        <ThemeToggle />

        {/* <Separator /> */}

        {/* <CollaborationUsers /> */}
      </div>
    </header>
  );
}
