import React, {useState} from 'react';
import {Result, Button, Space, Typography, Form, Card, Alert} from 'antd';
import {useNavigate} from 'react-router-dom';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
    ShoppingOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import {ROUTES} from '../../routes/AppRouter';
import {TEST_OTP} from '../../utils/stripe';
import OtpInput from './OtpInput';

const {Text, Title} = Typography;

type PaymentStatusProps = {
    status: 'success' | 'error' | 'processing' | 'confirmation';
    orderId?: string;
    paymentId?: string;
    error?: string;
    onVerifyOtp?: (otp: string) => void;
    verificationLoading?: boolean;
    onRetry?: () => void;
};

const PaymentStatus: React.FC<PaymentStatusProps> = ({
                                                         status,
                                                         orderId,
                                                         paymentId,
                                                         error,
                                                         onVerifyOtp,
                                                         verificationLoading = false,
                                                         onRetry
                                                     }) => {
    const navigate = useNavigate();
    const [otpValue, setOtpValue] = useState('');
    const [otpError, setOtpError] = useState<string | null>(null);

    const handleOtpSubmit = () => {
        if (!otpValue || otpValue.length !== 5) {
            setOtpError('Please enter the complete 5-digit code');
            return;
        }

        if (onVerifyOtp) {
            onVerifyOtp(otpValue);
        }
    };

    const handleOtpChange = (value: string) => {
        setOtpValue(value);
        if (otpError) setOtpError(null);
    };

    const renderStatus = () => {
        switch (status) {
            case 'success':
                return (
                    <Result
                        status="success"
                        icon={<CheckCircleOutlined/>}
                        title="Order Created Successfully!"
                        subTitle={
                            <Space direction="vertical">
                                <Text>Your payment has been confirmed and order created.</Text>
                                {orderId && <Text strong>Order ID: {orderId}</Text>}
                                {paymentId && <Text strong>Payment ID: {paymentId}</Text>}
                                <Text>Thank you for your purchase!</Text>
                            </Space>
                        }
                        extra={[
                            <Button
                                type="primary"
                                key="home"
                                onClick={() => navigate(ROUTES.HOME)}
                                icon={<ShoppingOutlined/>}
                            >
                                Continue Shopping
                            </Button>
                        ]}
                    />
                );

            case 'error':
                return (
                    <Result
                        status="error"
                        icon={<CloseCircleOutlined/>}
                        title="Payment Failed"
                        subTitle={
                            <Space direction="vertical">
                                <Text>We couldn't process your payment.</Text>
                                {error && <Text type="danger">{error}</Text>}
                                <Text>Please try again or use a different payment method.</Text>
                            </Space>
                        }
                        extra={[
                            <Button type="primary" key="retry" onClick={onRetry || (() => window.location.reload())}>
                                Try Again
                            </Button>,
                            <Button key="back" onClick={() => navigate(ROUTES.CART)}>
                                Return to Cart
                            </Button>
                        ]}
                    />
                );

            case 'processing':
                return (
                    <Result
                        icon={<LoadingOutlined/>}
                        title="Processing Payment"
                        subTitle="Please wait while we process your payment. Do not close this page."
                    />
                );

            case 'confirmation':
                return (
                    <Card title={<Title level={4}>Payment Confirmation</Title>}>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <Result
                                icon={<SafetyOutlined style={{color: '#1677ff'}}/>}
                                title="Confirm Your Payment"
                                subTitle={
                                    <Space direction="vertical">
                                    <Text>
                                            Payment processed successfully! Please enter the verification code to complete your purchase and create your order.
                                    </Text>
                                        {paymentId && <Text strong>Payment ID: {paymentId}</Text>}
                                    </Space>
                                }
                            />

                            <div style={{textAlign: 'center', marginBottom: 16}}>
                                <Text type="secondary">
                                    For this demo, please use code <Text code strong>{TEST_OTP}</Text>
                                </Text>
                            </div>

                            {error && (
                                <Alert 
                                    message="Verification Failed" 
                                    description={error} 
                                    type="error" 
                                    showIcon 
                                    style={{marginBottom: 16}}
                                />
                            )}

                            <Form layout="vertical" onFinish={handleOtpSubmit}>
                                <Form.Item
                                    label="Verification Code"
                                    validateStatus={otpError ? 'error' : undefined}
                                    help={otpError}
                                >
                                    <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0'}}>
                                        <OtpInput
                                            value={otpValue}
                                            onChange={handleOtpChange}
                                            length={5}
                                            autoFocus
                                            disabled={verificationLoading}
                                        />
                                    </div>
                                </Form.Item>

                                <div style={{textAlign: 'center', marginTop: 24}}>
                                    <Space>
                                        <Button
                                            onClick={() => navigate(ROUTES.CART)}
                                            disabled={verificationLoading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={verificationLoading}
                                        >
                                            Complete Order
                                        </Button>
                                    </Space>
                                </div>
                            </Form>
                        </Space>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="payment-status-container">{renderStatus()}</div>
    );
};

export default PaymentStatus; 