'use client';

import { useQuery as useDataQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { withSuspense } from '@/components/withSuspense';
import { useQuery } from '@/hooks/useQuery';
import { DiscoverTab, TutorialIndexItem, TutorialQueryParams } from '@/types/discover';

import Pagination from '../features/Pagination';
import List from './features/List';
import Loading from './loading';

const Client = memo<{ mobile?: boolean }>(() => {
  const { page = 1 } = useQuery() as TutorialQueryParams;

  const { data, isLoading } = useDataQuery({
    queryKey: ['tutorial', 'list', { page }],
    queryFn: async () => {
      const search = new URLSearchParams({ page: page.toString(), pageSize: '21' });
      const res = await fetch(`/webapi/tutorial?${search}`, {
        credentials: 'include',
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch tutorial list');
      }
      const data = (await res.json()) as {
        list: TutorialIndexItem[];
        currentPage: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
      };
      return data;
    },
  });

  if (isLoading || !data) return <Loading />;

  const { list: items, currentPage, pageSize, totalCount } = data;

  return (
    <Flexbox gap={32} width={'100%'}>
      <List data={items} />
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        tab={DiscoverTab.Tutorial}
        total={totalCount}
      />
    </Flexbox>
  );
});

export default withSuspense(Client);
