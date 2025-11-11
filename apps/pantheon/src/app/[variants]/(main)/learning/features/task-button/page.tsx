'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { V1TaskUserInfo } from '@/lib/http';
import { useTaskButtons } from '@/store/learning/helpers';
import { TaskButtonConfig, TaskButtonGroupProps } from '@/store/learning/initialState';
import { useLearningStore } from '@/store/learning/store';

import styles from './index.module.css';

const validButtonTypes = ['primary', 'link', 'text', 'default', 'dashed'] as const;
const goComplete = (item: V1TaskUserInfo, router: any) => {
  //去挑战
  const { page } = JSON.parse(item.jump) as { page: string };
  if (page === 'chat') {
    router.push('/chat');
    return;
  }
  if (page === 'pose') {
    router.push('/lab/pose-classifier');
  }
  if (page === 'audio') {
    router.push('/lab/audio-classifier');
  }
  if (page === 'image') {
    router.push('/lab/image-classifier');
  }
};
type ButtonType = (typeof validButtonTypes)[number];

export const TaskButtonGroup: React.FC<TaskButtonGroupProps> = ({ item }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { listDict, completeTask } = useLearningStore();
  const { getTaskButtons } = useTaskButtons();
  const handleButtonClick = (config: TaskButtonConfig) => {
    if (config?.action === 'challenge') {
      goComplete(item, router); // 跳转页面
    } else if (config?.action === 'complete') {
      setIsModalOpen(true); // TODO: 显示去完成弹框 后续对接 下面是完成接口
      if (config?.taskIndex) {
        completeTask(config.taskIndex);
      }
      console.log('状态', isModalOpen);
    }
  };

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
      {/* TODO: 此处为后续弹框调用 */}
    </div>
  );
};
