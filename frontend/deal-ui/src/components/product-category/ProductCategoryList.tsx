import React from 'react';
import { Card, Button, Form, Input, Space, Tooltip, Typography, theme, Empty, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProductCategory } from '../../types/entities';

const { Title } = Typography;

interface ProductCategoryListProps {
  productCategories: ProductCategory[];
  loading: boolean;
  editingProductCategoryId: string | null;
  onUpdate: (productCategory: ProductCategory) => void;
  onDelete: (id: string) => void;
  onStartEdit: (productCategory: ProductCategory) => void;
  onCancelEdit: () => void;
  updateForm: any; // Form instance type
}

const ProductCategoryList: React.FC<ProductCategoryListProps> = ({
  productCategories,
  loading,
  editingProductCategoryId,
  onUpdate,
  onDelete,
  onStartEdit,
  onCancelEdit,
  updateForm,
}) => {
  const { token } = theme.useToken();

  const handleUpdateFinish = (values: { categoryName: string }) => {
    if (editingProductCategoryId) {
      onUpdate({ id: editingProductCategoryId, categoryName: values.categoryName });
    }
  };

  const cardStyle = {
    width: "100%",
    background: token.colorBgContainer,
    border: `1px solid ${token.colorBorder}`,
    boxShadow: token.boxShadowSecondary,
    borderRadius: token.borderRadiusLG,
    padding: "12px 16px",
    minHeight: "60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (productCategories.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '24px' }}>
        <Empty 
          description="No product categories found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <p style={{ marginTop: '12px' }}>Add a new product category to get started</p>
      </Card>
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      {productCategories.map((productCategory) => (
        <Card
          key={productCategory.id}
          style={cardStyle}
          actions={[
            <div key="button-container" style={{ width: "100%", padding: "10px" }}>
              <Space size="middle">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => onStartEdit(productCategory)}
                  disabled={editingProductCategoryId === productCategory.id}
                  type="default"
                >
                  Update
                </Button>
                <Tooltip
                  title={false ? "This category is in use and cannot be deleted" : null}
                  // TODO: Replace 'false' with actual 'isUsed' property when available from the API
                >
                  <span>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => onDelete(productCategory.id)}
                      disabled={false} // TODO: Replace with 'isUsed' property when available from the API
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
              onFinish={handleUpdateFinish}
              style={{ marginTop: 16, width: '100%' }}
            >
              <Form.Item
                name="categoryName"
                label="Category Name"
                rules={[{ required: true, message: 'Please enter a category name' }]}
              >
                <Input />
              </Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">Save</Button>
                <Button onClick={onCancelEdit}>Cancel</Button>
              </Space>
            </Form>
          ) : (
            <Typography.Text strong>{productCategory.categoryName}</Typography.Text>
          )}
        </Card>
      ))}
    </Space>
  );
};

export default ProductCategoryList; 