'use client';

import { Button, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import { appEnv } from '@/envs/app';
import { TopicCreateInner } from '@/features/Talk/TalkCreate/topic-create-inner';
import { V1TaskUserInfo } from '@/lib/http';
import { useTaskButtons } from '@/store/learning/helpers';
import { TaskButtonConfig, TaskButtonGroupProps } from '@/store/learning/initialState';
import { useLearningStore } from '@/store/learning/store';

import styles from './index.module.css';

const validButtonTypes = ['primary', 'link', 'text', 'default', 'dashed'] as const;
const goComplete = (item: V1TaskUserInfo, router: any) => {
  //去挑战
  console.log('appEnv.NEXT_PUBLIC_CHAT_APP_URL', appEnv.NEXT_PUBLIC_CHAT_APP_URL);
  const { page } = JSON.parse(item.jump) as { page: string };
  if (page === 'chat') {
    window.open(`${appEnv.NEXT_PUBLIC_CHAT_APP_URL}/chat`, '_blank');
    return;
  }
  if (page === 'pose') {
    router.push('/lab');
  }
  if (page === 'audio') {
    router.push('/lab');
  }
  if (page === 'image') {
    router.push('/lab');
  }
};
type ButtonType = (typeof validButtonTypes)[number];

export const TaskButtonGroup: React.FC<TaskButtonGroupProps> = ({ item }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { completeTask } = useLearningStore();
  const useFetchTaskList = useLearningStore((s) => s.useFetchTaskList);
  const { data: taskList } = useFetchTaskList({});

  const { getTaskButtons } = useTaskButtons();
  const [createVisible, setCreateVisible] = useState(false);
  const [taskIndex, setTaskIndex] = useState<any>(null);
  const handleButtonClick = (config: TaskButtonConfig) => {
    if (config?.action === 'challenge') {
      goComplete(item, router); // 跳转页面
    } else if (config?.action === 'complete') {
      setIsModalOpen(true); // 显示去完成弹框
      setCreateVisible(true); // 显示TopicCreateInner
      if (config?.taskIndex) {
        setTaskIndex(config.taskIndex);
      }
    }
  };

  const listData = useMemo(() => taskList?.list, [taskList?.list]);

  const listDict = useMemo(
    () =>
      listData?.reduce(
        (acc, cur) => ((acc[cur.index] = cur), acc),
        {} as Record<number, V1TaskUserInfo>,
      ) || {},
    [listData],
  );

  const buttonConfigs = getTaskButtons(item, listDict);

  return (
    <div className={styles.taskButton}>
      {buttonConfigs.map((config, index) => (
        <Button
          disabled={'disabled' in config ? config.disabled : false}
          key={index}
          onClick={() => {
            if ('action' in config && config.action) {
              handleButtonClick(config);
            }
          }}
          style={{
            color: config.type !== 'primary' ? config.color : '',
            border: config.type === 'default' ? `1px solid ${config.color}` : '',
            backgroundColor: config.type === 'primary' ? config.color : '',
          }}
          type={
            'type' in config && config.type && validButtonTypes.includes(config.type as ButtonType)
              ? (config.type as ButtonType)
              : 'primary'
          }
        >
          {config.text}
        </Button>
      ))}
      {/* 用弹框包裹TopicCreateInner */}
      <Modal
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setCreateVisible(false);
        }}
        open={isModalOpen}
        width={800}
      >
        <TopicCreateInner
          onCreated={() => {
            setCreateVisible(false);
            setIsModalOpen(false);
            completeTask(taskIndex);
            setTaskIndex(null);
          }}
          open={createVisible}
        />
      </Modal>
    </div>
  );
};
