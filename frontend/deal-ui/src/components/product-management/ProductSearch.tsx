import React from 'react';
import {Input, Card} from 'antd';
import {SearchOutlined} from '@ant-design/icons';

interface ProductSearchProps {
    onSearch: (value: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({onSearch}) => {
    return (
        <Card style={{marginBottom: '16px'}}>
            <Input
                placeholder="Search products by name..."
                prefix={<SearchOutlined/>}
                onChange={(e) => onSearch(e.target.value)}
                allowClear
                size="large"
            />
        </Card>
    );
};

export default ProductSearch; 