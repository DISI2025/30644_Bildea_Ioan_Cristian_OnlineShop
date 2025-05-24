import React from 'react';
import {Card, Typography, Tag, theme} from 'antd';
import {Link} from 'react-router-dom';
import {Product} from '../../types/entities';

const {Text} = Typography;
const { useToken } = theme;

interface ProductCardProps {
  product: Product;
}
//TODO Delete this after the product visualization is done
const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  const { token } = useToken();
  
  return (
    <Link to={`/products/${product.id}`} style={{textDecoration: 'none', display: 'block', height: '100%'}}>
      <Card
        hoverable
        style={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorder}`,
          transition: 'all 0.3s ease',
          backgroundColor: token.colorBgContainer
        }}
        styles={{ 
          body: { 
            padding: token.paddingMD,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
        cover={
          <div style={{
            height: 220, 
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`
          }}>
            <img 
              alt={product.title} 
              src={product.imageUrl || 'https://via.placeholder.com/300x220?text=No+Image'} 
              style={{
                width: '100%', 
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>
        }
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ marginBottom: token.marginSM }}>
            <Typography.Title 
              level={4} 
              style={{ 
                margin: 0, 
                marginBottom: token.marginXS,
                fontSize: token.fontSizeLG,
                lineHeight: token.lineHeight,
                height: '44px', // Fixed height for 2 lines
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                color: token.colorText
              }}
              title={product.title}
            >
              {product.title}
            </Typography.Title>
            
            <Text 
              style={{ 
                fontSize: token.fontSizeXL, 
                fontWeight: token.fontWeightStrong, 
                color: token.colorPrimary,
                display: 'block',
                marginBottom: token.marginSM
              }}
            >
              ${product.price.toFixed(2)}
            </Text>
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            <div style={{ 
              marginBottom: token.marginSM,
              minHeight: '32px', // Fixed height for categories
              display: 'flex',
              flexWrap: 'wrap',
              gap: token.marginXXS
            }}>
              {product.categories.slice(0, 2).map((category) => (
                <Tag key={category.id} color="blue" style={{ margin: 0 }}>
                  {category.categoryName}
                </Tag>
              ))}
              {product.categories.length > 2 && (
                <Tag color="default" style={{ margin: 0 }}>
                  +{product.categories.length - 2}
                </Tag>
              )}
            </div>
            
            <Text 
              type={product.stock > 0 ? 'success' : 'danger'}
              style={{ 
                fontSize: token.fontSize,
                fontWeight: token.fontWeightStrong
              }}
            >
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard; 