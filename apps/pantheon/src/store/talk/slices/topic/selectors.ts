import type { TopicStore } from '../../store';

const templating = (s: TopicStore) => s.templating && false;

export const topicSelectors = {
  templating,
};
