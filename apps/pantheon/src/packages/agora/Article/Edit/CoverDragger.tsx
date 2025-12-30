import { Upload, UploadProps } from 'antd';
import { createStyles } from 'antd-style';
import { ImageIcon } from 'lucide-react';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useUpload } from '@/packages/pithos';

import { genFilePath } from '../../helper';

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
  draggerInner: css`
    // aspect-ratio: 16 / 9;
    width: 100%;
  `,
}));

interface CoverDraggerProps extends PropsWithChildren {
  onSuccess: (name: string) => void;
}

const CoverDragger = memo<CoverDraggerProps>(({ onSuccess, children }) => {
  const { styles } = useStyles();
  const { multipartUpload } = useUpload();

  const uploadFile: UploadProps['customRequest'] = async ({ file }) => {
    const obj = file as File;
    const res = await multipartUpload(genFilePath(obj.name), obj);
    onSuccess?.(res.name);
  };

  return (
    <Upload.Dragger
      accept="image/*"
      className={styles.dragger}
      customRequest={uploadFile}
      listType="picture-card"
      showUploadList={false}
    >
      {children ? (
        children
      ) : (
        <Flexbox align="center" className={styles.draggerInner} justify="center" width={'100%'}>
          <ImageIcon size={48} strokeWidth={1} />
          <p className="ant-upload-text">拖张图到这里当封面（也可以没有）</p>
          <p className="ant-upload-hint">图是横的可以选 1000:420</p>
        </Flexbox>
      )}
    </Upload.Dragger>
  );
});

export default CoverDragger;
