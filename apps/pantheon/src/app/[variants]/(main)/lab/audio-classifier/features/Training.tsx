'use client';
import type { CollapseProps } from 'antd';

import { BarChartOutlined } from '@ant-design/icons';
import { Button, Collapse, message } from 'antd';
import React, { useEffect, useState } from 'react';

import styles from '../audio.module.scss';
import { useAudioStore } from '../stores/audioSlice';
import { useSpeechTrainer } from './SpeechTrainer';

const handleRetraining = () => {
  globalThis.location.reload();
};

const Training: React.FC = () => {
  const {
    trainModel,
    // stopPredicting,
  } = useSpeechTrainer();
  const [trainFlag, setTrainFlag] = useState(false);
  const { list } = useAudioStore();
  const { trainingOver } = useAudioStore();
  const totalCount = list.reduce((sum, cls) => sum + (cls.images?.length || 0), 0);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    if (!trainFlag || trainingOver) return;

    const interval = setInterval(() => {
      setCurrentCount((prev) => {
        if (prev < totalCount) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [trainFlag, trainingOver, totalCount]);

  const handleStart = () => {
    if (list.length < 2) {
      message.warning('至少需要两个训练集');
      return;
    }

    if (list[0]!.images.length < 5) {
      message.warning(list[0]!.name + '样本数量不足，无法开始训练');
      return;
    }
    if (list[1]!.images.length < 5) {
      message.warning(list[1]!.name + '样本数量不足，无法开始训练');
      return;
    }
    // stopPredicting();
    trainModel();
    setTrainFlag(true);
  };

  const trainingItems: CollapseProps['items'] = [
    {
      key: '1',
      label: '高级',
      children: (
        <section className={styles.training_input}>
          <p>
            深入了解
            <BarChartOutlined />
          </p>
          {/* <Input
          name='distanceThreshold'
          value={""}
        >
        </Input>
        <div className={styles.training_input_buttons}>
          <CaretUpOutlined className={styles.button_increment} onClick={() => {}}/>
          <CaretDownOutlined className={styles.button_decrement} onClick={() => {}}/>
        </div>
        <QuestionCircleOutlined /> */}
        </section>
      ),
    },
  ];

  return (
    <div className={styles.audio_training_container}>
      <div className={styles.audio_training_cont}>
        <div className={styles.audio_training_box}>
          <p className={styles.training_title}>训练</p>
          {/* <Button type="primary" onClick={handleStart}>开始训练</Button> */}
          {!trainingOver ? (
            <Button onClick={handleStart} type="primary">
              开始训练
            </Button>
          ) : (
            <Button onClick={handleRetraining} type="primary">
              重新开始
            </Button>
          )}
          {trainFlag === true ? (
            <div className={styles.training_progress}>
              {trainingOver === true ? (
                '已训练'
              ) : (
                <p style={{ textAlign: 'center' }}>
                  {`上传中： ${currentCount} / ${totalCount} 个样本`}
                  <br />
                  训练中...
                </p>
              )}
            </div>
          ) : (
            []
          )}
          <Collapse
            className={styles.training_collapse}
            defaultActiveKey={[]}
            items={trainingItems}
          />
        </div>
      </div>
    </div>
  );
};

export default Training;
