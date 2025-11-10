'use client';
import type { MenuProps } from '@lobehub/ui';

import {
  CloseOutlined,
  DeleteOutlined,
  LeftOutlined,
  MoreOutlined,
  PlusSquareOutlined,
  RightOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Image as AntdImage, Button, Dropdown, Input, Modal, Select } from '@lobehub/ui';
import { Card, Space, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import styles from '../poseTrainerLobe.module.scss';
import { usePoseStore } from '../stores/poseSlice';
import { usePoseModel } from './trainingMod';

// import { Graph } from '@antv/x6'

type CapturedPose = {
  id: string;
  src: string;
};

interface SampleProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
  e.target.select(); // 全选内容
};

const Sample: React.FC<SampleProps> = ({ videoRef }) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  // const graphRef = useRef<Graph>(null);
  // const placeholderRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const {
    list: classList,
    addClass,
    removeClass,
    renameClass,
    changeClass,
    poseDelete,
    changeClassPoses,
    poseDetector,
    setIsCameraActive,
    clearClassSample,
  } = usePoseStore();

  const { processPose, predictLoop, init } = usePoseModel({ classList });

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedPoseIndex, setSelectedPoseIndex] = useState<number>(0);
  const selectedClass = classList.find((c) => c.id === selectedClassId);
  const previewRefMap = useRef<Record<string, HTMLDivElement | null>>({});
  const [poseModalVisible, setPoseModalVisible] = useState(false);
  const [selectedPose, setSelectedPose] = useState<CapturedPose | undefined>(undefined);
  const [videoReady, setVideoReady] = useState(false);
  const [selectMap, setSelectMap] = useState<Record<string, boolean>>({});
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
  const canvasRefMap = useRef<Record<string, HTMLCanvasElement | null>>({});
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    classList.forEach((_, classId) => {
      const container = previewRefMap.current[classId];
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, [classList]);

  // 启动摄像头
  const startCamera = async () => {
    try {
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        // videoRef.current.srcObject = stream;
        videoRef.current.play();

        // videoRef.current.onloadedmetadata = () => {
        //   if (canvasRef.current) {
        //     canvasRef.current.width = 265;
        //     canvasRef.current.height = 265;
        //   }
        // };
      }
    } catch (error) {
      console.error('无法访问摄像头:', error);
    }
  };

  const handleIni = () => {
    init();

    if (!videoRef.current) {
      return;
    }

    startCamera();
    setIsCameraActive(true);
  };

  useEffect(() => {
    handleIni();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    // const canvas = canvasRef.current;

    const startPredictionLoop = () => {
      predictLoop(video, canvasRefMap);
    };

    // 如果视频还没开，启动摄像头
    if (!video.srcObject) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
          video.addEventListener('loadedmetadata', () => {
            // canvas.width = 265;
            // canvas.height = 265;
            startPredictionLoop();
          });
        })
        .catch((error) => console.error('无法访问摄像头:', error));
    } else {
      // 视频已开，直接同步启动
      video.play();
      startPredictionLoop();
    }
  }, [videoReady]);

  //button
  const startHoldCapture = (id: string) => {
    if (captureIntervalRef.current) return;
    if (!canvasRefMap.current[id] || !videoRef?.current || !poseDetector) return;

    const isCapturing = true;
    const canvas = canvasRefMap.current[id];
    // const video = videoRef?.current;

    captureIntervalRef.current = setInterval(async () => {
      if (!isCapturing) return;

      // 捕获图片
      const data = canvas.toDataURL('image/png');
      const uuid = uuidv4();
      const newPose: CapturedPose = { id: uuid, src: data };

      // 更新 classList 中对应 class 的 poses
      changeClassPoses(id, newPose);
    }, 20);
  };

  const stopHoldCapture = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };

  const handleUpload = async (file: File, classId: string) => {
    try {
      const base64 = await processPose(file, 265, 265);
      const uuid = uuidv4();
      changeClassPoses(classId, { id: uuid, src: base64 });
    } catch (error) {
      console.error('图片处理失败:', error);
    }
  };

  //class
  const handleAddClass = () => {
    const name = `Class ${classList.length + 1}`;
    const id = `class-${Date.now()}`;
    addClass({ name, id });
  };

  const handleRemoveClass = (id: string) => {
    removeClass(id);
    if (selectedClassId === id) {
      setSelectedClassId('');
    }
  };

  const handleRenameClass = (classId: string, newName: string) => {
    renameClass({ id: classId, name: newName });
  };

  //sample
  const handlePosePreview = (pose: CapturedPose) => {
    for (const classItem of classList) {
      const index = classItem.poses.findIndex((img) => img.id === pose.id);
      if (index !== -1) {
        setSelectedClassId(classItem.id);
        setSelectedPoseIndex(index);
        setSelectedPose(pose);
        setPoseModalVisible(true);
        break;
      }
    }
  };

  const handlePoseDelete = (classId: string, pose: CapturedPose) => {
    poseDelete(classId, pose.id);
  };

  const handlePosePreviewDelete = (classId: string, pose: CapturedPose) => {
    handlePoseDelete(classId, pose);
    setPoseModalVisible(false);
  };

  const handlePreviousPose = () => {
    setSelectedPoseIndex((prev) => {
      const poses = selectedClass?.poses ?? [];
      const newIndex = Math.max(0, prev - 1);
      setSelectedPose(poses[newIndex] ?? undefined);
      return newIndex;
    });
  };

  const handleNextPose = () => {
    setSelectedPoseIndex((prev) => {
      const poses = selectedClass?.poses ?? [];
      const newIndex = Math.min(poses.length - 1, prev + 1);
      setSelectedPose(poses[newIndex] ?? undefined);
      return newIndex;
    });
  };

  const handleChangeClass = (newClassId: string) => {
    if (!selectedClassId) return;

    const selectedClassItem = classList.find((c) => c.id === selectedClassId);
    const newClassItem = classList.find((c) => c.id === newClassId);
    const poseToMove = selectedClassItem?.poses[selectedPoseIndex];

    if (!selectedClassItem || !newClassItem || !poseToMove) return;
    if (newClassId === selectedClassId) return;

    changeClass(selectedClassItem.id, poseToMove.id, newClassItem.id);

    setSelectedClassId(newClassId);
    setSelectedPoseIndex(newClassItem.poses.length ? newClassItem.poses.length : 0);
  };

  const handleRemoveSample = (id: string) => {
    clearClassSample(id);
  };

  //select
  const setSelect = (id: string, value: boolean) => {
    setSelectMap((prev) => {
      const newSelect = Object.keys(prev).reduce(
        (acc, key) => {
          acc[key] = key === id ? value : false;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      if (!newSelect[id]) {
        newSelect[id] = value;
      }

      return newSelect;
    });
    setUploadingMap((prev) => {
      const newMap: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newMap[key] = false;
      });
      return newMap;
    });
    setVideoReady(true);
  };

  const setUploading = (id: string, value: boolean) => {
    setUploadingMap((prev) => {
      const newSelect = Object.keys(prev).reduce(
        (acc, key) => {
          acc[key] = key === id ? value : false;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      if (!newSelect[id]) {
        newSelect[id] = value;
      }
      return newSelect;
    });
    setSelectMap((prev) => {
      const newMap: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newMap[key] = false;
      });
      return newMap;
    });
    setVideoReady(true);
  };

  return (
    <div className={styles.pose_card_container}>
      {/* <div ref={containerRef} style={{ width: 1200, height: 900, position: "absolute", top: "0" }} /> */}
      {classList.map((cls) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: (
              <span
                onClick={(e) => {
                  if (cls.id === 'class-env') {
                    e.preventDefault();
                    e.stopPropagation();
                  } else {
                    handleRemoveClass(cls.id);
                  }
                }}
              >
                删除类别
              </span>
            ),
            disabled: cls.id === 'class-env',
          },
          {
            key: '2',
            label: (
              <span
                onClick={() => {
                  handleRemoveSample(cls.id);
                }}
              >
                删除所有样本
              </span>
            ),
          },
        ];

        return (
          <Card
            className={styles.pose_card}
            extra={
              <Dropdown
                className={styles.preview_dropdown}
                menu={{ items }}
                placement="bottomLeft"
                trigger={['click']}
              >
                <MoreOutlined style={{ color: '#000' }} />
              </Dropdown>
            }
            key={cls.id}
            title={
              <Input
                className={styles.pose_card_item}
                onChange={(e) => handleRenameClass(cls.id, e.target.value)}
                onFocus={handleFocus}
                value={cls.name}
              />
            }
          >
            {uploadingMap[cls.id] ? (
              <div className={styles.cardArea}>
                <div className={styles.cardArea_cont}>
                  <p>文件</p>
                  <Button
                    className={styles.cardArea_close}
                    onClick={() => setUploading(cls.id, false)}
                  >
                    <CloseOutlined style={{ color: '#000' }} />
                  </Button>
                  <div className={styles.cardArea_button}>
                    <Upload
                      accept=".jpg,.png,.jpeg"
                      beforeUpload={async (file) => {
                        await handleUpload(file, cls.id);
                        return false;
                      }}
                      multiple={true}
                      showUploadList={false}
                    >
                      <Button
                        className={styles.button_upload}
                        icon={<UploadOutlined style={{ fontSize: '20px' }} />}
                      >
                        您可以从文件中选择图片，也可以将图片拖放到此处
                      </Button>
                    </Upload>

                    {/* <Button className={styles.button_upload} icon={<UploadOutlined style={{ fontSize: '20px' }} />}>
                      Google 云端硬盘导入图片
                    </Button> */}
                  </div>
                </div>
                <div className={styles.cardArea_cont}>
                  <p>{cls.poses.length}个图片样本</p>
                  <div className={styles.cardArea_preview}>
                    {cls.poses.map((img, i) => (
                      <div
                        className={styles.img_item}
                        key={img.id}
                        style={{ position: 'relative' }}
                      >
                        <img
                          alt={`sample-${i}`}
                          onClick={() => handlePosePreview(img)}
                          src={img.src}
                          style={{ width: 60, height: 60, cursor: 'pointer' }}
                        />
                        <div className={styles.close_icon}>
                          <DeleteOutlined
                            onClick={() => {
                              handlePoseDelete(cls.id, img);
                            }}
                            style={{
                              position: 'absolute',
                              top: 2,
                              left: 2,
                              fontSize: 20,
                              color: '#fff',
                              cursor: 'pointer',
                              background: 'trasparent',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : selectMap[cls.id] ? (
              <div className={styles.cardArea}>
                <div className={styles.cardArea_cont}>
                  <p>webcam</p>
                  <Button
                    className={styles.cardArea_close}
                    onClick={() => setSelect(cls.id, false)}
                  >
                    <CloseOutlined style={{ color: '#000' }} />
                  </Button>
                  {videoReady ? (
                    <div className={styles.cardArea_button} style={{ width: 265 }}>
                      {/* <video
                        ref={videoRef}
                        width={265}
                        height={265}
                        autoPlay
                        muted
                        playsInline
                        style={{borderRadius: 4, objectFit: 'cover', objectPosition: 'center' }}
                      /> */}
                      {/* <canvas ref={canvasRef} id={cls.id}/> */}
                      <canvas
                        id={cls.id}
                        ref={(el) => {
                          canvasRefMap.current[cls.id] = el;
                          if (el) {
                            el.width = 265;
                            el.height = 265;
                          }
                          if (!el) {
                            delete canvasRefMap.current[cls.id];
                          }
                        }}
                      />
                      <div className={styles.video_button_area}>
                        <Button
                          className={styles.button_hold}
                          color="danger"
                          onMouseDown={() => startHoldCapture(cls.id)}
                          onMouseLeave={() => stopHoldCapture()}
                          onMouseUp={() => stopHoldCapture()}
                          onTouchCancel={() => stopHoldCapture()}
                          onTouchEnd={() => stopHoldCapture()}
                          onTouchStart={() => startHoldCapture(cls.id)}
                          type="primary"
                          variant="dashed"
                        >
                          按住即可录制
                        </Button>
                        {/* <Button className={styles.button_setting}><SettingOutlined style={{ color: "#3474E0", fontSize: "24px" }} /></Button> */}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
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
                <div className={styles.cardArea_cont}>
                  <p>{cls.poses.length} 个图片样本</p>
                  <div
                    className={styles.cardArea_preview}
                    ref={(el) => void (previewRefMap.current[cls.id] = el)}
                  >
                    {cls.poses.map((img, i) => (
                      <div
                        className={styles.img_item}
                        key={img.id}
                        style={{ position: 'relative' }}
                      >
                        <img
                          alt={`sample-${i}`}
                          onClick={() => handlePosePreview(img)}
                          src={img.src}
                          style={{ width: 60, height: 60, cursor: 'pointer' }}
                        />
                        <div className={styles.close_icon}>
                          <DeleteOutlined
                            onClick={() => {
                              handlePoseDelete(cls.id, img);
                            }}
                            style={{
                              position: 'absolute',
                              top: 2,
                              left: 2,
                              fontSize: 20,
                              color: '#fff',
                              cursor: 'pointer',
                              background: 'trasparent',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.card_container}>
                <p className={styles.card_label}>添加图片样本</p>
                <Space>
                  <Button
                    className={styles.button_comn}
                    icon={<VideoCameraOutlined style={{ fontSize: '20px' }} />}
                    onClick={() => setSelect(cls.id, true)}
                  >
                    拍照
                  </Button>
                  <Button
                    className={styles.button_comn}
                    icon={<UploadOutlined style={{ fontSize: '20px' }} />}
                    onClick={() => setUploading(cls.id, true)}
                  >
                    上传
                  </Button>
                  {cls.poses.map((img, i) => (
                    <div className={styles.img_item} key={img.id} style={{ position: 'relative' }}>
                      <img
                        alt={`sample-${i}`}
                        onClick={() => handlePosePreview(img)}
                        src={img.src}
                        style={{ width: 60, height: 60, cursor: 'pointer' }}
                      />
                      <div className={styles.close_icon}>
                        <DeleteOutlined
                          onClick={() => {
                            handlePoseDelete(cls.id, img);
                          }}
                          style={{
                            position: 'absolute',
                            top: 2,
                            left: 2,
                            fontSize: 20,
                            color: '#fff',
                            cursor: 'pointer',
                            background: 'trasparent',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Space>
              </div>
            )}
          </Card>
        );
      })}
      <Button
        className={styles.button_add}
        icon={<PlusSquareOutlined />}
        onClick={() => handleAddClass()}
      >
        <span style={{ lineHeight: '100px' }}>添加类别</span>
      </Button>

      <Modal
        className={styles.preview_cont}
        footer={null}
        onCancel={() => setPoseModalVisible(false)}
        open={poseModalVisible}
        style={{ top: 'calc(50% - 190px)' }}
        title={selectedClass?.name}
        width={260}
      >
        <div className={styles.preview_box}>
          <AntdImage
            alt="preview"
            src={selectedPose ? selectedPose.src : ''}
            style={{ maxWidth: '288px', maxHeight: '288px' }}
          />

          <div className={styles.control_area}>
            <Button disabled={selectedPoseIndex <= 0} onClick={() => handlePreviousPose()}>
              <LeftOutlined />
            </Button>

            <div style={{ textAlign: 'center', margin: '10px 0' }}>
              <span>
                {selectedPoseIndex + 1} /{' '}
                {selectedClass
                  ? (classList.find((i) => i.id === selectedClass.id)?.poses.length ?? 0)
                  : 0}
              </span>
            </div>

            <Button
              disabled={
                selectedPoseIndex >=
                (selectedClass
                  ? (classList.find((i) => i.id === selectedClass.id)?.poses.length ?? 0)
                  : 0) -
                  1
              }
              onClick={() => handleNextPose()}
            >
              <RightOutlined />
            </Button>
          </div>

          <div className={styles.class_area}>
            <Select
              onChange={handleChangeClass}
              options={classList.map((cls) => ({ label: cls.name, value: cls.id }))}
              style={{ width: 188 }}
              value={selectedClassId}
            />
            <Button
              onClick={() => {
                if (selectedPose && selectedClassId) {
                  handlePosePreviewDelete(selectedClassId, selectedPose);
                }
              }}
            >
              <DeleteOutlined />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sample;
