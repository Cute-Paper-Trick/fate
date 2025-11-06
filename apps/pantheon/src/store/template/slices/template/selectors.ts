import type { TemplateStore } from '../../store';

const templating = (s: TemplateStore) => s.templating && false;

export const templateSelectors = {
  templating,
};
