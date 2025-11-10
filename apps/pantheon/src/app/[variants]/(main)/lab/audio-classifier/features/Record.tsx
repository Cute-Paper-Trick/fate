'use client';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import styles from '../audio.module.scss';
import { useAudioStore } from '../stores/audioSlice';

interface CapturedAudio {
  id: string;
  src: string;
}

interface ClassComponentProps {
  classId: string;
}

// HSV -> RGB
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

// 三色渐变映射
const getSpectrogramColor = (val: number) => {
  if (val <= 0) return 'rgb(0,0,0)'; // 黑色底色

  const h = 240 - (val / 1) * 60;
  const s = 1;
  const v = val;
  return hsvToRgb(h, s, v);
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // 返回格式化的时间，始终显示两位数
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const LiveSpectrogram: React.FC<ClassComponentProps> = ({ classId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recording, setRecording] = useState(false);
  const [recEnding, setRecEnding] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [extractSampleFlag, setExtractSampleFlag] = useState(true);
  const [duration, setDuration] = useState(0); // 新增计时器
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 用来清除计时器
  const [audioSrc, setAudioSrc] = useState<string | null>(null); // 音频文件的 URL
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null); // 用于控制播放器
  const [currentTime, setCurrentTime] = useState<number>(0); // 记录当前播放时间
  const [audioDuration, setAudioDuration] = useState(0); // 专门存储音频时长
  const pendingSegmentsRef = useRef<CapturedAudio[]>([]); // 保存录制的音频片段
  const pendingScreenshotsRef = useRef<{ id: string; src: string }[]>([]); // 保存截图

  const [isPlaying, setIsPlaying] = useState(false);
  const { clearTemporaryAudios } = useAudioStore();
  const { addClassImg } = useAudioStore();
  const { addTemporaryAudios } = useAudioStore();

  // 信号检测状态
  const lowSignalCounterRef = useRef(0);
  const signalStateRef = useRef<'silent' | 'active'>('silent');
  const switchCounterRef = useRef(0);
  const lastWarningTimeRef = useRef(0);

  // 检测信号稳定性
  const detectSignalStability = (avg: number) => {
    const LOW_THRESHOLD = 5;
    const HIGH_THRESHOLD = 20;

    let newState: 'silent' | 'active' = signalStateRef.current;
    if (avg < LOW_THRESHOLD) newState = 'silent';
    else if (avg > HIGH_THRESHOLD) newState = 'active';

    if (newState !== signalStateRef.current) {
      switchCounterRef.current++;
      signalStateRef.current = newState;
    }

    // if (switchCounterRef.current >= 5) {
    //   const now = Date.now();
    //   if (now - lastWarningTimeRef.current > 10000) {
    //     message.warning("检测到音频输入不稳定，请检查设备");
    //     lastWarningTimeRef.current = now;
    //   }
    //   switchCounterRef.current = 0;
    // }
  };

  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const startAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const audioContext = new AudioContext({ sampleRate: 16_000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048; // 高分辨率
    source.connect(analyser);

    analyserRef.current = analyser;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const sampleRate = audioContextRef.current!.sampleRate;
    const minFreq = 20;
    const maxFreq = sampleRate / 2;

    const drawFrame = () => {
      animationRef.current = requestAnimationFrame(drawFrame);
      analyser.getByteFrequencyData(dataArray);
      let isDeviceOnline = false;

      const checkDeviceStatus = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        isDeviceOnline = devices.some((device) => device.kind === 'audioinput');
        return isDeviceOnline;
      };

      checkDeviceStatus().then((isOnline) => {
        if (!isOnline) {
          return;
        }

        // 计算平均音量
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]!;
        const avg = sum / dataArray.length;

        // 信号过弱检测
        if (avg < 3) {
          lowSignalCounterRef.current++;
          if (lowSignalCounterRef.current >= 120) {
            // ~2秒
            const now = Date.now();
            if (now - lastWarningTimeRef.current > 1000) {
              message.warning('音量过低，可能导致样本提取失败');
              lastWarningTimeRef.current = now;
            }
            lowSignalCounterRef.current = 0;
          }
        } else {
          lowSignalCounterRef.current = 0;
        }

        detectSignalStability(avg);
      });

      //频谱
      const img = ctx.getImageData(1, 0, canvas.width - 1, canvas.height);
      ctx.putImageData(img, 0, 0);

      for (let y = 0; y < canvas.height; y++) {
        const freq = minFreq * Math.pow(maxFreq / minFreq, y / canvas.height);
        let freqIndex = Math.floor((freq / (sampleRate / 2)) * bufferLength);
        freqIndex = Math.min(bufferLength - 1, freqIndex);

        const val = Math.log10(dataArray[freqIndex]! + 1) / Math.log10(256);
        ctx.fillStyle = getSpectrogramColor(val);
        ctx.fillRect(canvas.width - 1, canvas.height - y - 1, 1, 1);
      }

      canvas.parentElement!.scrollLeft = canvas.width;
    };

    drawFrame();
  };

  // helper: 将 AudioBuffer 转 Blob
  const audioBufferToWavBlob = async (buffer: AudioBuffer): Promise<Blob> => {
    const numOfChan = buffer.numberOfChannels,
      length = buffer.length * numOfChan * 2 + 44,
      bufferArray = new ArrayBuffer(length),
      view = new DataView(bufferArray);

    let offset = 0;
    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
      }
    };

    writeString('RIFF');
    view.setUint32(offset, length - 8, true);
    offset += 4;
    writeString('WAVE');
    writeString('fmt ');
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, numOfChan, true);
    offset += 2;
    view.setUint32(offset, buffer.sampleRate, true);
    offset += 4;
    view.setUint32(offset, buffer.sampleRate * numOfChan * 2, true);
    offset += 4;
    view.setUint16(offset, numOfChan * 2, true);
    offset += 2;
    view.setUint16(offset, 16, true);
    offset += 2;
    writeString('data');
    view.setUint32(offset, buffer.length * numOfChan * 2, true);
    offset += 4;

    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        view.setInt16(offset, buffer.getChannelData(channel)[i]! * 0x7F_FF, true);
        offset += 2;
      }
    }

    return new Blob([bufferArray], { type: 'audio/wav' });
  };

  const toggleRecording = async () => {
    try {
      setExtractSampleFlag(true);
      if (!recording) {
        await startAudio();
        draw();
        setRecording(true);
        setRecEnding(false);
        setDuration(0);

        const screenshots: { id: string; src: string }[] = [];

        timerRef.current = setInterval(() => {
          setDuration((prev) => {
            const next = prev + 1;

            // 到20秒时自动停止录制
            if (classId === 'class-env') {
              if (next >= 20) {
                mediaRecorderRef.current?.stop();
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
              }

              return next;
            } else {
              if (next >= 10) {
                mediaRecorderRef.current?.stop();
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
              }

              return next;
            }
          });
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d')!;
            const sec = duration + 1; // 当前秒数
            const startX = Math.max(0, canvas.width - 60 * sec); // 从哪里开始截
            const width = Math.min(60, canvas.width - startX); // 截图宽度不超过60

            const imageData = ctx.getImageData(startX, 0, width, canvas.height);

            // 创建临时canvas存储截取图
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = 60; // 最终图宽度固定60
            tmpCanvas.height = 60; // 高度固定
            const tmpCtx = tmpCanvas.getContext('2d')!;

            // 填充黑色背景
            tmpCtx.fillStyle = 'black';
            tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            // 将截取图画到tmpCanvas上
            tmpCtx.putImageData(imageData, 0, 0);

            const imgId = uuidv4();
            const imgUrl = tmpCanvas.toDataURL('image/png');
            screenshots.push({ id: imgId, src: imgUrl });
          }
        }, 1000);

        // 开始录音
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const track = stream.getTracks()[0];
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        track!.addEventListener('onended', () => {
          console.warn('麦克风输入已中断');
          message.error('麦克风输入已断开');
          return;
        });

        track!.onmute = () => {
          console.warn('麦克风被静音或设备不可用');
          message.warning('检测到音频输入中断');
          return;
        };

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioSrc(audioUrl);

          if (screenshots.length > 0) {
            pendingScreenshotsRef.current = screenshots;
          }

          try {
            const arrayBuffer = await audioBlob.arrayBuffer();
            const newAudioContext = new AudioContext();
            const audioBuffer = await newAudioContext.decodeAudioData(arrayBuffer);
            setAudioDuration(audioBuffer.duration);

            const segments: CapturedAudio[] = [];
            const sampleRate = audioBuffer.sampleRate;
            const segmentLength = sampleRate * 1;
            const totalSegments = Math.ceil(audioBuffer.length / segmentLength);

            for (let i = 0; i < totalSegments; i++) {
              const start = i * segmentLength;
              const end = Math.min((i + 1) * segmentLength, audioBuffer.length);

              const segmentBuffer = newAudioContext.createBuffer(
                audioBuffer.numberOfChannels,
                end - start,
                sampleRate,
              );

              for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
                const channelData = audioBuffer.getChannelData(ch).slice(start, end);
                segmentBuffer.copyToChannel(channelData, ch, 0);
              }

              const offlineCtx = new OfflineAudioContext(
                audioBuffer.numberOfChannels,
                segmentBuffer.length,
                sampleRate,
              );
              const bufferSource = offlineCtx.createBufferSource();
              bufferSource.buffer = segmentBuffer;
              bufferSource.connect(offlineCtx.destination);
              bufferSource.start();

              const renderedBuffer = await offlineCtx.startRendering();
              const wavBlob = await audioBufferToWavBlob(renderedBuffer);
              const id = uuidv4();
              const src = URL.createObjectURL(wavBlob);

              segments.push({ id, src });
            }
            pendingSegmentsRef.current = segments;
          } catch (error) {
            console.error('Error decoding audio data:', error);
            message.error('未捕获有效音频', 2);
            setAudioDuration(duration);
          }

          setRecording(false);
          setRecEnding(true);
          setDuration(0);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        };

        mediaRecorder.start();
      } else {
        mediaRecorderRef.current?.stop();
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof DOMException) {
        if (error.name === 'EncodingError') {
          message.error('没有有效音频', 2);
        } else if (error.name === 'NotFoundError') {
          message.error('未找到有效设备', 2);
        } else {
          message.error(`音频解码失败: ${error.name}`, 2);
        }
      } else {
        message.error('未知错误', 2);
      }
    }
  };

  const handleCanPlayThrough = () => {
    if (audioPlayerRef.current) {
      const playerDuration = audioPlayerRef.current.duration;
      console.log('Player duration:', playerDuration);

      // 如果还没有设置audioDuration，则使用播放器的时长
      if (!audioDuration && playerDuration && isFinite(playerDuration) && playerDuration > 0) {
        setAudioDuration(playerDuration);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      setCurrentTime(audioPlayerRef.current.currentTime);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (audioPlayerRef.current.paused) {
      audioPlayerRef.current.play();
    } else {
      audioPlayerRef.current.pause();
    }
  };

  const handleAudio = (classId: string) => {
    if (pendingSegmentsRef.current.length > 0) {
      clearTemporaryAudios();
      addTemporaryAudios({ id: classId, audios: pendingSegmentsRef.current });
      pendingSegmentsRef.current = [];
      setExtractSampleFlag(false);
    }

    if (pendingScreenshotsRef.current.length > 0) {
      addClassImg({ id: classId, images: pendingScreenshotsRef.current });
      pendingScreenshotsRef.current = [];
      setExtractSampleFlag(false);
    }
  };

  return (
    <div className={styles.mic_container}>
      <div style={{ width: '200', overflowX: 'scroll' }}>
        <canvas
          height={60}
          ref={canvasRef}
          style={{ backgroundColor: 'black', border: '1px solid #ccc' }}
          width={1200}
        />
      </div>

      {/* 播放器 */}
      {audioSrc && recEnding && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={styles.audio_player}>
            <audio
              controls={false} // 不显示默认的播放控件
              onCanPlayThrough={handleCanPlayThrough} // 获取总时长
              onTimeUpdate={handleTimeUpdate} // 更新当前时间
              preload="metadata"
              ref={audioPlayerRef}
              src={audioSrc}
            />
            <Button className={styles.play_btn} onClick={togglePlayback}>
              {isPlaying ? (
                <PauseOutlined style={{ color: '#185ABC' }} />
              ) : (
                <CaretRightOutlined style={{ color: '#185ABC' }} />
              )}
            </Button>
            <span>
              {formatTime(currentTime)} /{' '}
              {audioDuration && isFinite(audioDuration) ? formatTime(audioDuration) : '00:00:00'}
            </span>
          </div>
          <div className={styles.sample_btn}>
            <Button disabled={!extractSampleFlag} onClick={() => handleAudio(classId)}>
              提取样本
            </Button>
          </div>
        </div>
      )}
      <Button className={styles.button_Rec} onClick={toggleRecording}>
        {recording && classId === 'class-env'
          ? '停止（' + (20 - duration) + 's）'
          : recording && classId !== 'class-env'
            ? '停止（' + (10 - duration) + 's）'
            : classId === 'class-env'
              ? '开始录制'
              : '开始录制'}
      </Button>
    </div>
  );
};

export default LiveSpectrogram;
