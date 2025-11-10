'use client';

import type { MenuProps } from 'antd';

import {
  CloseOutlined,
  DeleteOutlined,
  LeftOutlined,
  MoreOutlined,
  // SettingOutlined,
  // QuestionCircleOutlined,
  PlusSquareOutlined,
  RightOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Image as AntdImage, Button, Dropdown, Input, Modal, Select } from '@lobehub/ui';
// import { Image as AntdImage } from 'antd';
import { Card, Space, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useImageModel } from '../hooks/imageHooks';
import styles from '../imageTrainer.module.scss';
import { useImageStore } from '../stores/imageSlice';

type CapturedImage = { id: string; src: string };

type SampleProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
  e.target.select(); // 全选内容
};

const Sample: React.FC<SampleProps> = ({ videoRef }) => {
  const {
    list: classList,
    addClass,
    removeClass,
    renameClass,
    changeClass,
    imageDelete,
    clearClassSample,
    changeClassImages,
  } = useImageStore();

  const { processImage, init, startCamera, downloadImagesAsZip } = useImageModel({ classList });
  const previewRefMap = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectMap, setSelectMap] = useState<Record<string, boolean>>({});
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
  const [videoReady, setVideoReady] = useState(false);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const HOLD_INTERVAL = 5; // ms
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CapturedImage | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const selectedClass = classList.find((c) => c.id === selectedClassId);

  useEffect(() => {
    classList.forEach((_, classId) => {
      const container = previewRefMap.current[classId];
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, [classList]);

  const handleIni = async () => {
    await init();
    if (!videoRef.current) return;
    startCamera(videoRef);
  };

  useEffect(() => {
    handleIni();
  }, []);

  //camera
  useEffect(() => {
    const activeClassId = Object.keys(selectMap).find((key) => selectMap[key]);
    if (!activeClassId) return;
    startCamera(videoRef);

    return () => {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, [selectMap, videoReady]);

  //card
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
  const handleImagePreview = (image: CapturedImage) => {
    for (const classItem of classList) {
      const index = classItem.images.findIndex((img) => img.id === image.id);
      if (index !== -1) {
        setSelectedClassId(classItem.id);
        setSelectedImageIndex(index);
        setSelectedImage(image);
        setImageModalVisible(true);
        break;
      }
    }
  };

  const handleImageDelete = (classId: string, image: CapturedImage) => {
    imageDelete(classId, image.id);
  };

  const handleImagePreviewDelete = (classId: string, image: CapturedImage) => {
    handleImageDelete(classId, image);
    setImageModalVisible(false);
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => {
      const images = selectedClass?.images ?? [];
      const newIndex = Math.max(0, prev - 1);
      setSelectedImage(images[newIndex] ?? null);
      return newIndex;
    });
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => {
      const images = selectedClass?.images ?? [];
      const newIndex = Math.min(images.length - 1, prev + 1);
      setSelectedImage(images[newIndex] ?? null);
      return newIndex;
    });
  };

  const handleChangeClass = (newClassId: string) => {
    if (!selectedClassId) return;

    const selectedClassItem = classList.find((c) => c.id === selectedClassId);
    const newClassItem = classList.find((c) => c.id === newClassId);
    const imageToMove = selectedClassItem?.images[selectedImageIndex];

    if (!selectedClassItem || !newClassItem || !imageToMove) return;
    if (newClassId === selectedClassId) return;

    changeClass(selectedClassItem.id, imageToMove.id, newClassItem.id);

    setSelectedClassId(newClassId);
    setSelectedImageIndex(newClassItem.images.length ? newClassItem.images.length : 0);
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

  //button
  const handleUpload = async (file: File, classId: string) => {
    try {
      const base64 = await processImage(file, 265, 265);
      const uuid = uuidv4();
      changeClassImages(classId, { id: uuid, src: base64 });
    } catch (error) {
      console.error('图片处理失败:', error);
    }
  };

  const startHoldCapture = (id: string) => {
    if (captureIntervalRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');

    captureIntervalRef.current = setInterval(() => {
      if (videoRef.current && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, 0, 0, 224, 224);

        const data = canvas.toDataURL('image/png');
        const uuid = uuidv4();
        const newImage: CapturedImage = { id: uuid, src: data };
        changeClassImages(id, newImage);
      }
    }, HOLD_INTERVAL);
  };

  const stopHoldCapture = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };

  const handleModelUpload = async (id: string) => {
    await downloadImagesAsZip(id);
  };

  return (
    <div className={styles.image_card_container}>
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
          {
            key: '3',
            label: (
              <span
                onClick={() => {
                  handleModelUpload(cls.id);
                }}
              >
                下载所有样本
              </span>
            ),
          },
        ];

        return (
          <Card
            className={styles.image_card}
            extra={
              <Dropdown
                className={styles.preview_dropdown}
                menu={{ items }}
                placement="bottomLeft"
                trigger={['click']}
              >
                <MoreOutlined />
              </Dropdown>
            }
            key={cls.id}
            title={
              <Input
                className={styles.image_card_item}
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
                    <CloseOutlined />
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
                        <p style={{ margin: 0 }}>仅支持png，jpg</p>
                      </Button>
                    </Upload>

                    {/* <Button className={styles.button_upload} icon={<UploadOutlined style={{ fontSize: '20px' }} />}>
                      Google 云端硬盘导入图片
                    </Button> */}
                  </div>
                </div>
                <div className={styles.cardArea_cont}>
                  <p style={{ color: '#3C4043' }}>{cls.images.length}个图片样本</p>
                  <div className={styles.cardArea_preview}>
                    {cls.images.map((img, i) => (
                      <div
                        className={styles.img_item}
                        key={img.id}
                        style={{ position: 'relative', minWidth: '60px' }}
                      >
                        <img
                          alt={`sample-${i}`}
                          onClick={() => handleImagePreview(img)}
                          src={img.src}
                          style={{ width: 60, height: 60, cursor: 'pointer' }}
                        />
                        <div className={styles.close_icon}>
                          <DeleteOutlined
                            onClick={() => {
                              handleImageDelete(cls.id, img);
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
                    <CloseOutlined />
                  </Button>
                  {videoReady ? (
                    <div className={styles.cardArea_button}>
                      <video
                        autoPlay
                        className={styles.video}
                        height={265}
                        muted
                        playsInline
                        ref={videoRef}
                        width={265}
                      />
                      <div className={styles.video_button_area}>
                        <Button
                          className={styles.button_hold}
                          onMouseDown={() => startHoldCapture(cls.id)}
                          onMouseLeave={stopHoldCapture}
                          onMouseUp={stopHoldCapture}
                          onTouchCancel={stopHoldCapture}
                          onTouchEnd={stopHoldCapture}
                          onTouchStart={() => startHoldCapture(cls.id)}
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
                  <p style={{ color: '#3C4043' }}>{cls.images.length} 个图片样本</p>
                  <div
                    className={styles.cardArea_preview}
                    ref={(el) => void (previewRefMap.current[cls.id] = el)}
                  >
                    {cls.images.map((img, i) => (
                      <div
                        className={styles.img_item}
                        key={img.id}
                        style={{ position: 'relative', minWidth: '60px' }}
                      >
                        <img
                          alt={`sample-${i}`}
                          onClick={() => handleImagePreview(img)}
                          src={img.src}
                          style={{ width: 60, height: 60, cursor: 'pointer' }}
                        />
                        <div className={styles.close_icon}>
                          <DeleteOutlined
                            onClick={() => {
                              handleImageDelete(cls.id, img);
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
                  {cls.images.map((img, i) => (
                    <div
                      className={styles.img_item}
                      key={img.id}
                      style={{ position: 'relative', minWidth: '60px' }}
                    >
                      <img
                        alt={`sample-${i}`}
                        onClick={() => handleImagePreview(img)}
                        src={img.src}
                        style={{ width: 60, height: 60, cursor: 'pointer' }}
                      />
                      <div className={styles.close_icon}>
                        <DeleteOutlined
                          onClick={() => {
                            handleImageDelete(cls.id, img);
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
        onCancel={() => setImageModalVisible(false)}
        open={imageModalVisible}
        style={{ top: 'calc(50% - 190px)' }}
        title={selectedClass?.name}
        width={260}
      >
        <div className={styles.preview_box}>
          <AntdImage
            alt="preview"
            src={selectedImage ? selectedImage.src : ''}
            style={{ maxWidth: '288px', maxHeight: '288px' }}
          />

          <div className={styles.control_area}>
            <Button disabled={selectedImageIndex <= 0} onClick={() => handlePreviousImage()}>
              <LeftOutlined />
            </Button>

            <div style={{ textAlign: 'center', margin: '10px 0' }}>
              <span>
                {selectedImageIndex + 1} /{' '}
                {selectedClass
                  ? (classList.find((i) => i.id === selectedClass.id)?.images.length ?? 0)
                  : 0}
              </span>
            </div>

            <Button
              disabled={
                selectedImageIndex >=
                (selectedClass
                  ? (classList.find((i) => i.id === selectedClass.id)?.images.length ?? 0)
                  : 0) -
                  1
              }
              onClick={() => handleNextImage()}
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
                if (selectedImage && selectedClassId) {
                  handleImagePreviewDelete(selectedClassId, selectedImage);
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
