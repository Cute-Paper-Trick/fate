'use client';

import { useTranslate } from '@tolgee/react';
import { Badge, Button, Card, Col, Row, Space, Tag } from 'antd';
import { TestTube, Rocket, Lightbulb, Plug } from 'lucide-react';

interface Experiment {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
  category: string;
  icon: React.ReactNode;
}

const experiments: Experiment[] = [
  {
    id: '1',
    title: 'AI Model Training',
    description: 'Train a new neural network model for natural language processing tasks.',
    status: 'active',
    category: 'Machine Learning',
    icon: <TestTube size={32} color="#1890ff" />,
  },
  {
    id: '2',
    title: 'API Integration Test',
    description: 'Testing integration with third-party APIs for data synchronization.',
    status: 'active',
    category: 'Integration',
    icon: <Plug size={32} color="#52c41a" />,
  },
  {
    id: '3',
    title: 'Performance Optimization',
    description: 'Optimize database queries and reduce response time by 50%.',
    status: 'completed',
    category: 'Performance',
    icon: <Rocket size={32} color="#faad14" />,
  },
  {
    id: '4',
    title: 'New Feature Prototype',
    description: 'Developing a prototype for the new collaboration feature.',
    status: 'draft',
    category: 'Feature',
    icon: <Lightbulb size={32} color="#722ed1" />,
  },
  {
    id: '5',
    title: 'A/B Testing Framework',
    description: 'Build a framework for running A/B tests on new features.',
    status: 'active',
    category: 'Testing',
    icon: <TestTube size={32} color="#eb2f96" />,
  },
  {
    id: '6',
    title: 'Data Analytics Pipeline',
    description: 'Create a pipeline for processing and analyzing user behavior data.',
    status: 'draft',
    category: 'Analytics',
    icon: <Plug size={32} color="#13c2c2" />,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'completed':
      return 'blue';
    case 'draft':
      return 'default';
    default:
      return 'default';
  }
};

export default function LabPage() {
  const { t } = useTranslate();

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Lab - Experiments & Prototypes</h1>
        <Button type="primary" icon={<TestTube size={16} />}>
          New Experiment
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {experiments.map((experiment) => (
          <Col xs={24} sm={12} lg={8} key={experiment.id}>
            <Badge.Ribbon
              text={experiment.status.toUpperCase()}
              color={getStatusColor(experiment.status)}
            >
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button type="link" key="view">View Details</Button>,
                  <Button type="link" key="edit">Edit</Button>,
                  <Button type="link" danger key="delete">Delete</Button>,
                ]}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div style={{ textAlign: 'center' }}>
                    {experiment.icon}
                  </div>
                  <h3 style={{ margin: 0 }}>{experiment.title}</h3>
                  <Tag color="blue">{experiment.category}</Tag>
                  <p style={{ color: '#666', margin: 0 }}>
                    {experiment.description}
                  </p>
                </Space>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: '24px' }} title="Lab Statistics">
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                {experiments.filter((e) => e.status === 'active').length}
              </div>
              <div style={{ color: '#666' }}>Active Experiments</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                {experiments.filter((e) => e.status === 'completed').length}
              </div>
              <div style={{ color: '#666' }}>Completed</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>
                {experiments.filter((e) => e.status === 'draft').length}
              </div>
              <div style={{ color: '#666' }}>Drafts</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
