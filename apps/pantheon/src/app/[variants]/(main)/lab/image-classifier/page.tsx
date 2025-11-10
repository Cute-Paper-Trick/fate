'use client';
import { Spin } from 'antd';
import React, { useEffect, useRef } from 'react';

import Preview from './components/Preview';
import Sample from './components/Sample';
import Training from './components/Training';
import styles from './imageTrainer.module.scss';
import { useImageStore } from './stores/imageSlice';

const ImageTrainer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { loading, setLoading, clearImages } = useImageStore();

  useEffect(() => {
    return () => {
      clearImages();
      setLoading(false);
    };
  }, [clearImages]);

  return (
    <div className={styles.container}>
      {!loading && (
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

      <div className={styles.image_container}>
        <Sample videoRef={videoRef} />
        <Training />
        <Preview videoRef={videoRef} />
      </div>
    </div>
  );
};

export default ImageTrainer;
