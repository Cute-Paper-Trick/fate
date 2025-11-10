'use client';
import { ThemeProvider } from '@lobehub/ui';
import React, { useRef } from 'react';

import Preview from './features/Preview';
import Sample from './features/Sample';
import Training from './features/Training';
import styles from './poseTrainerLobe.module.scss';
import { usePoseStore } from './stores/poseSlice';

const PoseTrainer: React.FC = () => {
  const { isPredicting, loading } = usePoseStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <ThemeProvider>
      <div className={styles.container}>
        {/* <img src="/image/bg1.png" /> */}
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
          />
        )}

        <div className={styles.pose_container}>
          <video
            autoPlay
            muted
            playsInline
            ref={videoRef}
            style={{
              display: 'none',
              borderRadius: 4,
              objectFit: 'cover',
              objectPosition: 'center',
              filter: !isPredicting ? 'grayscale(100%)' : 'none',
            }}
          />
          <Sample videoRef={videoRef} />
          <Training videoRef={videoRef} />
          <Preview videoRef={videoRef} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PoseTrainer;
