import { memo } from 'react';

interface PannelContentProps {
  closePopover: () => void;
}

const PannelContent = memo<PannelContentProps>(({ closePopover }) => {
  return <div>Panel Content</div>;
});

export default PannelContent;
