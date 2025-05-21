import React from 'react';
import {Row, Col, Spin, Empty} from 'antd';
import {Product} from '../../types/entities';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
  columns?: number;
  gutter?: [number, number];
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  loading = false,
  columns = 4,
  gutter = [16, 24]
}) => {
  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', padding: '40px 0'}}>
        <Spin size="large" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <Empty description="No products found" />;
  }

  return (
    <Row gutter={gutter}>
      {products.map((product) => (
        <Col key={product.id} xs={24} sm={12} md={8} lg={24 / columns} xl={24 / columns} xxl={24 / columns}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid; 