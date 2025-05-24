import React, {useMemo, useState} from 'react';
import {Alert, Card, Col, Divider, Empty, Layout, Row, Skeleton, Space, theme, Typography} from 'antd';
import {AppstoreOutlined, UserOutlined} from '@ant-design/icons';
import {useSelector} from 'react-redux';
import ProductGrid from '../components/product/ProductGrid';
import {SearchFilters} from '../components/common';
import {
    useGetProductCategoriesQuery,
    useGetProductsBySellerIdQuery,
    useGetProductsQuery,
    useGetUsersQuery
} from '../store/api';
import {selectAuthState} from '../store/slices/auth-slice';
import {MainUser, UserRole} from '../types/entities';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import UserCard from "../components/admin/UserCard.tsx";

const {Content} = Layout;
const {useToken} = theme;
const {Title, Text, Paragraph} = Typography;

type SortOption = 'name-asc' | 'name-desc' | 'price-low' | 'price-high';

export const HomePage: React.FC = () => {
    const {token} = useToken();
    const authState = useSelector(selectAuthState);
    const isAdmin = authState.user?.role === UserRole.ADMIN;
    const currentUserId = authState.user?.id || '';

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');
    const [selectedUser, setSelectedUser] = useState<MainUser | null>(null);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);

    // API queries
    const {data: allProductsResponse, error: productsError, isLoading: isLoadingProducts} = useGetProductsQuery();
    const {data: usersResponse, error: usersError, isLoading: isLoadingUsers} = useGetUsersQuery(undefined, {
        skip: !isAdmin
    });
    const {data: userProductsResponse} = useGetProductsBySellerIdQuery(currentUserId, {
        skip: isAdmin || !currentUserId
    });
    const {data: categoriesResponse, isLoading: isLoadingCategories} = useGetProductCategoriesQuery();

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

    const filteredAndSortedUsers = useMemo(() => {
        if (!isAdmin) return [];

        let filtered = [...allUsers];

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.storeAddress && user.storeAddress.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(user => {
                if (selectedCategory === 'ADMIN') {
                    return user.role === UserRole.ADMIN;
                } else if (selectedCategory === 'SELLER') {
                    return user.role === UserRole.USER && !!user.storeAddress;
                } else if (selectedCategory === 'BUYER') {
                    return user.role === UserRole.USER;
                } else if (selectedCategory === 'SELLER_BUYER') {
                    return user.role === UserRole.USER && !!user.storeAddress;
                }
                return false;
            });
        }

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

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const handleSortChange = (value: SortOption) => {
        setSortOption(value);
    };

    const handleClearAll = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortOption('name-asc');
    };

    const handleUserClick = (user: MainUser) => {
        setSelectedUser(user);
        setIsUserModalVisible(true);
    };

    const handleCloseUserModal = () => {
        setIsUserModalVisible(false);
        setSelectedUser(null);
    };

    const renderContent = () => {
        if (isAdmin) {
            if (isLoadingUsers) {
                return (
                    <Row gutter={[token.padding, token.padding]}>
                        {Array.from({length: 8}).map((_, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={index}>
                                <Card style={{
                                    height: '320px',
                                    borderRadius: token.borderRadiusLG,
                                    border: `1px solid ${token.colorBorder}`
                                }}>
                                    <Skeleton active avatar paragraph={{rows: 4}}/>
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
                        style={{marginTop: token.marginLG}}
                    />
                );
            }

            if (filteredAndSortedUsers.length === 0 && allUsers.length > 0) {
                return (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No users found matching your search criteria"
                        style={{marginTop: token.marginXXL}}
                    />
                );
            }

            return (
                <Row gutter={[token.padding, token.padding]}>
                    {filteredAndSortedUsers.map(user => (
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} key={user.id}>
                            <UserCard user={user} onClick={handleUserClick}/>
                        </Col>
                    ))}
                </Row>
            );
        } else {
            if (isLoadingProducts) {
                return <ProductGrid products={[]} loading={true} columns={4}/>;
            }

            if (productsError) {
                return (
                    <Alert
                        message="Error Loading Products"
                        description="Failed to load products. Please try again later."
                        type="error"
                        showIcon
                        style={{marginTop: token.marginLG}}
                    />
                );
            }

            if (filteredAndSortedProducts.length === 0 && displayProducts.length > 0) {
                return (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No products found matching your search criteria"
                        style={{marginTop: token.marginXXL}}
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
        <Layout style={{minHeight: '100vh'}}>
            <Content
                style={{
                    padding: `${token.paddingLG}px ${token.paddingMD}px`,
                    backgroundColor: token.colorBgLayout,
                    minHeight: 'calc(100vh - 64px)', // Account for navbar height
                    width: '100%',
                    overflow: 'auto'
                }}
            >
                <div style={{
                    maxWidth: token.screenXL,
                    margin: '0 auto',
                    width: '100%',
                    padding: `0 ${token.paddingMD}px`
                }}>
                    {/* Header Section */}
                    <div style={{textAlign: 'center', marginBottom: token.marginXL}}>
                        <Title level={2} style={{marginBottom: token.marginXS, color: token.colorText}}>
                            {isAdmin ? (
                                <>
                                    <UserOutlined style={{marginRight: token.marginSM}}/>
                                    User Management Dashboard
                                </>
                            ) : (
                                <>
                                    <AppstoreOutlined style={{marginRight: token.marginSM}}/>
                                    Discover Amazing Products
                                </>
                            )}
                        </Title>
                        <Paragraph style={{
                            fontSize: token.fontSizeLG,
                            color: token.colorTextSecondary,
                            marginBottom: 0
                        }}>
                            {isAdmin
                                ? `Manage and view all ${allUsers.length} registered users in the platform`
                                : `Browse through ${displayProducts.length} products from various sellers`
                            }
                        </Paragraph>
                    </div>

                    <Divider style={{marginBottom: token.marginLG}}/>

                    {/* Filters Section */}
                    <SearchFilters
                        isAdmin={isAdmin}
                        searchTerm={searchTerm}
                        selectedCategory={selectedCategory}
                        sortOption={sortOption}
                        categories={categories}
                        isLoadingCategories={isLoadingCategories}
                        onSearchChange={handleSearchChange}
                        onCategoryChange={handleCategoryChange}
                        onSortChange={handleSortChange}
                        onClearAll={handleClearAll}
                    />

                    {/* Results Summary */}
                    <Card style={{
                        marginBottom: token.marginLG,
                        backgroundColor: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        border: `1px solid ${token.colorBorder}`
                    }}>
                        <Space split={<Divider type="vertical"/>} wrap>
                            <Text style={{color: token.colorText}}>
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
                                    Filtered
                                    by: {isAdmin ? selectedCategory : categories.find(c => c.id === selectedCategory)?.categoryName}
                                </Text>
                            )}
                        </Space>
                    </Card>

                    {/* Content Section */}
                    <div style={{paddingBottom: token.paddingLG}}>
                        {renderContent()}
                    </div>
                </div>
            </Content>

            <UserDetailsModal
                user={selectedUser}
                visible={isUserModalVisible}
                onClose={handleCloseUserModal}
            />
        </Layout>
    );
};