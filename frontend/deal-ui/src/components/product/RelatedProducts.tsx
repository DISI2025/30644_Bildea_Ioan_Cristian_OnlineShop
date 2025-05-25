import React, {useEffect, useState} from 'react';
import {Button, Card, Carousel, Divider, Empty, Skeleton, Space, Typography, Tag, theme} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import {Product} from '../../types/entities';
import {useNavigate, Link} from 'react-router-dom';
import {ROUTES} from '../../routes/AppRouter';

const {Title, Text} = Typography;
const { useToken } = theme;

interface RelatedProductsProps {
    sellerId: string;
    currentProductId: string;
    products: Product[];
    loading?: boolean;
    title?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
                                                                    currentProductId,
                                                                    products,
                                                                    loading = false,
                                                                    title = "From the same seller"
                                                                }) => {
    const navigate = useNavigate();
    const { token } = useToken();
    const [carouselItems, setCarouselItems] = useState<Product[]>([]);

    useEffect(() => {
        const filteredProducts = products
            .filter(product => product.id !== currentProductId)
            .slice(0, 6);

        setCarouselItems(filteredProducts);
    }, [products, currentProductId]);

    if (loading) {
        return (
            <div style={{marginTop: 48}}>
                <Divider orientation="left">
                    <Title level={4} style={{ color: token.colorText }}>{title}</Title>
                </Divider>
                <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} style={{
                            width: 240,
                            height: 280,
                            borderRadius: 12,
                            border: `1px solid ${token.colorBorderSecondary}`,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                            <Skeleton.Image active style={{width: '100%', height: 140}}/>
                            <Skeleton active paragraph={{rows: 2}} style={{ marginTop: 12 }}/>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (carouselItems.length === 0) {
        return (
            <div style={{marginTop: 48}}>
                <Divider orientation="left">
                    <Title level={4} style={{ color: token.colorText }}>{title}</Title>
                </Divider>
                <Empty 
                    description="No related products found"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        border: `1px solid ${token.colorBorderSecondary}`,
                        padding: token.paddingLG
                    }}
                />
            </div>
        );
    }

    return (
        <div style={{marginTop: 48}}>
            <Divider orientation="left">
                <Title level={4} style={{ color: token.colorText, marginBottom: 24 }}>{title}</Title>
            </Divider>

            <Carousel
                autoplay
                dots={true}
                autoplaySpeed={5000}
                slidesToShow={4}
                slidesToScroll={1}
                responsive={[
                    {
                        breakpoint: 1400,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 1,
                        },
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                        },
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        },
                    },
                ]}
                style={{padding: "0 12px"}}
            >
                {carouselItems.map((product) => (
                    <div key={product.id} style={{padding: "0 8px"}}>
                        <Link to={ROUTES.PRODUCT_DETAILS.replace(':id', product.id)} style={{textDecoration: 'none', display: 'block', height: '100%'}}>
                            <Card
                                hoverable
                                style={{
                                    height: 320,
                                    display: "flex",
                                    flexDirection: "column",
                                    overflow: 'hidden',
                                    borderRadius: 12,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    background: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorderSecondary}`,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: 'translateY(0)',
                                }}
                                styles={{ 
                                    body: { 
                                        padding: '12px',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                }}
                                cover={
                                    <div
                                        style={{
                                            paddingTop: '60%',
                                            position: 'relative',
                                            backgroundColor: token.colorFillQuaternary,
                                            overflow: 'hidden',
                                            borderRadius: '12px 12px 0 0'
                                        }}
                                    >
                                        <img 
                                            alt={product.title} 
                                            src={product.imageUrl || 'https://via.placeholder.com/280x168?text=No+Image&bg=2d2d2d&color=888'} 
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease'
                                            }} 
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        />
                                        {product.stock === 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'rgba(0,0,0,0.7)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>
                                }
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    color: token.colorText
                                }}>
                                    {product.categories.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 4,
                                            marginBottom: 8
                                        }}>
                                            {product.categories.slice(0, 2).map(cat => (
                                                <Tag
                                                    key={cat.id}
                                                    color="processing"
                                                    style={{ 
                                                        margin: 0, 
                                                        fontSize: '9px',
                                                        borderRadius: '4px',
                                                        border: 'none',
                                                        background: token.colorPrimaryBg,
                                                        color: token.colorPrimary,
                                                        padding: '1px 4px'
                                                    }}
                                                >
                                                    {cat.categoryName}
                                                </Tag>
                                            ))}
                                            {product.categories.length > 2 && (
                                                <Tag 
                                                    style={{ 
                                                        margin: 0, 
                                                        fontSize: '9px',
                                                        borderRadius: '4px',
                                                        background: token.colorFillSecondary,
                                                        color: token.colorTextSecondary,
                                                        border: 'none',
                                                        padding: '1px 4px'
                                                    }}
                                                >
                                                    +{product.categories.length - 2}
                                                </Tag>
                                            )}
                                        </div>
                                    )}

                                    <Title
                                        level={5}
                                        style={{
                                            margin: 0,
                                            lineHeight: 1.3,
                                            color: token.colorText,
                                            marginBottom: 8,
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            minHeight: '32px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                        title={product.title}
                                    >
                                        {product.title}
                                    </Title>

                                    <div style={{ marginTop: 'auto' }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: token.colorPrimary,
                                                display: 'block',
                                                marginBottom: 8
                                            }}
                                        >
                                            ${product.price.toFixed(2)}
                                        </Text>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <Text
                                                type={product.stock > 0 ? 'success' : 'danger'}
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 600,
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    background: product.stock > 0 ? token.colorSuccessBg : token.colorErrorBg,
                                                    color: product.stock > 0 ? token.colorSuccess : token.colorError,
                                                    border: `1px solid ${product.stock > 0 ? token.colorSuccessBorder : token.colorErrorBorder}`
                                                }}
                                            >
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}; 