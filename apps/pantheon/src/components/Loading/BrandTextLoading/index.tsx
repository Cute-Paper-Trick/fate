import { BrandLoading } from '@lobehub/ui/brand';
import { Center } from 'react-layout-kit';

import PantheonText from '@/components/brand/PantheonText';

import CircleLoading from '../CircleLoading';

const BrandTextLoading = () => {
  const isCustomBranding = false;

  if (isCustomBranding) return <CircleLoading />;

  return (
    <Center height={'100%'} width={'100%'}>
      <BrandLoading size={40} style={{ opacity: 0.6 }} text={PantheonText} />
    </Center>
  );
};

export default BrandTextLoading;
