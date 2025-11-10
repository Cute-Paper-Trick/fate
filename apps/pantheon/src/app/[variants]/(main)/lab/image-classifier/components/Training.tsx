'use client';
import type { CollapseProps } from 'antd';

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Collapse, Input, message } from 'antd';
import React, { useState } from 'react';

import { useImageModel } from '../hooks/imageHooks';
import styles from '../imageTrainer.module.scss';
import { useImageStore } from '../stores/imageSlice';

type CapturedImage = { id: string; src: string };

interface ClassItem {
  id: string;
  name: string;
  images: CapturedImage[];
}

const handleRetraining = () => {
  globalThis.location.reload();
};

const createImageElement = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
  });
};

const Training: React.FC = () => {
  const [trainedCount, setTrainedCount] = useState(0); // 已训练图片数
  const [totalImages, setTotalImages] = useState(0); // 总图片数
  const {
    list: classList,
    knnClassifierInstance,
    setTrainingOver,
    setIsCameraActive,
    setIsPredicting,
    setIsPerviewOpen,
    trainingOver,
    loading,
    kValue, //K值(最近邻数量)
    setKValue,
    distanceThreshold, //距离阈值
    setDistanceThreshold,
    filterAlpha, //滤波器系数 (α)
    setFilterAlpha,
  } = useImageStore();

  const { extractImageNetTags } = useImageModel({ classList });

  const inkValue = () => {
    setKValue(kValue + 1);
  };

  const dekValue = () => {
    setKValue(kValue - 1);
  };

  const indistanceThreshold = () => {
    setDistanceThreshold(Number((distanceThreshold + 0.05).toFixed(2)));
  };

  const dedistanceThreshold = () => {
    setDistanceThreshold(Number((distanceThreshold - 0.05).toFixed(2)));
  };

  const infilterAlpha = () => {
    setFilterAlpha(Number((filterAlpha + 0.05).toFixed(2)));
  };

  const defilterAlpha = () => {
    setFilterAlpha(Number((filterAlpha - 0.05).toFixed(2)));
  };

  const handleKValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replaceAll(/[^0-9]/g, '');
    setKValue(numericValue === '' ? 0 : Number(numericValue));
  };

  const handleFilterAlpha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replaceAll(/[^0-9]/g, '');
    setFilterAlpha(numericValue === '' ? 0 : Number(numericValue));
  };

  const handleDistanceThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replaceAll(/[^0-9]/g, '');
    setDistanceThreshold(numericValue === '' ? 0 : Number(numericValue));
  };

  const trainKNN = async (classList: ClassItem[]) => {
    const classes: string[] = [];
    let count = 0;

    for (const i of classList) {
      if (i.images.length === 0) {
        message.warning('训练集不能为空');
        return;
      }
    }

    // 计算所有类别中的图片数量
    classList.forEach((item) => (count += item.images.length));
    console.log(knnClassifierInstance);

    if (!knnClassifierInstance || count === 0) return;

    setTotalImages(count);
    setTrainedCount(0);
    setTrainingOver(false);

    knnClassifierInstance.clearAllClasses();
    let processedImages = 0;

    // 遍历 classList 来处理每个类
    for (const item of classList) {
      classes.push(item.id); // 使用 id 作为类名
      for (const capturedImage of item.images) {
        try {
          const imgElement = await createImageElement(capturedImage.src);
          const features = await extractImageNetTags(imgElement);
          if (features && features.logits) {
            knnClassifierInstance.addExample(features.logits, classes.length - 1);
            features.logits.dispose();
          }
          imgElement.remove();

          processedImages++;
          setTrainedCount(processedImages);
        } catch (error) {
          console.error('处理图片失败:', error);
        }
      }
    }

    setIsCameraActive(true);
    setIsPredicting(true);
    setIsPerviewOpen(true);
    setTrainingOver(true);

    console.log('KNN训练完成，类别:', classes);
  };

  const trainingItems: CollapseProps['items'] = [
    {
      key: '1',
      label: '高级',
      children: (
        <>
          <section className={styles.training_input}>
            <span>K值(最近邻数量)：</span>
            <Input disabled name="kValue" onChange={handleKValue} value={kValue} />
            <div className={styles.training_input_buttons}>
              <CaretUpOutlined className={styles.button_increment} onClick={() => inkValue()} />
              <CaretDownOutlined className={styles.button_decrement} onClick={() => dekValue()} />
            </div>
            {/* <QuestionCircleOutlined /> */}
          </section>
          <section className={styles.training_input}>
            <span>滤波器系数 (α) ：</span>
            <Input disabled name="filterAlpha" onChange={handleFilterAlpha} value={filterAlpha} />
            <div className={styles.training_input_buttons}>
              <CaretUpOutlined
                className={styles.button_increment}
                onClick={() => infilterAlpha()}
              />
              <CaretDownOutlined
                className={styles.button_decrement}
                onClick={() => defilterAlpha()}
              />
            </div>
          </section>
          <section className={styles.training_input}>
            <span>距离阈值：</span>
            <Input
              disabled
              name="distanceThreshold"
              onChange={handleDistanceThreshold}
              value={distanceThreshold}
            />
            <div className={styles.training_input_buttons}>
              <CaretUpOutlined
                className={styles.button_increment}
                onClick={() => indistanceThreshold()}
              />
              <CaretDownOutlined
                className={styles.button_decrement}
                onClick={() => dedistanceThreshold()}
              />
            </div>
          </section>
        </>
      ),
    },
  ];

  return (
    <div className={styles.image_training_container}>
      <div className={styles.image_training_cont}>
        <div className={styles.image_training_box}>
          <p className={styles.training_title}>训练</p>
          {!trainingOver ? (
            <Button
              disabled={!loading}
              onClick={() => {
                trainKNN(classList);
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
          {totalImages !== 0 ? (
            <p className={styles.training_progress}>
              已训练 {trainedCount} / {totalImages}
            </p>
          ) : (
            []
          )}
          <Collapse
            className={styles.training_collapse}
            defaultActiveKey={['1']}
            items={trainingItems}
          />
        </div>
      </div>
    </div>
  );
};

export default Training;
