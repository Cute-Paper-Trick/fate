import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import { isNodeTypeSelected } from "@/lib/tiptap-utils"

// --- Tiptap UI ---
import { DeleteNodeButton } from "@/components/tiptap-ui/delete-node-button"
import { VideoAlignButton } from "@/components/tiptap-ui/video-align-button"
import { VideoCaptionButton } from "@/components/tiptap-ui/video-caption-button"
import { VideoUploadButton } from "@/components/tiptap-ui/video-upload-button"
import { RefreshCcwIcon } from "@/components/tiptap-icons/refresh-ccw-icon"

// --- UI Primitive ---
import { Separator } from "@/components/tiptap-ui-primitive/separator"

export function VideoNodeFloating({
  editor: providedEditor,
}: {
  editor?: Editor | null
}) {
  const { editor } = useTiptapEditor(providedEditor)
  const visible = isNodeTypeSelected(editor, ["video"])

  if (!editor || !visible) {
    return null
  }

  return (
    <>
      <VideoAlignButton align="left" />
      <VideoAlignButton align="center" />
      <VideoAlignButton align="right" />
      <Separator />
      <VideoCaptionButton />
      <Separator />
      <VideoUploadButton icon={RefreshCcwIcon} tooltip="Replace" />
      <Separator />
      <DeleteNodeButton />
    </>
  )
}
