import React, { useState, useMemo } from 'react';
import { 
    Layout, 
    theme, 
    Typography, 
    Divider, 
    Input, 
    Select, 
    Button, 
    Row, 
    Col, 
    Card, 
    Space, 
    Avatar, 
    Tag, 
    Skeleton, 
    Empty,
    Alert
} from 'antd';
import { 
    SearchOutlined, 
    FilterOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    UserOutlined,
    ShopOutlined,
    DollarOutlined,
    CalendarOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import ProductGrid from '../components/product/ProductGrid';
import { 
    useGetProductsQuery, 
    useGetUsersQuery, 
    useGetProductsBySellerIdQuery, 
    useGetProductCategoriesQuery 
} from '../store/api';
import { selectAuthState } from '../store/slices/auth-slice';
import { UserRole, Product, MainUser } from '../types/entities';

const { Content, Footer } = Layout;
const { useToken } = theme;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

type SortOption = 'name-asc' | 'name-desc' | 'price-low' | 'price-high';

export const HomePage: React.FC = () => {
    const { token } = useToken();
    const authState = useSelector(selectAuthState);
    const isAdmin = authState.user?.role === UserRole.ADMIN;
    const currentUserId = authState.user?.id || '';

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');

    // API queries
    const { data: allProductsResponse, error: productsError, isLoading: isLoadingProducts } = useGetProductsQuery();
    const { data: usersResponse, error: usersError, isLoading: isLoadingUsers } = useGetUsersQuery(undefined, {
        skip: !isAdmin
    });
    const { data: userProductsResponse } = useGetProductsBySellerIdQuery(currentUserId, {
        skip: isAdmin || !currentUserId
    });
    const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetProductCategoriesQuery();

    const allProducts = allProductsResponse?.payload || [];
    const allUsers = usersResponse?.payload || [];
    const userProducts = userProductsResponse?.payload || [];
    const categories = categoriesResponse?.payload || [];

    // Filter products to exclude current user's products for regular users
    const displayProducts = useMemo(() => {
        if (isAdmin) return [];
        
        // TODO: Implement backend filtering to exclude current user's products
        // For now, filtering on frontend
        const userProductIds = userProducts.map(p => p.id);
        return allProducts.filter(product => !userProductIds.includes(product.id));
    }, [allProducts, userProducts, isAdmin]);

    // Filter and sort products based on search criteria
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...displayProducts];

        // TODO: Move search filtering to backend endpoint
        // Search by product name
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // TODO: Move category filtering to backend endpoint
        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.categories.some(cat => cat.id === selectedCategory)
            );
        }

        // TODO: Move sorting to backend endpoint
        // Sort products
        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [displayProducts, searchTerm, selectedCategory, sortOption]);

    // Filter and sort users for admin view
    const filteredAndSortedUsers = useMemo(() => {
        if (!isAdmin) return [];
        
        let filtered = [...allUsers];

        // TODO: Move user search filtering to backend endpoint
        // Search by user name, email, or store name
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.storeAddress && user.storeAddress.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // TODO: Move user role filtering to backend endpoint
        // Filter by role (treating role as category)
        if (selectedCategory) {
            filtered = filtered.filter(user => {
                if (selectedCategory === 'ADMIN') {
                    return user.role === UserRole.ADMIN;
                } else if (selectedCategory === 'SELLER') {
                    return user.role === UserRole.USER && !!user.storeAddress;
                } else if (selectedCategory === 'BUYER') {
                    return user.role === UserRole.USER; // All users can buy
                } else if (selectedCategory === 'SELLER_BUYER') {
                    return user.role === UserRole.USER && !!user.storeAddress; // Users who are both
                }
                return false;
            });
        }

        // TODO: Move user sorting to backend endpoint
        // Sort users
        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'name-asc':
                    return (a.fullName || a.username).localeCompare(b.fullName || b.username);
                case 'name-desc':
                    return (b.fullName || b.username).localeCompare(a.fullName || a.username);
                case 'price-low': // Sort by creation date (oldest first)
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'price-high': // Sort by creation date (newest first)
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    }, [allUsers, searchTerm, selectedCategory, sortOption, isAdmin]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const handleSortChange = (value: SortOption) => {
        setSortOption(value);
    };

    const renderFilters = () => (
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={8}>
                    <Input
                        placeholder={isAdmin ? "Search users..." : "Search products..."}
                        prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        size="large"
                        style={{ borderRadius: 8 }}
                    />
                </Col>
                <Col xs={24} md={6}>
                    <Select
                        placeholder={isAdmin ? "Filter by role" : "Filter by category"}
                        style={{ width: '100%' }}
                        size="large"
                        allowClear
                        value={selectedCategory || undefined}
                        onChange={handleCategoryChange}
                        suffixIcon={<FilterOutlined />}
                        loading={isLoadingCategories}
                    >
                        {isAdmin ? (
                            // User roles for admin - custom options
                            <>
                                <Option key="ADMIN" value="ADMIN">ADMIN</Option>
                                <Option key="SELLER" value="SELLER">SELLER ONLY</Option>
                                <Option key="BUYER" value="BUYER">BUYER (ALL USERS)</Option>
                                <Option key="SELLER_BUYER" value="SELLER_BUYER">SELLER & BUYER</Option>
                            </>
                        ) : (
                            // Product categories for regular users
                            categories.map(category => (
                                <Option key={category.id} value={category.id}>
                                    {category.categoryName}
                                </Option>
                            ))
                        )}
                    </Select>
                </Col>
                <Col xs={24} md={6}>
                    <Select
                        placeholder="Sort by"
                        style={{ width: '100%' }}
                        size="large"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <Option value="name-asc">
                            <Space>
                                <SortAscendingOutlined />
                                {isAdmin ? 'Name A-Z' : 'Name A-Z'}
                            </Space>
                        </Option>
                        <Option value="name-desc">
                            <Space>
                                <SortDescendingOutlined />
                                {isAdmin ? 'Name Z-A' : 'Name Z-A'}
                            </Space>
                        </Option>
                        <Option value="price-low">
                            <Space>
                                <CalendarOutlined />
                                {isAdmin ? 'Oldest First' : 'Lowest Price'}
                            </Space>
                        </Option>
                        <Option value="price-high">
                            <Space>
                                <CalendarOutlined />
                                {isAdmin ? 'Newest First' : 'Highest Price'}
                            </Space>
                        </Option>
                    </Select>
                </Col>
                <Col xs={24} md={4}>
                    <Button 
                        type="default" 
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('');
                            setSortOption('name-asc');
                        }}
                        size="large"
                        style={{ width: '100%' }}
                    >
                        Clear All
                    </Button>
                </Col>
            </Row>
        </Card>
    );

    const renderUserCard = (user: MainUser) => (
        <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
            <Card
                hoverable
                style={{ 
                    height: '100%',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                cover={
                    <div style={{ 
                        padding: 24, 
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}>
                        <Avatar 
                            size={80} 
                            icon={<UserOutlined />}
                            style={{ 
                                backgroundColor: 'white',
                                color: token.colorPrimary,
                                marginBottom: 16
                            }}
                        />
                        <Title level={4} style={{ color: 'white', marginBottom: 0 }}>
                            {user.fullName || user.username}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                            @{user.username}
                        </Text>
                    </div>
                }
            >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Role:</Text>
                        <div style={{ marginLeft: 8, display: 'inline-block' }}>
                            {user.role === UserRole.ADMIN ? (
                                <Tag color="red">ADMIN</Tag>
                            ) : (
                                <>
                                    {user.storeAddress && (
                                        <Tag color="blue" style={{ marginRight: 4 }}>SELLER</Tag>
                                    )}
                                    <Tag color="green">BUYER</Tag>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <Text strong>Email:</Text>
                        <Text style={{ marginLeft: 8, color: token.colorTextSecondary }}>
                            {user.email}
                        </Text>
                    </div>

                    {user.storeAddress && (
                        <div>
                            <Text strong>Store:</Text>
                            <Text style={{ marginLeft: 8, color: token.colorTextSecondary }}>
                                <ShopOutlined style={{ marginRight: 4 }} />
                                {user.storeAddress}
                            </Text>
                        </div>
                    )}

                    {user.city && user.country && (
                        <div>
                            <Text strong>Location:</Text>
                            <Text style={{ marginLeft: 8, color: token.colorTextSecondary }}>
                                {user.city}, {user.country}
                            </Text>
                        </div>
                    )}

                    <div>
                        <Text strong>Member since:</Text>
                        <Text style={{ marginLeft: 8, color: token.colorTextSecondary }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                        </Text>
                    </div>

                    {user.productCategories && user.productCategories.length > 0 && (
                        <div>
                            <Text strong>Categories:</Text>
                            <div style={{ marginTop: 8 }}>
                                {user.productCategories.slice(0, 3).map(category => (
                                    <Tag key={category.id} style={{ marginBottom: 4 }}>
                                        {category.categoryName}
                                    </Tag>
                                ))}
                                {user.productCategories.length > 3 && (
                                    <Tag color="default">+{user.productCategories.length - 3} more</Tag>
                                )}
                            </div>
                        </div>
                    )}
                </Space>
            </Card>
        </Col>
    );

    const renderContent = () => {
        if (isAdmin) {
            // Admin view - show users
            if (isLoadingUsers) {
                return (
                    <Row gutter={[24, 24]}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                <Card style={{ height: 400 }}>
                                    <Skeleton active avatar paragraph={{ rows: 6 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                );
            }

            if (usersError) {
                return (
                    <Alert
                        message="Error Loading Users"
                        description="Failed to load users. Please try again later."
                        type="error"
                        showIcon
                        style={{ marginTop: 24 }}
                    />
                );
            }

            if (filteredAndSortedUsers.length === 0 && allUsers.length > 0) {
                return (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No users found matching your search criteria"
                        style={{ marginTop: 48 }}
                    />
                );
            }

            return (
                <Row gutter={[24, 24]}>
                    {filteredAndSortedUsers.map(renderUserCard)}
                </Row>
            );
        } else {
            // Regular user view - show products (excluding their own)
            if (isLoadingProducts) {
                return <ProductGrid products={[]} loading={true} columns={4} />;
            }

            if (productsError) {
                return (
                    <Alert
                        message="Error Loading Products"
                        description="Failed to load products. Please try again later."
                        type="error"
                        showIcon
                        style={{ marginTop: 24 }}
                    />
                );
            }

            if (filteredAndSortedProducts.length === 0 && displayProducts.length > 0) {
                return (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No products found matching your search criteria"
                        style={{ marginTop: 48 }}
                    />
                );
            }

            return (
                <ProductGrid
                    products={filteredAndSortedProducts}
                    loading={false}
                    columns={4}
                />
            );
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content 
                style={{
                    padding: token.spacing.lg,
                    backgroundColor: token.colorBgLayout,
                    minHeight: `calc(100vh - ${token.layout.headerHeight}px - ${token.layout.footerHeight}px)`,
                    marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
                }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    {/* Header Section */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <Title level={2} style={{ marginBottom: 8 }}>
                            {isAdmin ? (
                                <>
                                    <UserOutlined style={{ marginRight: 12 }} />
                                    User Management Dashboard
                                </>
                            ) : (
                                <>
                                    <AppstoreOutlined style={{ marginRight: 12 }} />
                                    Discover Amazing Products
                                </>
                            )}
                        </Title>
                        <Paragraph style={{ fontSize: 16, color: token.colorTextSecondary, marginBottom: 0 }}>
                            {isAdmin 
                                ? `Manage and view all ${allUsers.length} registered users in the platform`
                                : `Browse through ${displayProducts.length} products from various sellers`
                            }
                        </Paragraph>
                    </div>

                    <Divider />

                    {/* Filters Section */}
                    {renderFilters()}

                    {/* Results Summary */}
                    <Card style={{ marginBottom: 24, backgroundColor: token.colorBgContainer }}>
                        <Space split={<Divider type="vertical" />}>
                            <Text>
                                <strong>
                                    {isAdmin ? filteredAndSortedUsers.length : filteredAndSortedProducts.length}
                                </strong> {isAdmin ? 'users' : 'products'} found
                            </Text>
                            {searchTerm && (
                                <Text type="secondary">
                                    Search: "{searchTerm}"
                                </Text>
                            )}
                            {selectedCategory && (
                                <Text type="secondary">
                                    Filtered by: {isAdmin ? selectedCategory : categories.find(c => c.id === selectedCategory)?.categoryName}
                                </Text>
                            )}
                        </Space>
                    </Card>

                    {/* Content Section */}
                    {renderContent()}
                </div>
            </Content>

            <Footer style={{
                textAlign: 'center',
                backgroundColor: token.colorBgContainer,
                color: token.colorTextSecondary,
                padding: token.spacing.md,
                borderTop: `1px solid ${token.colorBorder}`,
            }}>
                DEAL E-Commerce ©{new Date().getFullYear()} - 
                {isAdmin ? ' Admin Dashboard' : ' Shopping Platform'}
            </Footer>
        </Layout>
    );
};