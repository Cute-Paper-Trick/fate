'use client';
import { IEditor, ReactCodeblockPlugin } from '@lobehub/editor';
import { Editor, useEditor } from '@lobehub/editor/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import OSS from 'ali-oss';
import { Button, GetProp, Image, Space, Upload, type UploadFile, UploadProps } from 'antd';
import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { v4 as uuid } from 'uuid';

import { message } from '@/components/AntdStaticMethods';
import { commonService, useTaskTopicAdd } from '@/lib/http';
import { queryClient } from '@/lib/query';

import styles from './topic-create.module.scss';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', (error) => reject(error));
  });

interface TalkEditorProps {
  content?: string;
  onChange: (content: string) => void;
}

export function TopicCreate({ onChange }: TalkEditorProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { t } = useTranslate('common');

  const handleInit = useCallback(
    (editor: IEditor) => console.log('Editor initialized:', editor),
    [],
  );

  const createTopicMutation = useTaskTopicAdd({
    mutation: {
      onSuccess: () => {
        setContent('');
        setTitle('');
        setFileList([]);
        onChange?.('');
        setResetKey((prev) => prev + 1);
        queryClient.invalidateQueries({ queryKey: ['topic', 'list'] });
      },
    },
  });

  const ossStsQuery = useQuery({
    queryKey: ['oss', 'sts'],
    queryFn: () => commonService().commonSignSts(),
    staleTime: 60,
  });

  const sts = useMemo(() => ossStsQuery.data, [ossStsQuery]);
  const editor = useEditor();

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <Plus />
    </button>
  );

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const onUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    // 只保留不重复的文件（按文件名判断）
    const uniqueFileList: UploadFile[] = [];
    const nameSet = new Set<string>();
    for (const file of newFileList) {
      if (!file.name || !nameSet.has(file.name)) {
        uniqueFileList.push(file);
        if (file.name) nameSet.add(file.name);
      }
    }
    setFileList(uniqueFileList);
  };

  const onPost = async () => {
    const images = fileList.map((file) => ({
      path: (file as any).ossKey,
      width: 0,
      height: 0,
    }));
    createTopicMutation.mutate({
      data: {
        content: JSON.stringify({ data: content, images, title }),
        title: title,
      },
    });
  };

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!sts) {
      return false;
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'));

    // @ts-ignore
    file.ossKey = `${process.env.NEXT_PUBLIC_OSS_TOPIC_PREFIX}/post/${uuid()}${suffix}`;
    return file;
  };

  const uploadFile: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
    onProgress,
  }) => {
    try {
      let _sts = sts;
      if (!_sts) {
        const res = await ossStsQuery.refetch();
        _sts = res.data;
        if (!_sts) {
          message.error(t('talk.create.error.catch_fail', '获取OSS STS失败，请稍后再试'));
          return;
        }
      }
      const client = new OSS({
        accessKeyId: _sts.accessKeyId,
        accessKeySecret: _sts.accessKeySecret,
        stsToken: _sts.stsToken,
        bucket: process.env.NEXT_PUBLIC_OSS_TOPIC_BUCKET || _sts.bucket,
        region: process.env.NEXT_PUBLIC_OSS_TOPIC_REGION || _sts.region,
        secure: _sts.secure,
        refreshSTSToken: async () => {
          const { data } = await ossStsQuery.refetch();
          return {
            accessKeyId: data?.accessKeyId ?? '',
            accessKeySecret: data?.accessKeySecret ?? '',
            stsToken: data?.stsToken ?? '',
          };
        },
      });
      setUploading(true);

      const data = await client.multipartUpload((file as any).ossKey, file, {
        progress: function (p) {
          onProgress?.({ percent: Math.round(p * 100) / 100 });
        },
      });
      setUploading(false);
      onSuccess?.(data);
    } catch (error) {
      setUploading(false);

      onError?.(error as any);
    }
  };

  return (
    <div style={{ flex: '1 1 0' }}>
      <div className={styles.detail_input}>
        {previewImage && (
          <Image
            alt="pic"
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
            wrapperStyle={{ display: 'none' }}
          />
        )}
        {/* <Input.TextArea
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你的想法..."
          rows={4}
          style={{
            marginBottom: '22px',
            border: '1px solid #f9f9f9',
            borderRadius: '10px',
            backgroundColor: '#f0f1f4',
          }}
          value={content}
        /> */}
        <Flexbox
          as="section"
          paddingBlock={8}
          paddingInline={8}
          style={{
            border: '1px solid #f9f9f9',
            minHeight: 100,
            borderRadius: 10,
            marginBottom: '22px',
            backgroundColor: '#f0f1f4',
          }}
          width={'100%'}
        >
          <Editor
            content={content}
            editor={editor}
            enablePasteMarkdown={false}
            key={resetKey}
            markdownOption={false}
            onChange={() => {
              const text = String(editor.getDocument('markdown') || '');
              setContent(text);
            }}
            onInit={handleInit}
            placeholder={t('editor.placeholder')}
            plugins={[ReactCodeblockPlugin]}
            type="text"
            variant="chat"
          />
        </Flexbox>

        <Upload
          accept="image/*"
          action={sts?.OSSRegionEndPoint}
          beforeUpload={beforeUpload}
          customRequest={uploadFile}
          fileList={fileList}
          listType="picture-card"
          maxCount={9}
          multiple
          onChange={onUploadChange}
          onPreview={handlePreview}
        >
          {fileList.length >= 9 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            alt="pic"
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
            wrapperStyle={{ display: 'none' }}
          />
        )}

        <Space className={styles.space}>
          {/* <Button onClick={() => {deleteTopicMutation.mutate()}}>+</Button> */}
          <Button
            className={styles.postBtn}
            disabled={
              content.trim() === '' || (fileList.length === 0 && content.trim() === '') || uploading
            }
            loading={createTopicMutation.isPending}
            onClick={onPost}
            type="primary"
          >
            {t('talk.create.publish', '发布')}
          </Button>
        </Space>
      </div>
    </div>
  );
}
