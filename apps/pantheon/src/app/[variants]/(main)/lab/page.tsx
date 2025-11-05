'use client';

// import { useTranslate } from '@tolgee/react';
import { Badge, Button, Card, Col, Row, Space, Tag } from 'antd';
import { Lightbulb, Plug, Rocket, TestTube } from 'lucide-react';

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
    icon: <TestTube color="#1890ff" size={32} />,
  },
  {
    id: '2',
    title: 'API Integration Test',
    description: 'Testing integration with third-party APIs for data synchronization.',
    status: 'active',
    category: 'Integration',
    icon: <Plug color="#52c41a" size={32} />,
  },
  {
    id: '3',
    title: 'Performance Optimization',
    description: 'Optimize database queries and reduce response time by 50%.',
    status: 'completed',
    category: 'Performance',
    icon: <Rocket color="#faad14" size={32} />,
  },
  {
    id: '4',
    title: 'New Feature Prototype',
    description: 'Developing a prototype for the new collaboration feature.',
    status: 'draft',
    category: 'Feature',
    icon: <Lightbulb color="#722ed1" size={32} />,
  },
  {
    id: '5',
    title: 'A/B Testing Framework',
    description: 'Build a framework for running A/B tests on new features.',
    status: 'active',
    category: 'Testing',
    icon: <TestTube color="#eb2f96" size={32} />,
  },
  {
    id: '6',
    title: 'Data Analytics Pipeline',
    description: 'Create a pipeline for processing and analyzing user behavior data.',
    status: 'draft',
    category: 'Analytics',
    icon: <Plug color="#13c2c2" size={32} />,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': {
      return 'green';
    }
    case 'completed': {
      return 'blue';
    }
    case 'draft': {
      return 'default';
    }
    default: {
      return 'default';
    }
  }
};

export default function LabPage() {
  // const { t } = useTranslate();

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Lab - Experiments & Prototypes</h1>
        <Button icon={<TestTube size={16} />} type="primary">
          New Experiment
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {experiments.map((experiment) => (
          <Col key={experiment.id} lg={8} sm={12} xs={24}>
            <Badge.Ribbon
              color={getStatusColor(experiment.status)}
              text={experiment.status.toUpperCase()}
            >
              <Card
                actions={[
                  <Button key="view" type="link">
                    View Details
                  </Button>,
                  <Button key="edit" type="link">
                    Edit
                  </Button>,
                  <Button danger key="delete" type="link">
                    Delete
                  </Button>,
                ]}
                hoverable
                style={{ height: '100%' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>{experiment.icon}</div>
                  <h3 style={{ margin: 0 }}>{experiment.title}</h3>
                  <Tag color="blue">{experiment.category}</Tag>
                  <p style={{ color: '#666', margin: 0 }}>{experiment.description}</p>
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
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#52c41a',
                }}
              >
                {experiments.filter((e) => e.status === 'active').length}
              </div>
              <div style={{ color: '#666' }}>Active Experiments</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1890ff',
                }}
              >
                {experiments.filter((e) => e.status === 'completed').length}
              </div>
              <div style={{ color: '#666' }}>Completed</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#faad14',
                }}
              >
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
