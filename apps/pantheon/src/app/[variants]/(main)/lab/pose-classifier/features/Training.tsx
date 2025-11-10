'use client';
import type { CollapseProps } from '@lobehub/ui';

import { BarChartOutlined } from '@ant-design/icons';
import { Button, Collapse } from '@lobehub/ui';
// import { message } from 'antd';
import React from 'react';

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
  const {
    list: classList,
    setTrainingOver,
    trainingOver,
    setIsCameraActive,
    setIsPredicting,
    setIsPerviewOpen,
    loading,
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
          // message.warning("训练集不能为空")
          return;
        }
      }

      if (classList.length < 2) {
        // message.warning("至少需要2个训练集")
        return;
      }

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
    <div className={styles.pose_training_container}>
      <div className={styles.pose_training_cont}>
        <div className={styles.pose_training_box}>
          <p className={styles.training_title}>训练</p>
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
              开始训练
            </Button>
          ) : (
            <Button onClick={handleRetraining} type="primary">
              重新开始
            </Button>
          )}
          {totalPoses !== 0 ? (
            <p className={styles.training_progress}>
              已训练 {trainedCount} / {totalPoses}
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
