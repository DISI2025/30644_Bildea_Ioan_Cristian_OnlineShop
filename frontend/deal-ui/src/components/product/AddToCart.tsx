import React, {useEffect} from 'react';
import {Button, InputNumber, Space, theme, Typography} from 'antd';
import {DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import {
    addToCart,
    removeFromCart,
    selectCartItemByProductId,
    updateCartItemQuantity
} from '../../store/slices/cart-slice';
import {Product} from '../../types/entities';
import {useSnackbar} from "../../context/SnackbarContext.tsx";

const {Text} = Typography;
const {useToken} = theme;

interface AddToCartProps {
    productId: string;
    product: Product;
    stock: number;
    price: number;
}

export const AddToCart: React.FC<AddToCartProps> = ({
                                                        productId,
                                                        product,
                                                        stock,
                                                        price,
                                                    }) => {
    const {token} = useToken();
    const dispatch = useDispatch();
    const {showWarning, showSuccess} = useSnackbar();

    const cartItem = useSelector(selectCartItemByProductId(productId));
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const [quantityToAdd, setQuantityToAdd] = React.useState(1);

    useEffect(() => {
        setQuantityToAdd(1);
    }, [productId]);

    const handleQuantityChange = (value: number | null) => {
        const newQuantity = value || 1;

        const availableStock = stock - quantityInCart;
        if (newQuantity > availableStock) {
            showWarning('Stock limit reached', `Only ${availableStock} additional items are available.`);
            setQuantityToAdd(Math.max(availableStock, 1));
            return;
        }

        setQuantityToAdd(newQuantity);
    };

    const increaseQty = () => {
        const availableStock = stock - quantityInCart;
        if (quantityToAdd < availableStock) {
            setQuantityToAdd(quantityToAdd + 1);
        } else {
            showWarning('Stock limit reached', `Only ${availableStock} additional items are available.`);
        }
    };

    const decreaseQty = () => {
        if (quantityToAdd > 1) {
            setQuantityToAdd(quantityToAdd - 1);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            const availableStock = stock - quantityInCart;
            const newQuantity = Math.min(quantityToAdd, availableStock);

            if (newQuantity !== quantityToAdd) {
                showWarning('Stock limit reached', `Only ${availableStock} additional items are available.`);
                setQuantityToAdd(Math.max(newQuantity, 1));
            }

            if (quantityInCart > 0) {
                dispatch(updateCartItemQuantity({
                    productId: product.id,
                    quantity: quantityInCart + newQuantity
                }));
            } else {
                dispatch(addToCart({
                    product,
                    quantity: newQuantity
                }));
            }

            showSuccess('Added to Cart', `${newQuantity} item(s) added to your cart.`)
            setQuantityToAdd(1);
        }
    };

    const handleRemoveFromCart = () => {
        if (product && quantityInCart > 0) {
            dispatch(removeFromCart(product.id));
            showSuccess('Removed from Cart', `Products removed from your cart.`)
        }
    };

    const availableStock = stock - quantityInCart;
    const isAddToCartDisabled = !product || stock <= 0 || availableStock <= 0;

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: token.marginSM
            }}>
                <Text strong style={{color: token.colorTextSecondary}}>Quantity to add:</Text>
                <Space>
                    <Button
                        icon={<MinusOutlined/>}
                        onClick={decreaseQty}
                        disabled={quantityToAdd <= 1}
                        shape="circle"
                        type="text"
                        style={{
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                    <InputNumber
                        min={1}
                        max={availableStock}
                        value={quantityToAdd}
                        onChange={handleQuantityChange}
                        style={{
                            width: '60px',
                            borderColor: token.colorBorder
                        }}
                    />
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={increaseQty}
                        disabled={quantityToAdd >= availableStock}
                        shape="circle"
                        type="text"
                        style={{
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    />
                </Space>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: token.marginLG
            }}>
                <Text strong style={{color: token.colorTextSecondary}}>Total:</Text>
                <Text strong style={{
                    fontSize: token.fontSizeLG,
                    color: token.colorPrimary
                }}>${(price * quantityToAdd).toFixed(2)}</Text>
            </div>

            <Space direction="vertical" style={{width: '100%'}}>
                <Button
                    type="primary"
                    icon={<ShoppingCartOutlined/>}
                    size="large"
                    block
                    onClick={handleAddToCart}
                    disabled={isAddToCartDisabled}
                    style={{
                        height: token.controlHeight * 1.5,
                        borderRadius: 12,
                        backgroundColor: token.colorPrimary,
                        borderColor: token.colorPrimary
                    }}
                >
                    {availableStock <= 0 ? 'Max Quantity In Cart' : stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                {quantityInCart > 0 && (
                    <Button
                        danger
                        icon={<DeleteOutlined/>}
                        size="large"
                        block
                        onClick={handleRemoveFromCart}
                        style={{
                            height: token.controlHeight * 1.5,
                            borderRadius: 12
                        }}
                    >
                        Remove from Cart
                    </Button>
                )}
            </Space>
        </div>
    );
};