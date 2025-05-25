import React from 'react';
import { 
    Card, 
    Input, 
    Select, 
    Button, 
    Row, 
    Col, 
    Space, 
    theme 
} from 'antd';
import { 
    SearchOutlined, 
    FilterOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { ProductCategory } from '../../types/entities';

const { useToken } = theme;
const { Option } = Select;

type SortOption = 'name-asc' | 'name-desc' | 'price-low' | 'price-high';

interface SearchFiltersProps {
    isAdmin: boolean;
    searchTerm: string;
    selectedCategory: string;
    sortOption: SortOption;
    categories?: ProductCategory[];
    isLoadingCategories?: boolean;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSortChange: (value: SortOption) => void;
    onClearAll: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    isAdmin,
    searchTerm,
    selectedCategory,
    sortOption,
    categories = [],
    isLoadingCategories = false,
    onSearchChange,
    onCategoryChange,
    onSortChange,
    onClearAll
}) => {
    const { token } = useToken();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    return (
        <Card style={{ 
            marginBottom: token.marginMD, 
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorBorder}`,
            backgroundColor: token.colorBgContainer
        }}>
            <Row gutter={[token.paddingSM, token.paddingSM]} align="middle">
                <Col xs={24} sm={24} md={isAdmin || categories.length > 0 ? 8 : 12} lg={isAdmin || categories.length > 0 ? 8 : 12}>
                    <Input
                        placeholder={isAdmin ? "Search users..." : "Search products..."}
                        prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        size="middle"
                        style={{ 
                            fontSize: token.fontSize
                        }}
                    />
                </Col>
                {(isAdmin || categories.length > 0) && (
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Select
                            placeholder={isAdmin ? "Filter by role" : "Filter by category"}
                            style={{ width: '100%' }}
                            size="middle"
                            allowClear
                            value={selectedCategory || undefined}
                            onChange={onCategoryChange}
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
                )}
                <Col xs={24} sm={12} md={6} lg={6}>
                    <Select
                        placeholder="Sort by"
                        style={{ width: '100%' }}
                        size="middle"
                        value={sortOption}
                        onChange={onSortChange}
                    >
                        <Option value="name-asc">
                            <Space size={token.marginXS}>
                                <SortAscendingOutlined />
                                {isAdmin ? 'Name A-Z' : 'Name A-Z'}
                            </Space>
                        </Option>
                        <Option value="name-desc">
                            <Space size={token.marginXS}>
                                <SortDescendingOutlined />
                                {isAdmin ? 'Name Z-A' : 'Name Z-A'}
                            </Space>
                        </Option>
                        <Option value="price-low">
                            <Space size={token.marginXS}>
                                <CalendarOutlined />
                                {isAdmin ? 'Oldest First' : 'Lowest Price'}
                            </Space>
                        </Option>
                        <Option value="price-high">
                            <Space size={token.marginXS}>
                                <CalendarOutlined />
                                {isAdmin ? 'Newest First' : 'Highest Price'}
                            </Space>
                        </Option>
                    </Select>
                </Col>
                <Col xs={24} sm={24} md={4} lg={4}>
                    <Button 
                        type="default" 
                        onClick={onClearAll}
                        size="middle"
                        style={{ 
                            width: '100%'
                        }}
                    >
                        Clear All
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default SearchFilters; 