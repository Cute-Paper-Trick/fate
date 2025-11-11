'use client';
import * as speechCommands from '@tensorflow-models/speech-commands';
import * as tf from '@tensorflow/tfjs';
import { useTranslate } from '@tolgee/react';
import { Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { message } from '@/components/AntdStaticMethods';

import styles from './audio.module.scss';
import Preview from './features/Preview';
import SampleComponent from './features/Sample';
import Training from './features/Training';
import { useAudioStore } from './stores/audioSlice';

interface ExampleCounts {
  [label: string]: number;
}

interface TransferRecognizer {
  collectExample: (label: string, options?: { example?: AudioBuffer }) => Promise<void>;
  countExamples: () => ExampleCounts;
  train: (config: {
    epochs?: number;
    batchSize?: number;
    validationSplit?: number;
  }) => Promise<void>;
  listen: (
    callback: (result: { scores: number[] }) => void,
    options?: { probabilityThreshold?: number },
  ) => Promise<() => void>;
  serializeExamples: () => ArrayBuffer;
  loadExamples: (buffer: ArrayBuffer) => Promise<void>;
  wordLabels: () => string[];
  stopListening?: () => void;
}

const AudioTrainer: React.FC = () => {
  const recognizerRef = useRef<speechCommands.SpeechCommandRecognizer | null>(null);
  const transferRef = useRef<TransferRecognizer | null>(null);
  const { setTransferRefCurrent } = useAudioStore();
  const { clearAudios } = useAudioStore();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslate('lab');

  // 初始化模型
  useEffect(() => {
    const initModel = async () => {
      try {
        // console.log('正在加载模型...');
        setLoading(true);
        await tf.setBackend('webgl');
        await tf.ready();
        const MODEL_BASE_URL =
          'https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/fetch/speech-commands/';
        const recognizer = speechCommands.create(
          'BROWSER_FFT',
          undefined,
          MODEL_BASE_URL + 'model.json', // customModelURL
          MODEL_BASE_URL + 'metadata.json', // customMetadataURL
        );
        await recognizer.ensureModelLoaded();
        const transfer = recognizer.createTransfer('my-custom-model');

        recognizerRef.current = recognizer;
        // console.log(transferRef.current);

        // @ts-expect-error - spectrogram not in official types
        transferRef.current = transfer;
        if (transferRef.current) {
          // console.log(transferRef.current);

          setTransferRefCurrent(transferRef.current);
        }
        setLoading(false);
        message.success(t('classifier.model.success.loaded', '模型加载完成！'));
      } catch (error) {
        console.log(`模型加载失败: ${error}`);
        message.error(t('classifier.model.error.unloaded', '模型加载失败'));
      }
    };
    initModel();
  }, []);

  // 组件卸载时清空 audios
  useEffect(() => {
    return () => {
      clearAudios();
    };
  }, [clearAudios]);

  return (
    <div className={styles.container}>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <Spin size="default" />
        </div>
      )}
      {/* <FileMenu trainId="" trainType="audio" temporaryImages={sampleAudio} /> */}
      <div className={styles.audio_container}>
        <SampleComponent />
        <Training />
        <Preview />
      </div>
    </div>
  );
};

export default AudioTrainer;
