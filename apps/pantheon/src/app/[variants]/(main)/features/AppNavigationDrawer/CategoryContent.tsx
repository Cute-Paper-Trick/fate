'use client';

import { usePathname } from 'next/navigation';
import { memo } from 'react';

import Menu from '@/components/Menu';
import { useQueryRoute } from '@/hooks/useQueryRoute';

import { useCategory } from './useCategory';

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
        router.push(`/${key}`);
      }}
      selectable
      selectedKeys={activeTab ? [activeTab] : []}
    />
  );
});

export default CategoryContent;
