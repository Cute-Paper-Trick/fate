import { NodeSelection } from '@tiptap/pm/state';
import type { Editor, NodeViewProps } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { isValidPosition } from '@/lib/tiptap-utils';
import { RemoteWrapper } from '@/packages/pithos';

import './video-node-view.scss';

export const ResizableVideo: React.FC<ResizableVideoProps> = ({
  src,
  title = '',
  poster,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  editor,
  minWidth = 200,
  maxWidth = 800,
  align = 'left',
  initialWidth,
  showCaption = false,
  hasContent = false,
  nodeSize,
  onVideoResize,
  onUpdateAttributes,
  getPos,
}) => {
  const [resizeParams, setResizeParams] = useState<ResizeParams | undefined>();
  const [width, setWidth] = useState<number | undefined>(initialWidth);
  const [showHandles, setShowHandles] = useState(false);
  const isResizingRef = useRef(false);
  const isMountedRef = useRef(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftResizeHandleRef = useRef<HTMLDivElement>(null);
  const rightResizeHandleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Listen to editor selection changes to detect when focus leaves the caption
  useEffect(() => {
    if (!editor || !showCaption) return;

    const handleSelectionUpdate = () => {
      const pos = getPos();
      if (!isValidPosition(pos) || !nodeSize) return;

      const { from, to } = editor.state.selection;
      const nodeStart = pos;
      const nodeEnd = pos + nodeSize;

      // Check if selection is outside this video node
      const isOutsideNode = to < nodeStart || from > nodeEnd;

      if (isOutsideNode && !hasContent && onUpdateAttributes) {
        onUpdateAttributes({ showCaption: false });
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, showCaption, hasContent, getPos, nodeSize, onUpdateAttributes]);

  // Had to manually set the node selection on video click because
  // We treat the video-node-extension.ts as content: "inline*"
  const handleVideoClick = useCallback(
    (event: React.MouseEvent) => {
      if (!editor || !getPos || resizeParams) return;

      event.preventDefault();
      event.stopPropagation();

      const pos = getPos();
      if (isValidPosition(pos)) {
        editor.chain().focus().setNodeSelection(pos).run();
      }
    },
    [editor, getPos, resizeParams],
  );

  const windowMouseMoveHandler = useCallback(
    (event: MouseEvent | TouchEvent): void => {
      if (!resizeParams || !editor || !isMountedRef.current) return;

      const clientX = 'touches' in event ? (event.touches[0]?.clientX ?? 0) : event.clientX;
      const isLeftHandle = resizeParams.handleUsed === 'left';
      const multiplier = align === 'center' ? 2 : 1;

      const delta = isLeftHandle
        ? (resizeParams.initialClientX - clientX) * multiplier
        : (clientX - resizeParams.initialClientX) * multiplier;

      const newWidth = resizeParams.initialWidth + delta;
      const effectiveMaxWidth = editor.view.dom?.firstElementChild?.clientWidth || maxWidth;
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), effectiveMaxWidth);

      setWidth(clampedWidth);
      if (wrapperRef.current) {
        wrapperRef.current.style.width = `${clampedWidth}px`;
      }
    },
    [editor, align, maxWidth, minWidth, resizeParams],
  );

  const windowMouseUpHandler = useCallback(
    (event: MouseEvent | TouchEvent): void => {
      if (!editor || !isMountedRef.current) return;

      const target =
        'touches' in event
          ? document.elementFromPoint(
              event.changedTouches[0]?.clientX ?? 0,
              event.changedTouches[0]?.clientY ?? 0,
            )
          : event.target;

      const isInsideWrapper = target && wrapperRef.current?.contains(target as Node);

      if ((!isInsideWrapper || !editor.isEditable) && showHandles && isMountedRef.current) {
        setShowHandles(false);
      }

      if (!resizeParams) return;

      const wasNodeSelection =
        editor.state.selection instanceof NodeSelection &&
        editor.state.selection.node.type.name === 'video';

      if (isMountedRef.current) {
        setResizeParams(undefined);
      }
      onVideoResize?.(width);

      // Restore the node selection after resizing
      const pos = getPos();

      if (isValidPosition(pos) && wasNodeSelection && isMountedRef.current) {
        editor.chain().focus().setNodeSelection(pos).run();
      }

      isResizingRef.current = false;
    },
    [editor, getPos, onVideoResize, resizeParams, showHandles, width],
  );

  const startResize = useCallback(
    (handleUsed: 'left' | 'right', clientX: number) => {
      setResizeParams({
        handleUsed,
        initialWidth: wrapperRef.current?.clientWidth ?? minWidth,
        initialClientX: clientX,
      });
      isResizingRef.current = true;
    },
    [minWidth],
  );

  const leftResizeHandleMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    startResize('left', event.clientX);
  };

  const leftResizeHandleTouchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) startResize('left', touch.clientX);
  };

  const rightResizeHandleMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    startResize('right', event.clientX);
  };

  const rightResizeHandleTouchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) startResize('right', touch.clientX);
  };

  const wrapperMouseEnterHandler = () => {
    if (editor?.isEditable && isMountedRef.current) setShowHandles(true);
  };

  const wrapperMouseLeaveHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMountedRef.current) return;

    if (
      event.relatedTarget === leftResizeHandleRef.current ||
      event.relatedTarget === rightResizeHandleRef.current ||
      resizeParams
    )
      return;

    if (editor?.isEditable) setShowHandles(false);
  };

  const wrapperTouchStartHandler = () => {
    if (editor?.isEditable && isMountedRef.current) setShowHandles(true);
  };

  useEffect(() => {
    globalThis.addEventListener('mousemove', windowMouseMoveHandler);
    globalThis.addEventListener('mouseup', windowMouseUpHandler);
    globalThis.addEventListener('touchmove', windowMouseMoveHandler, {
      passive: false,
    });
    globalThis.addEventListener('touchend', windowMouseUpHandler);

    return () => {
      globalThis.removeEventListener('mousemove', windowMouseMoveHandler);
      globalThis.removeEventListener('mouseup', windowMouseUpHandler);
      globalThis.removeEventListener('touchmove', windowMouseMoveHandler);
      globalThis.removeEventListener('touchend', windowMouseUpHandler);
    };
  }, [windowMouseMoveHandler, windowMouseUpHandler]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const shouldShowCaption = showCaption || hasContent;

  return (
    <NodeViewWrapper
      className="tiptap-video"
      data-align={align}
      data-width={width}
      onMouseEnter={wrapperMouseEnterHandler}
      onMouseLeave={wrapperMouseLeaveHandler}
      onTouchStart={wrapperTouchStartHandler}
    >
      <div
        className="tiptap-video-container"
        ref={wrapperRef}
        style={{ width: width ? `${width}px` : 'fit-content' }}
      >
        <div className="tiptap-video-content">
          <RemoteWrapper path={src}>
            {(realSrc) => {
              return (
                <video
                  autoPlay={autoplay}
                  className="tiptap-video-element"
                  contentEditable={false}
                  controls={controls}
                  draggable={false}
                  loop={loop}
                  muted={muted}
                  onClick={handleVideoClick}
                  poster={poster}
                  ref={videoRef}
                  src={realSrc}
                  style={{ cursor: editor?.isEditable ? 'pointer' : 'default' }}
                  title={title}
                />
              );
            }}
          </RemoteWrapper>

          {showHandles && editor?.isEditable && (
            <>
              <div
                className="tiptap-video-handle tiptap-video-handle-left"
                onMouseDown={leftResizeHandleMouseDownHandler}
                onTouchStart={leftResizeHandleTouchStartHandler}
                ref={leftResizeHandleRef}
              />
              <div
                className="tiptap-video-handle tiptap-video-handle-right"
                onMouseDown={rightResizeHandleMouseDownHandler}
                onTouchStart={rightResizeHandleTouchStartHandler}
                ref={rightResizeHandleRef}
              />
            </>
          )}
        </div>

        {editor?.isEditable && shouldShowCaption && (
          <NodeViewContent
            as="div"
            className="tiptap-video-caption"
            data-placeholder="Add a caption..."
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

export interface ResizeParams {
  handleUsed: 'left' | 'right';
  initialWidth: number;
  initialClientX: number;
}

export interface ResizableVideoProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  title?: string;
  poster?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  editor?: Editor;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  initialWidth?: number;
  showCaption?: boolean;
  hasContent?: boolean;
  onVideoResize?: (width?: number) => void;

  onUpdateAttributes?: (attrs: Record<string, any>) => void;
  getPos: () => number | undefined;
  nodeSize?: number;
}

export function VideoNodeView(props: NodeViewProps) {
  const { editor, node, updateAttributes, getPos } = props;
  const hasContent = node.content.size > 0;

  return (
    <ResizableVideo
      align={node.attrs['data-align']}
      autoplay={node.attrs.autoplay}
      controls={node.attrs.controls}
      editor={editor}
      getPos={getPos}
      hasContent={hasContent}
      initialWidth={node.attrs.width}
      loop={node.attrs.loop}
      muted={node.attrs.muted}
      nodeSize={node.nodeSize}
      onUpdateAttributes={updateAttributes}
      onVideoResize={(width) => updateAttributes({ width })}
      poster={node.attrs.poster}
      showCaption={node.attrs.showCaption}
      src={node.attrs.src}
      title={node.attrs.title || ''}
    />
  );
}
