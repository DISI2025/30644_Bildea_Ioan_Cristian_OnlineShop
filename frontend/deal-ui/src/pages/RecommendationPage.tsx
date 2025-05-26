import React from 'react';
import { Card, Col, Row, Typography, Alert, Skeleton, Space, Tag, Empty, Button } from 'antd';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../store/slices/auth-slice';
import ProductGrid from '../components/product/ProductGrid';
import { ShoppingCartOutlined, HeartOutlined, StarOutlined, ReloadOutlined } from '@ant-design/icons';
import { useGetRecommendationsForUserQuery } from '../store/api';

const { Title, Text, Paragraph } = Typography;

export const RecommendationPage: React.FC = () => {
    const authState = useSelector(selectAuthState);
    const userId = authState.user?.id;

    const {
        data: recommendationsResponse,
        isLoading: loading,
        error,
        refetch
    } = useGetRecommendationsForUserQuery(
        { userId: userId!, limit: 12 },
        { skip: !userId }
    );

    const recommendations = recommendationsResponse?.payload;

    const renderPreferredCategories = () => {
        if (!recommendations?.preferredCategories || Object.keys(recommendations.preferredCategories).length === 0) {
            return null;
        }

        const sortedCategories = Object.entries(recommendations.preferredCategories)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5);

        return (
            <Card 
                title={
                    <Space>
                        <HeartOutlined style={{ color: '#ff4d4f' }} />
                        <span>Your Favorite Categories</span>
                    </Space>
                }
                style={{ marginBottom: 24 }}
            >
                <Space wrap>
                    {sortedCategories.map(([category, count]) => (
                        <Tag 
                            key={category} 
                            color="blue" 
                            style={{ fontSize: '14px', padding: '4px 12px' }}
                        >
                            {category} ({count as number} purchases)
                        </Tag>
                    ))}
                </Space>
            </Card>
        );
    };

    const renderRecommendationHeader = () => {
        if (!recommendations) return null;

        const isPersonalized = recommendations.recommendationType === 'PERSONALIZED';
        
        return (
            <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Title level={2} style={{ color: 'white', margin: 0 }}>
                        <Space>
                            <StarOutlined />
                            {isPersonalized ? 'Recommended For You' : 'Popular Products'}
                        </Space>
                    </Title>
                    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontSize: '16px' }}>
                        {isPersonalized 
                            ? 'Based on your purchase history and preferences'
                            : 'Trending products that other customers love'
                        }
                    </Paragraph>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {recommendations.totalRecommendations} products found
                    </Text>
                </Space>
            </Card>
        );
    };

    if (!userId) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Alert
                    message="Login Required"
                    description="Please log in to see personalized product recommendations."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 24 }} />
                <Row gutter={[16, 16]}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                            <Card>
                                <Skeleton active />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Alert
                    message="Error Loading Recommendations"
                    description="Failed to load recommendations. Please try again later."
                    type="error"
                    showIcon
                    action={
                        <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
                            Retry
                        </Button>
                    }
                    style={{ marginBottom: 24 }}
                />
            </div>
        );
    }

    if (!recommendations || recommendations.recommendedProducts.length === 0) {
        return (
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <Space direction="vertical">
                                <Text>No recommendations available yet</Text>
                                <Text type="secondary">
                                    Start shopping to get personalized recommendations!
                                </Text>
                            </Space>
                        }
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {renderRecommendationHeader()}
            {renderPreferredCategories()}
            
            <Card 
                title={
                    <Space>
                        <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                        <span>Recommended Products</span>
                    </Space>
                }
            >
                <ProductGrid products={recommendations.recommendedProducts} />
            </Card>
        </div>
    );
};

export default RecommendationPage; 