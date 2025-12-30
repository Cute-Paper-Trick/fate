import { Form, Modal, TextArea } from '@lobehub/ui';
import { Image, Skeleton, Upload, UploadProps } from 'antd';
import { createStyles } from 'antd-style';
import { ImageIcon } from 'lucide-react';
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useCollectionsCreate, useCollectionsDetail, useCollectionsUpdate } from '@/lib/http';
import { queryClient } from '@/lib/query';
import { genFilePath } from '@/packages/agora/helper';
import { RemoteWrapper, useUpload } from '@/packages/pithos';

const useStyles = createStyles(({ css, prefixCls }) => ({
  dragger: css`
    width: 150px;

    .${prefixCls}-upload {
      .${prefixCls}-upload-btn {
        padding: 0.2rem;
        aspect-ratio: 3 / 4;
      }
    }
  `,
  img: css`
    object-fit: cover;
    border-radius: 4px;
    width: 100%;
    aspect-ratio: 3 / 4;
  `,
  draggerInner: css`
    aspect-ratio: 3 / 4;
    width: 100%;
  `,
}));

const ImagePicker = memo<{
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}>(({ className, value, onChange }) => {
  const { styles, cx } = useStyles();

  const [img, setImg] = useState<string>(value || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value) setImg(value ?? '');
  }, [value]);

  const { multipartUpload } = useUpload();

  const uploadFile: UploadProps['customRequest'] = async ({ file, onProgress, onSuccess }) => {
    setLoading(true);
    const obj = file as File;
    const res = await multipartUpload(genFilePath(obj.name), obj, {
      progress: (percent) => {
        onProgress?.({ percent: percent * 100 });
      },
    });
    onSuccess?.(res);
    setImg?.(res.name);
    onChange?.(res.name);
    setLoading(false);
  };

  return (
    <Upload.Dragger
      accept="image/*"
      className={cx(styles.dragger, className)}
      customRequest={uploadFile}
      maxCount={1}
      showUploadList={
        loading
          ? {
              showRemoveIcon: false,
              showDownloadIcon: false,
              showPreviewIcon: false,
            }
          : false
      }
    >
      {img ? (
        <RemoteWrapper path={img}>
          {(realSrc) => <Image alt="cover" className={styles.img} preview={false} src={realSrc} />}
        </RemoteWrapper>
      ) : (
        <Flexbox align="center" className={styles.draggerInner} justify="center" width={'100%'}>
          <ImageIcon size={48} strokeWidth={1} />
          <p className="ant-upload-text">拖张图到这里当封面（也可以没有）</p>
          <p className="ant-upload-hint">比例最好是 3:4(竖的)</p>
        </Flexbox>
      )}
    </Upload.Dragger>
  );
});

const useModalStyles = createStyles(({ css }) => ({
  imagePicker: css`
    max-width: 150px;
  `,
}));

export interface CollectionModalRef {
  open: (id?: number) => void;
}

const CollectionModal = memo(
  forwardRef<CollectionModalRef>((_, ref) => {
    const { styles, cx } = useModalStyles();
    const [form] = Form.useForm();
    const [id, setId] = useState<number | undefined>(undefined);
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: (id?: number) => {
        setOpen(true);
        setId(id);
      },
    }));

    const { data, isLoading } = useCollectionsDetail({ id: id! }, { query: { enabled: !!id } });
    const createMutation = useCollectionsCreate();
    const updateMutation = useCollectionsUpdate();

    useEffect(() => {
      form.setFieldsValue({
        cover: data?.collection.cover_url,
        description: data?.collection.description,
        title: data?.collection.name,
      });
    }, [data, form]);

    const onFinish = async () => {
      const { cover, title, description } = form.getFieldsValue();
      if (id) {
        await updateMutation.mutateAsync({
          data: {
            id,
            cover_url: cover,
            description,
            name: title,
          },
        });
      } else {
        await createMutation.mutateAsync({
          data: {
            cover_url: cover,
            description,
            name: title,
          },
        });
      }

      queryClient.invalidateQueries({ queryKey: [{ url: '/api/collections/list' }] });
      setOpen(false);
    };

    return (
      <Modal
        afterClose={() => {
          setId(undefined);
        }}
        destroyOnHidden
        onCancel={() => setOpen(false)}
        onOk={onFinish}
        open={open}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <Form
            form={form}
            initialValues={{
              cover_url: data?.collection?.cover_url,
              description: data?.collection?.description,
              title: data?.collection?.name,
            }}
            itemMinWidth={'max(50%,300px)'}
            items={[
              {
                name: 'cover',
                label: '封面',
                children: <ImagePicker className={cx(styles.imagePicker, 'imagePicker')} />,
              },
              {
                name: 'title',
                label: '标题',
                children: <TextArea autoSize placeholder="请输入标题" />,
              },
              {
                name: 'description',
                label: '描述',
                children: <TextArea autoSize placeholder="请输入描述" />,
              },
            ]}
            itemsType={'flat'}
            title={id ? '编辑专题' : '创建专题'}
          />
        )}
      </Modal>
    );
  }),
);

export default CollectionModal;
