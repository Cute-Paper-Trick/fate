'use client';

import { useTranslate } from '@tolgee/react';
import { Button, Form, Input, Modal } from 'antd';
import { message } from 'antd';
import { useState } from 'react';

import { authClient } from '@/features/cerberus/client';
import { useUserStore } from '@/store/user';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const { t } = useTranslate('auth');
  const [loading, setLoading] = useState(false);
  const login = useUserStore((s) => s.login);

  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      // await login(values.email, values.password);
      const res = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      message.success(t('loginSuccess') || 'Login successful');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(t('loginFailed') || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={t('login')} open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{
          email: 'test@test.test',
          password: '12345678',
        }}
      >
        <Form.Item
          name="email"
          label={t('email') || 'Email'}
          rules={[
            { required: true, message: t('emailRequired') || 'Please input your email!' },
            { type: 'email', message: t('emailInvalid') || 'Please input a valid email!' },
          ]}
        >
          <Input placeholder={t('emailPlaceholder') || 'Enter your email'} />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('password') || 'Password'}
          rules={[
            { required: true, message: t('passwordRequired') || 'Please input your password!' },
          ]}
        >
          <Input.Password placeholder={t('passwordPlaceholder') || 'Enter your password'} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {t('login')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
