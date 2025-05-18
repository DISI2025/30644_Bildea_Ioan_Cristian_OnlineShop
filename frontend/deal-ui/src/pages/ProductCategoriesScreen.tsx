import {useMemo, useState} from "react";
import {Button, Card, Col, Form, Input, Row, Select, Space, theme, Tooltip, Typography,} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

interface ProductCategory {
    id: string;
    name: string;
    isUsed: boolean;
}

interface ProductCategoryFormValues {
    name: string;
}

export default function ProductCategoriesScreen() {
    const { token } = theme.useToken();
    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    const [form] = Form.useForm<ProductCategoryFormValues>();
    const [updateForm] = Form.useForm<ProductCategoryFormValues>();

    const [isAddPanelOpen, setAddPanelOpen] = useState<boolean>(false);
    const [editingProductCategoryId, setEditingProductCategoryId] = useState<string | null>(null);

    const [productCategories, setProductCategories] = useState<ProductCategory[]>([
        { id: "1", name: "TV", isUsed: true},
        { id: "2", name: "BetaTool", isUsed: false },
        { id: "3", name: "GammaDevice", isUsed: true },
        { id: "4", name: "OmegaGadget", isUsed: false },
    ]);

    const toggleAddPanel = (): void => setAddPanelOpen(!isAddPanelOpen);

    const onFinish = (values: ProductCategoryFormValues): void => {
        const newProductCategory: ProductCategory = {
            id: String(productCategories.length + 1),
            name: values.name,
            isUsed: false,
        };
        setProductCategories((prev) => [...prev, newProductCategory]);
        form.resetFields();
        setAddPanelOpen(false);
    };

    const startEditProductCategory = (product: ProductCategory): void => {
        setEditingProductCategoryId(product.id);
        updateForm.setFieldsValue(product);
    };

    const cancelEditProductCategory = (): void => {
        setEditingProductCategoryId(null);
        updateForm.resetFields();
    };

    const updateProductCategory = (values: ProductCategoryFormValues): void => {
        setProductCategories((prev) =>
            prev.map((productCategory) =>
                productCategory.id === editingProductCategoryId
                    ? { ...productCategory, ...values }
                    : productCategory
            )
        );
        setEditingProductCategoryId(null);
    };

    const deleteProduct = (id: string): void => {
        setProductCategories((prev) => prev.filter((productCategory) => productCategory.id !== id));
    };

    const cardStyle = {
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    const filteredProductCategories = useMemo(() => {
        let results = productCategories.filter((productCategory) => {
            return productCategory.name.toLowerCase().includes(searchText.toLowerCase());
        });

        if (sortOrder) {
            results = [...results].sort((a, b) =>
                sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
        }

        return results;
    }, [productCategories, searchText, sortOrder]);

    return (
        <div style={{ padding: "2rem" }}>
            <Title level={2} style={{ textAlign: "center" }}>Manage Product Categories</Title>

            <Row justify="center" style={{ marginBottom: "2rem" }}>
                <Col xs={24} sm={22} md={20} lg={16}>
                    <Search
                        placeholder="Search product categories by name"
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
                            placeholder="Sort by name"
                            allowClear
                            onChange={(value) => setSortOrder(value || null)}
                        >
                            <Select.Option value="asc">Name Ascending (A → Z)</Select.Option>
                            <Select.Option value="desc">Name Descending (Z → A)</Select.Option>
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

                    <Card style={{ ...cardStyle, marginBottom: '2rem' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={toggleAddPanel}
                        >
                            Add Product Category
                        </Button>

                        {isAddPanelOpen && (
                            <div style={{ marginTop: 20 }}>
                                <Form layout="vertical" form={form} onFinish={onFinish}>
                                    <Form.Item
                                        name="name"
                                        label="Product Name"
                                        rules={[{ required: true, message: 'Please enter a product name' }]}
                                    >
                                        <Input placeholder="Enter product name" />
                                    </Form.Item>
                                    <Row>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                        <Button onClick={toggleAddPanel} style={{ marginLeft: 8 }}>
                                            Cancel
                                        </Button>
                                    </Row>
                                </Form>
                            </div>
                        )}
                    </Card>

                    <Space direction="vertical" style={{ width: "100%" }} size={16}>
                        {filteredProductCategories.map((productCategory) => (
                            <Card
                                key={productCategory.id}
                                style={{
                                    width: "100%",
                                    background: token.colorBgContainer,
                                    border: `1px solid ${token.colorBorder}`,
                                    boxShadow: token.boxShadowSecondary,
                                    borderRadius: token.borderRadiusLG,
                                    padding: "12px 16px",
                                    minHeight: "60px", // smaller height
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                                actions={[
                                    <div key="button-container" style={{width: "100%", padding: "10px"}}>
                                        <Space size="middle">
                                            <Button
                                                icon={<EditOutlined/>}
                                                onClick={() => startEditProductCategory(productCategory)}
                                                disabled={editingProductCategoryId === productCategory.id}
                                                type="default"
                                            >
                                                Update
                                            </Button>
                                            <Tooltip
                                                title={productCategory.isUsed ? "This category is in use and cannot be deleted" : null}
                                            >
                                              <span>
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => deleteProduct(productCategory.id)}
                                                    disabled={productCategory.isUsed}
                                                    danger
                                                >
                                                  Delete
                                                </Button>
                                              </span>
                                            </Tooltip>
                                        </Space>
                                    </div>
                                ]}
                            >
                                {editingProductCategoryId === productCategory.id ? (
                                    <Form
                                        layout="vertical"
                                        form={updateForm}
                                        onFinish={updateProductCategory}
                                        style={{marginTop: 16}}
                                    >
                                        <Form.Item
                                            name="name"
                                            label="Product Name"
                                            rules={[{ required: true, message: 'Please enter a product name' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Space>
                                            <Button type="primary" htmlType="submit">Save</Button>
                                            <Button onClick={cancelEditProductCategory}>Cancel</Button>
                                        </Space>
                                    </Form>
                                ) : (
                                    <p>{productCategory.name}</p>
                                )}
                            </Card>
                        ))}
                    </Space>

                </div>
            </div>
        </div>
    );
}