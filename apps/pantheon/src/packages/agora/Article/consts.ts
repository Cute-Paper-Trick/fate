import { ReactionCate } from './type';

export const reactionCategories: { cate: ReactionCate; emjio: string; desc: string }[] = [
  { cate: 'nb', emjio: '🤩', desc: 'Star-Struck' },
  { cate: 'good', emjio: '👏', desc: 'Clapping Hands' },
  { cate: 'normal', emjio: '😶', desc: 'Face Without Mouth' },
  { cate: 'emm', emjio: '🥴', desc: 'Woozy Face' },
  { cate: 'poo', emjio: '💩', desc: 'Pile of Poo' },
] as const;

export const tags = [
  { name: 'ai', color: '#FF6B6B' },
  { name: 'productivity', color: '#6BCB77' },
  { name: 'automation', color: '#4D96FF' },
  { name: 'writing', color: '#FFD93D' },
] as const;
