import React from 'react';
import { Card, Space, Tag, Typography, Row, Col, Button } from 'antd';
import { StarOutlined, ShoppingOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRecommendations } from '../../hooks/useRecommendations';

const { Title, Text } = Typography;

interface RecommendationCardProps {
    userId?: string;
    limit?: number;
    showCategories?: boolean;
    showViewMore?: boolean;
    title?: string;
}

/**
 * Compact recommendation card component
 * Can be used in dashboard, sidebar, or other parts of the application
 */
export const RecommendationCard: React.FC<RecommendationCardProps> = ({
    userId,
    limit = 4,
    showCategories = true,
    showViewMore = true,
    title
}) => {
    const navigate = useNavigate();
    const { 
        recommendations, 
        isLoading, 
        error, 
        isPersonalized, 
        hasCategories,
        topCategory 
    } = useRecommendations({ userId, limit });

    if (isLoading) {
        return (
            <Card loading style={{ marginBottom: 16 }}>
                <div style={{ height: 120 }} />
            </Card>
        );
    }

    if (error || !recommendations) {
        return null; // Don't show anything if there's an error
    }

    const displayTitle = title || (isPersonalized ? 'Recommended For You' : 'Popular Products');
    const products = recommendations.recommendedProducts.slice(0, limit);

    return (
        <Card
            title={
                <Space>
                    <StarOutlined style={{ color: isPersonalized ? '#1890ff' : '#52c41a' }} />
                    <span>{displayTitle}</span>
                    {isPersonalized && (
                        <Tag color="blue">Personalized</Tag>
                    )}
                </Space>
            }
            extra={
                showViewMore && (
                    <Button 
                        type="link" 
                        size="small"
                        onClick={() => navigate('/recommendations')}
                    >
                        View All
                    </Button>
                )
            }
            style={{ marginBottom: 16 }}
        >
            {/* Top Category Display */}
            {showCategories && hasCategories && topCategory && (
                <div style={{ marginBottom: 12 }}>
                    <Space>
                        <HeartOutlined style={{ color: '#ff4d4f', fontSize: '12px' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Your favorite: <Tag color="pink">{topCategory}</Tag>
                        </Text>
                    </Space>
                </div>
            )}

            {/* Products Grid */}
            {products.length > 0 ? (
                <Row gutter={[8, 8]}>
                    {products.map((product: any, index: number) => (
                        <Col span={12} key={product.id || index}>
                            <Card
                                size="small"
                                hoverable
                                cover={
                                    <img
                                        alt={product.title}
                                        src={product.imageUrl}
                                        style={{ 
                                            height: 80, 
                                            objectFit: 'cover',
                                            borderRadius: '4px 4px 0 0'
                                        }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x80?text=No+Image';
                                        }}
                                    />
                                }
                                onClick={() => navigate(`/products/${product.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Card.Meta
                                    title={
                                        <Text 
                                            ellipsis={{ tooltip: product.title }}
                                            style={{ fontSize: '12px' }}
                                        >
                                            {product.title}
                                        </Text>
                                    }
                                    description={
                                        <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
                                            ${product.price}
                                        </Text>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <ShoppingOutlined style={{ fontSize: 24, color: '#d9d9d9', marginBottom: 8 }} />
                    <br />
                    <Text type="secondary">No recommendations available</Text>
                </div>
            )}

            {/* Summary */}
            {recommendations.totalRecommendations > limit && (
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        +{recommendations.totalRecommendations - limit} more recommendations
                    </Text>
                </div>
            )}
        </Card>
    );
};

export default RecommendationCard; 