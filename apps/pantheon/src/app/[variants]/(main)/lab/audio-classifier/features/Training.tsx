'use client';
import { BarChartOutlined } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { Button, Collapse, type CollapseProps } from 'antd';
import React, { useEffect, useState } from 'react';

import { message } from '@/components/AntdStaticMethods';

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
  const { t } = useTranslate('lab');

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
      message.error(t('classifier.training.error.least', '至少需要两个训练集'));
      return;
    }

    if (list[0]!.images.length < 5) {
      message.error(
        list[0]!.name + t('classifier.training.error.not_enough', '样本数量不足，无法开始训练'),
      );
      return;
    }
    if (list[1]!.images.length < 5) {
      message.error(
        list[1]!.name + t('classifier.training.error.not_enough', '样本数量不足，无法开始训练'),
      );
      return;
    }
    // stopPredicting();
    trainModel();
    setTrainFlag(true);
  };

  const trainingItems: CollapseProps['items'] = [
    {
      key: '1',
      label: t('classifier.training.options.title', '高级'),
      children: (
        <section className={styles.training_input}>
          <p>
            {t('classifier.training.options.description', '深入了解')}
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
          <p className={styles.training_title}>{t('classifier.training.title', '训练')}</p>
          {/* <Button type="primary" onClick={handleStart}>开始训练</Button> */}
          {!trainingOver ? (
            <Button onClick={handleStart} type="primary">
              {t('classifier.training.start', '开始训练')}
            </Button>
          ) : (
            <Button onClick={handleRetraining} type="primary">
              {t('classifier.training.restart', '重新开始')}
            </Button>
          )}
          {trainFlag === true ? (
            <div className={styles.training_progress}>
              {trainingOver === true ? (
                t('classifier.training.finish', '已训练')
              ) : (
                <p style={{ textAlign: 'center' }}>
                  {`${t('classifier.training.uploading', '上传中')}： ${currentCount} / ${totalCount} ${t('classifier.training.unit', '个样本')}`}
                  <br />
                  {t('classifier.training.training', '训练中')}...
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
