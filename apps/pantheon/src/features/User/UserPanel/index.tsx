'use client';

import { Popover } from 'antd';
import { createStyles } from 'antd-style';
import { PropsWithChildren, memo, useState } from 'react';

import PannelContent from './PanelContent';

const useStyles = createStyles(({ css }) => {
  return {
    popover: css`
      // inset-block-start: ${8}px !important;
      // inset-inline-start: 8px !important;
    `,
  };
});

const UserPanel = memo<PropsWithChildren>(({ children }) => {
  const [open, setOpen] = useState(false);
  const { styles } = useStyles();

  return (
    <Popover
      arrow={false}
      content={<PannelContent closePopover={() => setOpen(false)} />}
      onOpenChange={setOpen}
      open={open}
      placement="bottomRight"
      rootClassName={styles.popover}
      styles={{
        body: { padding: 0 },
      }}
      trigger={['click']}
    >
      {children}
    </Popover>
  );
});

UserPanel.displayName = 'UserPanel';

export default UserPanel;
