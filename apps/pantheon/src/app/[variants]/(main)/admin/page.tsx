'use client';

import { useTranslate } from '@tolgee/react';
import { Alert, Button, Card, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface UserDataType {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const userData: UserDataType[] = [
  {
    key: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    key: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
  },
  {
    key: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
  },
];

export default function AdminPage() {
  const { t } = useTranslate();

  const columns: ColumnsType<UserDataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>Admin Panel</h1>

      <Alert
        message="Admin Access"
        description="This is the admin panel. You have full access to manage users and system settings."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card
        title="User Management"
        extra={<Button type="primary">Add User</Button>}
        style={{ marginBottom: '24px' }}
      >
        <Table columns={columns} dataSource={userData} pagination={false} />
      </Card>

      <Card title="System Settings">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="default" block>
            Configure Email Settings
          </Button>
          <Button type="default" block>
            Manage API Keys
          </Button>
          <Button type="default" block>
            View System Logs
          </Button>
          <Button danger block>
            Reset Database
          </Button>
        </Space>
      </Card>
    </div>
  );
}
