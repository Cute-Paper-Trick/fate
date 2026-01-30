'use client';

import { ActionIcon, Header } from '@lobehub/ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Badge } from 'antd';
import { Bell } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import PantheonLogo from '@/components/brand/PantheonLogo';
import PantheonText from '@/components/brand/PantheonText';
import { axiosInstance } from '@/lib/http/axiosClient';

import Avatar from './Avatar';

const Nav = memo(() => {
  const unread = useQuery({
    queryFn: async () => {
      const response = await axiosInstance.get('/api/notice/unread_count');
      return response.data as { count: number };
    },
    queryKey: ['notice', 'unreadCount'],
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const markread = useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/api/notice/mark_read', { notice_id_list: [], mark_all: true });
    },
    onMutate: () => unread.refetch(),
  });

  return (
    <Header
      actions={
        <Flexbox align="center" gap={20} horizontal justify="center">
          <Badge count={unread.data?.count ?? 0} size="small">
            <ActionIcon
              icon={Bell}
              onClick={() => {
                markread.mutate();
                window.open(
                  `${process.env.NEXT_PUBLIC_GOOODSPACE_APP_URL}/notifications`,
                  '_blank',
                );
              }}
              title="通知中心"
            />
          </Badge>
          <Avatar />
        </Flexbox>
      }
      logo={
        <Flexbox align="center" gap={8} horizontal>
          <PantheonLogo alt="Pantheon" size={34} />
          <PantheonText size={28} />
        </Flexbox>
      }
      style={{ paddingLeft: 12 }}
    />
  );
});

Nav.displayName = 'DesktopTopNav';

export default Nav;
