'use client';

import { Pagination as Page } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo } from 'react';

const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    page: css`
      .${prefixCls}-pagination-item-active {
        border-color: ${token.colorFillSecondary};
        background: ${token.colorFillSecondary};

        &:hover {
          border-color: ${token.colorFill};
          background: ${token.colorFill};
        }
      }
    `,
  };
});

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
}

const Pagination = memo<PaginationProps>(({ currentPage, total, pageSize }) => {
  const [page, setPage] = useQueryState('page', { ...parseAsInteger, defaultValue: 1 });
  const { styles } = useStyles();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Page
      className={styles.page}
      current={page ? Number(page) : currentPage}
      data-testid="pagination"
      onChange={handlePageChange}
      pageSize={pageSize}
      showSizeChanger={false}
      style={{
        alignSelf: 'flex-end',
      }}
      total={total}
    />
  );
});

export default Pagination;
