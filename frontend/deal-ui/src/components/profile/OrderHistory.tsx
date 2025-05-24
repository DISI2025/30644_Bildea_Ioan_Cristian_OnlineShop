import React, {useState} from 'react';
import {
    Badge,
    Card,
    Empty,
    Image,
    List,
    Space,
    Tabs,
    Tag,
    Typography,
    theme,
    Avatar,
    Button,
    Skeleton,
    Alert
} from 'antd';
import {
    ShoppingOutlined,
    CalendarOutlined,
    DollarCircleOutlined,
    BoxPlotOutlined,
    UserOutlined,
    ShopOutlined,
    DownOutlined,
    UpOutlined
} from '@ant-design/icons';
import {useGetOrdersByBuyerIdQuery, useGetOrdersQuery, useGetProductsBySellerIdQuery, useGetUserByIdQuery} from '../../store/api';
import {Order, OrderItem} from '../../types/entities';
import {OrderStatus} from '../../utils/constants';

const {Title, Text} = Typography;
const {useToken} = theme;

interface OrderHistoryProps {
    userId: string;
    isSeller: boolean;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({userId, isSeller}) => {
    const {token} = useToken();
    const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

    // Get buyer orders directly using the optimized endpoint
    const {data: buyerOrdersResponse, isLoading: isLoadingBuyerOrders, error: buyerOrdersError} = useGetOrdersByBuyerIdQuery(userId);
    const buyerOrders = buyerOrdersResponse?.payload || [];

    // Get all orders for seller view (we still need to filter these on frontend)
    const {data: allOrdersResponse, isLoading: isLoadingAllOrders, error: allOrdersError} = useGetOrdersQuery(undefined, {
        skip: !isSeller
    });
    const allOrders = allOrdersResponse?.payload || [];

    // Get seller's products to match against orders
    const {data: sellerProductsResponse} = useGetProductsBySellerIdQuery(userId, {
        skip: !isSeller
    });
    const sellerProducts = sellerProductsResponse?.payload || [];

    const toggleExpand = (orderId: string) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // Filter orders for seller (orders containing this seller's products)
    const sellerOrders = allOrders.filter(order =>
        order.items.some(item =>
            sellerProducts.some(product => product.id === item.product.id)
        )
    );

    const getStatusColor = (status: OrderStatus): string => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'orange';
            case OrderStatus.PROCESSING:
                return 'blue';
            case OrderStatus.SHIPPING:
                return 'cyan';
            case OrderStatus.DONE:
                return 'green';
            case OrderStatus.CANCELLED:
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: OrderStatus): string => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'Pending';
            case OrderStatus.PROCESSING:
                return 'Processing';
            case OrderStatus.SHIPPING:
                return 'Shipping';
            case OrderStatus.DONE:
                return 'Completed';
            case OrderStatus.CANCELLED:
                return 'Cancelled';
            default:
                console.log('Unknown order status:', status);
                return 'Unknown';
        }
    };

    const calculateOrderTotal = (items: OrderItem[]): number => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const SellerInfo: React.FC<{sellerId: string}> = ({sellerId}) => {
        const {data: sellerResponse, isLoading} = useGetUserByIdQuery(sellerId);
        const seller = sellerResponse?.payload;

        if (isLoading) {
            return <Skeleton.Button active size="small" style={{width: 100}}/>;
        }

        if (!seller) {
            return <Text type="secondary">Unknown Seller</Text>;
        }

        return (
            <Space>
                <Avatar icon={<UserOutlined/>} size="small"/>
                <div>
                    <Text strong>{seller.fullName || seller.username}</Text>
                    <br/>
                    <Text type="secondary" style={{fontSize: '12px'}}>
                        <ShopOutlined style={{marginRight: 4}}/>
                        {seller.storeAddress || 'No store info'}
                    </Text>
                </div>
            </Space>
        );
    };

    const OrderCard: React.FC<{order: Order; viewType: 'buyer' | 'seller'}> = ({order, viewType}) => {
        const orderTotal = calculateOrderTotal(order.items);
        const isExpanded = expandedOrders[order.id];

        return (
            <Card
                style={{marginBottom: 16}}
                bodyStyle={{padding: 16}}
            >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16}}>
                    <div>
                        <Space direction="vertical" size={4}>
                            <Space>
                                <BoxPlotOutlined style={{color: token.colorPrimary}}/>
                                <Text strong style={{fontSize: 16}}>Order #{order.id.slice(-8)}</Text>
                                <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
                            </Space>
                            <Space>
                                <CalendarOutlined style={{color: token.colorTextSecondary}}/>
                                <Text type="secondary">
                                    {new Date(order.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Text>
                            </Space>
                            {viewType === 'seller' && (
                                <SellerInfo sellerId={order.buyerId}/>
                            )}
                        </Space>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <Space direction="vertical" size={4} align="end">
                            <Space>
                                <DollarCircleOutlined style={{color: token.colorSuccess}}/>
                                <Text strong style={{fontSize: 18, color: token.colorSuccess}}>
                                    ${orderTotal.toFixed(2)}
                                </Text>
                            </Space>
                            <Badge count={order.items.length} style={{backgroundColor: token.colorPrimary}}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={isExpanded ? <UpOutlined/> : <DownOutlined/>}
                                    onClick={() => toggleExpand(order.id)}
                                >
                                    {isExpanded ? 'Hide Details' : 'View Details'}
                                </Button>
                            </Badge>
                        </Space>
                    </div>
                </div>

                {isExpanded && (
                    <div style={{borderTop: `1px solid ${token.colorBorder}`, paddingTop: 16}}>
                        <Title level={5} style={{marginBottom: 12}}>
                            <ShoppingOutlined style={{marginRight: 8}}/>
                            Order Items
                        </Title>
                        <List
                            dataSource={order.items}
                            renderItem={(item) => (
                                <List.Item style={{padding: '12px 0'}}>
                                    <List.Item.Meta
                                        avatar={
                                            <Image
                                                width={60}
                                                height={60}
                                                src={item.product.imageUrl}
                                                style={{borderRadius: 8, objectFit: 'cover'}}
                                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
                                            />
                                        }
                                        title={
                                            <Space direction="vertical" size={0}>
                                                <Text strong>{item.product.title}</Text>
                                                <Space>
                                                    <Text type="secondary">Qty: {item.quantity}</Text>
                                                    <Text type="secondary">•</Text>
                                                    <Text strong style={{color: token.colorPrimary}}>
                                                        ${item.product.price.toFixed(2)} each
                                                    </Text>
                                                </Space>
                                            </Space>
                                        }
                                        description={
                                            <Text type="secondary" ellipsis={{tooltip: item.product.description}}>
                                                {item.product.description}
                                            </Text>
                                        }
                                    />
                                    <div style={{textAlign: 'right', minWidth: 80}}>
                                        <Text strong style={{fontSize: 16}}>
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </Card>
        );
    };

    const EmptyState: React.FC<{type: 'buyer' | 'seller'}> = ({type}) => (
        <Card style={{textAlign: 'center', padding: '40px 20px'}}>
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <Space direction="vertical">
                        <Text type="secondary" style={{fontSize: 16}}>
                            {type === 'buyer' 
                                ? "You haven't placed any orders yet" 
                                : "No orders for your products yet"
                            }
                        </Text>
                        <Text type="secondary">
                            {type === 'buyer' 
                                ? "Start shopping to see your order history here" 
                                : "Orders containing your products will appear here"
                            }
                        </Text>
                    </Space>
                }
            />
        </Card>
    );

    // Use the appropriate loading and error states
    const isLoading = isLoadingBuyerOrders || (isSeller && isLoadingAllOrders);
    const error = buyerOrdersError || (isSeller && allOrdersError);

    if (isLoading) {
        return (
            <Card>
                <Skeleton active paragraph={{rows: 4}}/>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error Loading Orders"
                description="Unable to load order history. Please try again later."
                type="error"
                showIcon
            />
        );
    }

    const tabItems = [
        {
            key: 'buyer',
            label: (
                <Space>
                    <ShoppingOutlined/>
                    <span>My Orders</span>
                    <Badge count={buyerOrders.length} style={{backgroundColor: token.colorPrimary}}/>
                </Space>
            ),
            children: (
                <div>
                    {buyerOrders.length === 0 ? (
                        <EmptyState type="buyer"/>
                    ) : (
                        <div>
                            <Text type="secondary" style={{marginBottom: 16, display: 'block'}}>
                                Orders you have placed ({buyerOrders.length} total)
                            </Text>
                            {buyerOrders.map(order => (
                                <OrderCard key={order.id} order={order} viewType="buyer"/>
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
    ];

    if (isSeller) {
        tabItems.push({
            key: 'seller',
            label: (
                <Space>
                    <BoxPlotOutlined/>
                    <span>Orders to Fulfill</span>
                    <Badge count={sellerOrders.length} style={{backgroundColor: token.colorWarning}}/>
                </Space>
            ),
            children: (
                <div>
                    {sellerOrders.length === 0 ? (
                        <EmptyState type="seller"/>
                    ) : (
                        <div>
                            <Text type="secondary" style={{marginBottom: 16, display: 'block'}}>
                                Orders containing your products ({sellerOrders.length} total)
                            </Text>
                            {sellerOrders.map(order => (
                                <OrderCard key={order.id} order={order} viewType="seller"/>
                            ))}
                        </div>
                    )}
                </div>
            ),
        });
    }

    return (
        <div>
            <div style={{marginBottom: 24}}>
                <Title level={3}>
                    <ShoppingOutlined style={{marginRight: 8, color: token.colorPrimary}}/>
                    Order History
                </Title>
                <Text type="secondary">
                    View and track your {isSeller ? 'orders and sales' : 'order history'}
                </Text>
            </div>

            <Tabs
                defaultActiveKey="buyer"
                items={tabItems}
                size="large"
                style={{marginTop: 16}}
            />
        </div>
    );
};

export default OrderHistory; 