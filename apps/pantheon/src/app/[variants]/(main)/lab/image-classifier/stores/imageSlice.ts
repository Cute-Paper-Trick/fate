'use client';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { create } from 'zustand';

interface CapturedImage {
  id: string;
  src: string;
}

interface ClassItem {
  id: string;
  name: string;
  images: CapturedImage[];
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
  isPredicting: boolean;
  isPerviewOpen: boolean;
  isCameraActive: boolean;
  loading: boolean;
  knnClassifierInstance: knnClassifier.KNNClassifier | null;
  filterAlpha: number;
  distanceThreshold: number;
  kValue: number;
  compareType: string;
  mobilenetModel: mobilenet.MobileNet | null;
  trainingFlag?: boolean;

  // Actions
  addClass: (payload: { id: string; name: string }) => void;
  removeClass: (id: string) => void;
  renameClass: (payload: { id: string; name: string }) => void;
  clearImages: () => void;
  setTrainingOver: (flag: boolean) => void;
  setPredictions: (predictions: Prediction[]) => void;
  changeClass: (imageId: string, fromId: string, toId: string) => void;
  imageDelete: (classId: string, imageId: string) => void;
  changeClassImages: (classId: string, image: CapturedImage) => void;
  setIsPredicting: (isPredicting: boolean) => void;
  setIsPerviewOpen: (isPerviewOpen: boolean) => void;
  setIsCameraActive: (isCameraActive: boolean) => void;
  setLoading: (loading: boolean) => void;
  setKnnClassifierInstance: (knnClassifierInstance: knnClassifier.KNNClassifier) => void;
  clearClassSample: (id: string) => void;
  setFilterAlpha: (value: number) => void;
  setDistanceThreshold: (value: number) => void;
  setKValue: (value: number) => void;
  setCompareType: (compareType: string) => void;
  setMobilenetModel: (mobilenetModel: mobilenet.MobileNet | null) => void;
  stopPredict: () => void;
  reset: () => void;
  setTrainingFlag: (flag: boolean) => void;
}

// === 创建 vanilla store ===
export const useImageStore = create<ClassState>((set) => ({
  list: [
    { id: 'class-1', name: 'Class 1', images: [] },
    { id: 'class-2', name: 'Class 2', images: [] },
  ],
  predictionResult: undefined,
  trainingOver: false,
  predictions: [],
  imageDetector: null,
  isPredicting: false,
  isPerviewOpen: false,
  isCameraActive: false,
  loading: false,
  knnClassifierInstance: null,
  filterAlpha: 0.3,
  distanceThreshold: 0.5,
  kValue: 3,
  compareType: 'video',
  mobilenetModel: null,
  trainingFlag: false,

  clearClassSample: (id) => {
    set((state) => {
      const cls = state.list.find((c) => c.id === id);
      if (cls) {
        cls.images = [];
      }
      return { list: [...state.list] };
    });
  },

  addClass: ({ id, name }) =>
    set((state) => ({
      list: [...state.list, { id, name, images: [] }],
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

  changeClass: (fromId: string, imageId: string, toId: string) =>
    set((state) => {
      const imageToMove = state.list
        .find((c) => c.id === fromId)
        ?.images.find((p) => p.id === imageId);

      if (!imageToMove) return state;

      return {
        list: state.list.map((c) => {
          if (c.id === fromId) {
            return { ...c, images: c.images.filter((p) => p.id !== imageId) };
          }
          if (c.id === toId) {
            return { ...c, images: [...c.images, imageToMove] };
          }
          return c;
        }),
      };
    }),

  imageDelete: (classId, imageId) =>
    set((state) => ({
      list: state.list.map((c) =>
        c.id === classId ? { ...c, images: c.images.filter((p) => p.id !== imageId) } : c,
      ),
    })),

  changeClassImages: (classId, image) =>
    set((state) => ({
      list: state.list.map((c) => (c.id === classId ? { ...c, images: [...c.images, image] } : c)),
    })),

  clearImages: () =>
    set({
      list: [
        { id: 'class-1', name: 'Class 1', images: [] },
        { id: 'class-2', name: 'Class 2', images: [] },
      ],
    }),

  setTrainingOver: (flag) => set({ trainingOver: flag }),
  setPredictions: (predictions) => set({ predictions }),
  setIsPredicting: (isPredicting) => set({ isPredicting }),
  setIsPerviewOpen: (isPerviewOpen) => set({ isPerviewOpen }),
  setIsCameraActive: (isCameraActive) => set({ isCameraActive }),
  setLoading: (loading) => set({ loading }),
  setKnnClassifierInstance: (knnClassifierInstance) => set({ knnClassifierInstance }),
  setFilterAlpha: (filterAlpha) => set({ filterAlpha }),
  setDistanceThreshold: (distanceThreshold) => set({ distanceThreshold }),
  setKValue: (kValue) => set({ kValue }),
  setCompareType: (compareType) => set({ compareType }),
  setMobilenetModel: (mobilenetModel) => set({ mobilenetModel }),
  stopPredict: () => set({ isPredicting: false }),
  setTrainingFlag: (flag) => set({ trainingFlag: flag }),
  reset: () =>
    set({
      predictions: [],
      isPredicting: false,
      loading: false,
      trainingOver: false,
      isPerviewOpen: false,
    }),
}));

// === React hook 用于订阅状态 ===
// export function useImageStore() {
//   return useSyncExternalStore(
//     store.subscribe,
//     () => store.getState()
//   )
// }

// useImageStore.getState = store.getState;
// useImageStore.setState = store.setState;
