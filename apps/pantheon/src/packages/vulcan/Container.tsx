import { PropsWithChildren, memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

const Container = memo<PropsWithChildren<FlexboxProps>>(({ children, ...rest }) => (
  <Flexbox paddingInline={'1.25rem'} {...rest}>
    {children}
  </Flexbox>
));

export default Container;
