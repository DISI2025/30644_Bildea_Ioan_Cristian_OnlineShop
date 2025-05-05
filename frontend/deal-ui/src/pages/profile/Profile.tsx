import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Typography,
  Form,
  Spin,
  message,
  Tabs,
  Switch,
  Divider,
  Row,
  Col,
} from 'antd';
import BasicInfo from './components/BasicInfo';
import SellerInfo from './components/SellerInfo';
import BuyerInfo from './components/BuyerInfo';
import AdminInfo from './components/AdminInfo';

const { Title } = Typography;
const { Content, Footer } = Layout;

// Mock data types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string; // 'ADMIN', 'CUSTOMER'
  sellerInfo?: {
    preferredLocations?: string[];
    preferredCourier?: string;
    productCategories?: number[]; // IDs of product categories
  };
  buyerInfo?: {
    shippingAddress?: string;
    paymentMethod?: string; // 'creditCard', 'paypal', 'bankTransfer', 'cash'
  };
  categoriesId?: string;
  createdAt?: string;
}

// Mock user data generator
const getMockUserData = (userId: string): UserProfile => ({
  id: userId,
  username: 'user' + userId,
  email: `user${userId}@example.com`,
  role: 'CUSTOMER',
  sellerInfo: {
    preferredLocations: ['Cluj-Napoca', 'Bucharest'],
    preferredCourier: 'Fan Courier',
    productCategories: [1, 3, 5]
  },
  // Buyer info marked as TODO (will be implemented in another task)
  buyerInfo: {
    shippingAddress: 'TODO: Implement in another task',
    paymentMethod: 'TODO: Implement in another task'
  },
  categoriesId: '1,3,5',
  createdAt: '2023-05-15T10:30:00.000Z'
});

// Mock categories data
const mockCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Home & Garden' },
  { id: 4, name: 'Books' },
  { id: 5, name: 'Toys & Games' },
  { id: 6, name: 'Beauty & Personal Care' },
  { id: 7, name: 'Sports & Outdoors' }
];

interface ProfilePageParams {
  userId: string;
}

