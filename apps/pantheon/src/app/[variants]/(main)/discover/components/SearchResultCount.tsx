'use client';

import { T } from '@tolgee/react';
import { createStyles } from 'antd-style';
import { memo } from 'react';

import Title from './Title';

const useStyles = createStyles(({ css, token }) => ({
  highlight: css`
    color: ${token.colorInfo};

    &::before,
    &::after {
      content: '\`';
    }
  `,
}));

const SearchResultCount = memo<{ count: number; keyword: string }>(({ keyword, count }) => {
  const { styles } = useStyles();

  console.log(keyword, count, styles);
  return (
    <Title>
      <T
        // components={{ highlight: <span className={styles.highlight} /> }}
        keyName={'search.result'}
        ns={'discover'}
        // values={{
        //   count,
        //   keyword,
        // }}
      />
    </Title>
  );
});

export default SearchResultCount;
