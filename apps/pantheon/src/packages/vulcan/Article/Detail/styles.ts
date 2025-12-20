import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, responsive }) => ({
  content: css`
    width: 896px;
    max-width: 100%;
    margin-inline: auto;
    flex: 1;
    min-height: 300px;

    ${responsive.md} {
    }
    height: 100%;
  `,
  comments: css``,
  commentInput: css`
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
  `,
}));
