import { Content } from '@tiptap/core';
import { Badge, Button, Image, Input, Select, Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsInteger, useQueryState } from 'nuqs';
import { memo, useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { NotionEditor } from '@/components/tiptap-templates/notion-like/notion-like-editor';
import { useSession } from '@/features/cerberus/client';
import { useCollectionsList, useContentsDetail } from '@/lib/http';
import { RemoteImage } from '@/packages/pithos';

import { useAutoSave } from '../hooks/useAutoSave';
import CoverDragger from './CoverDragger';

const headerHeight = '56px';
const actionHeight = '88px';

const useStyles = createStyles(({ css }) => ({
  logo: css`
    height: 40px;
    margin-right: 1rem;
  `,
  pageTitle: css`
    font-weight: 500;
    font-size: 1rem;
  `,
  layout: css`
    width: 100%;
    max-width: 1380px;
    margin; 0 auto;
    height: 100%;
    display: grid;
    grid-template-columns: 64px 7fr 3fr;
    gap: 0 1rem;
  `,
  header: css`
    grid-column-start: 1;
    grid-column-end: 3;
    height: ${headerHeight};
  `,
  content: css`
    grid-column-start: 2;
    grid-column-end: 2;
    overflow-y: auto;
    height: calc(100vh - ${headerHeight} - ${actionHeight});
  `,
  titleInput: css`
    margin-block: 0.5rem;
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    overflow-y: clip;
  `,
  descriptionInput: css`
    font-size: 1rem;
    overflow-y: clip;
    margin-block: 0.5rem;
  `,
  actions: css`
    grid-column-start: 2;
    grid-column-end: span 2;

    height: ${actionHeight};
    position: relative;
  `,
  aside: css``,
}));

const ArticleEditor = memo(() => {
  const sessionData = useSession();

  const [id] = useQueryState('id', parseAsInteger);

  const { styles, cx } = useStyles();
  const [initialized, setInitialized] = useState(false);
  const [cover, setCover] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState<Content>();
  const [collectionId, setCollectionId] = useState<number | undefined>();

  const collectionsQuery = useCollectionsList({ page: 1, size: 999_999 });

  const { data, isLoading } = useContentsDetail({ id: id! }, { query: { enabled: Boolean(id) } });

  const { forceSave, hasUnsavedChanges, setUnsavedChanges, saving } = useAutoSave({
    data: { cover, title, description, content, collectionId },
  });

  useEffect(() => {
    // 没有 id 时，直接初始化（新建文章模式）
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialized(true);
      return;
    }

    // 有 id 但 data 还没加载完成，不做任何操作
    if (!data) {
      return;
    }

    // data 加载完成后，设置内容并标记初始化完成
    setCover(data.content.cover_url || '');
    setTitle(data.content.title || '');
    setDescription(data.content.description || '');
    setContent(data.content.body as Content);
    setCollectionId(data.content.collection_id);
    setInitialized(true);
  }, [id, data]);

  if (sessionData.isPending || isLoading || !initialized) {
    return <Skeleton />;
  }

  if (!['creator'].includes(sessionData.data?.user.role ?? '')) {
    return <div>你没有权限进行此操作</div>;
  }

  return (
    <div className={styles.layout}>
      <Flexbox align="center" className={styles.header} horizontal>
        <Flexbox className={styles.logo}>
          <Image
            alt="agora"
            height={40}
            preview={false}
            src="https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/agora.png?x-oss-process=image/resize,limit_1,m_lfit,w_100,h_100/quality,q_90/format,webp"
            style={{ borderRadius: '1rem' }}
            width={40}
          />
        </Flexbox>
        <Flexbox className={styles.pageTitle} flex={1} justify="center">
          创建文章
        </Flexbox>
      </Flexbox>
      <Flexbox className={styles.content}>
        <header>
          <CoverDragger
            onSuccess={(val) => {
              setCover(val);
              setUnsavedChanges(true);
            }}
          >
            {cover ? (
              <RemoteImage
                alt="cover"
                preview={false}
                process={[
                  'image',
                  'resize,limit_1,m_lfit,w_1000,h_420',
                  'quality,q_90',
                  'format,webp',
                ]}
                src={cover}
              />
            ) : null}
          </CoverDragger>

          <Input.TextArea
            autoSize
            className={cx(styles.titleInput)}
            onChange={(e) => {
              setTitle(e.target.value);
              setUnsavedChanges(true);
            }}
            placeholder="在这里写标题..."
            style={{ background: '#fff' }}
            value={title}
            variant="borderless"
          />

          <Input.TextArea
            autoSize
            className={styles.descriptionInput}
            onChange={(e) => {
              setDescription(e.target.value);
              setUnsavedChanges(true);
            }}
            placeholder="在这里写描述..."
            style={{ background: '#fff' }}
            value={description}
            variant="borderless"
          />

          <Flexbox align="center" horizontal paddingBlock={'0.5rem'} width="100%">
            <span style={{ fontWeight: 500, fontSize: '1rem' }}>所属专题：</span>
            <Select
              onChange={setCollectionId}
              options={
                collectionsQuery.data?.collections?.map((collection) => ({
                  label: collection.name,
                  value: collection.id,
                })) || []
              }
              style={{ flex: 1 }}
              value={collectionId}
            />
          </Flexbox>

          <Flexbox style={{ background: '#fff' }}>
            <NotionEditor
              content={content}
              onChange={(val) => {
                setContent(val);
                setUnsavedChanges(true);
              }}
            />
          </Flexbox>
        </header>
      </Flexbox>
      <Flexbox className={styles.aside} />
      <Flexbox align="center" className={styles.actions} gap={10} horizontal>
        <Badge dot={hasUnsavedChanges}>
          <Button loading={saving} onClick={forceSave} type="primary">
            保存
          </Button>
        </Badge>
        <Flexbox gap={4} horizontal>
          上次保存时间 <time>{new Date().toLocaleTimeString()}</time>
          <span>({hasUnsavedChanges ? '你改了，还没保存' : '都保存了'})</span>
        </Flexbox>
      </Flexbox>
    </div>
  );
});

ArticleEditor.displayName = 'ArticleEditor';

export default ArticleEditor;
