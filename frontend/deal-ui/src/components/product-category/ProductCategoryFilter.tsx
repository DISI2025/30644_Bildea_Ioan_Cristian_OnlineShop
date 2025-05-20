import React from 'react';
import { Select, Space } from 'antd';

interface ProductCategoryFilterProps {
  onSortChange: (value: 'asc' | 'desc' | null) => void;
}

const ProductCategoryFilter: React.FC<ProductCategoryFilterProps> = ({ onSortChange }) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Select
        style={{ width: "100%" }}
        placeholder="Sort by name"
        allowClear
        onChange={(value) => onSortChange(value as 'asc' | 'desc' | null)}
      >
        <Select.Option value="asc">Name Ascending (A → Z)</Select.Option>
        <Select.Option value="desc">Name Descending (Z → A)</Select.Option>
      </Select>
    </Space>
  );
};

export default ProductCategoryFilter; 