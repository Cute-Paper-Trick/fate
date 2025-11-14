export interface TopicState {
  templating: boolean;
  simpleValue: string;
}

export const initialTopicState: TopicState = {
  templating: false,
  simpleValue: 'This is a template store',
};
