import ServerLayout from '@/components/server/ServerLayout';

import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';

// Main layout that switches between Desktop and Mobile layouts
const MessageCenterLayout = ServerLayout({ Desktop, Mobile });

MessageCenterLayout.displayName = 'MessageCenterLayout';

export default MessageCenterLayout;
