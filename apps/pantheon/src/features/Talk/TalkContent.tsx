import { Text } from '@lobehub/ui';
import { memo } from 'react';

import { wrapClosestHashWithLink } from './helper/wrapClosestHashWithLink';

interface TalkContentProps {
  content: string;
}

const TalkContent = memo<TalkContentProps>(({ content }) => {
  const formatedContent = wrapClosestHashWithLink(content);
  return <Text style={{ whiteSpace: 'pre-wrap' }}>{formatedContent}</Text>;
});

TalkContent.displayName = 'TalkContent';

export default TalkContent;
