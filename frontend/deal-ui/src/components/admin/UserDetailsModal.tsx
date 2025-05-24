import React, {useState} from 'react';
import {Avatar, Card, Col, Empty, Modal, Row, Space, Spin, Tabs, Tag, Typography, theme} from 'antd';
import {
    AppstoreOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import {MainUser, UserRole} from '../../types/entities';
import {useGetProductsBySellerIdQuery} from '../../store/api';
import ProductGrid from '../product/ProductGrid';
import OrderHistory from '../profile/OrderHistory';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { useToken } = theme;

interface UserDetailsModalProps {
    user: MainUser | null;
    visible: boolean;
    onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, visible, onClose }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const { token } = useToken();

    const isAdmin = user?.role === UserRole.ADMIN;
    
    const { data: userProductsResponse, isLoading: isLoadingProducts } = useGetProductsBySellerIdQuery(
        user?.id || '', 
        { skip: !user?.id || !user?.storeAddress || isAdmin }
    );

    if (!user) return null;

    const userProducts = userProductsResponse?.payload || [];

    const renderProfileTab = () => (
        <div>
            {/* User Header */}
            <Card style={{ marginBottom: token.marginLG, borderRadius: token.borderRadiusLG }}>
                <Row gutter={[token.paddingLG, token.paddingLG]} align="middle">
                    <Col xs={24} sm={24} md={8} style={{ textAlign: 'center' }}>
                        <Avatar 
                            size={{ xs: 100, sm: 110, md: 120 }} 
                            src={user.profileUrl}
                            icon={!user.profileUrl ? <UserOutlined /> : undefined}
                            style={{ 
                                border: `4px solid ${token.colorBorder}`,
                                boxShadow: token.boxShadowSecondary
                            }}
                        />
                        <div style={{ marginTop: token.marginMD }}>
                            <Title level={3} style={{ margin: 0, color: token.colorText }}>
                                {user.fullName || user.username}
                            </Title>
                            <Text type="secondary" style={{ fontSize: token.fontSizeLG }}>
                                @{user.username}
                            </Text>
                        </div>
                        <div style={{ marginTop: token.marginSM }}>
                            {user.role === UserRole.ADMIN ? (
                                <Tag color="red" style={{ fontSize: token.fontSize, padding: `${token.paddingXXS}px ${token.paddingSM}px` }}>ADMIN</Tag>
                            ) : (
                                <>
                                    {user.storeAddress && (
                                        <Tag color="blue" style={{ fontSize: token.fontSize, padding: `${token.paddingXXS}px ${token.paddingSM}px`, marginRight: token.marginXS }}>
                                            SELLER
                                        </Tag>
                                    )}
                                    <Tag color="green" style={{ fontSize: token.fontSize, padding: `${token.paddingXXS}px ${token.paddingSM}px` }}>
                                        BUYER
                                    </Tag>
                                </>
                            )}
                        </div>
                    </Col>
                    
                    <Col xs={24} sm={24} md={16}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Title level={4} style={{ color: token.colorText }}>Contact Information</Title>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div>
                                        <MailOutlined style={{ marginRight: token.marginXS, color: token.colorPrimary }} />
                                        <Text strong style={{ color: token.colorText }}>Email: </Text>
                                        <Text style={{ color: token.colorText }}>{user.email}</Text>
                                    </div>
                                    
                                    {user.phoneNumber && (
                                        <div>
                                            <PhoneOutlined style={{ marginRight: token.marginXS, color: token.colorPrimary }} />
                                            <Text strong style={{ color: token.colorText }}>Phone: </Text>
                                            <Text style={{ color: token.colorText }}>{user.phoneNumber}</Text>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <CalendarOutlined style={{ marginRight: token.marginXS, color: token.colorPrimary }} />
                                        <Text strong style={{ color: token.colorText }}>Member since: </Text>
                                        <Text style={{ color: token.colorText }}>{new Date(user.createdAt).toLocaleDateString()}</Text>
                                    </div>
                                </Space>
                            </div>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Address Information */}
            {(user.address || user.city || user.country) && (
                <Card title="Address Information" style={{ marginBottom: token.marginLG, borderRadius: token.borderRadiusLG }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {user.address && (
                            <div>
                                <EnvironmentOutlined style={{ marginRight: token.marginXS, color: token.colorPrimary }} />
                                <Text strong style={{ color: token.colorText }}>Address: </Text>
                                <Text style={{ color: token.colorText }}>{user.address}</Text>
                            </div>
                        )}
                        
                        {(user.city || user.country) && (
                            <div>
                                <EnvironmentOutlined style={{ marginRight: token.marginXS, color: token.colorPrimary }} />
                                <Text strong style={{ color: token.colorText }}>Location: </Text>
                                <Text style={{ color: token.colorText }}>
                                    {user.city}
                                    {user.city && user.country && ', '}
                                    {user.country}
                                    {user.postalCode && ` ${user.postalCode}`}
                                </Text>
                            </div>
                        )}
                    </Space>
                </Card>
            )}

            {/* Store Information - Only show for non-admins */}
            {!isAdmin && user.storeAddress && (
                <Card title="Store Information" style={{ marginBottom: token.marginLG, borderRadius: token.borderRadiusLG }}>
                    <div>
                        <ShopOutlined style={{ marginRight: token.marginXS, color: token.colorPrimary }} />
                        <Text strong style={{ color: token.colorText }}>Store Address: </Text>
                        <Text style={{ color: token.colorText }}>{user.storeAddress}</Text>
                    </div>
                </Card>
            )}

            {/* Categories - Only show for non-admins */}
            {!isAdmin && user.productCategories && user.productCategories.length > 0 && (
                <Card title="Product Categories" style={{ borderRadius: token.borderRadiusLG }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: token.marginXS }}>
                        {user.productCategories.map(category => (
                            <Tag key={category.id} color="blue" style={{ margin: 0 }}>
                                {category.categoryName}
                            </Tag>
                        ))}
                    </div>
                </Card>
            )}

            {/* Admin-specific information */}
            {isAdmin && (
                <Card title="Administrative Information" style={{ borderRadius: token.borderRadiusLG }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                            <Text strong style={{ color: token.colorText }}>Role: </Text>
                            <Tag color="red" style={{ marginLeft: token.marginXS }}>
                                System Administrator
                            </Tag>
                        </div>
                        <div>
                            <Text type="secondary">
                                This user has administrative privileges and can manage the entire platform.
                            </Text>
                        </div>
                    </Space>
                </Card>
            )}
        </div>
    );

    const renderProductsTab = () => {
        if (!user.storeAddress) {
            return (
                <Empty 
                    description="This user is not a seller"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            );
        }

        if (isLoadingProducts) {
            return (
                <div style={{ textAlign: 'center', padding: `${token.paddingXL}px 0` }}>
                    <Spin size="large" />
                </div>
            );
        }

        if (userProducts.length === 0) {
            return (
                <Empty 
                    description="No products found for this seller"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            );
        }

        return (
            <div>
                <Title level={4} style={{ marginBottom: token.marginLG, color: token.colorText }}>
                    Products ({userProducts.length})
                </Title>
                <ProductGrid products={userProducts} columns={3} />
            </div>
        );
    };

    const renderOrdersTab = () => (
        <div>
            <OrderHistory 
                userId={user.id} 
                isSeller={!!user.storeAddress}
            />
        </div>
    );

    const renderTabsContent = () => {
        if (isAdmin) {
            return (
                <div style={{ padding: '24px' }}>
                    {renderProfileTab()}
                </div>
            );
        }

        return (
            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                size="large"
                type="card"
            >
                <TabPane 
                    tab={
                        <span>
                            <UserOutlined />
                            Profile
                        </span>
                    } 
                    key="profile"
                >
                    {renderProfileTab()}
                </TabPane>
                
                <TabPane 
                    tab={
                        <span>
                            <AppstoreOutlined />
                            Products ({userProducts.length})
                        </span>
                    } 
                    key="products"
                    disabled={!user.storeAddress}
                >
                    {renderProductsTab()}
                </TabPane>
                
                <TabPane 
                    tab={
                        <span>
                            <ShoppingCartOutlined />
                            Orders
                        </span>
                    } 
                    key="orders"
                >
                    {renderOrdersTab()}
                </TabPane>
            </Tabs>
        );
    };

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            footer={null}
            width="90%"
            style={{ 
                top: token.marginLG,
                maxWidth: '1000px',
                margin: '0 auto'
            }}
            styles={{
                body: { 
                    padding: 0, 
                    maxHeight: '85vh', 
                    overflow: 'auto',
                    backgroundColor: token.colorBgContainer
                }
            }}
        >
            <div style={{ padding: `${token.paddingLG}px ${token.paddingLG}px 0 ${token.paddingLG}px` }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: token.paddingLG,
                    borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: token.marginLG
                }}>
                    <Title level={2} style={{ color: 'white', margin: 0 }}>
                        {isAdmin ? 'Administrator Profile' : 'User Details'}
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: token.fontSizeLG }}>
                        {isAdmin 
                            ? `Administrative profile for ${user.fullName || user.username}`
                            : `Comprehensive view of ${user.fullName || user.username}'s profile`
                        }
                    </Text>
                </div>
            </div>

            <div style={{ padding: `0 ${token.paddingLG}px ${token.paddingLG}px ${token.paddingLG}px` }}>
                {renderTabsContent()}
            </div>
        </Modal>
    );
};

export default UserDetailsModal; 