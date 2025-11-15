'use client';
import {
  CloseOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusSquareOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Image, Input, Modal } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { Card, type MenuProps, Space, Upload } from 'antd';
import React, { useRef, useState } from 'react';

import styles from '../audio.module.scss';
import { useAudioStore } from '../stores/audioSlice';
import LiveSpectrogram, { LiveSpectrogramRef } from './Record';

const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
  e.target.select(); // 全选内容
};

const SampleComponent: React.FC = () => {
  const spectrogramRefs = useRef<Map<string, LiveSpectrogramRef>>(new Map());
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);
  const setSpectrogramRef = (classId: string) => (ref: LiveSpectrogramRef | null) => {
    if (ref) {
      spectrogramRefs.current.set(classId, ref);
    } else {
      spectrogramRefs.current.delete(classId);
    }
  };
  const { t } = useTranslate('lab');
  const { list } = useAudioStore();
  const { addClass } = useAudioStore();
  const { removeClass } = useAudioStore();
  const { renameClass } = useAudioStore();
  const { clearClassSample, trainingFlag, trainingOver } = useAudioStore();

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
  const [selectMap, setSelectMap] = useState<Record<string, boolean>>({});
  const [audioUrl] = useState<string>('');
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [openHelp, setOpenhelp] = useState(false);

  const handleAddClass = () => {
    const name = `Class ${list.length + 1}`;
    const id = `class-${Date.now()}`;
    addClass({ name, id });
  };

  const handleRemoveClass = (id: string) => {
    removeClass(id);
    if (selectedClassId === id) {
      setSelectedClassId('');
    }
  };

  const handleRemoveSample = (id: string) => {
    clearClassSample(id);
  };

  const handleRenameClass = (classId: string, newName: string) => {
    renameClass({ id: classId, name: newName });
  };

  // const handleUpload = async (file: File, classId: string) => {
  //   try {
  //     const uuid = uuidv4();
  //     const audioUrl = URL.createObjectURL(file);
  //     setSampleAudio(prev => {
  //       const newMap = new Map(prev);
  //       const currentAudios = newMap.get(classId) || [];

  //       // 检查音频是否已存在，避免重复添加
  //       if (!currentAudios.some(audio => audio.src === audioUrl)) {
  //         const updatedAudios = [...currentAudios, { id: uuid, src: audioUrl }];
  //         newMap.set(classId, updatedAudios);
  //       }

  //       return newMap;
  //     });
  //   } catch (error) {
  //     console.error("音频处理失败:", error);
  //   }
  // };

  const setUploading = (id: string, value: boolean) => {
    setUploadingMap((prev) => ({ ...prev, [id]: value }));
  };

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
  };

  const stopAllOtherRecordings = (currentId: string) => {
    spectrogramRefs.current.forEach((ref, id) => {
      if (id !== currentId) {
        ref.stopMinimalCleanup();
      }
    });
    setActiveRecordingId(null);
  };

  const stopAllRecordings = () => {
    spectrogramRefs.current.forEach((ref) => {
      console.log(spectrogramRefs.current);

      ref.stopMinimalCleanup();
    });
    setActiveRecordingId(null);
  };

  const handleStartRecording = (classId: string) => {
    stopAllOtherRecordings(classId);
    setActiveRecordingId(classId);
    setSelect(classId, true);
  };

  const handleRecordingStopped = (classId: string) => {
    if (activeRecordingId === classId) {
      setActiveRecordingId(null);
    }
  };

  return (
    <div className={styles.audio_card_container}>
      {list.map((cls) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: (
              <span
                onClick={(e) => {
                  if (cls.id === 'class-env') {
                    e.preventDefault();
                    e.stopPropagation();
                    stopAllRecordings();
                  } else {
                    handleRemoveClass(cls.id);
                    stopAllRecordings();
                  }
                }}
              >
                {t('classifier.sample.delete_category', '删除类别')}
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
                  stopAllRecordings();
                }}
              >
                {t('classifier.sample.delete_all', '删除所有样本')}
              </span>
            ),
          },
        ];

        return (
          <Card
            className={styles.audio_card}
            extra={
              <Dropdown
                className={styles.preview_dropdown}
                menu={{ items }}
                trigger={['click']}
                placement="bottomLeft"
              >
                <MoreOutlined />
              </Dropdown>
            }
            title={
              <Input
                onFocus={handleFocus}
                value={cls.name}
                disabled={cls.id === 'class-env'}
                onChange={(e) => handleRenameClass(cls.id, e.target.value)}
              />
            }
            // extra={cls.id !== 'class-env' && (<Button icon={<DeleteOutlined />} style={{ marginLeft: 10 }} onClick={() => handleRemoveClass(cls.id)} />)}
            key={cls.id}
          >
            {uploadingMap[cls.id] ? (
              <div className={styles.cardArea}>
                <div className={styles.cardArea_cont}>
                  <p>{t('classifier.document.title', '文件')}</p>
                  <Button
                    className={styles.cardArea_close}
                    onClick={() => setUploading(cls.id, false)}
                  >
                    <CloseOutlined />
                  </Button>
                  <div className={styles.cardArea_button}>
                    <Upload multiple={true} showUploadList={false}>
                      <Button
                        className={styles.button_upload}
                        icon={<UploadOutlined style={{ fontSize: '20px' }} />}
                      >
                        {t(
                          'classifier.audio.document.upload',
                          '您可以从文件中选择音频，也可以将音频拖放到此处',
                        )}
                      </Button>
                    </Upload>

                    {/* <Button className={styles.button_upload} icon={<UploadOutlined style={{ fontSize: '20px' }} />}>
                        Google 云端硬盘导入音频
                      </Button> */}
                  </div>
                </div>
                <div className={styles.cardArea_cont}>
                  <p style={{ color: '#3C4043' }}>
                    {(cls.images || []).length}
                    {t('classifier.audio.document.count', '个音频样本 / 至少需要')}
                    {cls.id === 'class-env' ? 5 : 5}个
                  </p>
                  <div className={styles.cardArea_preview}>
                    {cls.audios?.map((audioSrc, i) => (
                      <div className={styles.audio_item} key={i} style={{ position: 'relative' }}>
                        {/* 可以用 audio 播放器 */}
                        <audio controls src={audioSrc} style={{ width: 200 }} />

                        {/* 删除按钮 */}
                        <div className={styles.close_icon}>
                          {cls.audios}
                          <DeleteOutlined
                            // onClick={() => handleAudioDelete(cls.id, audioSrc)}
                            style={{
                              position: 'absolute',
                              top: 2,
                              left: 2,
                              fontSize: 20,
                              color: '#fff',
                              cursor: 'pointer',
                              background: 'transparent',
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
                  <p>{t('classifier.audio.collect.title', '麦克风')}</p>
                  <Button
                    className={styles.cardArea_close}
                    onClick={() => setSelect(cls.id, false)}
                  >
                    <CloseOutlined />
                  </Button>
                  <div className={styles.cardArea_button}>
                    {audioUrl && (
                      <div ref={waveformRef} style={{ width: '200px', height: '100px' }} />
                    )}
                    <LiveSpectrogram
                      classId={cls.id}
                      onRecordingStopped={handleRecordingStopped}
                      ref={setSpectrogramRef(cls.id)}
                    />
                    {cls.id === 'class-env' ? (
                      <>
                        <p
                          onClick={() => {
                            setOpenhelp(true);
                          }}
                          style={{ marginTop: '10px', cursor: 'pointer' }}
                        >
                          <QuestionCircleOutlined />{' '}
                          {t(
                            'classifier.audio.collect.problem',
                            '如果在录制过程中出现问题，请点击这里',
                          )}
                        </p>
                        <Modal
                          className={styles.preview_help}
                          footer={null}
                          onCancel={() => setOpenhelp(false)}
                          open={openHelp}
                          style={{ top: 'calc(50% - 240px)' }}
                          width={900}
                        >
                          <Image
                            alt=""
                            loading="lazy"
                            src="/audiohelp.gif"
                            style={{ width: '900px' }}
                          />
                        </Modal>
                      </>
                    ) : (
                      []
                    )}
                  </div>
                </div>
                <div className={styles.cardArea_cont}>
                  <p style={{ color: '#3C4043' }}>
                    {(cls.images || []).length} {t('classifier.audio.count', '个音频样本')} /{' '}
                    {(cls.images || []).length >= 5 ? (
                      <span>
                        {t('classifier.collect.least', '至少需要')}
                        {cls.id === 'class-env' ? 5 : 5}
                        {t('classifier.collect_unit.text', '个')}
                      </span>
                    ) : (
                      <span style={{ color: 'red' }}>
                        {t('classifier.collect_least.text', '至少需要')}
                        {cls.id === 'class-env' ? 5 : 5}
                        {t('classifier.collect_unit.text', '个')}
                      </span>
                    )}
                  </p>
                  <div className={styles.cardArea_preview}>
                    {cls.images.map((audioSrc, i) => (
                      <div className={styles.audio_item} key={i} style={{ position: 'relative' }}>
                        <div className={styles.close_icon}>
                          <img src={audioSrc.src} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.card_container}>
                <p className={styles.card_label}>
                  {t('classifier.audio.collect.add', '添加音频样本')}
                </p>
                <Space>
                  <Button
                    className={styles.button_comn}
                    icon={<VideoCameraOutlined style={{ fontSize: '20px' }} />}
                    onClick={() => handleStartRecording(cls.id)}
                  >
                    {t('classifier.audio.collect', '麦克风')}
                  </Button>
                  {/* <Button className={styles.button_comn} onClick={() => setUploading(cls.id, true)} icon={<UploadOutlined style={{ fontSize: '20px' }}/>}>上传</Button> */}
                  {cls.images.map((img, i) => (
                    <div className={styles.img_item} key={img.src} style={{ position: 'relative' }}>
                      <Image
                        alt={`sample-${i}`}
                        src={img.src}
                        style={{ width: 60, height: 60 }}
                        // onClick={() => handlePosePreview(img)}
                      />
                      {/* <div className={styles.close_icon}>
                          <DeleteOutlined
                            onClick={() => {handlePoseDelete(cls.id, img)}}
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
                        </div> */}
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
        disabled={trainingFlag || trainingOver}
        icon={<PlusSquareOutlined />}
        onClick={handleAddClass}
      >
        <span style={{ lineHeight: '100px' }}>
          {t('classifier.sample.add_category', '添加类别')}
        </span>
      </Button>
    </div>
  );
};

export default SampleComponent;
