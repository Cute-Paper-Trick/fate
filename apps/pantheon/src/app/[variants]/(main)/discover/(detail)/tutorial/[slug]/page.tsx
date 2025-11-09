import { PageProps } from '@/types/next';
import { RouteVariants } from '@/utils/server/routeVariants';

import Client from './Client';

type DiscoverPageProps = PageProps<{ slug: string; variants: string }>;

const getSharedProps = async (props: DiscoverPageProps) => {
  const params = await props.params;
  const { slug: identifier } = params;
  const { isMobile } = await RouteVariants.getVariantsFromProps(props);
  // const contentService = new ContentService();
  // const [t, data] = await Promise.all([getTranslate(), contentService.getPostById(identifier)]);
  return {
    // data,
    identifier,
    isMobile,
    // t,
  };
};

const TutorialDetail = async (props: DiscoverPageProps) => {
  const { identifier } = await getSharedProps(props);

  // if (!data) return notFound();
  // const { data } = useDataQuery({
  //   queryKey: ["tutorial", "detail"],
  //   queryFn: async () => {
  //     const res = await fetch(`/webapi/tutorial/${id}`, {
  //       credentials: "include",
  //       method: "GET",
  //     });
  //   }
  // });

  return <Client identifier={identifier} />;
};

TutorialDetail.displayName = 'TutorialDetail';

export default TutorialDetail;
