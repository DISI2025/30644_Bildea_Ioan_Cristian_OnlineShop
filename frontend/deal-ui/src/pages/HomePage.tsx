import React, {useMemo, useState, useCallback} from 'react';
import {Alert, Card, Col, Divider, Empty, Row, Skeleton, Space, theme, Typography, Pagination} from 'antd';
import {useSelector} from 'react-redux';
import ProductGrid from '../components/product/ProductGrid';
import {SearchFilters} from '../components/common';
import {
    useGetProductCategoriesQuery,
    useGetProductsBySellerIdQuery,
    useGetProductsQuery,
    useGetProductsPaginatedQuery,
    useGetUsersQuery
} from '../store/api';
import {selectAuthState} from '../store/slices/auth-slice';
import {MainUser, UserRole} from '../types/entities';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import UserCard from "../components/admin/UserCard.tsx";
import {ProductsFilter} from '../types/transfer';

const {useToken} = theme;
const {Text} = Typography;

type SortOption = 'name-asc' | 'name-desc' | 'price-low' | 'price-high';

export const HomePage: React.FC = () => {
    const {token} = useToken();
    const authState = useSelector(selectAuthState);
    const isAdmin = authState.user?.role === UserRole.ADMIN;
    const currentUserId = authState.user?.id || '';

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');
    const [selectedUser, setSelectedUser] = useState<MainUser | null>(null);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);

    const getProductsFilter = useCallback((): ProductsFilter => {
        const filter: ProductsFilter = {
            page: currentPage - 1,
            size: 4
        };

        if (searchTerm) {
            filter.search = searchTerm;
        }

        switch (sortOption) {
            case 'name-asc':
                filter.property = 'title';
                filter.sort = 'ASC';
                break;
            case 'name-desc':
                filter.property = 'title';
                filter.sort = 'DESC';
                break;
            case 'price-low':
                filter.property = 'price';
                filter.sort = 'ASC';
                break;
            case 'price-high':
                filter.property = 'price';
                filter.sort = 'DESC';
                break;
        }

        return filter;
    }, [currentPage, searchTerm, sortOption]);

    const productsFilter = getProductsFilter();
    const {data: paginatedProductsResponse, error: productsError, isLoading: isLoadingProducts} = useGetProductsPaginatedQuery(productsFilter, {
        skip: isAdmin
    });
    
    const shouldSkipAllProducts = isAdmin || !!searchTerm || sortOption !== 'name-asc';
    const {data: allProductsResponse} = useGetProductsQuery(undefined, {
        skip: shouldSkipAllProducts
    });

    const {data: usersResponse, error: usersError, isLoading: isLoadingUsers} = useGetUsersQuery(undefined, {
        skip: !isAdmin
    });
    
    const {data: userProductsResponse} = useGetProductsBySellerIdQuery(currentUserId, {
        skip: isAdmin || !currentUserId
    });
    
    const {data: categoriesResponse, isLoading: isLoadingCategories} = useGetProductCategoriesQuery();

    const paginatedProducts = paginatedProductsResponse?.payload || [];
    const paginationDetails = paginatedProductsResponse?.pagination;
    const allProducts = allProductsResponse?.payload || [];
    const allUsers = usersResponse?.payload || [];
    const userProducts = userProductsResponse?.payload || [];
    const categories = categoriesResponse?.payload || [];

    const displayProducts = useMemo(() => {
        if (isAdmin) return [];

        const products = paginatedProducts.length > 0 ? paginatedProducts : allProducts;
        
        const userProductIds = userProducts.map(p => p.id);
        return products.filter(product => !userProductIds.includes(product.id));
    }, [paginatedProducts, allProducts, userProducts, isAdmin]);

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
                case 'price-low':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'price-high':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    }, [allUsers, searchTerm, selectedCategory, sortOption, isAdmin]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        if (!isAdmin) {
            return;
        }
        setCurrentPage(1);
    };

    const handleSortChange = (value: SortOption) => {
        setSortOption(value);
        setCurrentPage(1);
    };

    const handleClearAll = () => {
        setSearchTerm('');
        if (isAdmin) {
            setSelectedCategory('');
        }
        setSortOption('name-asc');
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                    <Row gutter={[12, 12]}>
                        {Array.from({length: 8}).map((_, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={index}>
                                <Card style={{
                                    height: '280px',
                                    borderRadius: token.borderRadiusLG,
                                    border: `1px solid ${token.colorBorder}`
                                }}>
                                    <Skeleton active avatar paragraph={{rows: 3}}/>
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
                        style={{marginTop: token.marginMD}}
                    />
                );
            }

            if (filteredAndSortedUsers.length === 0 && allUsers.length > 0) {
                return (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No users found matching your search criteria"
                        style={{marginTop: token.marginLG}}
                    />
                );
            }

            return (
                <Row gutter={[12, 12]}>
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
                        style={{marginTop: token.marginMD}}
                    />
                );
            }

            if (displayProducts.length === 0) {
                return (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No products found matching your search criteria"
                        style={{marginTop: token.marginLG}}
                    />
                );
            }

            return (
                <>
                    <ProductGrid
                        products={displayProducts}
                        loading={false}
                        columns={4}
                        gutter={[12, 12]}
                    />
                    
                    {paginationDetails && paginationDetails.totalPages > 1 && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            marginTop: token.marginMD 
                        }}>
                            <Pagination
                                current={currentPage}
                                total={paginationDetails.totalElements}
                                pageSize={paginationDetails.size}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper={false}
                                showTotal={(total, range) => 
                                    `${range[0]}-${range[1]} of ${total} products`
                                }
                                style={{
                                    fontSize: token.fontSize,
                                }}
                            />
                        </div>
                    )}
                </>
            );
        }
    };

    return (
        <div style={{ 
            paddingTop: `calc(${token.layout.headerHeight} + ${token.paddingSM}px)`,
            paddingLeft: token.paddingMD,
            paddingRight: token.paddingMD,
            paddingBottom: token.paddingSM,
            height: '100%',
            overflow: 'auto',
        }}>
            <div style={{
                maxWidth: token.screenXL,
                margin: '0 auto',
                width: '100%',
            }}>

                <SearchFilters
                    isAdmin={isAdmin}
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    sortOption={sortOption}
                    categories={isAdmin ? categories : []}
                    isLoadingCategories={isLoadingCategories}
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onSortChange={handleSortChange}
                    onClearAll={handleClearAll}
                />

                <Card style={{
                    marginBottom: token.marginMD,
                    backgroundColor: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorder}`
                }}>
                    <Space split={<Divider type="vertical"/>} wrap>
                        <Text style={{color: token.colorText}}>
                            <strong>
                                {isAdmin 
                                    ? filteredAndSortedUsers.length 
                                    : paginationDetails?.totalElements || displayProducts.length
                                }
                            </strong> {isAdmin ? 'users' : 'products'} found
                        </Text>
                        {searchTerm && (
                            <Text type="secondary">
                                Search: "{searchTerm}"
                            </Text>
                        )}
                        {selectedCategory && isAdmin && (
                            <Text type="secondary">
                                Filtered by: {selectedCategory}
                            </Text>
                        )}
                        {!isAdmin && paginationDetails && (
                            <Text type="secondary">
                                Page {currentPage} of {paginationDetails.totalPages}
                            </Text>
                        )}
                    </Space>
                </Card>

                <div style={{marginBottom: token.marginMD}}>
                    {renderContent()}
                </div>
            </div>

            <UserDetailsModal
                user={selectedUser}
                visible={isUserModalVisible}
                onClose={handleCloseUserModal}
            />
        </div>
    );
};