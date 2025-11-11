import { Progress } from 'antd';

import styles from './prediction.module.scss';

interface Prediction {
  label: number;
  confidences: Record<number, number>;
  minDistance?: number;
  isSingleClass?: boolean;
  isUnknown?: boolean;
}

interface CapturedImage {
  id: string;
  src: string;
}

interface ClassItem {
  id: string;
  name: string;
  images: CapturedImage[];
}

interface PredictionsProps {
  predictions: Prediction[];
  classList: ClassItem[];
}

const Predictions: React.FC<PredictionsProps> = ({ predictions, classList }) => {
  const progressColors = [
    '#FF4D4F',
    '#1890FF',
    '#52C41A',
    '#FAAD14',
    '#722ED1',
    '#13C2C2',
    '#EB2F96',
    '#2F54EB',
    '#237804',
    '#D46B08',
  ];

  return (
    <div className={styles.output_area}>
      {predictions.map((pred, predIndex) => (
        <div key={predIndex}>
          {Object.keys(pred.confidences).map((k) => {
            const i = parseInt(k);
            const className = classList[i]?.name || '';
            const confidence = pred.confidences[i] || 0;
            const percentage = (confidence * 100).toFixed(1);

            return (
              <div className={styles.prediction_item} key={i} style={{ marginBottom: 8 }}>
                <div className={styles.prediction_header}>
                  <span className={styles.prediction_label}>{className}</span>
                </div>
                <Progress
                  className={styles.prediction_progress}
                  format={(percent) => `${percent?.toFixed(1)}%`}
                  percent={parseFloat(percentage)}
                  percentPosition={{ align: 'center', type: 'inner' }}
                  showInfo={true}
                  size={[180, 29]}
                  strokeColor={progressColors[i % progressColors.length]} // 循环使用颜色
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Predictions;
