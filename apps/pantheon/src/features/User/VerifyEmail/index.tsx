'use client';

import { Button, Form, Input, Modal, Text } from '@lobehub/ui';
import { useMutation } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import { Steps } from 'antd';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { message } from '@/components/AntdStaticMethods';
import { authClient, useSession } from '@/features/cerberus/client';
import { useUserStore } from '@/store/user/store';

const VerifyEmail = () => {
  const { t } = useTranslate('auth');
  const { refetch } = useSession();
  const user = useUserStore((s) => s.user);
  const [modalVisible, setModalVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/verify-email-success') {
      return;
    }

    if (!user) {
      return;
    }
    const { email, emailVerified } = user;
    if (!email || !emailVerified) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalVisible(true);
    }
  }, [user, pathname]);

  const [step, setStep] = useState(0);

  const [form] = Form.useForm();

  const changeEmail = useMutation({
    mutationFn: async (newEmail: string) => {
      let data;
      if (newEmail === user?.email) {
        data = await authClient.sendVerificationEmail({
          email: newEmail,
          callbackURL: '/verify-email-success',
        });
      } else {
        data = await authClient.changeEmail({ newEmail, callbackURL: '/verify-email-success' });
      }

      if (data?.error) {
        if (data.error.code === 'COULDNT_UPDATE_YOUR_EMAIL') {
          throw new Error(t('emailVerify.emailAlreadyInUse', '邮箱已被使用，请更换邮箱'));
        }
        if (data.error.code === 'YOU_CAN_ONLY_SEND_A_VERIFICATION_EMAIL_TO_AN_UNVERIFIED_EMAIL') {
          throw new Error(
            t('emailVerify.emailHasBeenVerified', '您的邮箱已经通过验证，请刷新页面'),
          );
        }
        throw new Error(data.error.message || '操作失败，请稍后重试');
      }
    },
    onError: (error) => {
      message?.error(error.message || '操作失败，请稍后重试');
    },
    onSuccess: () => {
      setStep((step) => step + 1);
    },
  });

  const emailVerified = useMutation({
    mutationFn: async () => {
      const { data: session } = await authClient.getSession({
        query: { disableCookieCache: true },
      });
      if (session?.user.emailVerified) {
        await refetch({ query: { disableCookieCache: true } });
        return;
      }
      throw new Error(t('emailVerify.emailVerifyFailed', '邮箱尚未验证成功，请稍后重试'));
    },
    onSuccess: () => setStep((step) => step + 1),
    onError: (error) => {
      message?.error(error.message || '操作失败，请稍后重试');
    },
  });

  return (
    <Modal
      closable={false}
      footer={null}
      open={modalVisible}
      title={t('accountSecurity', '账号安全')}
    >
      <Flexbox>
        <Text className="mb-4">
          {t(
            'emailVerify.notVerified.description',
            '监测到您的邮箱还未验证，为了保证账号安全，请验证您的邮箱地址。',
          )}
        </Text>
      </Flexbox>
      <Steps current={step} size="small" type="navigation">
        <Steps.Step title={t('emailVerify.confirmEmailAddress', '确认邮箱地址')} />
        <Steps.Step title={t('emailVerify.checkEmail', '查收验证邮件')} />
        <Steps.Step title={t('emailVerify.completed', '完成验证')} />
      </Steps>
      {step === 0 && (
        <>
          <Flexbox gap={8}>
            <Form form={form} initialValues={{ email: user?.email }}>
              <Form.Item
                label={t('emailVerify.emailAddress', '邮箱地址')}
                layout="vertical"
                name="email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input type="email" />
              </Form.Item>
            </Form>
          </Flexbox>
          <Flexbox gap={8}>
            <Text className="my-4">
              {t('emailVerify.sendEmail.description', '点击下方按钮发送验证邮件至您的邮箱。')}
            </Text>
            <Button
              loading={changeEmail.isPending}
              onClick={async () => {
                await form.validateFields();
                changeEmail.mutate(form.getFieldValue('email'));
              }}
              type="primary"
            >
              {t('emailVerify.sendEmail.title', '发送验证邮件')}
            </Button>
          </Flexbox>
        </>
      )}
      {step === 1 && (
        <Flexbox gap={16}>
          <Flexbox gap={16} paddingBlock={20}>
            <Text>
              {t(
                'emailVerify.checkEmail.description',
                '请前往您的邮箱查收，并点击邮件中的验证链接完成邮箱验证。',
              )}
            </Text>
            <Text>
              {t(
                'emailVerify.checkEmail.note',
                '可能需要几分钟时间才能收到邮件，请注意查收垃圾邮件文件夹以防遗漏。',
              )}
            </Text>
            <Text>
              {t('emailVerify.checkEmail.instruction', '发送验证邮件后，验证成功请点击下方按钮。')}
            </Text>
          </Flexbox>
          <Button onClick={() => setStep((step) => step - 1)}>
            {t('emailVerify.changeEmail.title', '修改邮箱')}
          </Button>
          <Button
            loading={emailVerified.isPending}
            onClick={() => emailVerified.mutate()}
            type="primary"
          >
            {t('emailVerify.checkEmail', '我已验证')}
          </Button>
        </Flexbox>
      )}
      {step === 2 && (
        <Flexbox>
          <Flexbox align="center" gap={8} paddingBlock={20}>
            <Text>🎉</Text>
            <Text>
              {t(
                'emailVerify.completed.description',
                '邮箱验证成功，之后您可以通过该邮箱地址登录并接收重要通知。',
              )}
            </Text>
          </Flexbox>
          <Button
            onClick={() => {
              refetch();
              setModalVisible(false);
            }}
          >
            {t('emailVerify.completed.ok', '好的')}
          </Button>
        </Flexbox>
      )}
    </Modal>
  );
};

export default VerifyEmail;
