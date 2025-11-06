'use client';

import { Button } from '@lobehub/ui';

import { useAccountChangeNickname } from '@/lib/http';
import { templateSelectors } from '@/store/template/selectors';
import { useTemplateStore } from '@/store/template/store';

export default function Home() {
  const simpleValue = useTemplateStore((s) => s.simpleValue);
  const templating = useTemplateStore(templateSelectors.templating);
  const useTemplateList = useTemplateStore((s) => s.useFetchTemplate);

  const { data: templateList, isLoading } = useTemplateList({});

  const changeNickName = useAccountChangeNickname();

  console.log('templateList', templateList, isLoading);
  console.log('templating', templating);
  console.log('simpleValue', simpleValue);

  return (
    <main className="container mx-auto flex flex-col gap-4 p-6">
      <h1 className="font-bold text-2xl">Hello, world.</h1>
      <Button
        loading={changeNickName.isPending}
        onClick={() =>
          changeNickName.mutate({
            data: {
              nickname: '',
            },
          })
        }
      >
        更新昵称
      </Button>
    </main>
  );
}
