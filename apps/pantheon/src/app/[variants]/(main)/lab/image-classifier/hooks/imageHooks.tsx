'use client';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import { useTranslate } from '@tolgee/react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useEffect, useRef, useState } from 'react';

import { message } from '@/components/AntdStaticMethods';

import { useImageStore } from '../stores/imageSlice';

type ClassList = {
  classList: ClassItem[];
};

interface ClassItem {
  id: string;
  name: string;
  images: {
    id: string;
    src: string;
  }[];
}

interface Features {
  logits: tf.Tensor;
  predictions: Prediction[];
  topTags: TopTag[];
}

interface TopTag {
  className: string;
  probability: number;
  logit: number;
}

interface Prediction {
  label: number;
  confidences: Record<number, number>;
  minDistance?: number;
  isSingleClass?: boolean;
  isUnknown?: boolean;
}

const softmax = (values: Float32Array) => {
  const expValues = values.map((v) => Math.exp(v));
  const sum = expValues.reduce((a, b) => a + b, 0);
  return expValues.map((v) => v / sum);
};

//image
const processImage = (file: File, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.addEventListener('load', () => {
      const imgWidth = img.width;
      const imgHeight = img.height;

      // 计算缩放比例，确保图片的较小边 >= 目标尺寸，保证不会出现空白
      const scale = Math.max(width / imgWidth, height / imgHeight);

      // 缩放后图片尺寸
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      // 设置画布尺寸为目标尺寸
      canvas.width = width;
      canvas.height = height;

      // 计算缩放后图片左上角相对画布的偏移（中心裁剪）
      const dx = (width - scaledWidth) / 2;
      const dy = (height - scaledHeight) / 2;

      // 先缩放绘制图像到画布
      ctx?.clearRect(0, 0, width, height);
      ctx?.drawImage(img, dx, dy, scaledWidth, scaledHeight);

      // 输出base64
      const result = canvas.toDataURL('image/png');
      resolve(result);
    });

    img.addEventListener('error', () => reject(new Error('图片加载失败')));
    img.src = URL.createObjectURL(file);
  });
};

