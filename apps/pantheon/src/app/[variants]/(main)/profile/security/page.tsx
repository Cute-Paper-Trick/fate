import { ChangePasswordCard, SessionsCard } from '@daveyplate/better-auth-ui';

// import { DynamicLayoutProps } from '@/types/next';

// import { RouteVariants } from '@/utils/server/routeVariants';

const Page = async () => {
  // const mobile = await RouteVariants.getIsMobile(props);

  return (
    <>
      <ChangePasswordCard />
      <SessionsCard />
    </>
  );
};

export default Page;
