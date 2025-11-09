import ServerLayout from '@/components/server/ServerLayout';

import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';

const BriefIntroductLayout = ServerLayout({ Desktop, Mobile });

BriefIntroductLayout.displayName = 'BriefIntroductLayout';

export default BriefIntroductLayout;
