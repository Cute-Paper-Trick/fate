'use client';

import { PropsWithChildren, memo } from 'react';

import { Toaster } from '@/components/Sonner';

const SonnerProvider = memo<PropsWithChildren>(({ children }) => (
  <>
    {children}
    <Toaster position="top-center" />
  </>
));

SonnerProvider.displayName = 'SonnerProvider';

export default SonnerProvider;
