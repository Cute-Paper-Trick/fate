"use client"

import { useCallback, useEffect, useState } from "react"
import { type Editor } from "@tiptap/react"
import { NodeSelection } from "@tiptap/pm/state"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import {
  isExtensionAvailable,
  isNodeTypeSelected,
} from "@/lib/tiptap-utils"

// --- Icons ---
import { ImageCaptionIcon } from "@/components/tiptap-icons/image-caption-icon"

/**
 * Configuration for the video caption functionality
 */
export interface UseVideoCaptionConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when caption toggle is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful caption set.
   */
  onSet?: () => void
}

/**
 * Checks if video caption can be toggled in the current editor state
 */
export function canToggleVideoCaption(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, ["video"])) return false

  return isNodeTypeSelected(editor, ["video"])
}

/**
 * Checks if the currently selected video has caption enabled
 */
export function isVideoCaptionActive(editor: Editor | null): boolean {
  if (!editor) return false

  try {
    const { selection } = editor.state
    const isVideoSelected =
      selection instanceof NodeSelection && selection.node.type.name === "video"

    if (!isVideoSelected) {
      return false
    }

    const videoNode = (selection as NodeSelection).node
    return videoNode.attrs.showCaption === true || videoNode.content.size > 0
  } catch {
    return false
  }
}

/**
 * Toggles the video caption in the editor
 */
export function setVideoCaption(editor: Editor | null): boolean {
  if (!editor?.isEditable || !canToggleVideoCaption(editor)) {
    return false
  }

  try {
    const { selection } = editor.state
    const isVideoSelected =
      selection instanceof NodeSelection && selection.node.type.name === "video"

    if (!isVideoSelected) {
      return false
    }

    const captionEnabled = editor
      .chain()
      .focus()
      .updateAttributes("video", { showCaption: true })
      .run()

    if (!captionEnabled) {
      return false
    }

    const videoPosition = selection.from
    editor
      .chain()
      .focus(videoPosition + 1)
      .selectTextblockEnd()
      .run()

    return true
  } catch {
    return false
  }
}

/**
 * Determines if the video caption button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, ["video"])) return false

  if (hideWhenUnavailable) {
    return canToggleVideoCaption(editor)
  }

  return true
}

/**
 * Custom hook that provides video caption functionality for Tiptap editor
 */
export function useVideoCaption(config?: UseVideoCaptionConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSet,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isActive, setIsActive] = useState<boolean>(false)
  const canToggle = canToggleVideoCaption(editor)

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
      setIsActive(isVideoCaptionActive(editor))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleToggleCaption = useCallback(() => {
    if (!editor) return false

    const success = setVideoCaption(editor)
    if (success) {
      onSet?.()
    }
    return success
  }, [editor, onSet])

  return {
    isVisible,
    isActive,
    canToggle,
    handleToggleCaption,
    label: "Caption",
    Icon: ImageCaptionIcon,
  }
}
