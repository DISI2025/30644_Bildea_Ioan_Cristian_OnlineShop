import React from 'react';
import { Form, Input, Button, Select, Tag, Typography, Space, Row, Col, Divider, Collapse, Alert, Card } from 'antd';
import { UserProfile } from '../Profile';
import { sellerInfoRules } from '../../../utils/validators';

const { Text, Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

interface SellerInfoProps {
  profileData: UserProfile;
  categories: { id: number; name: string }[];
  isEditing: boolean;
  canEditSellerInfo: boolean;
  saving: boolean;
  form: any;
  handleEdit: () => void;
  handleCancel: () => void;
}

const SellerInfo: React.FC<SellerInfoProps> = ({
  profileData,
  categories,
  isEditing,
  canEditSellerInfo,
  saving,
  form,
  handleEdit,
  handleCancel,
}) => {
  return (
    <Card
      className="seller-info-card"
      style={{ 
        width: '100%',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}
    >
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col xs={24}>
          {isEditing && canEditSellerInfo ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                preferredLocations: profileData.sellerInfo?.preferredLocations?.join(', '),
                preferredCourier: profileData.sellerInfo?.preferredCourier,
                productCategories: profileData.sellerInfo?.productCategories,
              }}
              style={{ width: '100%' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="preferredLocations"
                    label="Preferred Locations"
                    help="Enter locations separated by commas"
                    rules={sellerInfoRules.preferredLocations}
                  >
                    <Input placeholder="Cluj-Napoca, Bucharest, ..." />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="preferredCourier"
                    label="Preferred Courier"
                    rules={sellerInfoRules.preferredCourier}
                  >
                    <Input placeholder="Fan Courier, DHL, ..." />
                  </Form.Item>
                </Col>
                
                <Col xs={24}>
                  <Form.Item
                    name="productCategories"
                    label="Product Categories"
                    rules={sellerInfoRules.productCategories}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select product categories"
                      style={{ width: '100%' }}
                    >
                      {categories.map(category => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={saving}
                    style={{ 
                      backgroundColor: '#1890ff',
                      borderColor: '#1890ff'
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <div style={{ width: '100%' }}>
              <Title level={5} style={{ marginBottom: '16px', color: '#434343' }}>Seller Details</Title>
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <div className="info-item" style={{ marginBottom: '16px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '4px', color: '#595959' }}>Preferred Locations</Text>
                    <Text style={{ fontSize: '16px' }}>
                      {profileData.sellerInfo?.preferredLocations?.length
                        ? profileData.sellerInfo.preferredLocations.join(', ')
                        : 'None specified'}
                    </Text>
                  </div>
                </Col>
                
                <Col xs={24} md={12}>
                  <div className="info-item" style={{ marginBottom: '16px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '4px', color: '#595959' }}>Preferred Courier</Text>
                    <Text style={{ fontSize: '16px' }}>
                      {profileData.sellerInfo?.preferredCourier || 'None specified'}
                    </Text>
                  </div>
                </Col>
                
                <Col xs={24}>
                  <div className="info-item" style={{ marginBottom: '16px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '4px', color: '#595959' }}>Product Categories</Text>
                    <div style={{ marginTop: 8 }}>
                      {profileData.sellerInfo?.productCategories?.length
                        ? profileData.sellerInfo.productCategories.map(catId => {
                            const category = categories.find(c => c.id === catId);
                            return category ? (
                              <Tag color="blue" key={catId} style={{ margin: '0 4px 4px 0', padding: '4px 8px' }}>
                                {category.name}
                              </Tag>
                            ) : null;
                          })
                        : 'None specified'}
                    </div>
                  </div>
                </Col>
              </Row>
              
              {canEditSellerInfo && (
                <Button 
                  type="primary" 
                  onClick={handleEdit} 
                  style={{ 
                    marginTop: 16,
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff'
                  }}
                >
                  Edit Seller Information
                </Button>
              )}

              <Divider style={{ margin: '24px 0' }} />
              
              <Card
                title={<Text strong style={{ fontSize: '16px' }}>Seller Products</Text>}
                style={{ 
                  width: '100%',
                  borderRadius: '6px',
                  marginTop: '16px'
                }}
              >
                <Alert
                  message="Product Management"
                  description={
                    <div>
                      <p>This feature will be integrated in a future task.</p>
                      <p>Here you will be able to:</p>
                      <ul style={{ paddingLeft: '20px' }}>
                        <li>View all your products</li>
                        <li>Add new products</li>
                        <li>Edit existing products</li>
                        <li>Remove products from your listing</li>
                      </ul>
                      <Button 
                        type="primary" 
                        disabled
                        style={{ 
                          marginTop: '12px',
                          backgroundColor: '#1890ff',
                          borderColor: '#1890ff'
                        }}
                      >
                        Manage Products (Coming Soon)
                      </Button>
                    </div>
                  }
                  type="info"
                  showIcon
                  style={{ background: 'rgba(24, 144, 255, 0.1)', border: 'none' }}
                />
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default SellerInfo; 