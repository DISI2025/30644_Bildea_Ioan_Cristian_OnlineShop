import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Avatar, Card, Form, Layout, message, Space, Tabs, theme, Typography, Input, Button} from 'antd';
import {HeartOutlined, LockOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {useSelector} from 'react-redux';
import {selectAuthState} from '../store/slices/auth-slice';
import {Navbar} from '../components/common/Navbar';
import BasicInfo from '../components/profile/BasicInfo';
import UserInfo from '../components/profile/SellerInfo';
import BuyerInfo from '../components/profile/BuyerInfo';
import AdminInfo from '../components/profile/AdminInfo';
import type {FormInstance} from 'antd/es/form';
import {UserRole} from "../types/entities";

const { Content } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;

// DTOs for user data
interface BaseUserDTO {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

interface UserDetailsDTO extends BaseUserDTO {
  role: UserRole.USER;
  userInfo: {
    shippingAddress?: string;
    preferredLocations?: string[];
    preferredCourier?: string;
    storeAddress?: string;
  };
}

interface AdminDTO extends BaseUserDTO {
  role: UserRole.ADMIN;
  adminInfo: {
    permissions: string[];
    lastLogin: string;
  };
}

type UserDTO = UserDetailsDTO | AdminDTO;

interface ProfileFormData {
  username: string;
  preferredLocations?: string;
  preferredCourier?: string;
  productCategories?: number[];
  shippingAddress?: string;
  paymentMethod?: string;
  storeAddress?: string;
}

interface AuthState {
  user: {
    id: string;
    username: string;
    role: UserRole;
  } | null;
}

const ProfilePage: React.FC = () => {
  const { token } = useToken();
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const { user } = useSelector(selectAuthState) as AuthState;
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userForm] = Form.useForm<ProfileFormData>();

  // Validate user access
  useEffect(() => {
    if (!user) {
      message.error('Please log in to view your profile');
      navigate('/');
      return;
    }

    if (username !== user.username) {
      message.error('You can only view your own profile');
      navigate('/');
    }
  }, [user, username, navigate]);

  // Mock user data based on role
  const getUserData = (): UserDTO => {
    const baseData = {
      id: user?.id || '',
      username: user?.username || '',
      createdAt: new Date().toISOString(),
    };

    switch (user?.role) {
      case UserRole.ADMIN:
        return {
          ...baseData,
          role: UserRole.ADMIN,
          adminInfo: {
            permissions: ['manage_users', 'manage_products'],
            lastLogin: new Date().toISOString()
          }
        };
      default:
        return {
          ...baseData,
          role: UserRole.USER,
          userInfo: {
            shippingAddress: '123 Main St, Cluj-Napoca',
            preferredLocations: ['Cluj-Napoca', 'Bucharest'],
            preferredCourier: 'Fan Courier',
            storeAddress: '456 Business Ave, Cluj-Napoca'
          }
        };
    }
  };

  const userData = getUserData();

  const handleEdit = () => {
    setIsEditing(true);
    if (userData.role === UserRole.USER) {
      userForm.setFieldsValue({
        preferredLocations: userData.userInfo.preferredLocations?.join(', '),
        preferredCourier: userData.userInfo.preferredCourier,
        shippingAddress: userData.userInfo.shippingAddress,
        storeAddress: userData.userInfo.storeAddress
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    userForm.resetFields();
  };

  const handleSaveUserInfo = async (values: ProfileFormData) => {
    try {
      setSaving(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('User information updated successfully');
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to update user information');
    } finally {
      setSaving(false);
    }
  };

  const isOwner = user?.username === username;
  const canEditUserInfo = isOwner && userData.role === UserRole.USER;

  const items = [
    {
      key: 'basic',
      label: (
        <Space>
          <UserOutlined />
          <span>Profile Information</span>
        </Space>
      ),
      children: (
        <BasicInfo
          profileData={userData}
          isOwner={isOwner}
        />
      )
    },
    {
      key: 'security',
      label: (
        <Space>
          <LockOutlined />
          <span>Security</span>
        </Space>
      ),
      children: (
        <Card
          style={{
            width: '100%',
            boxShadow: token.shadows.light.md,
            borderRadius: token.borderRadius.md,
            overflow: 'hidden',
            marginBottom: token.spacing.lg
          }}
        >
          <Title level={4}>Security Settings</Title>
          <Text>This section will be implemented in a future task.</Text>
        </Card>
      )
    }
  ];

  // Add role-specific tabs
  if (userData.role === UserRole.USER) {
    items.push({
      key: 'seller',
      label: (
        <Space>
          <ShoppingOutlined />
          <span>Seller Information</span>
        </Space>
      ),
      children: (
        <Card
          style={{
            width: '100%',
            boxShadow: token.shadows.light.md,
            borderRadius: token.borderRadius.md,
            overflow: 'hidden',
            marginBottom: token.spacing.lg
          }}
        >
          <Title level={4}>Seller Dashboard</Title>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card
              title={<Text strong style={{ fontSize: token.customFontSize.base }}>Store Information</Text>}
              style={{ 
                width: '100%',
                borderRadius: token.borderRadius.sm,
              }}
            >
              {isEditing && canEditUserInfo ? (
                <Form
                  form={userForm}
                  layout="vertical"
                  onFinish={handleSaveUserInfo}
                  style={{ width: '100%' }}
                >
                  <Form.Item
                    name="storeAddress"
                    label={<span style={{
                      fontSize: token.customFontSize.sm,
                      color: token.colorText
                    }}>Store Address</span>}
                  >
                    <Input placeholder="Enter your store address" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={saving}
                        style={{ 
                          backgroundColor: token.colorPrimary,
                          borderColor: token.colorPrimary
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel}>Cancel</Button>
                    </Space>
                  </Form.Item>
                </Form>
              ) : (
                <div style={{ padding: token.spacing.md }}>
                  <div className="info-item" style={{ marginBottom: token.spacing.md }}>
                    <Text strong style={{ display: 'block', marginBottom: token.spacing.xxs, color: token.colorTextSecondary }}>Store Address</Text>
                    <Text style={{ fontSize: token.customFontSize.base }}>
                      {userData.userInfo.storeAddress || 'None specified'}
                    </Text>
                  </div>
                  {canEditUserInfo && (
                    <Button 
                      type="primary" 
                      onClick={handleEdit} 
                      style={{ 
                        marginTop: token.spacing.md,
                        backgroundColor: token.colorPrimary,
                        borderColor: token.colorPrimary
                      }}
                    >
                      Edit Store Information
                    </Button>
                  )}
                </div>
              )}
            </Card>

            <Card
              title={<Text strong style={{ fontSize: token.customFontSize.base }}>Product Categories</Text>}
              style={{ 
                width: '100%',
                borderRadius: token.borderRadius.sm,
              }}
            >
              <div style={{ padding: token.spacing.md }}>
                <Text type="secondary">
                  This feature will be implemented in a future task. Here you will be able to:
                </Text>
                <ul style={{ 
                  paddingLeft: token.spacing.lg,
                  marginTop: token.spacing.sm,
                  color: token.colorTextSecondary
                }}>
                  <li>Manage your product categories</li>
                  <li>Add new categories to your store</li>
                  <li>Track category performance</li>
                  <li>Get insights about your product categories</li>
                </ul>
              </div>
            </Card>

            <Card
              title={<Text strong style={{ fontSize: token.customFontSize.base }}>Products Management</Text>}
              style={{ 
                width: '100%',
                borderRadius: token.borderRadius.sm,
              }}
            >
              <div style={{ padding: token.spacing.md }}>
                <Text type="secondary">
                  This feature will be implemented in a future task. Here you will be able to:
                </Text>
                <ul style={{ 
                  paddingLeft: token.spacing.lg,
                  marginTop: token.spacing.sm,
                  color: token.colorTextSecondary
                }}>
                  <li>Add new products to your store</li>
                  <li>Edit existing products</li>
                  <li>Manage product inventory</li>
                  <li>Track product performance</li>
                </ul>
              </div>
            </Card>

            <Card
              title={<Text strong style={{ fontSize: token.customFontSize.base }}>Orders Management</Text>}
              style={{ 
                width: '100%',
                borderRadius: token.borderRadius.sm,
              }}
            >
              <div style={{ padding: token.spacing.md }}>
                <Text type="secondary">
                  This feature will be implemented in a future task. Here you will be able to:
                </Text>
                <ul style={{ 
                  paddingLeft: token.spacing.lg,
                  marginTop: token.spacing.sm,
                  color: token.colorTextSecondary
                }}>
                  <li>View and manage incoming orders</li>
                  <li>Process order shipments</li>
                  <li>Handle returns and refunds</li>
                  <li>Track order status</li>
                </ul>
              </div>
            </Card>
          </Space>
        </Card>
      )
    });

    items.push({
      key: 'buyer',
      label: (
        <Space>
          <HeartOutlined />
          <span>Buyer Information</span>
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <UserInfo
            profileData={userData}
            isEditing={isEditing}
            canEditUserInfo={canEditUserInfo}
            saving={saving}
            form={userForm as FormInstance}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
          />

          <Card
            title={<Text strong style={{ fontSize: token.customFontSize.base }}>Orders</Text>}
            style={{ 
              width: '100%',
              borderRadius: token.borderRadius.sm,
            }}
          >
            <div style={{ padding: token.spacing.md }}>
              <Text type="secondary">
                This feature will be implemented in a future task. Here you will be able to:
              </Text>
              <ul style={{ 
                paddingLeft: token.spacing.lg,
                marginTop: token.spacing.sm,
                color: token.colorTextSecondary
              }}>
                <li>View your order history</li>
                <li>Track current orders</li>
                <li>Manage returns</li>
                <li>View invoices</li>
              </ul>
            </div>
          </Card>
        </Space>
      )
    });
  }

  if (userData.role === UserRole.ADMIN) {
    items.push({
      key: 'admin',
      label: (
        <Space>
          <UserOutlined />
          <span>Admin Dashboard</span>
        </Space>
      ),
      children: <AdminInfo />
    });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: token.spacing.lg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            style={{
              background: token.colorBgContainer,
              padding: token.spacing.lg,
              borderRadius: token.borderRadius.md,
              boxShadow: token.shadows.light.md
            }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default ProfilePage;