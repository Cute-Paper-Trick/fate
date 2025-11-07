import ServerLayout from '@/components/server/ServerLayout';

import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';

// Main layout that switches between Desktop and Mobile layouts
const LearningLayout = ServerLayout({ Desktop, Mobile });

LearningLayout.displayName = 'LearningLayout';

export default LearningLayout;
