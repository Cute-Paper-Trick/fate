'use client';

import { TolgeeProvider } from '@tolgee/react';
import { PropsWithChildren, memo, useEffect, useState } from 'react';

import BrandTextLoading from '@/components/Loading/BrandTextLoading';
// import { DEFAULT_LANG } from '@/const/locale';
import { createTolgee } from '@/locales/tolgee';

interface LocaleLayoutProps extends PropsWithChildren {
  antdLocale?: any;
  defaultLang?: string;
}

const Locale = memo(({ children, defaultLang }: LocaleLayoutProps) => {
  const [tolgee] = useState(createTolgee(defaultLang).init());

  const [lang] = useState(defaultLang);
  // const [locale, setLocale] = useState(antdLocale);

  useEffect(() => {
    const { unsubscribe } = tolgee.on('permanentChange', () => {});
    return () => unsubscribe();
  }, [tolgee]);

  return (
    <TolgeeProvider fallback={<BrandTextLoading />} ssr={{ language: lang }} tolgee={tolgee}>
      {children}
    </TolgeeProvider>
  );
});

Locale.displayName = 'LocaleLayout';

export default Locale;
