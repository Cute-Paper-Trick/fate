'use client';

import { Popover } from 'antd';
import { PropsWithChildren, memo, useState } from 'react';

import PannelContent from './PanelContent';

const UserPanel = memo<PropsWithChildren>(({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      arrow={false}
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      styles={{
        body: { padding: 0 },
      }}
      trigger={['click']}
      content={<PannelContent closePopover={() => setOpen(false)} />}
    >
      {children}
    </Popover>
  );
});

UserPanel.displayName = 'UserPanel';

export default UserPanel;
