import React from 'react';
import { Form, Input, Button, Space, Row, Col, theme, Divider, Typography } from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    HomeOutlined, 
    GlobalOutlined, 
    ShopOutlined,
    SaveOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { MainUser, UserRole } from '../../types/entities';
import ImageUpload from '../common/ImageUpload';

const { useToken } = theme;
const { Title } = Typography;

interface ProfileFormData {
    username?: string;
    email?: string;
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    phoneNumber?: string;
    profileUrl?: string;
    storeAddress?: string;
}

interface ProfileFormProps {
    userProfile: MainUser;
    form: any;
    onSave: (values: ProfileFormData) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
    userProfile, 
    form, 
    onSave, 
    onCancel, 
    isLoading 
}) => {
    const { token } = useToken();
    const isAdmin = userProfile.role === UserRole.ADMIN;
    
    if (isAdmin) {
        return null;
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSave}
            style={{ padding: token.paddingLG }}
        >
            {/* Basic Profile Information Section */}
            <Title level={4} style={{ 
                marginTop: 0, 
                marginBottom: token.marginLG,
                color: token.colorText 
            }}>
                Basic Profile Information
            </Title>
            
            <Row gutter={[token.margin, 0]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Username is required' }]}
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="fullName"
                        label="Full Name"
                    >
                        <Input 
                            prefix={<UserOutlined />} 
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="profileUrl"
                        label="Profile Image"
                    >
                        <ImageUpload placeholder="Upload Profile Image" />
                    </Form.Item>
                </Col>
            </Row>

            <Divider style={{ margin: `${token.marginLG}px 0` }} />

            {/* Seller Information Section - Always show for non-admin users */}
            <Title level={4} style={{ 
                marginTop: 0, 
                marginBottom: token.marginLG,
                color: token.colorText 
            }}>
                Seller Information
            </Title>
            
            <Row gutter={[token.margin, 0]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="storeAddress"
                        label="Store Address"
                    >
                        <Input 
                            prefix={<ShopOutlined />} 
                            size="large"
                            placeholder="Enter your store address (optional)"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider style={{ margin: `${token.marginLG}px 0` }} />

            {/* Buyer Information Section - Always show for non-admin users */}
            <Title level={4} style={{ 
                marginTop: 0, 
                marginBottom: token.marginLG,
                color: token.colorText 
            }}>
                Buyer Information
            </Title>
            
            <Row gutter={[token.margin, 0]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                    >
                        <Input 
                            prefix={<PhoneOutlined />} 
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="address"
                        label="Address"
                    >
                        <Input 
                            prefix={<HomeOutlined />} 
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="city"
                        label="City"
                    >
                        <Input 
                            prefix={<GlobalOutlined />} 
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="country"
                        label="Country"
                    >
                        <Input 
                            prefix={<GlobalOutlined />} 
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="postalCode"
                        label="Postal Code"
                    >
                        <Input size="large" />
                    </Form.Item>
                </Col>
            </Row>
            
            <Form.Item style={{ 
                marginTop: token.marginLG, 
                marginBottom: 0 
            }}>
                <Space size="middle">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isLoading}
                        icon={<SaveOutlined />}
                        size="large"
                    >
                        Save Changes
                    </Button>
                    <Button 
                        onClick={onCancel}
                        icon={<CloseOutlined />}
                        size="large"
                    >
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ProfileForm; 