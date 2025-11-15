'use client';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { create } from 'zustand';

interface CapturedPose {
  id: string;
  src: string;
}

interface ClassItem {
  id: string;
  name: string;
  poses: CapturedPose[];
}

interface Prediction {
  label: number;
  confidences: Record<number, number>;
  minDistance?: number;
  isSingleClass?: boolean;
  isUnknown?: boolean;
}

interface ClassState {
  list: ClassItem[];
  predictionResult?: string;
  trainingOver: boolean;
  predictions: Prediction[];
  poseDetector: poseDetection.PoseDetector | null;
  isPredicting: boolean;
  isPerviewOpen: boolean;
  isCameraActive: boolean;
  loading: boolean;
  knnClassifierInstance: knnClassifier.KNNClassifier | null;
  selectMap: Record<string, boolean>;
  poses: any;
  animationFrameId: number | null;
  trainingFlag: boolean;

  // Actions
  addClass: (payload: { id: string; name: string }) => void;
  removeClass: (id: string) => void;
  renameClass: (payload: { id: string; name: string }) => void;
  clearPoses: () => void;
  setTrainingOver: (flag: boolean) => void;
  setPredictions: (predictions: Prediction[]) => void;
  changeClass: (poseId: string, fromId: string, toId: string) => void;
  poseDelete: (classId: string, poseId: string) => void;
  changeClassPoses: (classId: string, pose: CapturedPose) => void;
  setPoseDetector: (poseDetector: poseDetection.PoseDetector) => void;
  setIsPredicting: (isPredicting: boolean) => void;
  setIsPerviewOpen: (isPerviewOpen: boolean) => void;
  setIsCameraActive: (isCameraActive: boolean) => void;
  setLoading: (loading: boolean) => void;
  setKnnClassifierInstance: (knnClassifierInstance: knnClassifier.KNNClassifier) => void;
  clearClassSample: (id: string) => void;
  setSelectMap: (selectMap: Record<string, boolean>) => void;
  setPoses: (poses: any) => void;
  setAnimationFrameId: (id: number | null) => void;
  stopAnimation: () => void;
  reset: () => void;
  setTrainingFlag: (flag: boolean) => void;
}

// === 创建 vanilla store ===
export const usePoseStore = create<ClassState>((set) => ({
  list: [
    { id: 'class-1', name: 'Class 1', poses: [] },
    { id: 'class-2', name: 'Class 2', poses: [] },
    // { id: 'class-3', name: 'Class 3', poses: [] },
    // { id: 'class-4', name: 'Class 4', poses: [] },
    // { id: 'class-5', name: 'Class 5', poses: [] },
    // { id: 'class-6', name: 'Class 6', poses: [] },
    // { id: 'class-7', name: 'Class 7', poses: [] },
    // { id: 'class-8', name: 'Class 8', poses: [] },
  ],
  predictionResult: undefined,
  trainingOver: false,
  predictions: [],
  poseDetector: null,
  isPredicting: false,
  isPerviewOpen: false,
  isCameraActive: false,
  loading: false,
  knnClassifierInstance: null,
  selectMap: {},
  poses: null,
  animationFrameId: null,
  trainingFlag: false,

  clearClassSample: (id) => {
    set((state) => {
      const cls = state.list.find((c) => c.id === id);
      if (cls) {
        cls.poses = [];
      }
      return { list: [...state.list] };
    });
  },

  addClass: ({ id, name }) =>
    set((state) => ({
      list: [...state.list, { id, name, poses: [] }],
    })),

  removeClass: (id) =>
    set((state) => ({
      list: state.list.filter((cls) => cls.id !== id),
    })),

  renameClass: ({ id, name }) =>
    set((state) => {
      const cls = state.list.find((c) => c.id === id);
      if (cls) cls.name = name;
      return { list: [...state.list] };
    }),

  changeClass: (fromId: string, poseId: string, toId: string) =>
    set((state) => {
      const poseToMove = state.list
        .find((c) => c.id === fromId)
        ?.poses.find((p) => p.id === poseId);

      if (!poseToMove) return state;

      return {
        list: state.list.map((c) => {
          if (c.id === fromId) {
            return { ...c, poses: c.poses.filter((p) => p.id !== poseId) };
          }
          if (c.id === toId) {
            return { ...c, poses: [...c.poses, poseToMove] };
          }
          return c;
        }),
      };
    }),

  poseDelete: (classId, poseId) =>
    set((state) => ({
      list: state.list.map((c) =>
        c.id === classId ? { ...c, poses: c.poses.filter((p) => p.id !== poseId) } : c,
      ),
    })),

  changeClassPoses: (classId, pose) =>
    set((state) => ({
      list: state.list.map((c) => (c.id === classId ? { ...c, poses: [...c.poses, pose] } : c)),
    })),

  clearPoses: () =>
    set({
      list: [
        { id: 'class-1', name: 'Class 1', poses: [] },
        { id: 'class-2', name: 'Class 2', poses: [] },
      ],
    }),

  setPoseDetector: (poseDetector) => set({ poseDetector }),
  setTrainingOver: (flag) => set({ trainingOver: flag }),
  setTrainingFlag: (flag) => set({ trainingFlag: flag }),
  setPredictions: (predictions) => set({ predictions }),
  setIsPredicting: (isPredicting) => set({ isPredicting }),
  setIsPerviewOpen: (isPerviewOpen) => set({ isPerviewOpen }),
  setIsCameraActive: (isCameraActive) => set({ isCameraActive }),
  setLoading: (loading) => set({ loading }),
  setKnnClassifierInstance: (knnClassifierInstance) => set({ knnClassifierInstance }),
  setSelectMap: (selectMap) => set({ selectMap }),
  setPoses: (poses) => set({ poses }),
  setAnimationFrameId: (id) => {
    set({ animationFrameId: id });
  },

  stopAnimation: () => {
    set((state) => {
      const { animationFrameId } = state;
      if (animationFrameId !== null) {
        // 核心清理逻辑：取消当前活动的循环
        cancelAnimationFrame(animationFrameId);
        console.log(`Animation frame ID ${animationFrameId} cancelled.`);
      }
      // 将 ID 状态重置为 null
      return { animationFrameId: null };
    });
  },
  reset: () =>
    set({
      predictions: [],
      isPredicting: false,
      loading: false,
      trainingOver: false,
      isPerviewOpen: false,
      list: [
        { id: 'class-1', name: 'Class 1', poses: [] },
        { id: 'class-2', name: 'Class 2', poses: [] },
      ],
    }),
}));
