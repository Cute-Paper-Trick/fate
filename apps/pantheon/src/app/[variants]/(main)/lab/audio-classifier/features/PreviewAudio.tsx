'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import styles from '../audio.module.scss';

// HSV -> RGB 转换
const hsvToRgb = (h: number, s: number, v: number) => {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return `rgb(${Math.round((r + m) * 255)},${Math.round((g + m) * 255)},${Math.round((b + m) * 255)})`;
};

const getSpectrogramColor = (val: number) => {
  if (val <= 0) return 'rgb(0,0,0)';
  const h = 240 - val * 60;
  const s = 1;
  const v = val;
  return hsvToRgb(h, s, v);
};

const LivePreview = forwardRef((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (!canvas || !analyser || isPaused) return; // 如果暂停了就不绘制

      const ctx = canvas.getContext('2d')!;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const sampleRate = audioContextRef.current!.sampleRate;
      const minFreq = 20;
      const maxFreq = sampleRate / 2;

      const drawFrame = () => {
        if (isPaused) return; // 如果暂停了，停止绘制
        animationRef.current = requestAnimationFrame(drawFrame);
        analyser.getByteFrequencyData(dataArray);

        // 右移画布一列
        const img = ctx.getImageData(1, 0, canvas.width - 1, canvas.height);
        ctx.putImageData(img, 0, 0);

        // 绘制最新频谱在最右列
        for (let y = 0; y < canvas.height; y++) {
          const freq = minFreq * Math.pow(maxFreq / minFreq, y / canvas.height);
          let freqIndex = Math.floor((freq / (sampleRate / 2)) * bufferLength);
          freqIndex = Math.min(bufferLength - 1, freqIndex);

          const val = Math.log10(dataArray[freqIndex]! + 1) / Math.log10(256);
          ctx.fillStyle = getSpectrogramColor(val);
          ctx.fillRect(canvas.width - 1, canvas.height - y - 1, 1, 1);
        }

        // 自动滚动到最右
        canvas.parentElement!.scrollLeft = canvas.width;
      };

      drawFrame();
    };

    const startAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      draw();
    };

    startAudio();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [isPaused]);

  // 暴露给外部的暂停/继续方法
  useImperativeHandle(ref, () => ({
    togglePause: () => {
      setIsPaused((prev) => !prev);
    },
  }));

  return (
    <div className={styles.box_target} style={{ width: '100%', margin: '35px 0 25px' }}>
      <canvas
        height={60}
        ref={canvasRef}
        style={{ backgroundColor: 'black', border: '1px solid #ccc' }}
        width={260}
      />
    </div>
  );
});

export default LivePreview;
