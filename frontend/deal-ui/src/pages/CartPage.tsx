import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Card, Col, Divider, Empty, InputNumber, Layout, Row, Skeleton, Space, Table, theme, Typography} from 'antd';
import {DeleteOutlined, ShoppingOutlined, ShopOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {
    CartItem,
    clearCart,
    removeFromCart,
    selectCartItems,
    selectCartTotalPrice,
    updateCartItemQuantity
} from '../store/slices/cart-slice';
import {ROUTES} from '../routes/AppRouter';
import {useSnackbar} from "../context/SnackbarContext.tsx";
import {selectAuthState} from "../store/slices/auth-slice.ts";
import {useGetUserByIdQuery} from '../store/api';

const {Content} = Layout;
const {Title, Text} = Typography;
const {useToken} = theme;

const SellerInfo: React.FC<{ sellerId: string }> = ({ sellerId }) => {
    const { data: sellerResponse, isLoading } = useGetUserByIdQuery(sellerId);
    const seller = sellerResponse?.payload;

    if (isLoading) {
        return <Skeleton.Button active size="small" style={{ width: 120 }} />;
    }

    if (!seller) {
        return <Text type="secondary">Unknown Seller</Text>;
    }

    return (
        <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 14 }}>{seller.fullName || seller.username}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
                <ShopOutlined style={{ marginRight: 4 }} />
                {seller.storeAddress || 'No store address'}
            </Text>
        </Space>
    );
};

const CartPage: React.FC = () => {
    const {token} = useToken();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const {showError} = useSnackbar();

    const {user} = useSelector(selectAuthState);

    const handleQuantityChange = (productId: string, quantity: number) => {
        dispatch(updateCartItemQuantity({productId, quantity}));
    };

    const handleRemoveItem = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleCheckout = () => {
        if (!user) {
            showError('You must be logged in to proceed with checkout.');
            return;
        }

        if (cartItems.length === 0) {
            showError('Your cart is empty. Add some items before checkout.');
            return;
        }

        navigate(ROUTES.CHECKOUT, {
            state: {
                cartItems,
                totalPrice
            }
        });
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (_: unknown, record: CartItem) => (
                <Space>
                    <img
                        src={record.product.imageUrl}
                        alt={record.product.title}
                        style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 8}}
                    />
                    <Space direction="vertical" size={0}>
                        <Text strong style={{fontSize: 16}}>{record.product.title}</Text>
                        <Text type="secondary">ID: {record.product.id}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_: unknown, record: CartItem) => <Text strong>${record.product.price.toFixed(2)}</Text>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_: unknown, record: CartItem) => (
                <InputNumber
                    min={1}
                    max={record.product.stock}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.product.id, value || 1)}
                    style={{width: 60}}
                />
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (_: unknown, record: CartItem) => (
                <Text strong style={{color: token.colorPrimary}}>
                    ${(record.product.price * record.quantity).toFixed(2)}
                </Text>
            ),
        },
        {
            title: 'Seller',
            dataIndex: 'seller',
            key: 'seller',
            render: (_: unknown, record: CartItem) => (
                <SellerInfo sellerId={record.product.sellerId} />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: CartItem) => (
                <Button
                    icon={<DeleteOutlined/>}
                    danger
                    onClick={() => handleRemoveItem(record.product.id)}
                />
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{
                padding: '2rem',
                marginTop: `calc(${token.layout.headerHeight}px + 2rem)`,
                minHeight: 'calc(100vh - 64px)'
            }}>
                <div style={{maxWidth: 1200, margin: '0 auto'}}>
                    <Title level={2}>Shopping Cart</Title>

                    {cartItems.length === 0 ? (
                        <Card>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Your cart is empty"
                            >
                                <Button
                                    type="primary"
                                    icon={<ShoppingOutlined/>}
                                    onClick={() => navigate(ROUTES.HOME)}
                                >
                                    Continue Shopping
                                </Button>
                            </Empty>
                        </Card>
                    ) : (
                        <>
                            <Table
                                dataSource={cartItems}
                                columns={columns}
                                rowKey={(record) => record.product.id}
                                pagination={false}
                            />

                            <Row gutter={24} style={{marginTop: 24}}>
                                <Col xs={24} md={12}>
                                    <Space>
                                        <Button onClick={() => navigate(ROUTES.HOME)}>
                                            Continue Shopping
                                        </Button>
                                        <Button danger onClick={handleClearCart}>
                                            Clear Cart
                                        </Button>
                                    </Space>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card title="Order Summary">
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: 16
                                        }}>
                                            <Text strong>Subtotal:</Text>
                                            <Text strong>${totalPrice.toFixed(2)}</Text>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: 16
                                        }}>
                                            <Text>Shipping:</Text>
                                            <Text>Free</Text>
                                        </div>

                                        <Divider style={{margin: '12px 0'}}/>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: 16
                                        }}>
                                            <Title level={4} style={{margin: 0}}>Total:</Title>
                                            <Title level={4} style={{
                                                margin: 0,
                                                color: token.colorPrimary
                                            }}>${totalPrice.toFixed(2)}</Title>
                                        </div>

                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            onClick={handleCheckout}
                                            disabled={cartItems.length === 0}
                                            style={{
                                                marginTop: 16,
                                                backgroundColor: token.colorPrimary,
                                                borderColor: token.colorPrimary
                                            }}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default CartPage;