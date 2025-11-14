'use client';

import { Markdown } from '@lobehub/ui';
import { useResponsive } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useDetailContext } from '@/features/TutorialDetail/DetailProvider';

const Details = memo<{ mobile?: boolean }>(({ mobile: isMobile }) => {
  const { mobile = isMobile } = useResponsive();

  const { content } = useDetailContext();

  return (
    <Flexbox gap={24}>
      <Flexbox
        gap={48}
        horizontal={!mobile}
        style={mobile ? { flexDirection: 'column-reverse' } : undefined}
      >
        <Markdown allowHtml>{content ?? ''}</Markdown>
      </Flexbox>
    </Flexbox>
  );
});

export default Details;
