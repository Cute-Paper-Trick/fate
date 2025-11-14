'use client';
import TopicList from '@/app/[variants]/(main)/talk/features/TalkList/page';
import { useTopicStore } from '@/store/talk';

export default function TopicListPage() {
  const useTopicList = useTopicStore((s) => s.useTopicList);
  return <TopicList useTopicList={useTopicList} />;
}
