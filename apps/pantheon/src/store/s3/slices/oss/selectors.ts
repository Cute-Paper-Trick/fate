import type { S3Store } from '../../store';

const client = (s: S3Store) => s.client;

export const ossSelectors = {
  client,
};
