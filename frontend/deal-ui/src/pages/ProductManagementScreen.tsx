import { useState } from "react";
import {
    Button,
    Typography,
    Space,
    Form,
    Input,
    Row,
    theme,
    Card,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

interface Product {
    id: string;
    name: string;
    description: string;
}

interface ProductFormValues {
    name: string;
    description: string;
}

export default function ProductManagerScreen() {
    const { token } = theme.useToken();
    const [form] = Form.useForm<ProductFormValues>();
    const [updateForm] = Form.useForm<ProductFormValues>();

    const [isAddPanelOpen, setAddPanelOpen] = useState<boolean>(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'AlphaWidget', description: 'High-efficiency gadget for daily use' },
        { id: '2', name: 'BetaTool', description: 'Lightweight, multi-functional tool' },
    ]);

    const toggleAddPanel = (): void => setAddPanelOpen(!isAddPanelOpen);

    const onFinish = (values: ProductFormValues): void => {
        const newProduct: Product = {
            id: String(products.length + 1),
            name: values.name,
            description: values.description,
        };
        setProducts((prev) => [...prev, newProduct]);
        form.resetFields();
        setAddPanelOpen(false);
    };

    const startEditProduct = (product: Product): void => {
        setEditingProductId(product.id);
        updateForm.setFieldsValue(product);
    };

    const cancelEdit = (): void => {
        setEditingProductId(null);
        updateForm.resetFields();
    };

    const updateProduct = (values: ProductFormValues): void => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === editingProductId
                    ? { ...product, ...values }
                    : product
            )
        );
        setEditingProductId(null);
    };

    const deleteProduct = (id: string): void => {
        setProducts((prev) => prev.filter((product) => product.id !== id));
    };

    const cardStyle = {
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'left' }}>
            <Title level={2}>Create a New Product</Title>

            <Card style={{ ...cardStyle, marginBottom: '2rem' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={toggleAddPanel}
                >
                    Add Product
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
                            <Form.Item
                                name="description"
                                label="Product Description"
                                rules={[{ required: true, message: 'Please enter a description' }]}
                            >
                                <Input.TextArea placeholder="Enter description" rows={4} />
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

            <Title level={2}>Your Products</Title>

            <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {products.map((product) => (
                    <Card
                        key={product.id}
                        style={{ ...cardStyle }}
                        title={product.name}
                        extra={
                            <Space>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => startEditProduct(product)}
                                    disabled={editingProductId === product.id}
                                    type="default"
                                >
                                    Update
                                </Button>
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => deleteProduct(product.id)}
                                    danger
                                >
                                    Delete
                                </Button>
                            </Space>
                        }
                    >
                        <div style={{ color: token.colorTextSecondary }}>
                            {product.description}
                        </div>

                        {editingProductId === product.id && (
                            <div style={{ marginTop: 20 }}>
                                <Form layout="vertical" form={updateForm} onFinish={updateProduct}>
                                    <Form.Item
                                        name="name"
                                        label="Product Name"
                                        rules={[{ required: true, message: 'Please enter a product name' }]}
                                    >
                                        <Input placeholder="Enter product name" />
                                    </Form.Item>
                                    <Form.Item
                                        name="description"
                                        label="Product Description"
                                        rules={[{ required: true, message: 'Please enter a description' }]}
                                    >
                                        <Input.TextArea placeholder="Enter description" rows={4} />
                                    </Form.Item>
                                    <Row>
                                        <Button type="primary" htmlType="submit">
                                            Save Changes
                                        </Button>
                                        <Button onClick={cancelEdit} style={{ marginLeft: 8 }}>
                                            Cancel
                                        </Button>
                                    </Row>
                                </Form>
                            </div>
                        )}
                    </Card>
                ))}
            </Space>
        </div>
    );
}
