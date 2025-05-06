import { useState } from "react";
import {
    Button,
    Typography,
    Space,
    Form,
    Input,
    InputNumber,
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
    title: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    created_at: string;
}

interface ProductFormValues {
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
}

export default function ProductManagerScreen() {
    const { token } = theme.useToken();
    const [form] = Form.useForm<ProductFormValues>();
    const [updateForm] = Form.useForm<ProductFormValues>();

    const [isAddPanelOpen, setAddPanelOpen] = useState<boolean>(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    const [products, setProducts] = useState<Product[]>([]);

    const toggleAddPanel = (): void => setAddPanelOpen(!isAddPanelOpen);

    const onFinish = (values: ProductFormValues): void => {
        const newProduct: Product = {
            id: String(Date.now()),
            title: values.name,
            description: values.description,
            price: values.price,
            stock: values.stock,
            image_url: values.image_url,
            created_at: new Date().toISOString(),
        };
        setProducts((prev) => [...prev, newProduct]);
        form.resetFields();
        setAddPanelOpen(false);
    };

    const startEditProduct = (product: Product): void => {
        setEditingProductId(product.id);
        updateForm.setFieldsValue({
            name: product.title,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image_url: product.image_url,
        });
    };

    const cancelEdit = (): void => {
        setEditingProductId(null);
        updateForm.resetFields();
    };

    const updateProduct = (values: ProductFormValues): void => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === editingProductId
                    ? {
                        ...product,
                        title: values.name,
                        description: values.description,
                        price: values.price,
                        stock: values.stock,
                        image_url: values.image_url,
                    }
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
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Product Description"
                                rules={[{ required: true, message: 'Please enter a description' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[{ required: true, message: 'Please enter a price' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                name="stock"
                                label="Stock"
                                rules={[{ required: true, message: 'Please enter a stock amount' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                name="image_url"
                                label="Image URL"
                                rules={[{ required: true, message: 'Please enter an image URL' }]}
                            >
                                <Input />
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
                        style={cardStyle}
                        title={product.title}
                        extra={
                            <Space>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => startEditProduct(product)}
                                    disabled={editingProductId === product.id}
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
                        <p><strong>Description:</strong> {product.description}</p>
                        <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                        <p>
                            <strong>Stock:</strong> {product.stock}{' '}
                        </p>
                        {product.image_url && (
                            <img
                                src={product.image_url}
                                alt={product.title}
                                style={{ maxWidth: '100%', height: 150, objectFit: 'cover' }}
                            />
                        )}
                        <p><strong>Created At:</strong> {new Date(product.created_at).toLocaleString()}</p>

                        {editingProductId === product.id && (
                            <div style={{ marginTop: 20 }}>
                                <Form layout="vertical" form={updateForm} onFinish={updateProduct}>
                                    <Form.Item
                                        name="name"
                                        label="Product Name"
                                        rules={[{ required: true, message: 'Please enter a product name' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="description"
                                        label="Product Description"
                                        rules={[{ required: true, message: 'Please enter a description' }]}
                                    >
                                        <Input.TextArea rows={3} />
                                    </Form.Item>
                                    <Form.Item
                                        name="price"
                                        label="Price"
                                        rules={[{ required: true, message: 'Please enter a price' }]}
                                    >
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="stock"
                                        label="Stock"
                                        rules={[{ required: true, message: 'Please enter stock amount' }]}
                                    >
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="image_url"
                                        label="Image URL"
                                        rules={[{ required: true, message: 'Please enter an image URL' }]}
                                    >
                                        <Input />
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
