import React from 'react';
import {Card, Typography, Tag, theme} from 'antd';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Product} from '../../types/entities';
import {selectAuthState} from '../../store/slices/auth-slice';
import {useTrackProductViewMutation} from '../../store/api';

const {Text, Title} = Typography;
const { useToken } = theme;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  const { token } = useToken();
  const authState = useSelector(selectAuthState);
  const [trackProductView] = useTrackProductViewMutation();

  const handleProductClick = () => {
    if (authState.user?.id) {
      trackProductView({
        userId: authState.user.id,
        productId: product.id
      }).catch(error => {
        console.warn('Failed to track product view:', error);
      });
    }
  };
  
  return (
    <Link 
      to={`/products/${product.id}`} 
      style={{textDecoration: 'none', display: 'block', height: '100%'}}
      onClick={handleProductClick}
    >
      <Card
        hoverable
        style={{
          height: '100%',
          maxHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          background: token.colorBgContainer,
          color: token.colorText,
          border: `1px solid ${token.colorBorderSecondary}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateY(0)',
        }}
        styles={{ 
          body: { 
            padding: '14px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        }}
        cover={
          <div
            style={{
              paddingTop: '60%',
              position: 'relative',
              backgroundColor: token.colorFillQuaternary,
              overflow: 'hidden',
              borderRadius: '12px 12px 0 0'
            }}
          >
            <img 
              alt={product.title} 
              src={product.imageUrl || 'https://via.placeholder.com/280x168?text=No+Image&bg=2d2d2d&color=888'} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
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
            {product.stock === 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Out of Stock
              </div>
            )}
          </div>
        }
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          color: token.colorText
        }}>
          {product.categories.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              marginBottom: 10
            }}>
              {product.categories.slice(0, 2).map(cat => (
                <Tag
                  key={cat.id}
                  color="processing"
                  style={{ 
                    margin: 0, 
                    fontSize: '9px',
                    borderRadius: '4px',
                    border: 'none',
                    background: token.colorPrimaryBg,
                    color: token.colorPrimary,
                    padding: '1px 6px'
                  }}
                >
                  {cat.categoryName}
                </Tag>
              ))}
              {product.categories.length > 2 && (
                <Tag 
                  style={{ 
                    margin: 0, 
                    fontSize: '9px',
                    borderRadius: '4px',
                    background: token.colorFillSecondary,
                    color: token.colorTextSecondary,
                    border: 'none',
                    padding: '1px 6px'
                  }}
                >
                  +{product.categories.length - 2}
                </Tag>
              )}
            </div>
          )}

          <Title
            level={5}
            style={{
              margin: 0,
              lineHeight: 1.3,
              color: token.colorText,
              marginBottom: 12,
              fontSize: '14px',
              fontWeight: 600,
              minHeight: '36px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={product.title}
          >
            {product.title}
          </Title>

          <div style={{ marginTop: 'auto' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: token.colorPrimary,
                display: 'block',
                marginBottom: 10
              }}
            >
              ${product.price.toFixed(2)}
            </Text>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <Text
                type={product.stock > 0 ? 'success' : 'danger'}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: product.stock > 0 ? token.colorSuccessBg : token.colorErrorBg,
                  color: product.stock > 0 ? token.colorSuccess : token.colorError,
                  border: `1px solid ${product.stock > 0 ? token.colorSuccessBorder : token.colorErrorBorder}`
                }}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard; 