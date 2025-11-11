'use client';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { useTranslate } from '@tolgee/react';
import { useState } from 'react';

import { message } from '@/components/AntdStaticMethods';

// import type * as poseDetection from "@tensorflow-models/pose-detection";
import { usePoseStore } from '../stores/poseSlice';

type CapturedPose = {
  id: string;
  src: string;
};

interface ClassItem {
  id: string;
  name: string;
  poses: CapturedPose[];
}

interface PoseModelProps {
  classList: ClassItem[];
}

//格式化截图
const processPose = (file: File, width: number, height: number): Promise<string> => {
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
      const result = canvas.toDataURL('pose/png');
      resolve(result);
    });

    img.addEventListener('error', () => reject(new Error('图片加载失败')));
    img.src = URL.createObjectURL(file);
  });
};

// drawPose
const drawPoseOnCanvas = (
  pose: poseDetection.Pose,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  if (!canvas || !video) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const canvasSize = 265; // 输出固定大小
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  // 取视频短边为正方形边长
  const side = Math.min(video.videoWidth, video.videoHeight);
  const sx = (video.videoWidth - side) / 2; // 中心裁剪起点X
  const sy = (video.videoHeight - side) / 2; // 中心裁剪起点Y

  // 绘制裁切后的正方形并缩放到 canvas
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.drawImage(video, sx, sy, side, side, 0, 0, canvasSize, canvasSize);

  // 缩放比例
  const scale = canvasSize / side;

  // 绘制关键点
  const keypointsToDraw = new Set([
    'nose',
    'leftShoulder',
    'rightShoulder',
    'leftElbow',
    'rightElbow',
    'leftEye',
    'rightEye',
    'leftEar',
    'rightEar',
  ]);

  pose.keypoints?.forEach((kp) => {
    if (kp.name && keypointsToDraw.has(kp.name) && (kp.score ?? 0) > 0.3) {
      const x = (kp.x - sx) * scale;
      const y = (kp.y - sy) * scale;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#ff0000';
      ctx.fill();
    }
  });

  // 绘制骨架连接
  // const poseDetection = await import("@tensorflow-models/pose-detection/dist/pose-detection.js");
  const adjacentPairs: number[][] = poseDetection.util.getAdjacentPairs(
    poseDetection.SupportedModels.MoveNet,
  );

  adjacentPairs.forEach(([i, j]) => {
    const indexI = i as number;
    const indexJ = j as number;

    const kp1 = pose.keypoints[indexI];
    const kp2 = pose.keypoints[indexJ];
    if (kp1 && kp2 && (kp1.score ?? 0) > 0.3 && (kp2.score ?? 0) > 0.3) {
      const x1 = (kp1.x - sx) * scale;
      const y1 = (kp1.y - sy) * scale;
      const x2 = (kp2.x - sx) * scale;
      const y2 = (kp2.y - sy) * scale;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'lime';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
};

// 创建 HTMLImageElement
const createPoseElement = (capturedPose: CapturedPose): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = capturedPose.src;
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
  });
};

// 固定长度 flattenPose
const flattenPose = (pose: poseDetection.Pose) => {
  const numKeypoints = 17; // MoveNet 默认输出关键点数
  const keypoints = Array.from({ length: numKeypoints }, (_, i) => {
    const kp = pose.keypoints[i];
    // 如果关键点缺失或分数未定义，返回 [0, 0]
    if (!kp || kp.score === undefined) return [0, 0];
    // 否则，返回归一化后的 [x, y]
    return [kp.x / 265, kp.y / 265];
  }).flat();

  return tf.tensor([keypoints]); // shape [1, 34]
};

