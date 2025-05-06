import { useMemo, useState } from "react";
import {
    Typography,
    Input,
    Select,
    Row,
    Col,
    Card,
    theme,
    Space,
    Button,
} from "antd";

const { Title, Text } = Typography;
const { Search } = Input;

interface Product {
    id: string;
    name: string;
    category: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    created_at: string;
}

const hardcodedProducts: Product[] = [
    {
        id: "1", name: "AlphaWidget", description: "High-efficiency gadget", category: "Electronics",
        title: "Efficient Alpha Widget", price: 75, stock: 30,
        image_url: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", created_at: "2024-01-01"
    },
    {
        id: "2", name: "BetaTool", description: "Lightweight tool", category: "Hardware",
        title: "Compact Beta Tool", price: 65, stock: 30,
        image_url: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", created_at: "2024-02-15"
    },
    {
        id: "3", name: "GammaDevice", description: "Advanced device", category: "Electronics",
        title: "High-tech Gamma Device", price: 35, stock: 30,
        image_url: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", created_at: "2024-03-20"
    },
    {
        id: "4", name: "OmegaGadget", description: "Reliable gadget", category: "Gadgets",
        title: "Reliable Omega Gadget", price: 100, stock: 30,
        image_url: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", created_at: "2024-04-10"
    },
];

const uniqueCategories = [...new Set(hardcodedProducts.map((p) => p.category))];

export default function BuyerProductSearchScreen() {
    const { token } = theme.useToken();
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"name_asc" | "name_desc" | "price_asc" | "price_desc" | null>(null);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const filteredProducts = useMemo(() => {
        let results = hardcodedProducts.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        if (sortOrder) {
            results = [...results].sort((a, b) => {
                switch (sortOrder) {
                    case "name_asc":
                        return a.name.localeCompare(b.name);
                    case "name_desc":
                        return b.name.localeCompare(a.name);
                    case "price_asc":
                        return a.price - b.price;
                    case "price_desc":
                        return b.price - a.price;
                    default:
                        return 0;
                }
            });
        }

        return results;
    }, [searchText, selectedCategory, sortOrder]);


    const handleAddToCart = (productId: string) => {
        console.log(`Added ${quantities[productId] || 0} of product ${productId} to cart`);
    };

    const updateQuantity = (productId: string, delta: number) => {
        setQuantities((prev) => {
            const current = prev[productId] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [productId]: next };
        });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Title level={2} style={{ textAlign: "center" }}>Search & Filter Products</Title>

            <Row justify="center" style={{ marginBottom: "2rem" }}>
                <Col xs={24} sm={22} md={20} lg={16}>
                    <Search
                        placeholder="Search products by name"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
            </Row>

            <div style={{ display: "flex" }}>
                <div style={{ width: "250px" }}>
                    <Space direction="vertical" style={{ width: "100%" }} size="middle">
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Filter by category"
                            allowClear
                            onChange={(value) => setSelectedCategory(value || null)}
                        >
                            {uniqueCategories.map((category) => (
                                <Select.Option key={category} value={category}>
                                    {category}
                                </Select.Option>
                            ))}
                        </Select>

                        <Select
                            style={{ width: "100%" }}
                            placeholder="Sort by"
                            allowClear
                            onChange={(value) => setSortOrder(value || null)}
                        >
                            <Select.Option value="name_asc">Name Ascending (A → Z)</Select.Option>
                            <Select.Option value="name_desc">Name Descending (Z → A)</Select.Option>
                            <Select.Option value="price_asc">Price (Lowest to Highest)</Select.Option>
                            <Select.Option value="price_desc">Price (Highest to Lowest)</Select.Option>
                        </Select>

                    </Space>
                </div>

                <div style={{
                    width: "2px",
                    backgroundColor: token.colorBorder,
                    margin: "0 16px",
                    minHeight: "100%"
                }} />

                <div style={{ flex: 1 }}>
                    <Space direction="vertical" style={{ width: "100%" }} size={16}>
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                style={{
                                    width: "100%",
                                    background: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    boxShadow: token.boxShadowSecondary,
                                }}
                            >
                                <Row gutter={16}>
                                    {/* Left: Image full height */}
                                    <Col xs={24} sm={6}>
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "8px"
                                            }}
                                        />
                                    </Col>

                                    {/* Middle: Product Info */}
                                    <Col xs={24} sm={12}>
                                        <Space direction="vertical" style={{ width: "100%" }}>
                                            <Title level={4}>{product.name}</Title>
                                            <p><strong>Title:</strong> {product.title || "N/A"}</p>
                                            <p><strong>Description:</strong> {product.description}</p>
                                            <p><strong>Category:</strong> {product.category}</p>
                                            <p><strong>Price:</strong> ${product.price}</p>
                                        </Space>
                                    </Col>

                                    {/* Right: Actions */}
                                    <Col xs={24} sm={6} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <Button
                                            style={{ marginBottom: "8px" }}
                                            onClick={() => console.log(`Viewing details for product ${product.id}`)}
                                        >
                                            View More
                                        </Button>

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                                            <Button onClick={() => updateQuantity(product.id, -1)}>-</Button>
                                            <Text style={{padding: "0 5px"}}>{quantities[product.id] || 0}</Text>
                                            <Button onClick={() => updateQuantity(product.id, +1)}>-</Button>
                                        </div>

                                        <Button
                                            type="primary"
                                            onClick={() => handleAddToCart(product.id)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </Space>
                </div>
            </div>
        </div>
    );
}
