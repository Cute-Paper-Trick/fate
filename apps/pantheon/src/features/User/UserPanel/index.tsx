'use client';

import { Popover } from 'antd';
import { PropsWithChildren, memo, useState } from 'react';

import PannelContent from './PanelContent';

const UserPanel = memo<PropsWithChildren>(({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      arrow={false}
      content={<PannelContent closePopover={() => setOpen(false)} />}
      onOpenChange={setOpen}
      open={open}
      placement="bottomRight"
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