export const usePoseModel = ({ classList }: PoseModelProps) => {
  const { t } = useTranslate('lab');
  const {
    poseDetector,
    setPoseDetector,
    setLoading,
    setPredictions,
    predictions,
    knnClassifierInstance,
    setKnnClassifierInstance,
  } = usePoseStore();
  const [trainedCount, setTrainedCount] = useState(0); // 已训练图片数
  const [totalPoses, setTotalPoses] = useState(0); // 总图片数

  // 模型初始化
  const init = async () => {
    try {
      setLoading(true);
      await tf.ready(); // 确保 TF 后端就绪
      await tf.setBackend('webgl');
      message.loading(t('classifier.model.loading.loading', '加载模型...'), 1);
      const knn = knnClassifier.create();
      setKnnClassifierInstance(knn);

      const modelUrl =
        'https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/fetch/snake_game/model.json';

      // const poseDetection = await import("@tensorflow-models/pose-detection/dist/pose-detection.js");
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        modelUrl, // 指定自定义 OSS 模型
      });

      const element = document.body;

      setPoseDetector(detector);
      if (element) {
        element.style.height = 'initial';
      }
      message.success(t('classifier.model.success.loaded', '模型加载完成！'));
    } catch (error) {
      console.error('初始化失败', error);
      message.error(t('classifier.model.error.unloaded', '模型加载失败'));
    } finally {
      setLoading(false);
    }
  };

  // 实时预测循环（绘制骨骼）
  const predictLoop = async (
    video: HTMLVideoElement,
    // canvas: HTMLCanvasElement
    canvasRefMap: React.RefObject<Record<string, HTMLCanvasElement | null>>,
  ) => {
    try {
      if (!video || !poseDetector || !knnClassifierInstance) return;
      const canvasMap = canvasRefMap.current;
      for (const id of Object.keys(canvasMap)) {
        const canvas = canvasMap[id];
        if (canvas) {
          // 设置canvas的宽高
          canvas.width = 265;
          canvas.height = 265;

          // 获取姿势检测
          const poses = await poseDetector.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: true,
          });

          // 清除并绘制视频帧
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 取视频短边为正方形边长
            const side = Math.min(video.videoWidth, video.videoHeight);
            const sx = (video.videoWidth - side) / 2;
            const sy = (video.videoHeight - side) / 2;

            // 先把视频帧裁切后缩放到 265 × 265
            ctx.drawImage(video, sx, sy, side, side, 0, 0, canvas.width, canvas.height);

            // 如果有姿态，额外画骨架
            if (poses.length > 0) {
              drawPoseOnCanvas(poses[0]!, video, canvas);
            }
          }
        }
      }

      // 继续执行下一帧
      requestAnimationFrame(() => predictLoop(video, canvasRefMap));
      // setAnimationFrameId(animationFrame);
    } catch (error) {
      console.log(error);
    }
  };

  // KNN 训练
  const trainKNN = async (classList: ClassItem[]) => {
    try {
      if (!knnClassifierInstance) return;
      const classes: string[] = [];
      let totalCount = 0;

      // 统计总图片数量
      classList.forEach((cls) => {
        totalCount += cls.poses.length;
      });
      if (totalCount === 0) return;

      setTotalPoses(totalCount);
      setTrainedCount(0);
      knnClassifierInstance.clearAllClasses();
      let processedImages = 0;
      let addedSamples = 0;

      // 遍历 classList 训练
      for (const cls of classList) {
        if (!cls.poses || cls.poses.length === 0) continue;
        classes.push(cls.id);

        for (const capturedPose of cls.poses) {
          processedImages++;
          setTrainedCount(processedImages);
          try {
            const imgElement = await createPoseElement(capturedPose);
            if (!imgElement.width || !imgElement.height) {
              console.warn('跳过:图片尺寸为0，', capturedPose.id);
              imgElement.remove();
              continue;
            }

            const posesDetected =
              (await poseDetector?.estimatePoses(imgElement, { maxPoses: 1 })) || [];

            if (posesDetected.length === 0) {
              console.warn('跳过:未检测到姿态，', capturedPose.id);
              imgElement.remove();
              continue;
            }

            const features = flattenPose(posesDetected[0]!);
            if (features.shape[1] !== 34) {
              console.warn('跳过:特征长度异常，', capturedPose.id);
              features.dispose();
              imgElement.remove();
              continue;
            }

            knnClassifierInstance.addExample(features, classes.length - 1);
            addedSamples++;
            features.dispose();
            imgElement.remove();
          } catch (error) {
            console.error('处理图片失败:', error, capturedPose.id);
          }
        }
      }

      if (addedSamples === 0) {
        message.warning(
          t(
            'classifier.model.warning.not_pass',
            '所有图片都未能成功训练，请检查图片或姿态检测是否正常:',
          ),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 预测
  const predictFromCapturedPose = async (
    capturedPose: HTMLVideoElement | HTMLImageElement | null,
    compareType: string,
  ) => {
    try {
      if (!knnClassifierInstance || !capturedPose || !poseDetector) return;

      let poseFeatures: tf.Tensor;
      // 判断是视频流还是图片
      if (compareType === 'video') {
        // 对视频进行预测

        const posesDetected =
          (await poseDetector.estimatePoses(capturedPose, { maxPoses: 1 })) || [];
        if (posesDetected.length === 0) {
          console.warn('未检测到姿态，继续预测');
          poseFeatures = tf.zeros([1, 34]);
        } else {
          poseFeatures = flattenPose(posesDetected[0]!);
        }
      } else {
        // 对图片进行预测
        console.log('pic');
        const imgElement = await createPoseElement(capturedPose);
        const posesDetected = (await poseDetector.estimatePoses(imgElement, { maxPoses: 1 })) || [];

        if (posesDetected.length === 0) {
          console.warn('未检测到姿态，继续预测');
          poseFeatures = tf.zeros([1, 34]);
          imgElement.remove();
        } else {
          poseFeatures = flattenPose(posesDetected[0]!);
          imgElement.remove(); // 处理完图片后移除图片元素
        }
      }

      // 进行KNN预测
      const pred = await knnClassifierInstance.predictClass(poseFeatures);

      // 计算置信度
      const confidences: Record<number, number> = {};
      for (let i = 0; i < classList.length; i++) {
        const labelStr = i.toString();
        confidences[i] = pred.confidences[labelStr] ?? 0;
      }

      // 显示预测结果
      setPredictions([
        {
          label: Number(pred.label),
          confidences,
          isUnknown: false,
        },
      ]);

      // 清理资源
      poseFeatures.dispose();
    } catch (error) {
      console.log(error);
    }
  };

  // 导出训练好的 KNN 模型
  const exportKNNModel = () => {
    if (!knnClassifierInstance || knnClassifierInstance.getNumClasses() === 0) {
      message.error(t('classifier.model.error.no_save', '没有可保存的模型:'));
      return;
    }

    const dataset = knnClassifierInstance.getClassifierDataset();
    const datasetObj: Record<string, number[][]> = {};

    Object.keys(dataset).forEach((key) => {
      const data = dataset[key];
      datasetObj[key] = data!.arraySync();
    });

    const classMap: Record<string, string> = {};

    classList.forEach((classItem, index) => {
      classMap[index.toString()] = classItem.name;
    });

    const modelData = {
      classMap: classMap,
      dataset: datasetObj,
    };

    const jsonStr = JSON.stringify(modelData);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pose-kn n-model.json';
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return {
    init,
    predictLoop,
    predictFromCapturedPose,
    drawPoseOnCanvas,
    flattenPose,
    createPoseElement,
    trainKNN,
    exportKNNModel,
    processPose,
    poseDetector,
    trainedCount,
    totalPoses,
    predictions,
  };
};