export const useImageModel = ({ classList }: ClassList) => {
  const { t } = useTranslate('lab');
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [imagenetClasses, setImagenetClasses] = useState<string[]>([]);
  const filteredConfidences = useRef<Record<number, number>>({});
  const {
    kValue,
    distanceThreshold,
    filterAlpha,
    setLoading,
    setPredictions,
    compareType,
    knnClassifierInstance,
    setKnnClassifierInstance,
    setMobilenetModel,
    mobilenetModel,
  } = useImageStore();

  useEffect(() => {
    setElement(document.body);
  }, []);

  // 简化版 ImageNet 类别
  const loadImageNetClasses = async () => {
    setImagenetClasses([
      'tench',
      'goldfish',
      'shark',
      'tiger_shark',
      'hammerhead',
      'electric_ray',
      'stingray',
      'cock',
      'hen',
      'ostrich',
    ]);
  };

  // 模型初始化
  const init = async () => {
    message.loading(t('classifier.model.loading.loading', '加载 MobileNet 模型...'));
    if (element) {
      element.style.height = 'initial';
    }

    try {
      await tf.setBackend('webgl');
      await tf.ready();
      const model = await mobilenet.load({
        version: 2,
        alpha: 1,
        modelUrl:
          'https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/fetch/mobilenet/model.json',
      });
      setMobilenetModel(model);

      const knn = knnClassifier.create();
      setKnnClassifierInstance(knn);

      await loadImageNetClasses();
      setLoading(true);
      message.success(t('classifier.model.success.loaded', '模型加载完成！'));
    } catch (error) {
      message.error(t('classifier.model.error.unloaded', '模型加载失败'));
      console.error(error);
    }
  };

  const startCamera = async (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // setVideoReady(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadedmetadata', () => videoRef.current?.play());
      }
    } catch (error) {
      // setVideoReady(false);
      console.error('无法访问摄像头' + error);
      message.error(t('classifier.model.error.denied', '无法访问摄像头:'));
    }
  };

  const getTopKTags = async (logits: tf.Tensor, k = 10) => {
    const values = await logits.data();
    const arr = Array.from(values).map((v, i) => ({ value: v, index: i }));
    arr.sort((a, b) => b.value - a.value);
    const topkValues = new Float32Array(k);
    const topTags: TopTag[] = [];
    for (let i = 0; i < k; i++) {
      topkValues[i] = arr[i]!.value;
      topTags.push({
        className: imagenetClasses[i] || `class_${arr[i]!.index}`,
        probability: softmax(topkValues)[i]!,
        logit: topkValues[i]!,
      });
    }
    return topTags;
  };

  // KNN预测（简化单品类/多品类）
  const predictWithDistance = async (
    logits: tf.Tensor,
    k: number,
  ): Promise<Prediction | Prediction[]> => {
    if (!knnClassifierInstance || knnClassifierInstance.getNumClasses() === 0) {
      return { label: -1, confidences: {}, isSingleClass: false, isUnknown: true };
    }

    const numClasses = knnClassifierInstance.getNumClasses();
    if (numClasses === 1) {
      // 单品类距离判断
      const dataset = knnClassifierInstance.getClassifierDataset()[0];
      if (!dataset)
        return { label: -1, confidences: { 0: 0 }, minDistance: Infinity, isSingleClass: true };
      const inputData = await logits.data();
      const trainData = await dataset.data();
      const featureDim = dataset.shape[1];
      let minDistance = Infinity;
      for (let i = 0; i < dataset.shape[0]; i++) {
        let dist = 0;
        for (let j = 0; j < featureDim; j++) {
          const diff = inputData[j]! - trainData[i * featureDim + j]!;
          dist += diff * diff;
        }
        dist = Math.sqrt(dist);
        if (dist < minDistance) minDistance = dist;
      }
      const threshold = distanceThreshold || 0.5;
      const belongs = minDistance <= threshold;
      return {
        label: belongs ? 0 : -1,
        confidences: { 0: belongs ? 1 : 0 },
        minDistance,
        isSingleClass: true,
        isUnknown: !belongs,
      };
    }

    // 多类别 KNN
    const pred = await knnClassifierInstance.predictClass(logits, k);
    const confidences: Record<number, number> = {};
    for (let i = 0; i < classList.length; i++) {
      confidences[i] = pred.confidences[i] ?? (i === Number(pred.label) ? 1 : 0);
    }

    return { label: Number(pred.label), confidences, isSingleClass: false, isUnknown: false };
  };

  // 提取特征
  const extractImageNetTags = async (
    img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  ): Promise<Features | null> => {
    // 检查尺寸
    const isVideo = img instanceof HTMLVideoElement;
    const isImgOrCanvas = img instanceof HTMLImageElement || img instanceof HTMLCanvasElement;

    // 尺寸不合法，跳过
    if (
      (isVideo && (img.videoWidth === 0 || img.videoHeight === 0)) ||
      (isImgOrCanvas && (img.width === 0 || img.height === 0))
    ) {
      return null;
    }

    if (!mobilenetModel) return null;

    try {
      const predictions = await mobilenetModel.classify(img);
      const rawEmbeddings = mobilenetModel.infer(img, true);

      const embeddings = tf.tidy(() => {
        const norm = tf.norm(rawEmbeddings);
        const normalized = tf.div(rawEmbeddings, norm);
        rawEmbeddings.dispose();
        return normalized;
      });

      const logits = mobilenetModel.infer(img, false);
      const topTags = await getTopKTags(logits, 10);
      logits.dispose();

      return {
        logits: embeddings,
        predictions: predictions.map((p, i) => ({
          label: i,
          confidences: { [i]: p.probability },
          isSingleClass: false,
          isUnknown: false,
        })),
        topTags,
      };
    } catch (error) {
      console.warn('特征提取被跳过:', error);
      return null;
    }
  };

  const getIsPredicting = () => useImageStore.getState().isPredicting;

  let rafId: number | null = null;

  // 低通滤波数组
  const applyLowPassFilterArray = (preds: Prediction[]): Prediction[] => {
    const alpha = filterAlpha || 0.3;
    return preds.map((pred) => {
      if (pred.isSingleClass) return pred; // 单品类直接返回
      const newConfidences: Record<number, number> = {};
      Object.keys(pred.confidences).forEach((k) => {
        const idx = parseInt(k);
        const prev = filteredConfidences.current[idx] || 0;
        const curr = pred.confidences[idx] || 0;
        filteredConfidences.current[idx] = alpha * curr + (1 - alpha) * prev;
        newConfidences[idx] = filteredConfidences.current[idx];
      });
      // 归一化
      const sum = Object.values(newConfidences).reduce((a, b) => a + b, 0) || 1;
      Object.keys(newConfidences).forEach((k) => (newConfidences[parseInt(k)]! /= sum));

      let maxLabel = 0,
        maxConf = 0;
      Object.keys(newConfidences).forEach((k) => {
        const idx = parseInt(k);
        if (newConfidences[idx]! > maxConf) {
          maxConf = newConfidences[idx]!;
          maxLabel = idx;
        }
      });
      return { ...pred, label: maxLabel, confidences: newConfidences };
    });
  };

  const predictLoop = async (
    uploadedImg: HTMLImageElement | null,
    video: HTMLVideoElement | null,
  ) => {
    if (!useImageStore.getState().isPredicting) return;

    let features: Features | null = null;

    if (compareType === 'pic' && uploadedImg) {
      features = await extractImageNetTags(uploadedImg);
      if (!features) return;
      const k = kValue || 3;
      const predictionWithDistance = await predictWithDistance(features.logits, k);
      const finalPredictions: Prediction[] = Array.isArray(predictionWithDistance)
        ? predictionWithDistance
        : [predictionWithDistance];
      setPredictions(finalPredictions);
      features.logits.dispose();
      return; // 只执行一次
    }

    if (compareType === 'video' && video) {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        rafId = requestAnimationFrame(() => predictLoop(uploadedImg, video));
        return;
      }

      features = await extractImageNetTags(video);
      if (!features) return;

      const k = kValue || 3;
      const predictionWithDistance = await predictWithDistance(features.logits, k);
      const finalPredictions: Prediction[] = Array.isArray(predictionWithDistance)
        ? predictionWithDistance
        : [predictionWithDistance];

      const smoothedPredictions = applyLowPassFilterArray(finalPredictions);
      setPredictions(smoothedPredictions);

      features.logits.dispose();
    }

    rafId = requestAnimationFrame(() => predictLoop(uploadedImg, video));
  };

  const stopPredict = () => {
    useImageStore.setState({ isPredicting: false });
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  // 导出训练好的 KNN 模型;
  const exportKNNModelWithBin = async () => {
    if (!knnClassifierInstance || knnClassifierInstance.getNumClasses() === 0) {
      message.error(t('classifier.model.error.no_save', '没有可保存的模型:'));
      return;
    }

    try {
      // 1. 获取 KNN 数据集
      const dataset = knnClassifierInstance.getClassifierDataset();
      const datasetObj: Record<string, { start: number; length: number }> = {};
      let allData: number[] = [];
      let offset = 0;

      Object.keys(dataset).forEach((key) => {
        const tensorData = dataset[key]!.dataSync(); // Tensor -> 数组
        const dataArr = Array.from(tensorData);
        datasetObj[key] = { start: offset, length: dataArr.length };
        allData = allData.concat(dataArr);
        offset += dataArr.length;
      });

      // 2. 保存特征维度
      let featureDim = 1280; // 默认值
      const firstKey = Object.keys(dataset)[0];
      if (firstKey && dataset[firstKey]) {
        featureDim = dataset[firstKey].shape[1];
      }

      // 3. JSON 元数据
      const modelMeta = {
        dataset: datasetObj,
        classList,
        k: kValue || 3,
        featureDim,
        date: new Date().toISOString(),
        dataFile: 'knn-model.bin',
      };

      // 4. 创建 JSZip 对象
      const zip = new JSZip();

      // 5. 将 JSON 和 BIN 文件添加到压缩包中
      const jsonBlob = new Blob([JSON.stringify(modelMeta)], { type: 'application/json' });
      const binBlob = new Blob([new Float32Array(allData).buffer], {
        type: 'application/octet-stream',
      });

      zip.file('knn-model.json', jsonBlob);
      zip.file('knn-model.bin', binBlob);

      // 6. 生成并下载压缩文件
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const aZip = document.createElement('a');
      aZip.href = zipUrl;
      aZip.download = 'knn-model.zip';
      aZip.click();
      URL.revokeObjectURL(zipUrl);

      message.success(t('classifier.model.success.save', '模型已保存为压缩文件（JSON + BIN）'));
    } catch (error: unknown) {
      console.error('导出模型失败:', error);
    }
  };

  // 下载sample文件
  const downloadImagesAsZip = async (id: string) => {
    const zip = new JSZip();
    const maxPerClass = 400;

    for (const cls of classList) {
      console.log(cls.images);

      if (cls.id === id && cls.images.length > 0) {
        const folder = zip.folder(cls.name || cls.id);
        if (!folder) continue;
        // const images = temporaryImages.get(cls.id) || [];
        const images = cls.images.map((img) => img.src);
        const count = Math.min(images.length, maxPerClass);

        for (let i = 0; i < count; i++) {
          const idx = Math.floor((i / count) * images.length);
          const image = images[idx];

          const res = await fetch(image!);
          const blob = await res.blob();
          folder.file(`${i + 1}.png`, blob);
        }

        const download = await zip.generateAsync({ type: 'blob' });
        saveAs(download, 'exported_images.zip');
      }
    }
  };

  return {
    init,
    processImage,
    predictLoop,
    exportKNNModelWithBin,
    extractImageNetTags,
    startCamera,
    downloadImagesAsZip,
    stopPredict,
    getIsPredicting,
  };
};
