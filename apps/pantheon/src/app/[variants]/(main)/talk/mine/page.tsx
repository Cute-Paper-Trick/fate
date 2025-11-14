'use client';
import TopicList from '@/app/[variants]/(main)/talk/features/TalkList/page';
import { useTopicStore } from '@/store/talk';

export default function TopicListPage() {
  const useTopicMineList = useTopicStore((s) => s.useTopicMineList);
  return <TopicList useTopicList={useTopicMineList} />;
}
