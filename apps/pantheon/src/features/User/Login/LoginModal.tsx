'use client';

import { useTranslate } from '@tolgee/react';
import { Button, Form, Input, Modal, message } from 'antd';
import { useState } from 'react';

import { authClient } from '@/features/cerberus/client';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const { t } = useTranslate('auth');
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      // await login(values.email, values.password);
      await authClient.signIn.email({
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
    <Modal destroyOnClose footer={null} onCancel={onClose} open={open} title={t('login')}>
      <Form
        autoComplete="off"
        form={form}
        initialValues={{
          email: 'test@test.test',
          password: '12345678',
        }}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label={t('email') || 'Email'}
          name="email"
          rules={[
            {
              required: true,
              message: t('emailRequired') || 'Please input your email!',
            },
            {
              type: 'email',
              message: t('emailInvalid') || 'Please input a valid email!',
            },
          ]}
        >
          <Input placeholder={t('emailPlaceholder') || 'Enter your email'} />
        </Form.Item>

        <Form.Item
          label={t('password') || 'Password'}
          name="password"
          rules={[
            {
              required: true,
              message: t('passwordRequired') || 'Please input your password!',
            },
          ]}
        >
          <Input.Password placeholder={t('passwordPlaceholder') || 'Enter your password'} />
        </Form.Item>

        <Form.Item>
          <Button block htmlType="submit" loading={loading} type="primary">
            {t('login')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
