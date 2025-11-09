'use client';

import { useQuery as useDataQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Divider from '@/components/Cell/Divider';
import { withSuspense } from '@/components/withSuspense';
import { DetailProvider } from '@/features/TutorialDetail/DetailProvider';
import Header from '@/features/TutorialDetail/Header';

// import { useFetchInstalledPlugins } from '@/hooks/useFetchInstalledPlugins';
// import { useQuery } from '@/hooks/useQuery';
// import { useDiscoverStore } from '@/store/discover';
// import { DiscoverTab } from '@/types/discover';
// import Breadcrumb from '../../features/Breadcrumb';
// import { TocProvider } from '../../features/Toc/useToc';
import Details from './features/Details';
import Loading from './loading';

const Client = memo<{ identifier: string; mobile?: boolean }>(({ identifier, mobile }) => {
  // const { version } = useQuery() as { version?: string };
  // const useMcpDetail = useDiscoverStore((s) => s.useFetchMcpDetail);
  // const { data, isLoading } = useMcpDetail({ identifier, version });
  const { data, isLoading } = useDataQuery({
    queryKey: ['discover', 'tutorial', identifier],
    queryFn: async () => {
      const res = await fetch(`/webapi/tutorial/${identifier}`, {
        credentials: 'include',
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch tutorial detail');
      }

      return res.json();
    },
  });
  // useFetchInstalledPlugins();

  if (isLoading) return <Loading />;
  if (!data) return notFound();

  return (
    // <TocProvider>
    <DetailProvider config={data}>
      {/* {!mobile && <Breadcrumb identifier={identifier} tab={DiscoverTab.Mcp} />} */}
      <Flexbox gap={16}>
        <Header mobile={mobile} />
        <Divider />
        <Details mobile={mobile} />
      </Flexbox>
    </DetailProvider>
    // </TocProvider>
  );
});

export default withSuspense(Client);
