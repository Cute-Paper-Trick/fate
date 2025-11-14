'use client';

import { usePathname } from 'next/navigation';
import { memo } from 'react';
import urlJoin from 'url-join';

import Menu from '@/components/Menu';
import { useQueryRoute } from '@/hooks/useQueryRoute';

import { useCategory } from '../../hooks/useCategory';

const CategoryContent = memo(() => {
  const pathname = usePathname();
  const activeTab = pathname.split('/').at(-1);
  const cateItems = useCategory();
  const router = useQueryRoute();

  return (
    <Menu
      compact
      items={cateItems}
      onClick={({ key }) => {
        const activeKey = key;
        router.push(urlJoin('/talk', activeKey));
      }}
      selectable
      selectedKeys={activeTab ? [activeTab] : []}
    />
  );
});

export default CategoryContent;
