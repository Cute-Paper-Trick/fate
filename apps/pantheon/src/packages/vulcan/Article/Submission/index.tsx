'use client';

import { Button, FormModal, Select } from '@lobehub/ui';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useContentsSubmitForAudit } from '@/lib/http';

interface SubmissionArticleProps {
  id: number;
  onClose?: () => void;
  open?: boolean;
}

const SubmissionArticle = memo(({ id, onClose, open }: SubmissionArticleProps) => {
  const { mutate, isPending } = useContentsSubmitForAudit();

  const onFinish = () => {
    mutate({ data: { id } });
  };

  return (
    <FormModal
      destroyOnHidden
      footer={
        <Flexbox horizontal justify="end" width={'100%'}>
          <Button htmlType={'submit'} loading={isPending} onClick={onFinish} type={'primary'}>
            投稿审核
          </Button>
        </Flexbox>
      }
      itemMinWidth={'max(30%,240px)'}
      items={[
        {
          label: '专栏',
          name: 'collection',
          rules: [{ required: true }],
          children: (
            <Select
              options={[
                { label: '公开', value: 'public' },
                { label: '私密', value: 'private' },
                { label: '仅粉丝可见', value: 'followers' },
              ]}
            />
          ),
        },
      ]}
      itemsType="flat"
      layout={'inline'}
      onCancel={onClose}
      onFinish={(values) => console.log(values)}
      open={open}
      title="发布设置"
      variant={'borderless'}
    />
  );
});

export default SubmissionArticle;
