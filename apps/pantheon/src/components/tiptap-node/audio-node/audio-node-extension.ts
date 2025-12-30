import { ReactNodeViewRenderer, Node, mergeAttributes } from "@tiptap/react"
import { AudioNodeView } from "@/components/tiptap-node/audio-node/audio-node-view"

interface AudioAttributes {
  src: string | null
  title?: string | null
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
}

export interface AudioOptions {
  /**
   * Controls whether the audio should have controls.
   * @default true
   */
  controls: boolean

  /**
   * Controls whether the audio should autoplay.
   * @default false
   */
  autoplay: boolean

  /**
   * Controls whether the audio should loop.
   * @default false
   */
  loop: boolean

  /**
   * HTML attributes to add to the audio element.
   * @default {}
   */
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    audio: {
      /**
       * Add an audio
       * @param options The audio attributes
       * @example
       * editor
       *   .commands
       *   .setAudio({ src: 'https://example.com/audio.mp3' })
       */
      setAudio: (options: { src: string; title?: string }) => ReturnType
    }
  }
}

const parseAudioAttributes = (audio: Element): Partial<AudioAttributes> => ({
  src: audio.getAttribute("src"),
  title: audio.getAttribute("title"),
  controls: audio.hasAttribute("controls"),
  autoplay: audio.hasAttribute("autoplay"),
  loop: audio.hasAttribute("loop"),
})

function buildAudioHTMLAttributes(
  attrs: AudioAttributes
): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = { src: attrs.src || "" }

  if (attrs.title) result.title = attrs.title
  if (attrs.controls) result.controls = true
  if (attrs.autoplay) result.autoplay = true
  if (attrs.loop) result.loop = true

  return result
}

export const Audio = Node.create<AudioOptions>({
  name: "audio",

  group: "block",

  atom: true,

  draggable: true,

  selectable: true,

  addOptions() {
    return {
      controls: true,
      autoplay: false,
      loop: false,
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
      controls: {
        default: this.options.controls,
      },
      autoplay: {
        default: this.options.autoplay,
      },
      loop: {
        default: this.options.loop,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='audio']",
        getAttrs: (node) => {
          const audio = node.querySelector("audio")
          if (!audio) return false

          return parseAudioAttributes(audio)
        },
      },
      {
        tag: "audio[src]",
        getAttrs: (node) => {
          return parseAudioAttributes(node)
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, title, controls, autoplay, loop } = node.attrs

    const audioAttrs = buildAudioHTMLAttributes({
      src,
      title,
      controls,
      autoplay,
      loop,
    })

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, { "data-type": "audio" }, HTMLAttributes),
      ["audio", audioAttrs],
    ]
  },

  addCommands() {
    return {
      setAudio:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioNodeView)
  },
})

export default Audio
