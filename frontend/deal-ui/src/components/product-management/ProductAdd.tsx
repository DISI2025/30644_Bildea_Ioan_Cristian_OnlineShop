import React from 'react';
import { Card, Button, Form, Input, InputNumber, Select, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { CreateProductRequest, ProductFormData } from '../../types/transfer';
import { ProductCategory } from '../../types/entities';

const { Title } = Typography;

interface ProductAddProps {
    isAddPanelOpen: boolean;
    toggleAddPanel: () => void;
    onFinish: (values: ProductFormData) => Promise<void>;
    form: FormInstance;
    productCategories: ProductCategory[];
}

const ProductAdd: React.FC<ProductAddProps> = ({
    isAddPanelOpen,
    toggleAddPanel,
    onFinish,
    form,
    productCategories
}) => {
    return (
        <Card 
            title={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={toggleAddPanel}
                >
                    {isAddPanelOpen ? 'Cancel' : 'Add New Product'}
                </Button>
            }
            style={{ marginBottom: '1rem' }}
        >
            {isAddPanelOpen && (
                <div>
                    <Title level={4}>Create New Product</Title>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="title"
                            label="Product Name"
                            rules={[{ required: true, message: 'Please enter product name' }]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                        
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter product description' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Enter product description" />
                        </Form.Item>
                        
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[{ required: true, message: 'Please enter product price' }]}
                        >
                            <InputNumber 
                                min={0} 
                                step={0.01} 
                                style={{ width: '100%' }} 
                                placeholder="Enter price" 
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                        
                        <Form.Item
                            name="stock"
                            label="Stock"
                            rules={[{ required: true, message: 'Please enter stock amount' }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Enter stock amount"
                            />
                        </Form.Item>
                        
                        <Form.Item
                            name="categories"
                            label="Categories"
                            rules={[{ required: true, message: 'Please select at least one category' }]}
                        >
                            <Select 
                                mode="multiple" 
                                placeholder="Select categories" 
                                showSearch
                                filterOption={(input, option) => 
                                    (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {productCategories.map(category => (
                                    <Select.Option key={category.id} value={category.categoryName}>
                                        {category.categoryName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        
                        <Form.Item
                            name="imageUrl"
                            label="Image URL"
                            rules={[{ required: true, message: 'Please enter image URL' }]}
                        >
                            <Input placeholder="Enter image URL" />
                        </Form.Item>
                        
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </Card>
    );
};

export default ProductAdd; 