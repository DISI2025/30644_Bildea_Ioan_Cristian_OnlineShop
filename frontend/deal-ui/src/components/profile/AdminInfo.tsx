import React from 'react';
import {Alert, Card, Col, Row, Statistic, Table, Tag, theme, Typography} from 'antd';

const {Title, Text} = Typography;
const {useToken} = theme;

// TODO: Replace with actual API call to fetch admin stats

// Mock admin stats
const mockAdminStats = {
    totalUsers: 1254,
    activeSellers: 345,
    totalProducts: 5678,
    pendingApprovals: 12
};

// Mock pending approval data
const pendingApprovals = [
    {id: 1, username: 'user123', type: 'Seller Verification', createdAt: '2023-06-10T10:30:00.000Z'},
    {id: 2, username: 'shopowner22', type: 'Product Listing', createdAt: '2023-06-12T11:45:00.000Z'},
    {id: 3, username: 'artisan44', type: 'Seller Verification', createdAt: '2023-06-11T09:15:00.000Z'}
];

const AdminInfo: React.FC = () => {
    const {token} = useToken();

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
                boxShadow: token.shadows.light.md,
                borderRadius: token.borderRadius.md,
                overflow: 'hidden',
                marginBottom: token.spacing.lg
            }}
        >
            <Alert
                message={<Title level={4} style={{margin: 0}}>Admin Dashboard</Title>}
                description={
                    <Text>Admin dashboard provides tools for managing the platform</Text>
                }
                type="info"
                showIcon
                style={{
                    width: '100%',
                    marginBottom: token.spacing.lg,
                    border: 'none',
                    background: 'rgba(24, 144, 255, 0.1)'
                }}
            />

            <Row gutter={[16, 16]} style={{marginBottom: token.spacing.lg}}>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        className="stat-card"
                        style={{
                            height: '100%',
                            boxShadow: token.shadows.light.sm,
                            borderRadius: token.borderRadius.sm
                        }}
                    >
                        <Statistic
                            title="Total Users"
                            value={mockAdminStats.totalUsers}
                            valueStyle={{color: '#3f8600', fontSize: token.customFontSize.xl}}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        className="stat-card"
                        style={{
                            height: '100%',
                            boxShadow: token.shadows.light.sm,
                            borderRadius: token.borderRadius.sm
                        }}
                    >
                        <Statistic
                            title="Active Sellers"
                            value={mockAdminStats.activeSellers}
                            valueStyle={{color: token.colorPrimary, fontSize: token.customFontSize.xl}}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        className="stat-card"
                        style={{
                            height: '100%',
                            boxShadow: token.shadows.light.sm,
                            borderRadius: token.borderRadius.sm
                        }}
                    >
                        <Statistic
                            title="Total Products"
                            value={mockAdminStats.totalProducts}
                            valueStyle={{color: '#722ed1', fontSize: token.customFontSize.xl}}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        className="stat-card"
                        style={{
                            height: '100%',
                            boxShadow: token.shadows.light.sm,
                            borderRadius: token.borderRadius.sm
                        }}
                    >
                        <Statistic
                            title="Pending Approvals"
                            value={mockAdminStats.pendingApprovals}
                            valueStyle={{color: '#fa8c16', fontSize: token.customFontSize.xl}}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title={<Text strong style={{fontSize: token.customFontSize.base}}>Pending Approvals</Text>}
                style={{
                    width: '100%',
                    boxShadow: token.shadows.light.sm,
                    borderRadius: token.borderRadius.sm
                }}
            >
                <Table
                    dataSource={pendingApprovals}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    scroll={{x: 'max-content'}}
                    style={{marginTop: token.spacing.sm}}
                />
            </Card>
        </Card>
    );
};

export default AdminInfo; 