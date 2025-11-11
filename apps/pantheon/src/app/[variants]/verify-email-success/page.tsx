'use client';

import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { Button, Result, Space, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useSession } from '@/features/cerberus/client';

const { Paragraph, Text } = Typography;

export default function VerifyEmailSuccessPage() {
  const { t } = useTranslate('auth');
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    // Refetch session to ensure we have the latest email verification status
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!autoRedirect || countdown <= 0) {
      if (countdown <= 0) {
        router.push('/');
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router, autoRedirect]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Flexbox align="center" height="100vh" justify="center" width="100vw">
      <Result
        extra={
          <Space direction="vertical" size="middle">
            <Space>
              <Button onClick={handleGoHome} size="large" type="primary">
                {t('emailVerify.success.goHome', '返回首页')}
                {autoRedirect && <span suppressHydrationWarning> ({countdown}s)</span>}
              </Button>
            </Space>
            <Text
              onClick={() => setAutoRedirect(false)}
              style={{ cursor: 'pointer', fontSize: '12px' }}
              type="secondary"
            >
              {autoRedirect
                ? t('emailVerify.success.cancelAutoRedirect', '点击取消自动跳转')
                : t('emailVerify.success.autoRedirectCanceled', '已取消自动跳转')}
            </Text>
          </Space>
        }
        icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '72px' }} />}
        status="success"
        subTitle={
          <Space direction="vertical" size="small" style={{ marginTop: '16px' }}>
            <Paragraph style={{ fontSize: '16px', marginBottom: '8px' }}>
              {t(
                'emailVerify.success.description',
                '您的邮箱已成功验证，现在可以使用该邮箱登录并接收重要通知。',
              )}
            </Paragraph>
            {session?.user?.email && (
              <Text type="secondary">
                {t('emailVerify.success.verifiedEmail', '已验证邮箱')}: {session.user.email}
              </Text>
            )}
          </Space>
        }
        title={
          <Text style={{ fontSize: '24px', fontWeight: 600 }}>
            {t('emailVerify.success.title', '邮箱验证成功！')}
          </Text>
        }
      />
    </Flexbox>
  );
}
