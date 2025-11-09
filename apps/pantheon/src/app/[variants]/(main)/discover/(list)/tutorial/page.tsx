import { DynamicLayoutProps } from '@/types/next';
import { parsePageMetaProps } from '@/utils/server/pageProps';

import Client from './Client';

const Page = async (props: DynamicLayoutProps) => {
  // const { locale, t, isMobile } = await parsePageMetaProps(props);
  await parsePageMetaProps(props);

  return <Client mobile={false} />;
};

Page.DisplayName = 'DiscoverTutorial';

export default Page;
