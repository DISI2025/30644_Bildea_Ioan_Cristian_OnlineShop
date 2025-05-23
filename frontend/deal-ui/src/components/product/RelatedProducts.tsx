import React, {useEffect, useState} from 'react';
import {Button, Card, Carousel, Divider, Empty, Image, Skeleton, Space, Typography} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import {Product} from '../../types/entities';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from '../../routes/AppRouter';

const {Title, Text} = Typography;

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
                    <Title level={4}>{title}</Title>
                </Divider>
                <div style={{display: 'flex', gap: 16}}>
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} style={{width: 240, marginRight: 16}}>
                            <Skeleton.Image active style={{width: '100%', height: 180}}/>
                            <Skeleton active paragraph={{rows: 1}}/>
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
                    <Title level={4}>{title}</Title>
                </Divider>
                <Empty description="No related products found"/>
            </div>
        );
    }

    return (
        <div style={{marginTop: 48}}>
            <Divider orientation="left">
                <Title level={4}>{title}</Title>
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
                        <Card
                            hoverable
                            style={{
                                height: 375,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                            cover={
                                <Image
                                    alt={product.title}
                                    src={product.imageUrl}
                                    style={{height: 200, objectFit: "cover"}}
                                    preview={false}
                                />
                            }
                        >
                            <Space
                                direction="vertical"
                                size={3}
                                style={{
                                    padding: "0 8px",
                                    width: "100%",
                                    marginBottom: 8,
                                }}
                            >
                                <Title level={5} style={{margin: 0}} ellipsis={{rows: 2}}>
                                    {product.title}
                                </Title>
                                <Text strong>${product.price.toFixed(2)}</Text>
                            </Space>

                            <div style={{padding: "0 8px"}}>
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => navigate(ROUTES.PRODUCT_DETAILS.replace(':id', product.id))}
                                    icon={<ArrowRightOutlined/>}
                                >
                                    View Details
                                </Button>
                            </div>
                        </Card>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}; 