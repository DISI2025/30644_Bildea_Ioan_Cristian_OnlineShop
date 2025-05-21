import React from 'react';
import {Card, Typography, Space, Tag} from 'antd';
import {Link} from 'react-router-dom';
import {Product} from '../../types/entities';

const {Meta} = Card;
const {Text} = Typography;

interface ProductCardProps {
  product: Product;
}
//TODO Delete this after the product visualization is done
const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  return (
    <Link to={`/products/${product.id}`} style={{textDecoration: 'none'}}>
      <Card
        hoverable
        cover={
          <div style={{height: 200, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img 
              alt={product.title} 
              src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
              style={{width: '100%', objectFit: 'cover'}} 
            />
          </div>
        }
      >
        <Meta 
          title={product.title} 
          description={
            <Space direction="vertical" size="small" style={{width: '100%'}}>
              <Text>${product.price.toFixed(2)}</Text>
              <div>
                {product.categories.map((category) => (
                  <Tag key={category.id} color="blue">
                    {category.categoryName}
                  </Tag>
                ))}
              </div>
              <Text type={product.stock > 0 ? 'success' : 'danger'}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </Text>
            </Space>
          } 
        />
      </Card>
    </Link>
  );
};

export default ProductCard; 