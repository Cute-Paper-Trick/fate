import { createStyles } from 'antd-style';

export const useCardStyles = createStyles(({ css }) => ({
  card: css`
    --card-bg: rgb(255, 255, 255);
    --card-color: rgb(23, 23, 23);
    --card-secondary-border: rgba(23, 23, 23, 0.033);

    --radius: 0.375rem;
    --radius-auto: Max(0px, Min(var(--radius), calc((100vw - 4px - 100%) * 9999))) / var(--radius);

    border-radius: var(--radius-auto);
    background: var(--card-bg);
    color: var(--card-color);
    box-shadow: 0 0 0 1px var(--card-secondary-border);
    overflow-wrap: anywhere;

    overflow: hidden;
  `,
}));
