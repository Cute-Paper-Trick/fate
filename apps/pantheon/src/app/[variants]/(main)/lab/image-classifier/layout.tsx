import ServerLayout from '@/components/server/ServerLayout';

import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';

// Main layout that switches between Desktop and Mobile layouts
const ImageClassifierLayout = ServerLayout({ Desktop, Mobile });

ImageClassifierLayout.displayName = 'ImageClassifierLayout';

export default ImageClassifierLayout;
