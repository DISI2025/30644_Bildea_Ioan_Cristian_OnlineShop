import React from 'react';
import {Row, Col, Spin, Empty, theme} from 'antd';
import {Product} from '../../types/entities';
import ProductCard from './ProductCard';

const { useToken } = theme;

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
  gutter
}) => {
  const { token } = useToken();
  const defaultGutter: [number, number] = [token.padding, token.padding];
  const gridGutter = gutter || defaultGutter;

  if (loading) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        padding: `${token.paddingXL}px 0`
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Empty 
        description="No products found" 
        style={{ padding: `${token.paddingXL}px 0` }} 
      />
    );
  }

  return (
    <Row 
      gutter={gridGutter} 
      style={{ 
        backgroundColor: token.colorBgLayout
      }}
    >
      {products.map((product) => (
        <Col 
          key={product.id} 
          xs={24} 
          sm={12} 
          md={8} 
          lg={24 / columns} 
          xl={24 / columns} 
          xxl={24 / columns}
          style={{ 
            marginBottom: gridGutter[1],
            display: 'flex',
            alignItems: 'stretch'
          }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <ProductCard product={product} />
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid; 