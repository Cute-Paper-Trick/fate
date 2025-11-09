import { useTranslate } from '@tolgee/react';
import qs from 'query-string';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useDetailContext } from '@/features/TutorialDetail/DetailProvider';

import Title from '../../../../../../features/Title';

const Related = memo(() => {
  const { t } = useTranslate('discover');
  const { category } = useDetailContext();

  return (
    <Flexbox gap={16}>
      <Title
        more={t('mcp.details.related.more')}
        moreLink={qs.stringifyUrl({
          query: {
            category,
          },
          url: '/discover/mcp',
        })}
      >
        {t('mcp.details.related.listTitle')}
      </Title>
      <Flexbox gap={8}>
        {/* {related?.map((item, index) => {
          const link = urlJoin('/discover/mcp', item.identifier);
          return (
            <Link href={link} key={index} style={{ color: 'inherit', overflow: 'hidden' }}>
              <Item {...item} />
            </Link>
          );
        })} */}
      </Flexbox>
    </Flexbox>
  );
});

export default Related;
