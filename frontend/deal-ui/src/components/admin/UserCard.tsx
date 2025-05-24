import React from 'react';
import { 
    Card, 
    Avatar, 
    Typography, 
    Space, 
    Tag, 
    theme 
} from 'antd';
import { 
    UserOutlined, 
    ShopOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { MainUser, UserRole } from '../../types/entities';

const { Title, Text } = Typography;
const { useToken } = theme;

interface UserCardProps {
    user: MainUser;
    onClick: (user: MainUser) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
    const { token } = useToken();

    const handleClick = () => {
        onClick(user);
    };

    const getRoleTags = () => {
        const tags = [];
        
        if (user.role === UserRole.ADMIN) {
            tags.push(
                <Tag key="admin" color="red" style={{ fontSize: token.fontSizeSM, padding: `${token.paddingXXS}px ${token.paddingXS}px` }}>
                    ADMIN
                </Tag>
            );
        } else {
            if (user.storeAddress) {
                tags.push(
                    <Tag key="seller" color="blue" style={{ fontSize: token.fontSizeSM, padding: `${token.paddingXXS}px ${token.paddingXS}px` }}>
                        SELLER
                    </Tag>
                );
            }
            tags.push(
                <Tag key="buyer" color="green" style={{ fontSize: token.fontSizeSM, padding: `${token.paddingXXS}px ${token.paddingXS}px` }}>
                    BUYER
                </Tag>
            );
        }
        
        return tags;
    };

    return (
        <Card
            hoverable
            onClick={handleClick}
            style={{
                height: '100%',
                cursor: 'pointer',
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorder}`,
                transition: 'all 0.3s ease',
                backgroundColor: token.colorBgContainer
            }}
            styles={{
                body: { padding: 0 }
            }}
        >
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: token.paddingMD,
                borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
                textAlign: 'center',
                color: 'white'
            }}>
                <Avatar 
                    size={{ xs: 64, sm: 72, md: 80 }} 
                    src={user.profileUrl}
                    icon={!user.profileUrl ? <UserOutlined /> : undefined}
                    style={{ 
                        border: '3px solid rgba(255,255,255,0.3)',
                        marginBottom: token.marginSM
                    }}
                />
                <Title level={5} style={{ 
                    color: 'white', 
                    margin: 0, 
                    marginBottom: token.marginXXS,
                    fontSize: token.fontSize
                }}>
                    {user.fullName || user.username}
                </Title>
                <Text style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontSize: token.fontSizeSM 
                }}>
                    @{user.username}
                </Text>
            </div>
            
            <div style={{ padding: token.paddingMD }}>
                <div style={{ 
                    marginBottom: token.marginMD, 
                    textAlign: 'center' 
                }}>
                    <Space size={token.marginXS} wrap>
                        {getRoleTags()}
                    </Space>
                </div>
                
                <Space direction="vertical" size={token.marginXS} style={{ width: '100%' }}>
                    <div>
                        <MailOutlined style={{ 
                            marginRight: token.marginXS, 
                            color: token.colorPrimary 
                        }} />
                        <Text style={{ 
                            fontSize: token.fontSizeSM,
                            color: token.colorText
                        }}>
                            {user.email}
                        </Text>
                    </div>
                    
                    {user.phoneNumber && (
                        <div>
                            <PhoneOutlined style={{ 
                                marginRight: token.marginXS, 
                                color: token.colorPrimary 
                            }} />
                            <Text style={{ 
                                fontSize: token.fontSizeSM,
                                color: token.colorText
                            }}>
                                {user.phoneNumber}
                            </Text>
                        </div>
                    )}
                    
                    {(user.city || user.country) && (
                        <div>
                            <EnvironmentOutlined style={{ 
                                marginRight: token.marginXS, 
                                color: token.colorPrimary 
                            }} />
                            <Text style={{ 
                                fontSize: token.fontSizeSM,
                                color: token.colorText
                            }}>
                                {user.city}
                                {user.city && user.country && ', '}
                                {user.country}
                            </Text>
                        </div>
                    )}
                    
                    {user.storeAddress && (
                        <div>
                            <ShopOutlined style={{ 
                                marginRight: token.marginXS, 
                                color: token.colorPrimary 
                            }} />
                            <Text style={{ 
                                fontSize: token.fontSizeSM,
                                color: token.colorText
                            }}>
                                {user.storeAddress}
                            </Text>
                        </div>
                    )}
                    
                    <div>
                        <CalendarOutlined style={{ 
                            marginRight: token.marginXS, 
                            color: token.colorTextSecondary 
                        }} />
                        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                        </Text>
                    </div>
                </Space>
            </div>
        </Card>
    );
};

export default UserCard; 