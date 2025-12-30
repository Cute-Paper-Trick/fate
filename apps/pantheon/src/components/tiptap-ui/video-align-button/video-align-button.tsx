"use client"

import { forwardRef, useCallback } from "react"

// --- Lib ---
import { parseShortcutKeys } from "@/lib/tiptap-utils"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Tiptap UI ---
import type {
  VideoAlign,
  UseVideoAlignConfig,
} from "@/components/tiptap-ui/video-align-button"
import {
  VIDEO_ALIGN_SHORTCUT_KEYS,
  useVideoAlign,
} from "@/components/tiptap-ui/video-align-button"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Badge } from "@/components/tiptap-ui-primitive/badge"

export interface VideoAlignButtonProps
  extends Omit<ButtonProps, "type">,
    UseVideoAlignConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
  showShortcut?: boolean
}

export function VideoAlignShortcutBadge({
  align,
  shortcutKeys = VIDEO_ALIGN_SHORTCUT_KEYS[align],
}: {
  align: VideoAlign
  shortcutKeys?: string
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>
}

/**
 * Button component for setting video alignment in a Tiptap editor.
 *
 * For custom button implementations, use the `useVideoAlign` hook instead.
 */
export const VideoAlignButton = forwardRef<
  HTMLButtonElement,
  VideoAlignButtonProps
>(
  (
    {
      editor: providedEditor,
      align,
      text,
      extensionName,
      attributeName = "data-align",
      hideWhenUnavailable = false,
      onAligned,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const {
      isVisible,
      handleVideoAlign,
      label,
      canAlign,
      isActive,
      Icon,
      shortcutKeys,
    } = useVideoAlign({
      editor,
      align,
      extensionName,
      attributeName,
      hideWhenUnavailable,
      onAligned,
    })

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleVideoAlign()
      },
      [handleVideoAlign, onClick]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        disabled={!canAlign}
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        data-disabled={!canAlign}
        role="button"
        tabIndex={-1}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut ? (
              <VideoAlignShortcutBadge
                align={align}
                shortcutKeys={shortcutKeys}
              />
            ) : null}
          </>
        )}
      </Button>
    )
  }
)

VideoAlignButton.displayName = "VideoAlignButton"
