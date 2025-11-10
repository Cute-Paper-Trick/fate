import ServerLayout from '@/components/server/ServerLayout';

import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';

// Main layout that switches between Desktop and Mobile layouts
const PoseClassifierLayout = ServerLayout({ Desktop, Mobile });

PoseClassifierLayout.displayName = 'PoseClassifierLayout';

export default PoseClassifierLayout;
