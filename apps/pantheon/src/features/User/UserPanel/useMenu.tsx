import { Icon } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { ItemType } from 'antd/es/menu/interface';
import { Book, CircleUserRound, Feather, FileClockIcon, LogOut } from 'lucide-react';
import Link from 'next/link';

import { MenuProps } from '@/components/Menu';
import { DOCUMENTS_REFER_URL, GITHUB_ISSUES } from '@/const/url';
import { appEnv } from '@/envs/app';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

export const useMenu = () => {
  const { t } = useTranslate(['common', 'setting', 'auth']);

  const [isLogin] = useUserStore((s) => [authSelectors.isLogin(s)]);

  const profile: MenuProps['items'] = [
    {
      icon: <Icon icon={CircleUserRound} />,
      key: 'profile',
      // label: <Link href={'/profile'}>{t('userPanel.profile')}</Link>,
      label: (
        <Link href={`${appEnv.NEXT_PUBLIC_CHAT_APP_URL}/profile`} target={'_blank'}>
          {t('userPanel.profile')}
        </Link>
      ),
    },
  ];

  const enableHelp = false;

  const helps: MenuProps['items'] = [
    {
      icon: <Icon icon={FileClockIcon} />,
      key: 'help',
      label: t('userPanel.help'),
      children: [
        {
          icon: <Icon icon={Book} />,
          key: 'docs',
          label: (
            <Link href={DOCUMENTS_REFER_URL} target={'_blank'}>
              {t('userPanel.docs')}
            </Link>
          ),
        },
        {
          icon: <Icon icon={Feather} />,
          key: 'feedback',
          label: (
            <Link href={GITHUB_ISSUES} target={'_blank'}>
              {t('userPanel.feedback')}
            </Link>
          ),
        },
      ],
    },
  ].filter(Boolean) as ItemType[];

  const logoutItems: MenuProps['items'] = isLogin
    ? [
        {
          icon: <Icon icon={LogOut} />,
          key: 'logout',
          label: <span>{t('SIGN_OUT', { ns: 'betterAuth' })}</span>,
        },
      ]
    : [];

  const mainItems = [
    { type: 'divider' },
    ...(isLogin ? profile : []),
    ...(enableHelp ? helps : []),
  ].filter(Boolean) as MenuProps['items'];

  return { mainItems, logoutItems };
};
