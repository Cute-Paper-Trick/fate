import { useS3 } from '@fate/s3';
import { Badge, Button, Skeleton } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import {
  useContentOperationLogList,
  useContentsDetail,
  useContentsPublish,
  useContentsUnpublish,
} from '@/lib/http';
import { useArticleStore } from '@/store/article';
import { draftSelectors } from '@/store/article/selectors';

import Editor from '../Editor';
import ArticleHeader from '../Header';
import { ContentStatus } from '../types';
import { useStyles } from './styles';
import { useDarftInit } from './useDarftInit';
import { useSave } from './useSave';

const ArticleDarft = memo(() => {
  const s3 = useS3();
  const { styles } = useStyles();

  const currentDraft = useArticleStore(draftSelectors.currentDraft);
  const saveStatus = useArticleStore(draftSelectors.saveStatus);
  const hasUnsavedChanges = useArticleStore(draftSelectors.hasUnsavedChanges);
  const initialized = useArticleStore((s) => s.initialized);

  const updateBlocks = useArticleStore((s) => s.updateBlocks);

  const { isLoading } = useDarftInit();

  const forceSave = useSave();

  useContentOperationLogList({ contentId: 2, page: 1, size: 100 });

  const { data } = useContentsDetail(
    { id: currentDraft.id! },
    { query: { enabled: !!currentDraft.id } },
  );

  const publishMutation = useContentsPublish();
  const unpublishMutation = useContentsUnpublish();
  const onPublish = () => {
    if (currentDraft.id) {
      publishMutation.mutate({ data: { id: currentDraft.id } });
    }
  };
  const onUnpublish = () => {
    if (currentDraft.id) {
      unpublishMutation.mutate({ data: { id: currentDraft.id } });
    }
  };

  return (
    <Flexbox className="draft" style={{ paddingBottom: '1.75rem' }}>
      <Flexbox
        align="center"
        gap={10}
        horizontal
        justify="end"
        paddingBlock={10}
        paddingInline={10}
      >
        <span>上次保存时间：{saveStatus.lastSaveAt}</span>
        <Button
          loading={publishMutation.isPending}
          onClick={data?.content.status === ContentStatus.PUBLISHED ? onUnpublish : onPublish}
        >
          {data?.content.status === ContentStatus.PUBLISHED ? '已发布' : '发布'}
        </Button>
        <Badge dot={hasUnsavedChanges}>
          <Button loading={saveStatus.isSaving} onClick={forceSave} type="primary">
            保存
          </Button>
        </Badge>
      </Flexbox>
      <ArticleHeader editable loading={isLoading || !initialized} />
      <div className={styles.content}>
        {isLoading || !initialized ? (
          <Skeleton paragraph={{ rows: 10 }} />
        ) : (
          <Editor
            initialContent={currentDraft.blocks}
            onChange={(blocks) => {
              updateBlocks(blocks);
            }}
            resolveFileUrl={async (url) => {
              if (url.startsWith('http')) {
                return url;
              }
              return await s3.signature(url);
            }}
            uploadFile={async (file) => {
              const uploaded = await s3.multipartUpload(file);
              return uploaded.name;
            }}
          />
        )}
      </div>
    </Flexbox>
  );
});

export default ArticleDarft;
