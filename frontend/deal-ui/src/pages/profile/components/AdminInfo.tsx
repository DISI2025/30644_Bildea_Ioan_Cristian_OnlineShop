import React from 'react';
import { Typography, Alert, Row, Col, Card, Statistic, Table, Tag } from 'antd';

const { Title, Text } = Typography;

// Mock admin stats
const mockAdminStats = {
  totalUsers: 1254,
  activeSellers: 345,
  totalProducts: 5678,
  pendingApprovals: 12
};

// Mock pending approval data
const pendingApprovals = [
  { id: 1, username: 'user123', type: 'Seller Verification', createdAt: '2023-06-10T10:30:00.000Z' },
  { id: 2, username: 'shopowner22', type: 'Product Listing', createdAt: '2023-06-12T11:45:00.000Z' },
  { id: 3, username: 'artisan44', type: 'Seller Verification', createdAt: '2023-06-11T09:15:00.000Z' }
];

const AdminInfo: React.FC = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Seller Verification' ? 'blue' : 'green'}>
          {type}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <Card
      className="admin-info-card"
      style={{ 
        width: '100%',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}
    >
      <Alert
        message={<Title level={4} style={{ margin: 0 }}>Admin Dashboard</Title>}
        description={
          <Text>Admin dashboard provides tools for managing the platform</Text>
        }
        type="info"
        showIcon
        style={{ 
          width: '100%', 
          marginBottom: '24px',
          border: 'none',
          background: 'rgba(24, 144, 255, 0.1)'
        }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            className="stat-card"
            style={{ 
              height: '100%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderRadius: '6px'
            }}
          >
            <Statistic 
              title="Total Users" 
              value={mockAdminStats.totalUsers} 
              valueStyle={{ color: '#3f8600', fontSize: '24px' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            className="stat-card"
            style={{ 
              height: '100%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderRadius: '6px'
            }}
          >
            <Statistic 
              title="Active Sellers" 
              value={mockAdminStats.activeSellers} 
              valueStyle={{ color: '#1890ff', fontSize: '24px' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            className="stat-card"
            style={{ 
              height: '100%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderRadius: '6px'
            }}
          >
            <Statistic 
              title="Total Products" 
              value={mockAdminStats.totalProducts} 
              valueStyle={{ color: '#722ed1', fontSize: '24px' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            className="stat-card"
            style={{ 
              height: '100%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderRadius: '6px'
            }}
          >
            <Statistic 
              title="Pending Approvals" 
              value={mockAdminStats.pendingApprovals} 
              valueStyle={{ color: '#fa8c16', fontSize: '24px' }} 
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<Text strong style={{ fontSize: '16px' }}>Pending Approvals</Text>} 
        style={{ 
          width: '100%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderRadius: '6px' 
        }}
      >
        <Table 
          dataSource={pendingApprovals} 
          columns={columns} 
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          style={{ marginTop: '8px' }}
        />
      </Card>
    </Card>
  );
};

export default AdminInfo; 