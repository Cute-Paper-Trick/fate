'use client';

import { useTranslate } from '@tolgee/react';
import { Col, Row } from 'antd';
import { FC, useMemo } from 'react';

import styles from './page.module.css';

const Example: FC = () => {
  const { t } = useTranslate('');
  const data = useMemo(
    () => [
      {
        title: t('我需要编程知识吗？'),
        detail: t(
          '不需要！我们的模型训练体验器设计得非常直观，您只需按照引导上传数据并点击几下即可开始训练，无需编写任何代码。',
        ),
      },
      {
        title: t('训练模型需要多长时间？'),
        detail: t(
          '训练时间取决于您的数据集大小和项目类型。简单的项目可能只需几分钟，而大型数据集可能需要更长的时间。您可以在训练过程中看到进度。',
        ),
      },
      {
        title: t('我的数据安全吗？'),
        detail: t(
          '我们非常重视您的数据安全和隐私。所有数据都经过加密传输和存储，我们绝不会在未经您许可的情况下与第三方共享您的数据。',
        ),
      },
      {
        title: t('我可以导出训练好的模型吗？'),
        detail: t(
          '是的，训练完成后，您可以将模型导出为多种格式，以便在您自己的应用程序或项目中使用。',
        ),
      },
      {
        title: t('支持哪些类型的数据？'),
        detail: t(
          '图片项目支持JPEG、PNG等格式；音频项目支持WAV、MP3格式；姿势项目则通过摄像头实时采集数据。',
        ),
      },
      {
        title: t('如果遇到问题怎么办？'),
        detail: t(
          '您可以查阅我们的文档中心获取详细教程，或通过支持渠道联系我们的技术团队获得帮助。',
        ),
      },
    ],
    [t],
  );
  return (
    <div className={styles.help}>
      <div className={styles.helpTitle}>
        <div>{t('常见问题')}</div>
        <div>{t('在这里找到您问题的答案。')}</div>
      </div>
      <Row gutter={[20, 20]} style={{ flex: 1 }}>
        {data.map((item, index) => (
          <Col key={index} span={8} style={{ display: 'flex' }}>
            <div className={styles.card}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.detail}>{item.detail}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Example;
