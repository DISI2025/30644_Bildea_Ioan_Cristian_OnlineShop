import React from 'react';
import { Button, Card, Form, Input, Row, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CreateProductCategoryRequest } from '../../types/transfer';

interface ProductCategoryAddProps {
  isAddPanelOpen: boolean;
  toggleAddPanel: () => void;
  onFinish: (values: CreateProductCategoryRequest) => void;
  form: any; // Form instance type
}

const ProductCategoryAdd: React.FC<ProductCategoryAddProps> = ({
  isAddPanelOpen,
  toggleAddPanel,
  onFinish,
  form,
}) => {
  const { token } = theme.useToken();

  const cardStyle = {
    border: `1px solid ${token.colorBorder}`,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    marginBottom: '2rem'
  };

  return (
    <Card style={cardStyle}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={toggleAddPanel}
      >
        Add Product Category
      </Button>

      {isAddPanelOpen && (
        <div style={{ marginTop: 20 }}>
          <Form 
            layout="vertical" 
            form={form} 
            onFinish={onFinish}
            initialValues={{ categoryName: '' }}
          >
            <Form.Item
              name="categoryName"
              label="Category Name"
              rules={[
                { required: true, message: 'Please enter a category name' },
                { min: 2, message: 'Category name must be at least 2 characters' },
                { max: 50, message: 'Category name cannot exceed 50 characters' }
              ]}
            >
              <Input placeholder="Enter category name" />
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
  );
};

export default ProductCategoryAdd; 