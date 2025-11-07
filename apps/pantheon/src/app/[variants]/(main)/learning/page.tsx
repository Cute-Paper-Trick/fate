'use client';

import { FC } from 'react';

import TaskBreadcrumb from './features/task-breadcrumb/page';
import TaskList from './features/task-list/page';

const Learning: FC = () => {
  return (
    <>
      <TaskBreadcrumb />
      <TaskList />
    </>
  );
};

export default Learning;
