import {
    Row,
    Col,
    Card,
    Typography,
    Divider,
    Carousel,
    Image,
    Tag,
    Button,
    Space, Rate,
} from "antd";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Navbar } from "../components/common/Navbar";
import { useState, useRef } from "react";

const { Title, Text, Paragraph } = Typography;

const mockProduct = {
    id: 123,
    user_id: 1,
    category_id: 10,
    title: "Wireless Headphones",
    description: "High quality wireless headphones with noise cancellation and long battery life.",
    price: 199.99,
    stock: 25,
    image_url: "https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg",
    created_at: "2024-05-01T12:00:00Z",
};

const otherProducts = [
    {
        id: 101,
        user_id: 1,
        category_id: 10,
        title: "Bluetooth Speaker",
        description: "Portable speaker with excellent sound.",
        price: 49.99,
        stock: 40,
        image_url: "https://img.freepik.com/premium-photo/3d-illustration-realistic-black-wireless-headphones-isolated-black-background-pink-blue-neon-light_116124-4168.jpg",
        created_at: "2024-05-05T08:30:00Z",
    },
    {
        id: 102,
        user_id: 1,
        category_id: 10,
        title: "Smart Watch",
        description: "Smart watch with fitness tracking and notifications.",
        price: 99.99,
        stock: 15,
        image_url: "https://cdn.mos.cms.futurecdn.net/uTNpFJgnqqvZjKsq8WsfY7.jpg",
        created_at: "2024-05-06T10:20:00Z",
    },
    {
        id: 103,
        user_id: 1,
        category_id: 10,
        title: "Wireless Charger",
        description: "Fast wireless charger compatible with all Qi devices.",
        price: 29.99,
        stock: 60,
        image_url: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
        created_at: "2024-05-07T09:10:00Z",
    },
    {
        id: 104,
        user_id: 1,
        category_id: 10,
        title: "USB-C Hub",
        description: "Multifunctional USB-C hub for your laptop or tablet.",
        price: 39.99,
        stock: 30,
        image_url: "https://img.kentfaith.com/cache/catalog/products/us/KF01.0001/KF01.0001-1-800x800.jpg",
        created_at: "2024-05-08T11:45:00Z",
    },
];

export default function ProductDetailPage() {
    const [quantity, setQuantity] = useState(1);
    const cardRef = useRef<HTMLDivElement>(null);

    const increaseQty = () => setQuantity((prev) => Math.min(prev + 1, 99));
    const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

    return (
        <>
            <Navbar />

            <div style={{ padding: "24px" }}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={10}>
                        <Card bordered={false} style={{ height: "100%" }}>
                            <Image
                                src={mockProduct.image_url}
                                alt={mockProduct.title}
                                width="100%"
                                style={{
                                    height: "100%",
                                    objectFit: "cover",
                                    maxHeight: 425,
                                }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} md={14}>
                        <Card bordered={false} ref={cardRef} style={{ height: "100%" }}>
                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                <Title level={2} style={{ marginBottom: 0 }}>{mockProduct.title}</Title>
                                <Text type="secondary">by {mockProduct.user_id}</Text>
                                ///TODO FETCH PENTRU NUMELE SELLERULUI

                                <Tag color="blue">{mockProduct.category_id}</Tag>
                                ///TODO FETCH PENTRU categorie

                                <Paragraph>{mockProduct.description}</Paragraph>

                                <Text strong style={{ fontSize: "18px" }}>
                                    Price: ${mockProduct.price.toFixed(2)}
                                </Text>

                                <Space direction="vertical" size={4}>
                                    <Rate disabled defaultValue={4.5} />
                                    <Text type="secondary">(123 reviews)</Text>
                                </Space>

                                <Space wrap>
                                    <Tag color="green">30-Day Return</Tag>
                                    <Tag color="gold">2-Year Warranty</Tag>
                                </Space>

                                <Text type="secondary">Free shipping • Arrives in 2-4 business days</Text>

                                <Divider />

                                <Space size="large" align="center">
                                    <Space>
                                        <Button icon={<MinusOutlined />} onClick={decreaseQty} />
                                        <Text>{quantity}</Text>
                                        <Button icon={<PlusOutlined />} onClick={increaseQty} />
                                    </Space>
                                    <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
                                        Add to Cart
                                    </Button>
                                </Space>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Divider orientation="left" style={{ marginTop: 48 }}>
                    <Title level={4}>From the same seller</Title>
                </Divider>

                <Carousel
                    autoplay
                    dots={false}
                    slidesToShow={4}
                    slidesToScroll={1}
                    style={{ padding: "0 12px" }}
                >
                    {otherProducts.map((product) => (
                        <div key={product.id} style={{ padding: "0 8px" }}>
                            <Card
                                hoverable
                                style={{
                                    width: "90%",
                                    height: 375,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                                cover={
                                    <Image
                                        alt={product.title}
                                        src={product.image_url}
                                        style={{ height: 200, objectFit: "cover" }}
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
                                    <Title level={5} style={{ margin: 0 }}>
                                        {product.title}
                                    </Title>
                                    <Text strong>${product.price.toFixed(2)}</Text>
                                </Space>

                                <div style={{ padding: "0 8px" }}>
                                    <Button type="primary" block>
                                        View More
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </Carousel>
            </div>
        </>
    );
}
