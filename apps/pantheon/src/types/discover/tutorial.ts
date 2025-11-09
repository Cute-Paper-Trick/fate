export enum TutorialCategory {
  All = 'all',
  Video = 'video',
  Audio = 'audio',
  Posture = 'posture',
  Game = 'game',
  Chat = 'chat',
}

export interface TutorialIndexItem {
  date: string;
  id: string;
  title: string;
  description?: string;
  image?: string;
  author?: string;
  category?: string;
  isFeatured?: boolean;
  isOfficial?: boolean;
}

export interface TutorialQueryParams {
  category?: string;
  locale?: string;
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  q?: string;
  // sort?: McpSorts;
}

export interface DiscoverTutorialDetail extends TutorialIndexItem {
  tags: string[];
  content: string;
  rawTitle: string;
}
