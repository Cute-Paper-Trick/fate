import { Avatar, Block, Text } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useCategory } from '@/hooks/useTutorialCategory';
import { TutorialIndexItem } from '@/types/discover';

const useStyles = createStyles(({ css, token }) => {
  return {
    desc: css`
      flex: 1;
      margin: 0 !important;
      font-size: 14px !important;
      color: ${token.colorTextSecondary};
    `,
    title: css`
      margin: 0 !important;
      font-size: 14px !important;
      font-weight: 500 !important;

      &:hover {
        color: ${token.colorLink};
      }
    `,
  };
});

const RelatedItem = memo<TutorialIndexItem>(({ title, category, description, id: identifier }) => {
  const { styles } = useStyles();
  const categories = useCategory();
  const cate = categories.find((c) => c.key === category);
  return (
    <Block gap={12} horizontal key={identifier} padding={12} variant={'outlined'}>
      <Avatar avatar={cate?.icon ? <cate.icon /> : null} size={40} style={{ flex: 'none' }} />
      <Flexbox
        flex={1}
        gap={6}
        style={{
          overflow: 'hidden',
        }}
      >
        <Text as={'h2'} className={styles.title} ellipsis>
          {title}
        </Text>
        <Text
          as={'p'}
          className={styles.desc}
          ellipsis={{
            rows: 2,
          }}
        >
          {description}
        </Text>
      </Flexbox>
    </Block>
  );
});

export default RelatedItem;
