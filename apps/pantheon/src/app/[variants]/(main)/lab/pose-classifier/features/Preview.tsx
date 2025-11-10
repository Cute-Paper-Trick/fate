'use client';
import type { MenuProps } from '@lobehub/ui';

import {
  // SettingOutlined,
  ArrowDownOutlined,
  DownOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from '@lobehub/ui';
import { Progress, Space, Switch, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import styles from '../poseTrainerLobe.module.scss';
import { usePoseStore } from '../stores/poseSlice';
import { usePoseModel } from './trainingMod';

interface PreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  // canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

const Preview: React.FC<PreviewProps> = ({ videoRef }) => {
  const {
    list: classList,
    setIsPredicting,
    setIsCameraActive,
    setIsPerviewOpen,
    isPredicting,
    trainingOver,
    isPerviewOpen,
    predictions,
  } = usePoseStore();

  const { predictFromCapturedPose, processPose, exportKNNModel, predictLoop } = usePoseModel({
    classList,
  });
  const [trainedComparePic, setTrainedComparePic] = useState<HTMLImageElement | null>(null);
  const [compareType, setCompareType] = useState('video');
  const previewCanvasRef = useRef<Record<string, HTMLCanvasElement | null>>({});

  useEffect(() => {
    predictFromCapturedPose(videoRef.current, compareType);
  }, [predictions, compareType]);

  useEffect(() => {
    if (videoRef.current) {
      predictLoop(videoRef.current, previewCanvasRef);
    }
  }, [isPerviewOpen]);

  const handleTrainedUpload = async (file: File) => {
    if (!videoRef.current) {
      return;
    }
    try {
      const base64 = await processPose(file, 265, 265);
      const img = new Image();
      img.src = base64;
      setTrainedComparePic(img);
      setIsPredicting(true);
      predictFromCapturedPose(img, compareType);
    } catch (error) {
      console.error('图片处理失败:', error);
    }
  };

  const handleCompareType = (type: string) => {
    setCompareType(type);
    if (type === 'video') {
      setIsCameraActive(true);
      setIsPerviewOpen(true);
      setTrainedComparePic(null);
      predictFromCapturedPose(videoRef.current, compareType);
      if (!isPredicting) {
        setIsPredicting(true);
      }
    } else {
      setIsCameraActive(false);
      if (!isPredicting) {
        setIsPredicting(true);
      }
    }
  };

  // 控制暂停/继续预测
  const togglePrediction = () => {
    setIsPredicting(!isPredicting);
    if (compareType === 'video') {
      if (videoRef.current) {
        if (!isPredicting) {
          videoRef.current.play(); // 恢复视频播放
        } else {
          videoRef.current.pause(); // 暂停视频播放
        }
      } else return;
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span
          onClick={() => {
            handleCompareType('video');
          }}
        >
          Webcam
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span
          onClick={() => {
            handleCompareType('pic');
          }}
        >
          文件
        </span>
      ),
    },
  ];

  const progressColors = [
    '#FF4D4F',
    '#1890FF',
    '#52C41A',
    '#FAAD14',
    '#722ED1',
    '#13C2C2',
    '#EB2F96',
    '#2F54EB',
    '#237804',
    '#D46B08',
  ];

  return (
    <div className={styles.pose_preview_container}>
      <div className={styles.pose_preview_cont}>
        <div className={styles.pose_preview_box}>
          <div className={styles.preview_title_area}>
            <p className={styles.preview_title}>预览</p>
            <Button disabled={!trainingOver} onClick={exportKNNModel} type="primary">
              导出模型
            </Button>
          </div>
          {isPerviewOpen ? (
            <>
              <div className={styles.preview_body_area}>
                <div className={styles.preview_control_area}>
                  <Space direction="horizontal">
                    <Switch className={styles.preview_switch} onChange={togglePrediction} />
                    <p className={styles.preview_switch_text}>
                      {isPredicting ? '已启用' : '已停用'}
                    </p>
                  </Space>
                  <Dropdown
                    className={styles.preview_dropdown}
                    menu={{ items }}
                    placement="bottomLeft"
                    trigger={['click']}
                  >
                    <Button>
                      {compareType === 'pic' ? '文件' : 'Webcam'}
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
                {compareType === 'video' ? (
                  <div
                    className={styles.cardArea_button}
                    style={{ width: 265, height: 265, position: 'relative' }}
                  >
                    <canvas
                      height={265}
                      ref={(el) => {
                        previewCanvasRef.current[0] = el;
                        if (el) {
                          el.width = 265;
                          el.height = 265;
                        }
                        if (!el) {
                          delete previewCanvasRef.current[0];
                        }
                      }}
                      style={{ filter: !isPredicting ? 'grayscale(100%)' : 'none' }}
                      width={265}
                    />
                  </div>
                ) : compareType === 'pic' ? (
                  <div style={{ color: 'red', maxWidth: '262px' }}>
                    <div className={styles.cardArea_button}>
                      <Upload
                        accept=".jpg,.png,.jpeg"
                        beforeUpload={async (file) => {
                          await handleTrainedUpload(file);
                          return false;
                        }}
                        multiple={false}
                        showUploadList={false}
                      >
                        <Button
                          className={styles.button_upload}
                          icon={<UploadOutlined style={{ fontSize: '20px' }} />}
                        >
                          您可以从文件中选择图片，也可以将图片拖放到此处
                        </Button>
                      </Upload>
                      {trainedComparePic && (
                        <div>
                          <img
                            alt="对比图"
                            height={265}
                            src={trainedComparePic.src}
                            style={{
                              objectFit: 'cover',
                              filter: !isPredicting ? 'grayscale(100%)' : 'none',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: 14,
                      width: 265,
                      height: 265,
                      color: '#1967D2',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    打开摄像头时出错。请确保您启用了相关权限，或改为上传图片。
                  </div>
                )}
              </div>
              <div className={styles.preview_output_area}>
                <p>输出</p>
                <ArrowDownOutlined
                  style={{
                    borderRadius: '50%',
                    background: '#E8EAED',
                    padding: '3px',
                    position: 'absolute',
                    top: 'calc(-50% + 18px)',
                    left: '50%',
                    transform: 'translate(-50%)',
                  }}
                />
              </div>
              <div className={styles.output_area}>
                {predictions.map((pred, predIndex) => (
                  <div key={predIndex}>
                    {Object.keys(pred.confidences).map((k) => {
                      const i = parseInt(k);
                      const className = classList[i]?.name || '未定义';
                      const confidence = pred.confidences[i] || 0;
                      const percentage = (confidence * 100).toFixed(1);

                      return (
                        <div className={styles.prediction_item} key={i} style={{ marginBottom: 8 }}>
                          <div className={styles.prediction_header}>
                            <span className={styles.prediction_label}>{className}</span>
                          </div>
                          <Progress
                            className={styles.prediction_progress}
                            format={(percent) => `${percent?.toFixed(1)}%`}
                            percent={parseFloat(percentage)}
                            percentPosition={{ align: 'center', type: 'inner' }}
                            showInfo={true}
                            size={[180, 29]}
                            strokeColor={progressColors[i % progressColors.length]} // 循环使用颜色
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.output_text}>您必须先在左侧训练模型，然后才可以在此处预览。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
