import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { reactionCategories } from '../consts';
import Reaction from './item';

const useStyles = createStyles(({ css }) => ({
  wrapper: css`
    gap: 2.2rem;
    padding-block: 0.25rem;
  `,
}));

interface ReactionsEngagementProps {
  engagement: Record<string, number>;
}

const ReactionsEngagement = memo<ReactionsEngagementProps>(({ engagement }) => {
  const { styles } = useStyles();

  return (
    <Flexbox className={styles.wrapper} horizontal>
      {reactionCategories.map((category) => (
        <Reaction category={category} count={engagement[category.cate]} key={category.cate} />
      ))}
    </Flexbox>
  );
});

ReactionsEngagement.displayName = 'ReactionsEngagement';

export default ReactionsEngagement;
