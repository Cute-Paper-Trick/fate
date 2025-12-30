"use client"

import { useCallback, useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { type Editor } from "@tiptap/react"
import { NodeSelection } from "@tiptap/pm/state"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"

// --- Lib ---
import { isExtensionAvailable } from "@/lib/tiptap-utils"

// --- Icons ---
import { AlignCenterVerticalIcon } from "@/components/tiptap-icons/align-center-vertical-icon"
import { AlignEndVerticalIcon } from "@/components/tiptap-icons/align-end-vertical-icon"
import { AlignStartVerticalIcon } from "@/components/tiptap-icons/align-start-vertical-icon"

export type VideoAlign = "left" | "center" | "right"

/**
 * Configuration for the video align functionality
 */
export interface UseVideoAlignConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * The video alignment to apply.
   */
  align: VideoAlign
  /**
   * The name of the video extension to target.
   * @default "video"
   */
  extensionName?: string
  /**
   * The attribute name used for alignment.
   * @default "data-align"
   */
  attributeName?: string
  /**
   * Whether the button should hide when alignment is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful alignment change.
   */
  onAligned?: () => void
}

export const VIDEO_ALIGN_SHORTCUT_KEYS: Record<VideoAlign, string> = {
  left: "alt+shift+l",
  center: "alt+shift+e",
  right: "alt+shift+r",
}

export const videoAlignIcons = {
  left: AlignStartVerticalIcon,
  center: AlignCenterVerticalIcon,
  right: AlignEndVerticalIcon,
}

export const videoAlignLabels: Record<VideoAlign, string> = {
  left: "Video align left",
  center: "Video align center",
  right: "Video align right",
}

/**
 * Checks if video alignment can be performed in the current editor state
 */
export function canSetVideoAlign(
  editor: Editor | null,
  align: VideoAlign,
  extensionName: string = "video",
  attributeName: string = "data-align"
): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, [extensionName])) return false

  return editor
    .can()
    .updateAttributes(extensionName, { [attributeName]: align })
}

/**
 * Checks if the video alignment is currently active
 */
export function isVideoAlignActive(
  editor: Editor | null,
  align: VideoAlign,
  extensionName: string = "video",
  attributeName: string = "data-align"
): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, [extensionName])) return false

  const attributes = editor.getAttributes(extensionName)
  const currentAlign = attributes[attributeName] || "left"
  return currentAlign === align
}

/**
 * Sets video alignment in the editor
 */
export function setVideoAlign(
  editor: Editor | null,
  align: VideoAlign,
  extensionName: string = "video",
  attributeName: string = "data-align"
): boolean {
  if (!editor?.isEditable) {
    return false
  }

  if (!isExtensionAvailable(editor, [extensionName])) {
    return false
  }

  if (!canSetVideoAlign(editor, align, extensionName, attributeName)) {
    return false
  }

  try {
    const { selection } = editor.state
    const isNodeSelection = selection instanceof NodeSelection
    const selectionPosition = isNodeSelection
      ? selection.from
      : selection.$anchor.pos

    const alignmentUpdated = editor
      .chain()
      .focus()
      .updateAttributes(extensionName, { [attributeName]: align })
      .run()

    // Restore node selection if it was originally selected
    if (alignmentUpdated && isNodeSelection) {
      editor.commands.setNodeSelection(selectionPosition)
    }

    return alignmentUpdated
  } catch {
    return false
  }
}

/**
 * Determines if the video align button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
  align: VideoAlign
  extensionName?: string
  attributeName?: string
}): boolean {
  const {
    editor,
    hideWhenUnavailable,
    align,
    extensionName = "video",
    attributeName = "data-align",
  } = props

  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, [extensionName])) return false

  if (hideWhenUnavailable) {
    return canSetVideoAlign(editor, align, extensionName, attributeName)
  }

  return true
}

/**
 * Custom hook that provides video align functionality for Tiptap editor
 */
export function useVideoAlign(config: UseVideoAlignConfig) {
  const {
    editor: providedEditor,
    align,
    extensionName = "video",
    attributeName = "data-align",
    hideWhenUnavailable = false,
    onAligned,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const isMobile = useIsBreakpoint()
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canAlign = canSetVideoAlign(editor, align, extensionName, attributeName)
  const isActive = isVideoAlignActive(
    editor,
    align,
    extensionName,
    attributeName
  )

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowButton({
          editor,
          align,
          hideWhenUnavailable,
          extensionName,
          attributeName,
        })
      )
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable, align, extensionName, attributeName])

  const handleVideoAlign = useCallback(() => {
    if (!editor) return false

    const success = setVideoAlign(editor, align, extensionName, attributeName)
    if (success) {
      onAligned?.()
    }
    return success
  }, [editor, align, extensionName, attributeName, onAligned])

  useHotkeys(
    VIDEO_ALIGN_SHORTCUT_KEYS[align],
    (event) => {
      event.preventDefault()
      handleVideoAlign()
    },
    {
      enabled: isVisible && canAlign,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    }
  )

  return {
    isVisible,
    isActive,
    handleVideoAlign,
    canAlign,
    label: videoAlignLabels[align],
    shortcutKeys: VIDEO_ALIGN_SHORTCUT_KEYS[align],
    Icon: videoAlignIcons[align],
  }
}
