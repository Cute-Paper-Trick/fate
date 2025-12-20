import { createStyles } from 'antd-style';
import { PropsWithChildren, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => ({
  section: css``,
  title: css`
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    display: flex;
    justify-content: space-between;
  `,
}));

interface SectionProps extends PropsWithChildren {
  title?: string;
}

const Section = memo<SectionProps>(({ children, title }) => {
  const { styles } = useStyles();
  return (
    <Flexbox className={styles.section}>
      <div className={styles.title}>
        <span>{title}</span>
      </div>
      {children}
    </Flexbox>
  );
});

export default Section;
