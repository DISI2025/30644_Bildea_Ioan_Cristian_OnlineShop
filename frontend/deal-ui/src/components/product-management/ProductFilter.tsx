import React from 'react';
import {Select, Space, Typography} from 'antd';
import {ProductCategory} from '../../types/entities';

const {Title} = Typography;

interface ProductFilterProps {
    onSortChange: (value: "asc" | "desc" | null) => void;
    onCategoryChange: (value: string | null) => void;
    productCategories: ProductCategory[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
                                                         onSortChange,
                                                         onCategoryChange,
                                                         productCategories
                                                     }) => {
    return (
        <Space direction="vertical" style={{width: '100%'}}>
            <div>
                <Title level={5}>Sort by Name</Title>
                <Select
                    placeholder="Sort by name"
                    style={{width: '100%'}}
                    onChange={onSortChange}
                    allowClear
                    options={[
                        {value: 'asc', label: 'A-Z'},
                        {value: 'desc', label: 'Z-A'},
                    ]}
                />
            </div>

            <div>
                <Title level={5}>Filter by Category</Title>
                <Select
                    placeholder="Select category"
                    style={{width: '100%'}}
                    onChange={onCategoryChange}
                    allowClear
                >
                    {productCategories.map(category => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.categoryName}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </Space>
    );
};

export default ProductFilter; 