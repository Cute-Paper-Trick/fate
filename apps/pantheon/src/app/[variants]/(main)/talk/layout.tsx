import ServerLayout from '@/components/server/ServerLayout';

import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';

const TalkLayout = ServerLayout({ Desktop, Mobile });

TalkLayout.displayName = 'TalkLayout';

export default TalkLayout;
