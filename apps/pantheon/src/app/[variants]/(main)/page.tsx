'use client';

import { Spin } from 'antd';

import TalkContent from '@/features/Talk/TalkContent';
import TalkEditor from '@/features/Talk/TalkEditor';

export default function Home() {
  // const simpleValue = useTemplateStore((s) => s.simpleValue);
  // const templating = useTemplateStore(templateSelectors.templating);
  // const useTemplateList = useTemplateStore((s) => s.useFetchTemplate);

  // const { data: templateList, isLoading } = useTemplateList({});

  // const changeNickName = useAccountChangeNickname({
  //   mutation: {
  //     onMutate: (_, context) => {
  //       context.client.invalidateQueries({ queryKey: ['task'] });
  //     },
  //   },
  // });

  // console.log('templateList', templateList, isLoading);
  // console.log('templating', templating);
  // console.log('simpleValue', simpleValue);

  return (
    <Spin spinning={false}>
      <main className="container mx-auto flex flex-col gap-4 p-6">
        <h1 className="font-bold text-2xl">Hello, world.</h1>

        <TalkEditor onChange={() => {}} />
        <TalkContent content={'###1### #2# #3\n#'} />
      </main>
    </Spin>
  );
}