const Profile: React.FC = () => {
  const { userId } = useParams<keyof ProfilePageParams>() as ProfilePageParams;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [isSellerView, setIsSellerView] = useState(true); // Default to seller view
  const [activeTab, setActiveTab] = useState<string>('basic');

  // Mock data for current user check (would be from auth context)
  const mockCurrentUser = { id: userId };
  const isOwner = mockCurrentUser.id === userId;
  const isCustomer = profileData?.role === 'CUSTOMER';
  const isAdmin = profileData?.role === 'ADMIN';
  const canEditSellerInfo = isOwner && isCustomer;

  useEffect(() => {
    // Using a timeout to simulate loading
    const timer = setTimeout(() => {
      // Get mock profile data
      const userData = getMockUserData(userId);
      setProfileData(userData);
      
      // Pre-populate form with user data
      form.setFieldsValue({
        username: userData.username,
        email: userData.email,
        preferredLocations: userData.sellerInfo?.preferredLocations?.join(', '),
        preferredCourier: userData.sellerInfo?.preferredCourier,
        productCategories: userData.sellerInfo?.productCategories,
      });
      
      // Set mock categories
      setCategories(mockCategories);
      
      setLoading(false);
    }, 800); // 800ms to simulate network call
    
    return () => clearTimeout(timer);
  }, [userId, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const handleSubmit = (values: any) => {
    if (!profileData) return;

    setSaving(true);
    
    // Process preferred locations from comma-separated string to array
    const preferredLocationsArray = values.preferredLocations
      ? values.preferredLocations.split(',').map((loc: string) => loc.trim())
      : [];
    
    // Prepare updated profile data
    const updatedProfile: Partial<UserProfile> = {
      ...profileData,
      username: values.username,
      email: values.email,
      sellerInfo: {
        ...profileData.sellerInfo,
        preferredLocations: preferredLocationsArray,
        preferredCourier: values.preferredCourier,
        productCategories: values.productCategories,
      }
    };

    // Simulate an API call with a timeout
    setTimeout(() => {
      setProfileData(updatedProfile as UserProfile);
      setIsEditing(false);
      message.success('Profile updated successfully');
      setSaving(false);
    }, 800);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', width: '100%', background: '#f5f5f5' }}>
        <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
            <Spin size="large" tip="Loading profile..." />
          </div>
        </Content>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout style={{ minHeight: '100vh', width: '100%', background: '#f5f5f5' }}>
        <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)', width: '100%' }}>
          <Row justify="center" gutter={[16, 16]}>
            <Col xs={24} sm={24} md={20} lg={18} xl={16}>
              <Card style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)', borderRadius: '8px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
                <Title level={4}>User not found</Title>
                <div style={{ marginTop: '16px' }}>
                  <button 
                    style={{ 
                      backgroundColor: '#1890ff', 
                      color: 'white', 
                      border: 'none',
                      borderRadius: '2px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                    onClick={() => navigate('/')}
                  >
                    Return to Home
                  </button>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', width: '100%', background: '#f5f5f5' }}>
      <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)', width: '100%' }}>
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24}>
            <Card
              style={{ 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)', 
                borderRadius: '8px', 
                width: '100%',
                overflow: 'hidden'
              }}
              title={
                <Title level={2} style={{ margin: 0, color: '#262626' }}>
                  User Profile
                </Title>
              }
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  username: profileData.username,
                  email: profileData.email,
                  preferredLocations: profileData.sellerInfo?.preferredLocations?.join(', '),
                  preferredCourier: profileData.sellerInfo?.preferredCourier,
                  productCategories: profileData.sellerInfo?.productCategories,
                }}
                onFinish={handleSubmit}
                style={{ width: '100%' }}
              >
                <Tabs 
                  defaultActiveKey="basic" 
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  style={{ width: '100%' }}
                  type="card"
                  items={[
                    {
                      key: 'basic',
                      label: 'Basic Information',
                      children: (
                        <BasicInfo
                          profileData={profileData}
                          isEditing={isEditing}
                          isOwner={isOwner}
                          saving={saving}
                          form={form}
                          handleEdit={handleEdit}
                          handleCancel={handleCancel}
                        />
                      ),
                    },
                    {
                      key: 'customerInfo',
                      label: 'Customer Information',
                      disabled: !isCustomer && !isAdmin,
                      children: (
                        <>
                          {isCustomer && (
                            <div style={{ width: '100%' }}>
                              <Card 
                                style={{ 
                                  marginBottom: '24px',
                                  borderRadius: '8px',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                  <span style={{ fontWeight: 500, marginRight: '12px', fontSize: '16px' }}>View as:</span>
                                  <Switch
                                    checked={isSellerView}
                                    onChange={setIsSellerView}
                                    checkedChildren="Seller"
                                    unCheckedChildren="Buyer"
                                    style={{ backgroundColor: isSellerView ? '#1890ff' : undefined }}
                                  />
                                  <span style={{ marginLeft: '12px', fontSize: '16px', color: '#262626' }}>
                                    {isSellerView ? 'Seller Information' : 'Buyer Information'}
                                  </span>
                                </div>
                              </Card>
                              
                              {isSellerView ? (
                                <SellerInfo
                                  profileData={profileData}
                                  categories={categories}
                                  isEditing={isEditing}
                                  canEditSellerInfo={canEditSellerInfo}
                                  saving={saving}
                                  form={form}
                                  handleEdit={handleEdit}
                                  handleCancel={handleCancel}
                                />
                              ) : (
                                <BuyerInfo />
                              )}
                            </div>
                          )}
                          
                          {isAdmin && !isCustomer && (
                            <AdminInfo />
                          )}
                        </>
                      ),
                    },
                  ]} 
                />
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center', padding: '16px', background: '#f0f2f5', boxShadow: '0 -1px 4px rgba(0,0,0,0.05)' }}>
        Online Shop ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
};

export default Profile; 