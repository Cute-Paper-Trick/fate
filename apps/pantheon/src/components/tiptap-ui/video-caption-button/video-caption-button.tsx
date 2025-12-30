"use client"

import * as React from "react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Tiptap UI ---
import type { UseVideoCaptionConfig } from "@/components/tiptap-ui/video-caption-button"
import { useVideoCaption } from "@/components/tiptap-ui/video-caption-button"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"

export interface VideoCaptionButtonProps
  extends Omit<ButtonProps, "type">,
    UseVideoCaptionConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
}

/**
 * Button component for toggling video captions in a Tiptap editor.
 * Only appears when a video is selected in the editor.
 *
 * For custom button implementations, use the `useVideoCaption` hook instead.
 */
export const VideoCaptionButton = React.forwardRef<
  HTMLButtonElement,
  VideoCaptionButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onSet,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const { isVisible, isActive, canToggle, handleToggleCaption, label, Icon } =
      useVideoCaption({
        editor,
        hideWhenUnavailable,
        onSet,
      })

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleToggleCaption()
      },
      [handleToggleCaption, onClick]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        role="button"
        tabIndex={-1}
        disabled={!canToggle}
        data-disabled={!canToggle}
        aria-label={label}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

VideoCaptionButton.displayName = "VideoCaptionButton"
