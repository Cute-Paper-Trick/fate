'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAudioStore } from '../stores/audioSlice';

interface Prediction {
  label: number;
  confidences: Record<number, number>;
}

interface ExampleCounts {
  [label: string]: number;
}

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
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

const BACKGROUND_NOISE_LABEL = 'Class background';
// ----------------------------------------------------

export const useSpeechTrainer = () => {
  const {
    list: audios,
    setPredictions,
    setTrainingOver,
    setSpeechCommands,
    transferRefCurrent,
  } = useAudioStore();

  // refs
  const hasStartedPredictingRef = useRef(false);
  const predictingRef = useRef(false);

  // states
  const [predicting, setPredicting] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [exampleCounts, setExampleCounts] = useState<ExampleCounts>({
    [BACKGROUND_NOISE_LABEL]: 0,
  });

  const importClassAudios = useCallback(
    async (classId: string) => {
      if (!transferRefCurrent.current) return;
      const classData = audios.find((cls) => cls.id === classId);
      if (!classData || !classData.audios?.length) {
        console.log(`找不到 ${classId} 类别或没有音频数据`);
        return;
      }

      const AudioContextClass =
        globalThis.AudioContext ||
        (globalThis as unknown as WindowWithWebkitAudio).webkitAudioContext;
      if (!AudioContextClass) {
        console.error('浏览器不支持 AudioContext');
        return;
      }
      const audioCtx = new AudioContextClass();

      console.log(`正在导入 ${classData.name} 类别音频...`);
      let count = 0;
      for (const url of classData.audios) {
        try {
          count++;
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          await transferRefCurrent.current.collectExample(classData.name, { example: audioBuffer });
        } catch (error) {
          console.error(`导入 ${classData.name} 的音频失败:`, error);
        }
      }

      // 更新示例计数
      if (transferRefCurrent.current) {
        const counts = transferRefCurrent.current.countExamples();
        setExampleCounts(counts);
        const backgroundReady = (counts[BACKGROUND_NOISE_LABEL] || 0) > 0;
        const customReady = Object.values(counts).some((c) => c > 0);
        setIsModelTrained(backgroundReady && customReady);
      }

      console.log(`已完成导入 ${classData.name} (${count}/${classData.audios.length})`);
    },
    [audios, transferRefCurrent, setExampleCounts, setIsModelTrained],
  );

  const importAllClassesForTraining = useCallback(async () => {
    for (const cls of audios) {
      await importClassAudios(cls.id);
    }
  }, [audios, importClassAudios]); // 必须包含 importClassAudios

  // 训练模型
  const trainModel = useCallback(async () => {
    if (!transferRefCurrent.current) return;
    await importAllClassesForTraining();
    try {
      await transferRefCurrent.current.train({ epochs: 50, batchSize: 16, validationSplit: 0.1 });
      console.log('训练完成！可以开始识别。');
      setIsModelTrained(true);
      setPredicting(true);
      setTrainingOver(true);
      setSpeechCommands(transferRefCurrent.current);
    } catch (error) {
      console.log(`训练失败: ${error}`);
      setIsModelTrained(false);
    }
  }, [
    importAllClassesForTraining,
    transferRefCurrent,
    setTrainingOver,
    setSpeechCommands,
    setIsModelTrained,
    setPredicting,
  ]);

  // 开始预测 (必须在 useEffect 之前声明)
  const startPredicting = useCallback(async () => {
    if (predictingRef.current) return;
    predictingRef.current = true;
    // setPredicting(true);
    console.log('开始预测');

    await transferRefCurrent.current!.listen(
      (result) => {
        if (predictingRef.current) {
          const scores = result.scores;
          const classLabels = transferRefCurrent.current!.wordLabels();
          const prediction: Prediction[] = classLabels.map((_, i) => ({
            label: i,
            confidences: { [i]: scores[i]! },
          }));
          setPredictions(prediction);
        }
      },
      { probabilityThreshold: 0 },
    );
  }, [transferRefCurrent, setPredictions, setPredicting]);

  useEffect(() => {
    if (predicting && !hasStartedPredictingRef.current) {
      startPredicting();
      hasStartedPredictingRef.current = true;
    }
  }, [predicting, startPredicting]);

  // 停止预测
  const stopPredicting = useCallback(() => {
    transferRefCurrent.current?.stopListening?.();
    if (!predictingRef.current) return;
    console.log('停止预测');
    predictingRef.current = false;
    setPredicting(false);
  }, [transferRefCurrent]);

  // 导出模型
  const exportModel = useCallback((refs: TransferRecognizer) => {
    if (!refs) return;
    const serialized = refs.serializeExamples();
    const blob = new Blob([serialized], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speech_data_${Date.now()}.bin`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // 返回 API
  return {
    trainModel,
    startPredicting,
    stopPredicting,
    exportModel,
    importClassAudios,
    predicting,
    isModelTrained,
    exampleCounts,
  };
};
