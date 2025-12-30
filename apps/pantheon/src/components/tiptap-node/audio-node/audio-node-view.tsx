'use client';

import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import { RemoteWrapper } from '@/packages/pithos';

import './audio-node.scss';

export function AudioNodeView(props: NodeViewProps) {
  const { node, selected } = props;

  return (
    <NodeViewWrapper className="tiptap-audio" data-selected={selected}>
      <div className="tiptap-audio-container">
        <RemoteWrapper path={node.attrs.src}>
          {(realSrc) => (
            <AudioPlayer
              autoPlay={node.attrs.autoplay}
              customAdditionalControls={[]}
              customVolumeControls={[]}
              layout="horizontal-reverse"
              loop={node.attrs.loop}
              showJumpControls={false}
              src={realSrc}
            />
          )}
        </RemoteWrapper>
      </div>
    </NodeViewWrapper>
  );
}
