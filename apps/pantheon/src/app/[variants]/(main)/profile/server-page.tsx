import { Flexbox } from 'react-layout-kit';

import { DynamicLayoutProps } from '@/types/next';

const Page = async (props: DynamicLayoutProps) => {
  console.log(props);
  // const mobile = await RouteVariants.getIsMobile(props);

  // if (enableClerk) return <ClerkProfile mobile={mobile} />;

  return <Flexbox />;
};

export default Page;
