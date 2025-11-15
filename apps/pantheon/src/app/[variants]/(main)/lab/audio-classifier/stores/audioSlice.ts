'use client';
import { useSyncExternalStore } from 'react';
import { createStore } from 'zustand/vanilla';

interface CapturedAudio {
  id: string;
  src: string;
}
interface CapturedImage {
  id: string;
  src: string;
}
interface ClassItem {
  id: string;
  name: string;
  audios?: string[];
  images: CapturedAudio[];
}
interface Prediction {
  label: number;
  confidences: Record<number, number>;
}
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

interface ClassState {
  list: ClassItem[];
  temporaryAudios?: { [id: string]: CapturedAudio[] };
  exportedData?: ClassItem[];
  predictionResult?: string;
  trainingFlag?: boolean;
  isRecording: boolean;
  activeClassId: string | null;
  trainingOver: boolean;
  predictions: Prediction[];
  speechCommands: TransferRecognizer;
  transferRefCurrent: { current: TransferRecognizer };
  activeRecorderId: string | null;

  // Actions
  clearTemporaryAudios: () => void;
  clearClassSample: (id: string) => void;
  addClassImg: (payload: { id: string; images: CapturedImage[] }) => void;
  addTemporaryAudios: (payload: { id: string; audios: CapturedAudio[] }) => void;
  addClass: (payload: { id: string; name: string }) => void;
  removeClass: (id: string) => void;
  renameClass: (payload: { id: string; name: string }) => void;
  setPredictionResult: (result: string) => void;
  setRecording: (isRecording: boolean, classId: string | null) => void;
  setTrainingOver: (flag: boolean) => void;
  setTrainingFlag: (flag: boolean) => void;
  setPredictions: (predictions: Prediction[]) => void;
  setSpeechCommands: (ref: TransferRecognizer) => void;
  setTransferRefCurrent: (transferRefCurrent: TransferRecognizer) => void;
  setActiveRecorder: (id: string | null) => void;
  reset: () => void;
}

// === 创建 vanilla store ===
export const audioStore = createStore<ClassState>((set) => ({
  list: [
    { id: 'class-env', name: 'Class background', audios: [], images: [] },
    { id: 'class-2', name: 'Class 2', audios: [], images: [] },
  ],
  temporaryAudios: {},
  exportedData: undefined,
  predictionResult: undefined,
  trainingFlag: false,
  isRecording: false,
  activeClassId: null,
  trainingOver: false,
  predictions: [],
  speechCommands: {} as TransferRecognizer,
  transferRefCurrent: { current: {} as TransferRecognizer },
  activeRecorderId: null,

  setRecording: (isRecording, classId) => set({ isRecording, activeClassId: classId }),

  clearTemporaryAudios: () => set({ temporaryAudios: {} }),

  clearClassSample: (id) => {
    set((state) => {
      const cls = state.list.find((c) => c.id === id);
      if (cls) {
        cls.images = [];
        cls.audios = [];
      }
      return { list: [...state.list] };
    });
  },

  addClassImg: ({ id, images }) => {
    set((state) => {
      const cls = state.list.find((c) => c.id === id);
      if (cls) cls.images.push(...images.map((img) => ({ id: img.id, src: img.src })));
      return { list: [...state.list] };
    });
  },

  addTemporaryAudios: ({ id, audios }) => {
    set((state) => {
      const cls = state.list.find((c) => c.id === id);
      if (cls) cls.audios?.push(...audios.map((a) => a.src));
      return { list: [...state.list] };
    });
  },

  addClass: ({ id, name }) =>
    set((state) => ({
      list: [...state.list, { id, name, audios: [], images: [] }],
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

  reset: () =>
    set({
      predictions: [],
      trainingOver: false,
      list: [
        { id: 'class-env', name: 'Class background', audios: [], images: [] },
        { id: 'class-2', name: 'Class 2', audios: [], images: [] },
      ],
    }),

  setTrainingOver: (flag) => set({ trainingOver: flag }),
  setTrainingFlag: (flag) => set({ trainingFlag: flag }),
  setSpeechCommands: (ref) => set({ speechCommands: ref }),
  setPredictions: (predictions) => set({ predictions }),
  setTransferRefCurrent: (transferRefCurrent) =>
    set({ transferRefCurrent: { current: transferRefCurrent } }),
  setPredictionResult: (result) => set({ predictionResult: result }),
  setActiveRecorder: (id) => set({ activeRecorderId: id }),
}));

// === React hook 用于订阅状态 ===
export function useAudioStore() {
  return useSyncExternalStore(audioStore.subscribe, () => audioStore.getState());
}
