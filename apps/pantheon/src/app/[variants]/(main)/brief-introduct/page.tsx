import { FC } from 'react';

// 引入各内容组件
import BriefUse from './features/brief-use/page';
import Example from './features/example/page';
import FunctionPreview from './features/functionPreview/page';
import Help from './features/help/page';

const BriefIntroducePage: FC = () => {
  return (
    <>
      <BriefUse />
      <Example />
      <FunctionPreview />
      <Help />
    </>
  );
};

export default BriefIntroducePage;
