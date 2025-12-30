import { ReactNodeViewRenderer, Node, mergeAttributes } from "@tiptap/react"
import { VideoNodeView } from "@/components/tiptap-node/video-node/video-node-view"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import { TextSelection } from "@tiptap/pm/state"

interface VideoAttributes {
  src: string | null
  title?: string | null
  width?: string | null
  height?: string | null
  poster?: string | null
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  "data-align"?: string | null
}

export interface VideoOptions {
  /**
   * Controls whether the video element should be rendered inline.
   * @default false
   * @example true
   */
  inline: boolean

  /**
   * Controls whether the video should have controls.
   * @default true
   * @example false
   */
  controls: boolean

  /**
   * Controls whether the video should autoplay.
   * @default false
   * @example true
   */
  autoplay: boolean

  /**
   * Controls whether the video should loop.
   * @default false
   * @example true
   */
  loop: boolean

  /**
   * Controls whether the video should be muted.
   * @default false
   * @example true
   */
  muted: boolean

  /**
   * HTML attributes to add to the video element.
   * @default {}
   * @example { class: 'foo' }
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    video: {
      /**
       * Add a video
       * @param options The video attributes
       * @example
       * editor
       *   .commands
       *   .setVideo({ src: 'https://example.com/video.mp4' })
       */
      setVideo: (options: { src: string; title?: string; poster?: string }) => ReturnType
    }
  }
}

const parseVideoAttributes = (video: Element): Partial<VideoAttributes> => ({
  src: video.getAttribute("src"),
  title: video.getAttribute("title"),
  width: video.getAttribute("width"),
  height: video.getAttribute("height"),
  poster: video.getAttribute("poster"),
  controls: video.hasAttribute("controls"),
  autoplay: video.hasAttribute("autoplay"),
  loop: video.hasAttribute("loop"),
  muted: video.hasAttribute("muted"),
})

function buildVideoHTMLAttributes(
  attrs: VideoAttributes
): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = { src: attrs.src || "" }

  if (attrs.title) result.title = attrs.title
  if (attrs.width) result.width = attrs.width
  if (attrs.height) result.height = attrs.height
  if (attrs.poster) result.poster = attrs.poster
  if (attrs.controls) result.controls = true
  if (attrs.autoplay) result.autoplay = true
  if (attrs.loop) result.loop = true
  if (attrs.muted) result.muted = true

  return result
}

export const Video = Node.create<VideoOptions>({
  name: "video",

  group: "block",

  content: "inline*",

  draggable: true,

  selectable: true,

  addOptions() {
    return {
      inline: false,
      controls: true,
      autoplay: false,
      loop: false,
      muted: false,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      poster: {
        default: null,
      },
      controls: {
        default: this.options.controls,
      },
      autoplay: {
        default: this.options.autoplay,
      },
      loop: {
        default: this.options.loop,
      },
      muted: {
        default: this.options.muted,
      },
      "data-align": {
        default: null,
      },
      showCaption: {
        default: false,
        parseHTML: (element) => {
          return (
            element.tagName === "FIGURE" ||
            element.getAttribute("data-show-caption") === "true"
          )
        },
        renderHTML: (attributes) => {
          if (!attributes.showCaption) return {}
          return { "data-show-caption": "true" }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-type='video']",
        getAttrs: (node) => {
          const video = node.querySelector("video")
          if (!video) return false

          return {
            ...parseVideoAttributes(video),
            "data-align": node.getAttribute("data-align"),
            showCaption: true,
          }
        },
        contentElement: "figcaption",
      },
      {
        tag: "video[src]",
        getAttrs: (node) => {
          if (node.closest("figure")) return false

          return {
            ...parseVideoAttributes(node),
            "data-align": node.getAttribute("data-align"),
            showCaption: false,
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, title, width, height, poster, controls, autoplay, loop, muted, showCaption } = node.attrs
    const align = node.attrs["data-align"]

    const videoAttrs = buildVideoHTMLAttributes({
      src,
      title,
      width,
      height,
      poster,
      controls,
      autoplay,
      loop,
      muted,
    })

    const hasContent = node.content.size > 0

    if (showCaption || hasContent) {
      const figureAttrs: Record<string, string> = {
        "data-type": "video",
        "data-url": src || "",
      }
      if (showCaption) figureAttrs["data-show-caption"] = "true"
      if (align) figureAttrs["data-align"] = align

      return [
        "figure",
        mergeAttributes(this.options.HTMLAttributes, figureAttrs, HTMLAttributes),
        ["video", videoAttrs],
        ["figcaption", {}, 0],
      ]
    }

    if (align) videoAttrs["data-align"] = align
    return ["video", mergeAttributes(this.options.HTMLAttributes, videoAttrs, HTMLAttributes)]
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      "Mod-a": ({ editor }) => {
        const { state, view } = editor
        const { selection } = state
        const { $from } = selection

        let videoPos: number | null = null
        let videoNode: ProseMirrorNode | null = null

        for (let depth = $from.depth; depth >= 0; depth--) {
          const nodeAtDepth = $from.node(depth)
          if (nodeAtDepth.type === this.type) {
            videoNode = nodeAtDepth
            videoPos = depth === 0 ? 0 : $from.before(depth)
            break
          }
        }

        // Not inside a Video → let default behavior happen
        if (!videoNode || videoPos == null) {
          return false
        }

        // If the caption/content is empty, allow the default progressive select-all
        const contentIsEmpty =
          videoNode.content.size === 0 || videoNode.textContent.length === 0

        if (contentIsEmpty) {
          return false
        }

        // Compute the content range of the video node:
        const start = videoPos + 1
        const end = videoPos + videoNode.nodeSize - 1

        const tr = state.tr.setSelection(
          TextSelection.create(state.doc, start, end)
        )
        view.dispatch(tr)

        return true
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView)
  },
})

export default Video
