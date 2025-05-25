import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Card, Col, Divider, Empty, InputNumber, Layout, Row, Skeleton, Space, Table, theme, Typography, Image} from 'antd';
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
            width: 300,
            render: (_: unknown, record: CartItem) => (
                <Space>
                    <Image
                        src={record.product.imageUrl}
                        alt={record.product.title}
                        style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 8}}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
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
            width: 100,
            responsive: ['md'],
            render: (_: unknown, record: CartItem) => <Text strong>${record.product.price.toFixed(2)}</Text>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
            render: (_: unknown, record: CartItem) => (
                <InputNumber
                    min={1}
                    max={record.product.stock}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.product.id, value || 1)}
                    style={{width: '100%', maxWidth: 80}}
                />
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: 120,
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
            width: 200,
            responsive: ['lg'],
            render: (_: unknown, record: CartItem) => (
                <SellerInfo sellerId={record.product.sellerId} />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_: unknown, record: CartItem) => (
                <Button
                    icon={<DeleteOutlined/>}
                    danger
                    size="small"
                    onClick={() => handleRemoveItem(record.product.id)}
                />
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{
                padding: window.innerWidth < 768 ? '1rem' : '2rem',
                marginTop: `calc(${token.layout.headerHeight}px + ${window.innerWidth < 768 ? '1rem' : '2rem'})`,
                minHeight: 'calc(100vh - 64px)'
            }}>
                <div style={{maxWidth: 1200, margin: '0 auto'}}>
                    <Title level={2} style={{ textAlign: window.innerWidth < 768 ? 'center' : 'left' }}>
                        Shopping Cart
                    </Title>

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
                                    size={window.innerWidth < 768 ? 'large' : 'middle'}
                                >
                                    Continue Shopping
                                </Button>
                            </Empty>
                        </Card>
                    ) : (
                        <>
                            <div style={{ overflowX: 'auto' }}>
                                <Table
                                    dataSource={cartItems}
                                    columns={columns}
                                    rowKey={(record) => record.product.id}
                                    pagination={false}
                                    scroll={{ x: 800 }}
                                    size={window.innerWidth < 768 ? 'small' : 'middle'}
                                />
                            </div>

                            <Row gutter={[16, 16]} style={{marginTop: 24}}>
                                <Col xs={24} lg={12} order={window.innerWidth < 768 ? 2 : 1}>
                                    <Space 
                                        direction={window.innerWidth < 576 ? 'vertical' : 'horizontal'}
                                        style={{ width: '100%' }}
                                        size="middle"
                                    >
                                        <Button 
                                            onClick={() => navigate(ROUTES.HOME)}
                                            size={window.innerWidth < 768 ? 'large' : 'middle'}
                                            style={{ width: window.innerWidth < 576 ? '100%' : 'auto' }}
                                        >
                                            Continue Shopping
                                        </Button>
                                        <Button 
                                            danger 
                                            onClick={handleClearCart}
                                            size={window.innerWidth < 768 ? 'large' : 'middle'}
                                            style={{ width: window.innerWidth < 576 ? '100%' : 'auto' }}
                                        >
                                            Clear Cart
                                        </Button>
                                    </Space>
                                </Col>
                                <Col xs={24} lg={12} order={window.innerWidth < 768 ? 1 : 2}>
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
                                                borderColor: token.colorPrimary,
                                                height: window.innerWidth < 768 ? '48px' : '40px'
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