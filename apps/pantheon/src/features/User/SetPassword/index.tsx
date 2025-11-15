/* eslint-disable react/jsx-sort-props */
'use client';

import { Button, Modal, Text } from '@lobehub/ui';
import { useMutation } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';
import { Form, Input } from 'antd';
import { usePathname } from 'next/navigation';
import { Flexbox } from 'react-layout-kit';

import { message } from '@/components/AntdStaticMethods';
import { authClient } from '@/features/cerberus/client';
import { accountChangePasswordFinish, useAccountNeedChangePassword } from '@/lib/http';
import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/selectors';

import styles from './index.module.css';

const SetPassword = () => {
  const { t } = useTranslate('auth');

  const { data, refetch } = useAccountNeedChangePassword();

  const userId = useUserStore(userProfileSelectors.userId);

  const [form] = Form.useForm();

  const pathname = usePathname();

  const changePassword = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (res.error?.code) {
        throw new Error(t(res.error.code, { ns: 'betterAuth' }));
      }
      if (res.error) {
        throw new Error(res.error.message);
      }

      await accountChangePasswordFinish({ data: { userId: userId! } });
    },
    onError: (error) => {
      message?.error(error.message || t('changePassword.changeFailed', '修改密码失败，请重试'));
    },
    onSuccess: () => {
      message?.success(t('changePassword.changeSuccess', '密码修改成功'));
      refetch();
    },
  });

  if (data?.need_change !== true) {
    return null;
  }

  if (pathname === '/verify-email-success') {
    return null;
  }

  return (
    <Modal open={true} closable={false} footer={null} title={t('changePassword.title', '设置密码')}>
      <Flexbox paddingBlock={20}>
        <Text>{t('changePassword.description', '为了您的账号安全请修改密码')}</Text>
      </Flexbox>
      <Flexbox paddingBlock={20}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          style={{ gap: 0 }}
          disabled={changePassword.isPending}
          className={styles.setPasswordForm}
        >
          <Form.Item
            label={t('changePassword.oldPassword', '旧密码')}
            name="oldPassword"
            rules={[
              {
                required: true,
              },
            ]}
            colon={false}
            labelAlign="left"
            required={false}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('changePassword.newPassword', '新密码')}
            name="newPassword"
            rules={[{ required: true, type: 'string', min: 8 }]}
            colon={false}
            labelAlign="left"
            required={false}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            colon={false}
            required={false}
            labelAlign="left"
            dependencies={['newPassword']}
            label={t('changePassword.confirmPassword', '确认密码')}
            name="confirmPassword"
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t('changePassword.passwordMismatch', '两次输入的密码不一致')),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Flexbox>
      <Flexbox>
        <Button
          loading={changePassword.isPending}
          onClick={async () => {
            const { oldPassword, newPassword } = await form.validateFields();
            changePassword.mutate({ currentPassword: oldPassword, newPassword });
          }}
          type="primary"
        >
          {t('changePassword.submit', '确认修改')}
        </Button>
      </Flexbox>
    </Modal>
  );
};

SetPassword.displayName = 'SetPassword';

export default SetPassword;
