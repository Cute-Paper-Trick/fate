'use client';
import { BarChartOutlined } from '@ant-design/icons';
import { Button, Collapse, type CollapseProps } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import React from 'react';

import { message } from '@/components/AntdStaticMethods';

import styles from '../poseTrainerLobe.module.scss';
import { usePoseStore } from '../stores/poseSlice';
import { usePoseModel } from './trainingMod';

interface TrainingProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  // containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const handleRetraining = () => {
  globalThis.location.reload();
};

const Training: React.FC<TrainingProps> = ({ videoRef }) => {
  const { t } = useTranslate('lab');
  const {
    list: classList,
    setTrainingOver,
    trainingOver,
    setIsCameraActive,
    setIsPredicting,
    setIsPerviewOpen,
    loading,
    setTrainingFlag,
  } = usePoseStore();
  const { predictFromCapturedPose, trainKNN, totalPoses, trainedCount } = usePoseModel({
    classList,
  });

  const handleTraining = async () => {
    setTrainingOver(false);
    try {
      await trainKNN(classList);
      for (const i of classList) {
        if (i.poses.length === 0) {
          message.error(t('classifier.training.error.empty', '训练集不能为空'));
          return;
        }
      }

      if (classList.length < 2) {
        message.error(t('classifier.training.error.least', '至少需要两个训练集'));
        return;
      }

      setTrainingFlag(true);
      setIsCameraActive(true);
      setIsPredicting(true);
      // startCamera();
      setIsPerviewOpen(true);
      setTrainingOver(true);

      // 训练完成后立即从视频流中进行预测
      setTimeout(() => {
        predictFromCapturedPose(videoRef.current, 'video'); // 传入当前的视频流
      }, 500); // 确保视频流已经准备好

      console.log('KNN训练完成');
    } catch (error) {
      console.log(error);
    }
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
    <div className={styles.pose_training_container}>
      <div className={styles.pose_training_cont}>
        <div className={styles.pose_training_box}>
          <p className={styles.training_title}>{t('classifier.training.title', '训练')}</p>
          {/* <Button onClick={() => {handleModelUpload()}}>训练模型</Button> */}
          {/* <Button type="primary" disabled={!loadingOver} onClick={() => {trainKNN(temporaryPoses)}}>开始训练</Button> */}
          {!trainingOver ? (
            <Button
              disabled={loading}
              onClick={() => {
                handleTraining();
              }}
              type="primary"
            >
              {t('classifier.training.start', '开始训练')}
            </Button>
          ) : (
            <Button onClick={handleRetraining} type="primary">
              {t('classifier.training.restart', '重新开始')}
            </Button>
          )}
          {totalPoses !== 0 ? (
            <p className={styles.training_progress}>
              {t('classifier.training.finish', '已训练')} {trainedCount} / {totalPoses}
            </p>
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
