import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Card, Col, Divider, Image, List, Row, Space, Steps, theme, Typography} from 'antd';
import {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DollarCircleOutlined,
    ShoppingOutlined,
    TruckOutlined
} from '@ant-design/icons';
import {Order, OrderItem} from '../../types/entities';
import {OrderStatus} from '../../utils/constants';
import {RootState} from '../../store';

const { Title, Text } = Typography;
const { useToken } = theme;

interface OrderDetailProps {
    order: Order;
    refetch?: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, refetch }) => {
    const { token } = useToken();
    const lastOrder = useSelector((state: RootState) => state.webSocket.lastOrder);
    const [lastStatusUpdate, setLastStatusUpdate] = useState<Date>(new Date(order.date));
    const [isRealTimeUpdate, setIsRealTimeUpdate] = useState<boolean>(false);
    
    const currentOrder = lastOrder && lastOrder.id === order.id ? lastOrder : order;
    
    useEffect(() => {
        if (lastOrder && lastOrder.id === order.id) {
            setLastStatusUpdate(new Date());
            setIsRealTimeUpdate(true);
            if (refetch) {
                refetch();
            }
        }
    }, [lastOrder, order.id, refetch]);

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
                return 'Unknown';
        }
    };

    const getCurrentStep = (status: OrderStatus): number => {
        switch (status) {
            case OrderStatus.PENDING:
                return 0;
            case OrderStatus.PROCESSING:
                return 1;
            case OrderStatus.SHIPPING:
                return 2;
            case OrderStatus.DONE:
                return 3;
            case OrderStatus.CANCELLED:
                return -1;
            default:
                return 0;
        }
    };

    const getStepStatus = (status: OrderStatus) => {
        if (status === OrderStatus.CANCELLED) {
            return 'error';
        }
        return 'process';
    };

    const calculateOrderTotal = (items: OrderItem[]): number => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const orderTotal = calculateOrderTotal(currentOrder.items);

    const steps = [
        {
            title: 'Order Placed',
            icon: <ClockCircleOutlined />,
            description: 'Order has been placed'
        },
        {
            title: 'Processing',
            icon: <CheckCircleOutlined />,
            description: 'Order is being processed'
        },
        {
            title: 'Shipping',
            icon: <TruckOutlined />,
            description: 'Order is on the way'
        },
        {
            title: 'Delivered',
            icon: <CheckCircleOutlined />,
            description: 'Order has been delivered'
        }
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Order Header */}
            <Card>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size="middle">
                            <div>
                                <Space>
                                    <ShoppingOutlined style={{ color: token.colorPrimary, fontSize: '20px' }} />
                                    <Title level={3} style={{ margin: 0 }}>
                                        Order {currentOrder.id}
                                    </Title>
                                </Space>
                            </div>
                            
                            <div>
                                <Space>
                                    <CalendarOutlined style={{ color: token.colorTextSecondary }} />
                                    <Text strong>Order Date:</Text>
                                    <Text>
                                        {new Date(currentOrder.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })} at {new Date(currentOrder.date).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: true
                                        })}
                                    </Text>
                                </Space>
                            </div>
                        </Space>
                    </Col>
                    
                    <Col xs={24} md={12}>
                        <div style={{ textAlign: 'right' }}>
                            <Space direction="vertical" size="small" align="end">
                                <Space>
                                    <DollarCircleOutlined style={{ color: token.colorSuccess, fontSize: '20px' }} />
                                    <Text strong style={{ fontSize: '24px', color: token.colorSuccess }}>
                                        ${orderTotal.toFixed(2)}
                                    </Text>
                                </Space>
                                <Text type="secondary">
                                    Total amount ({currentOrder.items.length} items)
                                </Text>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Order Status Progress */}
            <Card 
                title="Order Progress"
                extra={
                    <Space direction="vertical" size={0} style={{ textAlign: 'right' }}>
                        <Text strong style={{ color: getStatusColor(currentOrder.status) === 'green' ? token.colorSuccess : 
                                              getStatusColor(currentOrder.status) === 'red' ? token.colorError :
                                              getStatusColor(currentOrder.status) === 'blue' ? token.colorPrimary :
                                              getStatusColor(currentOrder.status) === 'orange' ? token.colorWarning :
                                              getStatusColor(currentOrder.status) === 'cyan' ? token.colorInfo : token.colorText }}>
                            {getStatusText(currentOrder.status)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {isRealTimeUpdate && (
                                <span style={{ 
                                    display: 'inline-block', 
                                    width: '6px', 
                                    height: '6px', 
                                    backgroundColor: token.colorSuccess, 
                                    borderRadius: '50%', 
                                    marginRight: '4px',
                                    animation: 'pulse 2s infinite'
                                }} />
                            )}
                            Last updated: {lastStatusUpdate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })} at {lastStatusUpdate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            })}
                            {isRealTimeUpdate && (
                                <Text type="secondary" style={{ fontSize: '10px', marginLeft: '4px' }}>
                                    (Live)
                                </Text>
                            )}
                        </Text>
                    </Space>
                }
            >
                <Steps
                    current={getCurrentStep(currentOrder.status)}
                    status={getStepStatus(currentOrder.status)}
                    items={currentOrder.status === OrderStatus.CANCELLED ? [
                        ...steps.slice(0, getCurrentStep(currentOrder.status) + 1),
                        {
                            title: 'Cancelled',
                            icon: <CloseCircleOutlined />,
                            description: 'Order has been cancelled'
                        }
                    ] : steps}
                />
            </Card>

            {/* Order Items */}
            <Card 
                title={
                    <Space>
                        <ShoppingOutlined />
                        <span>Order Items ({currentOrder.items.length})</span>
                    </Space>
                }
            >
                <List
                    dataSource={currentOrder.items}
                    renderItem={(item) => (
                        <List.Item style={{ padding: '16px 0' }}>
                            <List.Item.Meta
                                avatar={
                                    <Image
                                        width={80}
                                        height={80}
                                        src={item.product.imageUrl}
                                        style={{ borderRadius: 8, objectFit: 'cover' }}
                                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
                                    />
                                }
                                title={
                                    <Space direction="vertical" size={4}>
                                        <Text strong style={{ fontSize: '16px' }}>{item.product.title}</Text>
                                        <Space wrap>
                                            <Text type="secondary">Quantity: {item.quantity}</Text>
                                            <Divider type="vertical" />
                                            <Text strong style={{ color: token.colorPrimary }}>
                                                ${item.product.price.toFixed(2)} each
                                            </Text>
                                        </Space>
                                    </Space>
                                }
                                description={
                                    <Text type="secondary" ellipsis={{ tooltip: item.product.description }}>
                                        {item.product.description}
                                    </Text>
                                }
                            />
                            <div style={{ textAlign: 'right', minWidth: 120 }}>
                                <Text strong style={{ fontSize: '18px', color: token.colorPrimary }}>
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </Text>
                            </div>
                        </List.Item>
                    )}
                />
                
                <Divider />
                
                {/* Order Summary */}
                <Row justify="end">
                    <Col xs={24} sm={12} md={8}>
                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                            <Row justify="space-between">
                                <Text>Subtotal:</Text>
                                <Text>${orderTotal.toFixed(2)}</Text>
                            </Row>
                            <Row justify="space-between">
                                <Text>Shipping:</Text>
                                <Text>Free</Text>
                            </Row>
                            <Divider style={{ margin: '8px 0' }} />
                            <Row justify="space-between">
                                <Text strong style={{ fontSize: '16px' }}>Total:</Text>
                                <Text strong style={{ fontSize: '18px', color: token.colorSuccess }}>
                                    ${orderTotal.toFixed(2)}
                                </Text>
                            </Row>
                        </Space>
                    </Col>
                </Row>
            </Card>
        </Space>
    );
};

export default OrderDetail; 