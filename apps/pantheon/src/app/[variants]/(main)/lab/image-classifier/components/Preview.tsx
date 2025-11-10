'use client';
import type { MenuProps } from 'antd';

import { ArrowDownOutlined, DownOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Dropdown } from '@lobehub/ui';
import { Space, Switch, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

import Predictions from '../../components/prediction/Prediction';
import { useImageModel } from '../hooks/imageHooks';
import styles from '../imageTrainer.module.scss';
import { useImageStore } from '../stores/imageSlice';

interface PreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const Preview: React.FC<PreviewProps> = ({ videoRef }) => {
  const {
    list: classList,
    predictions,
    trainingOver,
    setIsPredicting,
    isPredicting,
    isPerviewOpen,
    setCompareType,
    compareType,
  } = useImageStore();
  const { processImage, predictLoop, exportKNNModelWithBin, startCamera } = useImageModel({
    classList,
  });
  const [trainedComparePic, setTrainedComparePic] = useState<HTMLImageElement | null>(null);

  const handleTrainedUpload = async (file: File) => {
    try {
      const base64 = await processImage(file, 224, 224);
      const img = new Image();
      img.src = base64;

      setTrainedComparePic(img);
      setIsPredicting(true);
      requestAnimationFrame(() => predictLoop(img, videoRef.current));
    } catch (error) {
      console.error('图片处理失败:', error);
    }
  };

  // 控制暂停/继续预测
  const togglePrediction = () => {
    setIsPredicting(!isPredicting);
    if (!isPredicting) {
      console.log('play' + videoRef.current);
      videoRef.current?.play();
    } else {
      useImageStore.getState().stopPredict();
      setTimeout(() => videoRef?.current?.pause(), 300);
    }
  };

  const handleCompareType = (type: string) => {
    setCompareType(type);
    // if (type === "video") {
    //   setIsCameraActive(true);
    //   // if(!isPredicting === true) {
    //   //   setIsPredicting(true)
    //   // }
    // } else {
    //   setIsCameraActive(false);
    //   // if(!isPredicting === true) {
    //   //   setIsPredicting(true)
    //   // }
    // }
  };

  useEffect(() => {
    startCamera(videoRef);
  }, [isPredicting, trainingOver, isPerviewOpen, compareType]);

  useEffect(() => {
    const videoElement = videoRef.current;
    const img = trainedComparePic;

    if (compareType === 'video') {
      // 视频
      if (videoElement) {
        if (isPredicting && videoElement.paused) {
          setTimeout(() => videoRef?.current?.play(), 300);
        } else if (!isPredicting && !videoElement.paused) {
          setTimeout(() => videoRef?.current?.pause(), 300);
        } else if (!isPredicting && videoElement.paused) {
          setTimeout(() => videoRef?.current?.pause(), 300);
        }
        if (isPredicting) {
          requestAnimationFrame(() => predictLoop(null, videoElement));
        }
      }
    } else if (compareType === 'pic' && img) {
      // 图片
      if (isPredicting) {
        requestAnimationFrame(() => predictLoop(img, null));
      } else return;
    }

    return () => {
      if (videoElement && videoElement.srcObject instanceof MediaStream) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
        videoElement.srcObject = null;
      }
    };
  }, [compareType, isPredicting, trainedComparePic]);

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

  return (
    <div className={styles.image_preview_container}>
      <div className={styles.image_preview_cont}>
        <div className={styles.image_preview_box}>
          <div className={styles.preview_title_area}>
            <p className={styles.preview_title}>预览</p>
            <Button disabled={!trainingOver} onClick={exportKNNModelWithBin}>
              导出模型
            </Button>
          </div>
          {isPerviewOpen ? (
            <div className={styles.preview_box}>
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
                  <video
                    autoPlay
                    className={styles.video}
                    height={265}
                    muted
                    playsInline
                    ref={videoRef}
                    width={265}
                  />
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
                          disabled={!isPredicting}
                          icon={<UploadOutlined style={{ fontSize: '20px' }} />}
                        >
                          您可以从文件中选择图片，也可以将图片拖放到此处
                          <p style={{ margin: 0 }}>仅支持png，jpg</p>
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
                            width={265}
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
              <div className={styles.preview_output_area} style={{ filter: 'grayscale(100%)' }}>
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
              <div style={{ width: '100%', filter: !isPredicting ? 'grayscale(100%)' : 'none' }}>
                <Predictions classList={classList} predictions={predictions} />
              </div>
            </div>
          ) : (
            <p className={styles.output_text}>您必须先在左侧训练模型，然后才可以在此处预览。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
