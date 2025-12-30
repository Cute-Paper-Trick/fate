import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import { isNodeTypeSelected } from "@/lib/tiptap-utils"

// --- Tiptap UI ---
import { DeleteNodeButton } from "@/components/tiptap-ui/delete-node-button"
import { AudioUploadButton } from "@/components/tiptap-ui/audio-upload-button"
import { RefreshCcwIcon } from "@/components/tiptap-icons/refresh-ccw-icon"

// --- UI Primitive ---
import { Separator } from "@/components/tiptap-ui-primitive/separator"

export function AudioNodeFloating({
  editor: providedEditor,
}: {
  editor?: Editor | null
}) {
  const { editor } = useTiptapEditor(providedEditor)
  const visible = isNodeTypeSelected(editor, ["audio"])

  if (!editor || !visible) {
    return null
  }

  return (
    <>
      <AudioUploadButton icon={RefreshCcwIcon} tooltip="Replace" />
      <Separator />
      <DeleteNodeButton />
    </>
  )
}
