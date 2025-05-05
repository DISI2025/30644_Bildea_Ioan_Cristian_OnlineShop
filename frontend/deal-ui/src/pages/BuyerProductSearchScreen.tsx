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

const { Title } = Typography;
const { Search } = Input;

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
}

const hardcodedProducts: Product[] = [
    { id: "1", name: "AlphaWidget", description: "High-efficiency gadget", category: "Electronics" },
    { id: "2", name: "BetaTool", description: "Lightweight tool", category: "Hardware" },
    { id: "3", name: "GammaDevice", description: "Advanced device", category: "Electronics" },
    { id: "4", name: "OmegaGadget", description: "Reliable gadget", category: "Gadgets" },
];

const uniqueCategories = [...new Set(hardcodedProducts.map((p) => p.category))];

export default function BuyerProductSearchScreen() {
    const { token } = theme.useToken();
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    const filteredProducts = useMemo(() => {
        let results = hardcodedProducts.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        if (sortOrder) {
            results = [...results].sort((a, b) =>
                sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
        }

        return results;
    }, [searchText, selectedCategory, sortOrder]);

    const handleAddToCart = (productId: string) => {
        console.log(`Product ${productId} added to cart`);
        // Here you would typically implement cart functionality
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Title level={2} style={{ textAlign: "center" }}>Search & Filter Products</Title>

            {/* Top Search Bar */}
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

            {/* Main content with filter panel and product list */}
            <div style={{ display: "flex" }}>
                {/* Left Panel: Filters + Sort */}
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
                            placeholder="Sort by name"
                            allowClear
                            onChange={(value) => setSortOrder(value || null)}
                        >
                            <Select.Option value="asc">Name Ascending (A → Z)</Select.Option>
                            <Select.Option value="desc">Name Descending (Z → A)</Select.Option>
                        </Select>
                    </Space>
                </div>

                {/* Vertical Divider with enhanced visibility */}
                <div style={{
                    width: "2px",
                    backgroundColor: token.colorBorder,
                    margin: "0 16px",
                    minHeight: "100%"
                }} />

                {/* Right Panel: Products */}
                <div style={{ flex: 1 }}>
                    <Space direction="vertical" style={{ width: "100%" }} size={16}>
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                title={product.name}
                                bordered
                                style={{
                                    width: "100%",
                                    background: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    boxShadow: token.boxShadowSecondary,
                                }}
                                actions={[
                                    <div key="button-container" style={{ display: "flex", width: "100%", padding: "10px" }}>
                                        <Button
                                            style={{ flex: "1", margin: "0 4px 0 0" }}
                                            onClick={() => console.log(`Viewing details for product ${product.id}`)}
                                        >
                                            View More
                                        </Button>
                                        <Button
                                            style={{ flex: "1", margin: "0 0 0 4px" }}
                                            type="primary"
                                            onClick={() => handleAddToCart(product.id)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                ]}
                            >
                                <p><strong>Description:</strong> {product.description}</p>
                                <p><strong>Category:</strong> {product.category}</p>
                            </Card>
                        ))}
                    </Space>
                </div>
            </div>
        </div>
    );
}