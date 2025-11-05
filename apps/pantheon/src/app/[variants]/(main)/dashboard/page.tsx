'use client';

// import { useTranslate } from '@tolgee/react';
import { Card, Col, Row, Statistic } from 'antd';

export default function DashboardPage() {
  // const { t } = useTranslate();

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col md={8} sm={12} xs={24}>
          <Card>
            <Statistic title="Total Users" value={1128} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col md={8} sm={12} xs={24}>
          <Card>
            <Statistic title="Active Sessions" value={93} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col md={8} sm={12} xs={24}>
          <Card>
            <Statistic prefix="$" title="Revenue" value={9280} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }} title="Overview">
        <p>Welcome to your dashboard. Here you can view key metrics and statistics.</p>
      </Card>

      <Card style={{ marginTop: '24px' }} title="Recent Activity">
        <ul>
          <li>User login - 2 minutes ago</li>
          <li>New registration - 15 minutes ago</li>
          <li>System update - 1 hour ago</li>
          <li>Database backup - 3 hours ago</li>
        </ul>
      </Card>
    </div>
  );
}
