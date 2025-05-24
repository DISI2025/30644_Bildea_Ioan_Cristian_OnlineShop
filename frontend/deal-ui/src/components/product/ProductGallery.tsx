import React from 'react';
import { Card, Image, Skeleton, theme, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { selectCartItemByProductId } from '../../store/slices/cart-slice';
import { useGetProductByIdQuery } from '../../store/api';
import { AddToCart } from './AddToCart';

const { Text } = Typography;
const { useToken } = theme;

interface ProductGalleryProps {
    imageUrl: string;
    title: string;
    productId: string;
    stock: number;
    price: number;
    loading?: boolean;
}

//TODO Delete this after the product visualization is done
export const ProductGallery: React.FC<ProductGalleryProps> = ({
    imageUrl,
    title,
    productId,
    stock,
    price,
    loading = false
}) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const { token } = useToken();

    const { data: productResponse } = useGetProductByIdQuery(productId, {
        skip: !productId
    });
    const product = productResponse?.payload;

    const cartItem = useSelector(selectCartItemByProductId(productId));
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const totalPriceInCart = quantityInCart * price;

    return (
        <Card
            bordered={false}
            style={{
                height: '100%',
                borderRadius: 16,
                backgroundColor: token.colorBgContainer,
                boxShadow: token.boxShadow
            }}
            bodyStyle={{ padding: 0 }}
        >
            <div style={{ padding: token.paddingLG, paddingBottom: 0 }}>
                {(loading || !imageLoaded) && (
                    <Skeleton.Image 
                        active 
                        style={{ 
                            width: '100%', 
                            height: 400,
                            borderRadius: 12
                        }}
                    />
                )}

                <Image
                    src={imageUrl}
                    alt={title}
                    width="100%"
                    style={{
                        display: imageLoaded ? 'block' : 'none',
                        objectFit: 'cover',
                        maxHeight: 425,
                        borderRadius: 12
                    }}
                    onLoad={() => setImageLoaded(true)}
                    preview={{ mask: 'View Full Size' }}
                />
            </div>

            <div style={{
                padding: token.paddingLG,
                marginTop: token.marginMD,
                backgroundColor: token.colorBgContainer,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: token.marginMD
                }}>
                    {quantityInCart > 0 && (
                        <Card
                            size="small"
                            style={{
                                borderRadius: 12,
                                backgroundColor: token.colorPrimaryBg,
                                borderColor: token.colorPrimaryBorder,
                                width: 'auto',
                                marginRight: token.marginMD
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <Text strong style={{ color: token.colorPrimary, display: 'block' }}>
                                    {quantityInCart} in cart
                                </Text>
                                <Text style={{ color: token.colorPrimary, display: 'block' }}>
                                    Total: ${totalPriceInCart.toFixed(2)}
                                </Text>
                            </div>
                        </Card>
                    )}
                    <Text style={{
                        color: token.colorTextSecondary,
                        marginLeft: 'auto'
                    }}>
                        Only <Text strong>{stock}</Text> in stock!
                    </Text>
                </div>

                {product && (
                    <AddToCart
                        productId={productId}
                        product={product}
                        stock={stock}
                        price={price}
                    />
                )}
            </div>
        </Card>
    );
}; 