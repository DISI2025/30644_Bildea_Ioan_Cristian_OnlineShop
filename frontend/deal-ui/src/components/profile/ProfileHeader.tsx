import React from 'react';
import { Avatar, Typography, Space, Tag, Row, Col, theme } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { MainUser, UserRole } from '../../types/entities';

const { Title, Text } = Typography;
const { useToken } = theme;

interface ProfileHeaderProps {
    userProfile: MainUser;
    isEditing: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
    userProfile, 
    isEditing 
}) => {
    const { token } = useToken();
    const isAdmin = userProfile.role === UserRole.ADMIN;
    const isSeller = !!userProfile.storeAddress;

    // Dynamic colors based on theme
    const headerBackgroundColor = token.colorPrimary;
    const headerBorderColor = token.colorPrimaryBorder;
    const overlayTextColor = token.colorTextLightSolid || '#ffffff';

    const getRoleInfo = () => {
        if (isAdmin) {
            return { label: 'ADMIN', color: 'red', description: 'System Administrator' };
        } else if (isSeller) {
            return { label: 'USER', color: 'green', description: 'Store Owner & Customer' };
        } else {
            return { label: 'USER', color: 'blue', description: 'Customer' };
        }
    };

    const roleInfo = getRoleInfo();

    return (
        <div style={{ 
            background: `linear-gradient(135deg, ${headerBackgroundColor} 0%, ${headerBorderColor} 100%)`,
            padding: token.paddingLG,
            borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
            color: overlayTextColor,
            marginBottom: 0
        }}>
            <Row gutter={[token.marginLG, token.marginLG]} align="middle">
                <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar 
                            size={120}
                            src={userProfile.profileUrl}
                            icon={<UserOutlined />}
                            style={{ 
                                border: `4px solid ${token.colorBorderSecondary}`,
                                boxShadow: token.boxShadowSecondary
                            }}
                        />
                        {isEditing && !isAdmin && (
                            <div style={{
                                marginTop: token.margin,
                                textAlign: 'center'
                            }}>
                                <Text style={{ 
                                    color: token.colorTextSecondary || 'rgba(255, 255, 255, 0.7)',
                                    fontSize: token.fontSizeSM
                                }}>
                                    Upload image in the form below
                                </Text>
                            </div>
                        )}
                    </div>
                </Col>
                <Col xs={24} sm={18}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Title level={2} style={{ color: overlayTextColor, margin: 0 }}>
                            {userProfile.fullName || userProfile.username}
                        </Title>
                        <Text style={{ 
                            color: token.colorTextSecondary || 'rgba(255, 255, 255, 0.8)', 
                            fontSize: token.fontSizeLG 
                        }}>
                            @{userProfile.username}
                        </Text>
                        <Space wrap>
                            <Tag 
                                color={roleInfo.color}
                                style={{ 
                                    fontSize: token.fontSizeSM,
                                    padding: `${token.paddingXXS}px ${token.paddingSM}px`,
                                    borderRadius: token.borderRadiusOuter,
                                    border: 'none'
                                }}
                            >
                                {roleInfo.label}
                            </Tag>
                            <Text style={{ 
                                color: token.colorTextSecondary || 'rgba(255, 255, 255, 0.8)',
                                fontSize: token.fontSizeSM
                            }}>
                                {roleInfo.description}
                            </Text>
                        </Space>
                        <Space style={{ color: token.colorTextSecondary || 'rgba(255, 255, 255, 0.7)' }}>
                            <CalendarOutlined />
                            <Text style={{ color: token.colorTextSecondary || 'rgba(255, 255, 255, 0.7)' }}>
                                Member since {new Date(userProfile.createdAt).toLocaleDateString()}
                            </Text>
                        </Space>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default ProfileHeader; 