'use client';
import { ArrowDownOutlined } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { Button, Space, Switch } from 'antd';
import { useRef, useState } from 'react';

import Predictions from '../../components/prediction/Prediction';
import styles from '../audio.module.scss';
import { useAudioStore } from '../stores/audioSlice';
import LivePreview from './PreviewAudio';
import { useSpeechTrainer } from './SpeechTrainer';

const Preview: React.FC = () => {
  const { startPredicting, stopPredicting, exportModel } = useSpeechTrainer();
  const livePreviewRef = useRef<{ togglePause: () => void }>(null);
  const [isPredicting, setIsPredicting] = useState(true);
  const { trainingOver, predictions, speechCommands, list: classList } = useAudioStore();
  const { t } = useTranslate('lab');

  const handleSwitchChange = async (checked: boolean) => {
    if (checked) {
      // 开始识别
      setIsPredicting(true);
      livePreviewRef.current?.togglePause();
      await startPredicting();
    } else {
      // 停止识别
      setIsPredicting(false);
      livePreviewRef.current?.togglePause();
      stopPredicting();
    }
  };

  return (
    <div className={styles.audio_preview_container}>
      <div className={styles.audio_preview_cont}>
        <div className={styles.audio_preview_box}>
          <div className={styles.preview_title_area}>
            <p className={styles.preview_title}>{t('classifier.preview.title', '预览')}</p>
            <Button
              disabled={!trainingOver}
              onClick={() => {
                exportModel(speechCommands);
              }}
            >
              {t('classifier.preview.export', '导出模型')}
            </Button>
          </div>
          {trainingOver ? (
            <>
              <div className={styles.preview_body_area}>
                <div className={styles.preview_control_area}>
                  <Space direction="horizontal">
                    <Switch
                      className={styles.preview_switch}
                      defaultChecked={true}
                      onChange={handleSwitchChange}
                    />
                    <p className={styles.preview_switch_text}>
                      {!isPredicting
                        ? t('classifier.preview.disable', '已停用')
                        : t('classifier.preview.enable', '已启用')}
                    </p>
                  </Space>
                </div>
                <LivePreview ref={livePreviewRef} />
              </div>
              <div className={styles.preview_output_area}>
                <p>{t('classifier.preview.output', '输出')}</p>
                <ArrowDownOutlined
                  style={{
                    borderRadius: '50%',
                    background: '#E8EAED',
                    padding: '3px',
                    position: 'absolute',
                    top: 'calc(-50% + 20px)',
                    left: '50%',
                    transform: 'translate(-50%)',
                  }}
                />
              </div>
              <div style={{ width: '100%', filter: !isPredicting ? 'grayscale(100%)' : 'none' }}>
                <Predictions classList={classList} predictions={predictions} />
              </div>
            </>
          ) : (
            <p className={styles.output_text}>
              {t('classifier.preview.attention', '您必须先在左侧训练模型，然后才可以在此处预览。')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
