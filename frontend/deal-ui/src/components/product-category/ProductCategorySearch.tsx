import React from 'react';
import { Col, Input, Row } from 'antd';

const { Search } = Input;

interface ProductCategorySearchProps {
  onSearch: (value: string) => void;
}

const ProductCategorySearch: React.FC<ProductCategorySearchProps> = ({ onSearch }) => {
  return (
    <Row justify="center" style={{ marginBottom: "2rem" }}>
      <Col xs={24} sm={22} md={20} lg={16}>
        <Search
          placeholder="Search product categories by name"
          allowClear
          enterButton="Search"
          size="large"
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>
    </Row>
  );
};

export default ProductCategorySearch; 