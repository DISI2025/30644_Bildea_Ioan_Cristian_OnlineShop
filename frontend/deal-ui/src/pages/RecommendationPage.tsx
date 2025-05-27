import React, {useMemo, useState, useCallback} from 'react';
import {Alert, Card, Divider, Empty, Space, theme, Typography, Pagination} from 'antd';
import {useSelector} from 'react-redux';
import ProductGrid from '../components/product/ProductGrid';
import {SearchFilters} from '../components/common';
import {
    useGetProductCategoriesQuery,
    useGetRecommendedProductsQuery
} from '../store/api';
import {selectAuthState} from '../store/slices/auth-slice';
import {ProductsFilter} from '../types/transfer';

const {useToken} = theme;
const {Text, Title} = Typography;

type SortOption = 'name-asc' | 'name-desc' | 'price-low' | 'price-high';

export const RecommendationPage: React.FC = () => {
    const {token} = useToken();
    const authState = useSelector(selectAuthState);
    const currentUserId = authState.user?.id || '';

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');

    const getProductsFilter = useCallback((): ProductsFilter => {
        const filter: ProductsFilter = {
            page: currentPage - 1,
            size: 8
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
    const {data: recommendedProductsResponse, error: productsError, isLoading: isLoadingProducts} = useGetRecommendedProductsQuery({
        userId: currentUserId,
        filter: productsFilter
    }, {
        skip: !currentUserId
    });
    
    const {data: categoriesResponse, isLoading: isLoadingCategories} = useGetProductCategoriesQuery();

    const recommendedProducts = recommendedProductsResponse?.payload || [];
    const paginationDetails = recommendedProductsResponse?.pagination;
    const categories = categoriesResponse?.payload || [];

    const displayProducts = useMemo(() => {
        return recommendedProducts;
    }, [recommendedProducts]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        setCurrentPage(1);
    };

    const handleSortChange = (value: SortOption) => {
        setSortOption(value);
        setCurrentPage(1);
    };

    const handleClearAll = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortOption('name-asc');
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderContent = () => {
        if (isLoadingProducts) {
            return <ProductGrid products={[]} loading={true} columns={4}/>;
        }

        if (productsError) {
            return (
                <Alert
                    message="Error Loading Recommendations"
                    description="Failed to load recommended products. Please try again later."
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
                    description="No recommendations found. Start browsing products to get personalized recommendations!"
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
                                `${range[0]}-${range[1]} of ${total} recommendations`
                            }
                            style={{
                                fontSize: token.fontSize,
                            }}
                        />
                    </div>
                )}
            </>
        );
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
                <div style={{ marginBottom: token.marginLG }}>
                    <Title level={2} style={{ 
                        margin: 0, 
                        color: token.colorText,
                        textAlign: 'center'
                    }}>
                        Recommended for You
                    </Title>
                    <Text type="secondary" style={{ 
                        display: 'block', 
                        textAlign: 'center',
                        marginTop: token.marginXS
                    }}>
                        Discover products tailored to your interests
                    </Text>
                </div>

                <SearchFilters
                    isAdmin={false}
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

                <Card style={{
                    marginBottom: token.marginMD,
                    backgroundColor: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorder}`
                }}>
                    <Space split={<Divider type="vertical"/>} wrap>
                        <Text style={{color: token.colorText}}>
                            <strong>
                                {paginationDetails?.totalElements || displayProducts.length}
                            </strong> recommendations found
                        </Text>
                        {searchTerm && (
                            <Text type="secondary">
                                Search: "{searchTerm}"
                            </Text>
                        )}
                        {selectedCategory && (
                            <Text type="secondary">
                                Filtered by: {selectedCategory}
                            </Text>
                        )}
                        {paginationDetails && (
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
        </div>
    );
}; 