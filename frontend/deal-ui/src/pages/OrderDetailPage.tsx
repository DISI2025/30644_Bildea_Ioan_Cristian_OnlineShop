import React from 'react';
import {useParams} from 'react-router-dom';
import {Alert, Card, Skeleton, Typography} from 'antd';
import {useGetOrderByIdQuery} from '../store/api';
import OrderDetail from '../components/orders/OrderDetail';

const {Title} = Typography;

const OrderDetailPage: React.FC = () => {
    const {orderId} = useParams<{ orderId: string }>();

    const {data: orderResponse, isLoading, error, refetch} = useGetOrderByIdQuery(orderId!, {
        skip: !orderId
    });

    const order = orderResponse?.payload;

    if (!orderId) {
        return (
            <div style={{padding: '24px', maxWidth: '1200px', margin: '0 auto'}}>
                <Alert
                    message="Invalid Order"
                    description="Order ID is required to view order details."
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div style={{padding: '24px', maxWidth: '1200px', margin: '0 auto'}}>
                <Card>
                    <Skeleton active paragraph={{rows: 6}}/>
                </Card>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div style={{padding: '24px', maxWidth: '1200px', margin: '0 auto'}}>
                <Alert
                    message="Order Not Found"
                    description="The requested order could not be found or you don't have permission to view it."
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div style={{padding: '24px', maxWidth: '1200px', margin: '0 auto'}}>
            <div style={{marginBottom: '24px'}}>
                <Title level={2} style={{margin: 0}}>
                    Order Details
                </Title>
            </div>

            <OrderDetail order={order} refetch={refetch}/>
        </div>
    );
};

export default OrderDetailPage; 