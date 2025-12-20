import { useS3 } from '@fate/s3';
import { Upload, type UploadProps } from 'antd';
import { createStyles } from 'antd-style';
import { ImageIcon } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, prefixCls }) => ({
  dragger: css`
    .${prefixCls}-upload {
      .${prefixCls}-upload-btn {
        padding: 0.2rem;
      }
    }
  `,
  cover: css`
    object-fit: contain;
    border-radius: 4px;
    width: 1360px;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  `,
}));

interface CoverDraggerProps {
  onSuccess?: (name: string) => void;
  cover?: string;
  editable?: boolean;
}

const CoverDragger = memo<CoverDraggerProps>(({ onSuccess, cover, editable }) => {
  const { styles } = useStyles();
  const { multipartUpload } = useS3();

  const uploadFile: UploadProps['customRequest'] = async ({ file }) => {
    const res = await multipartUpload(file as File);
    console.log(res);
    onSuccess?.(res.name);
  };

  if (editable) {
    return (
      <Upload.Dragger
        accept="image/*"
        className={styles.dragger}
        customRequest={uploadFile}
        listType="picture-card"
        showUploadList={false}
      >
        {cover ? (
          <img className={styles.cover} src={cover} />
        ) : (
          <Flexbox align="center" height={'180px'} justify="center" width={'600px'}>
            <ImageIcon size={48} strokeWidth={1} />
            <p className="ant-upload-text">点击或拖动文件到这个区域上传</p>
            <p className="ant-upload-hint">页面布局会根据图片比例调整</p>
          </Flexbox>
        )}
      </Upload.Dragger>
    );
  }

  return <img className={styles.cover} src={cover} />;
});

export default CoverDragger;
