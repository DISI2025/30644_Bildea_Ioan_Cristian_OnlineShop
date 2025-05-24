import React from 'react';
import {Card, Divider, Rate, Skeleton, Space, Tag, theme, Typography} from 'antd';
import {Product, ProductCategory} from '../../types/entities';
import {CheckCircleOutlined, GiftOutlined, SafetyCertificateOutlined, ShopOutlined} from '@ant-design/icons';
import {useGetUserByIdQuery} from '../../store/api';

const {Title, Text, Paragraph} = Typography;
const {useToken} = theme;

interface ProductInfoProps {
    product: Product | null;
    categories: ProductCategory[];
    loading?: boolean;
    sellerName?: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
                                                            product,
                                                            loading = false,
                                                            sellerName = 'Unknown Seller'
                                                        }) => {
    const {token} = useToken();
    const isDarkMode = token.colorBgContainer === '#141414' || token.colorBgContainer === '#1f1f1f';

    const {
        data: sellerResponse,
        isLoading: isLoadingSeller
    } = useGetUserByIdQuery(product?.sellerId || '', {
        skip: !product?.sellerId
    });

    const seller = sellerResponse?.payload;
    const displaySellerName = seller ? seller.username : sellerName;

    if (loading || !product) {
        return (
            <Card variant="borderless" style={{height: '100%'}}>
                <Skeleton active paragraph={{rows: 6}}/>
            </Card>
        );
    }

    return (
        <Card
            variant="borderless"
            style={{
                height: '100%',
                borderRadius: 12,
                backgroundColor: token.colorBgContainer,
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)'
            }}
        >
            <Space direction="vertical" size="middle" style={{width: "100%"}}>
                <Title level={2}
                       style={{marginBottom: 0, fontWeight: 600, color: token.colorTextHeading}}>{product.title}</Title>

                <Text type="secondary" style={{fontSize: '16px'}}>
                    {isLoadingSeller ? (
                        <Skeleton.Button active size="small" style={{width: 200}}/>
                    ) : (
                        <Space direction="vertical" size={0}>
                            <Text>
                                Sold by <Text strong>{seller?.fullName || seller?.username || displaySellerName}</Text>
                            </Text>
                            <Text type="secondary" style={{fontSize: '14px'}}>
                                <ShopOutlined style={{marginRight: 4}} />
                                Store: {seller?.storeAddress || 'No store address provided'}
                            </Text>
                        </Space>
                    )}
                </Text>

                <Space wrap style={{marginTop: 8}}>
                    {product.categories.map(category => (
                        <Tag
                            color="blue"
                            key={category.id}
                            style={{
                                padding: '4px 12px',
                                borderRadius: 16,
                                fontSize: '14px'
                            }}
                        >
                            {category.categoryName}
                        </Tag>
                    ))}
                </Space>

                <Divider style={{margin: '16px 0', borderColor: token.colorBorderSecondary}}/>

                <Paragraph style={{
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: token.colorText
                }}>
                    {product.description}
                </Paragraph>

                <Space direction="vertical" size={4}>
                    <Title level={3} style={{
                        marginBottom: 0,
                        color: '#8c2ae8',
                        fontWeight: 700
                    }}>
                        ${product.price.toFixed(2)}
                    </Title>
                    <Text type="secondary" style={{fontSize: '16px'}}>
                        {product.stock > 10
                            ? 'In Stock'
                            : (product.stock > 0
                                ? `Only ${product.stock} left!`
                                : 'Out of Stock')}
                    </Text>
                </Space>

                <Space direction="vertical" size={4} style={{marginTop: 8}}>
                    <Rate disabled defaultValue={4.5} style={{fontSize: '18px'}}/>
                    <Text type="secondary">(123 reviews)</Text>
                </Space>

                <Card
                    style={{
                        marginTop: 16,
                        borderRadius: 8,
                        backgroundColor: isDarkMode ? 'rgba(140, 42, 232, 0.1)' : '#f9f0ff',
                        border: `1px solid ${isDarkMode ? 'rgba(140, 42, 232, 0.3)' : '#d3adf7'}`
                    }}
                >
                    <Space direction="vertical" size="small">
                        <Space>
                            <CheckCircleOutlined style={{color: '#52c41a'}}/>
                            <Text strong style={{color: token.colorText}}>30-Day Return</Text>
                        </Space>

                        <Space>
                            <SafetyCertificateOutlined style={{color: '#faad14'}}/>
                            <Text strong style={{color: token.colorText}}>2-Year Warranty</Text>
                        </Space>

                        <Space>
                            <GiftOutlined style={{color: '#1890ff'}}/>
                            <Text strong style={{color: token.colorText}}>Free Shipping</Text>
                            <Text type="secondary">• Arrives in 2-4 business days</Text>
                        </Space>
                    </Space>
                </Card>
            </Space>
        </Card>
    );
}; 