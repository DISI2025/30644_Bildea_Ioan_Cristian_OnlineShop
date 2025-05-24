import React from 'react';
import { Button, Row, Col, Typography, Divider, theme } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { MainUser, UserRole } from '../../types/entities';

const { Text, Title } = Typography;
const { useToken } = theme;

interface ProfileInfoProps {
    userProfile: MainUser;
    onEdit: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userProfile, onEdit }) => {
    const { token } = useToken();
    const isAdmin = userProfile.role === UserRole.ADMIN;
    
    const InfoItem: React.FC<{ label: string; value: string | null | undefined }> = ({ label, value }) => (
        <div style={{ marginBottom: token.marginLG }}>
            <Text strong style={{ 
                display: 'block', 
                marginBottom: token.marginXS, 
                color: token.colorTextSecondary 
            }}>
                {label}
            </Text>
            <Text style={{ fontSize: token.fontSizeLG }}>
                {value || 'Not provided'}
            </Text>
        </div>
    );

    if (isAdmin) {
        return (
            <div style={{ padding: token.paddingLG }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: token.marginLG
                }}>
                    <Text style={{ 
                        fontSize: token.fontSizeXL, 
                        fontWeight: token.fontWeightStrong 
                    }}>
                        Administrator Account
                    </Text>
                </div>
                
                <Divider style={{ margin: `0 0 ${token.marginLG}px 0` }} />
                
                <Text type="secondary">
                    Admin accounts have access to all system features and don't require detailed profile information.
                </Text>
            </div>
        );
    }

    return (
        <div style={{ padding: token.paddingLG }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: token.marginLG
            }}>
                <Text style={{ 
                    fontSize: token.fontSizeXL, 
                    fontWeight: token.fontWeightStrong 
                }}>
                    Profile Information
                </Text>
                <Button 
                    type="primary" 
                    onClick={onEdit}
                    icon={<EditOutlined />}
                    size="large"
                >
                    Edit Profile
                </Button>
            </div>
            
            <Divider style={{ margin: `0 0 ${token.marginLG}px 0` }} />

            {/* Basic Profile Information Section */}
            <Title level={4} style={{ 
                marginTop: 0, 
                marginBottom: token.marginLG,
                color: token.colorText 
            }}>
                Basic Profile Information
            </Title>
            
            <Row gutter={[token.marginLG, 0]}>
                <Col xs={24} sm={12}>
                    <InfoItem label="Username" value={userProfile.username} />
                </Col>
                <Col xs={24} sm={12}>
                    <InfoItem label="Email" value={userProfile.email} />
                </Col>
                <Col xs={24} sm={12}>
                    <InfoItem label="Full Name" value={userProfile.fullName} />
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
            
            <Row gutter={[token.marginLG, 0]}>
                <Col xs={24} sm={12}>
                    <InfoItem label="Store Address" value={userProfile.storeAddress} />
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
            
            <Row gutter={[token.marginLG, 0]}>
                <Col xs={24} sm={12}>
                    <InfoItem label="Phone" value={userProfile.phoneNumber} />
                </Col>
                <Col xs={24} sm={12}>
                    <InfoItem label="Address" value={userProfile.address} />
                </Col>
                <Col xs={24} sm={12}>
                    <InfoItem label="City" value={userProfile.city} />
                </Col>
                <Col xs={24} sm={12}>
                    <InfoItem label="Country" value={userProfile.country} />
                </Col>
                <Col xs={24} sm={12}>
                    <InfoItem label="Postal Code" value={userProfile.postalCode} />
                </Col>
            </Row>
        </div>
    );
};

export default ProfileInfo; 