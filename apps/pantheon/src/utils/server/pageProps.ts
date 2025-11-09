import { getTolgee } from '@/locales/server';
import { DynamicLayoutProps } from '@/types/next';

import { RouteVariants } from './routeVariants';

export const parsePageMetaProps = async (props: DynamicLayoutProps) => {
  const { locale: hl, isMobile } = await RouteVariants.getVariantsFromProps(props);
  const tolgee = await getTolgee();
  // const { t, locale } = await getTolgee('metadata', hl);
  const lang = hl || (await tolgee.getLanguage());
  return { isMobile, locale: lang, t: tolgee.t };
};
