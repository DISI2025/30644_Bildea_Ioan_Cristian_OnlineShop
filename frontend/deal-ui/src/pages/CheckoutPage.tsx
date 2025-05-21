import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Typography, Card, Steps, Divider, List, Avatar, Row, Col, Button, Space } from 'antd';
import { CartItem } from '../store/slices/cart-slice';
import SimplePaymentForm from '../components/checkout/SimplePaymentForm';
import PaymentStatus from '../components/checkout/PaymentStatus';
import CustomerDetailsForm, { CustomerDetails } from '../components/checkout/CustomerDetailsForm';
import { useStripe } from '../context/StripeContext';
import { ROUTES } from '../routes/AppRouter';
import { CheckCircleOutlined, DollarCircleOutlined, UserOutlined } from '@ant-design/icons';
import { TEST_OTP } from '../utils/stripe';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Step } = Steps;

interface LocationState {
  cartItems: CartItem[];
  totalPrice: number;
  orderId: string;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { processing, paymentSuccess, paymentError, setPaymentSuccess } = useStripe();
  const [currentStep, setCurrentStep] = useState(0); // Start with customer details step
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [detailsSubmitting, setDetailsSubmitting] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  
  const { cartItems, totalPrice, orderId } = (location.state as LocationState) || { 
    cartItems: [], 
    totalPrice: 0,
    orderId: ''
  };

  useEffect(() => {
    if (!orderId || !cartItems.length) {
      navigate(ROUTES.CART);
    }
  }, [cartItems, orderId, navigate]);

  useEffect(() => {
    if (processing) {
      setCurrentStep(1);
    }
  }, [processing]);

  const handleCustomerDetailsSubmit = (details: CustomerDetails) => {
    setDetailsSubmitting(true);
    
    setTimeout(() => {
      setCustomerDetails(details);
      setCurrentStep(1); // Move to payment step
      setDetailsSubmitting(false);
    }, 800);
  };

  const handlePaymentSuccess = (pid: string) => {
    setPaymentId(pid);
    setCurrentStep(2); // Move to confirmation step
    
    // In a real app, you would call an API to update order status
    console.log('Payment successful with ID:', pid);
    console.log('Order ID:', orderId);
    console.log('Customer details:', customerDetails);
  };

  const handleOtpVerify = async (otp: string) => {
    setVerifyingOtp(true);
    setOtpError(null);
    
    try {
      // Simulate OTP verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otp === TEST_OTP) {
        setPaymentSuccess(true);
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CustomerDetailsForm 
            onSubmit={handleCustomerDetailsSubmit} 
            loading={detailsSubmitting}
          />
        );
      
      case 1:
        if (paymentError) {
          return <PaymentStatus status="error" error={paymentError} />;
        }
        
        if (processing) {
          return <PaymentStatus status="processing" />;
        }
        
        return customerDetails ? (
          <SimplePaymentForm 
            orderId={orderId} 
            amount={totalPrice} 
            customerEmail={customerDetails.email}
            customerPhone={customerDetails.phoneNumber}
            onSuccess={handlePaymentSuccess} 
          />
        ) : (
          <Button type="primary" onClick={() => setCurrentStep(0)}>
            Enter Customer Details First
          </Button>
        );
      
      case 2:
        if (paymentSuccess) {
          return <PaymentStatus status="success" orderId={orderId} />;
        }
        
        return (
          <PaymentStatus 
            status="confirmation" 
            orderId={orderId}
            onVerifyOtp={handleOtpVerify}
            verificationLoading={verifyingOtp}
            error={otpError || undefined}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '2rem', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2}>Checkout</Title>
          
          <Steps current={currentStep} style={{ marginBottom: 32 }}>
            <Step title="Customer Details" icon={<UserOutlined />} />
            <Step title="Payment" icon={<DollarCircleOutlined />} />
            <Step title="Confirmation" icon={<CheckCircleOutlined />} />
          </Steps>
          
          <Row gutter={24}>
            <Col xs={24} md={16}>
              {renderCurrentStep()}
            </Col>
            
            <Col xs={24} md={8}>
              <Card title={<Title level={4}>Order Summary</Title>}>
                <List
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar shape="square" size={64} src={item.product.imageUrl} />}
                        title={item.product.title}
                        description={`Quantity: ${item.quantity}`}
                      />
                      <div>${(item.product.price * item.quantity).toFixed(2)}</div>
                    </List.Item>
                  )}
                />
                
                <Divider />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Subtotal:</Text>
                  <Text>${totalPrice.toFixed(2)}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Shipping:</Text>
                  <Text>Free</Text>
                </div>
                
                <Divider />
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Total:</Text>
                  <Text strong>${totalPrice.toFixed(2)}</Text>
                </div>
                
                {currentStep === 2 && paymentSuccess && (
                  <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                    <Text strong>Payment ID:</Text>
                    <Text code>{paymentId}</Text>
                    <Button type="primary" block onClick={() => navigate(ROUTES.HOME)}>
                      Continue Shopping
                    </Button>
                  </Space>
                )}

                {customerDetails && currentStep < 2 && (
                  <div style={{ marginTop: 16 }}>
                    <Divider orientation="left">Shipping To</Divider>
                    <Text strong>{customerDetails.fullName}</Text>
                    <br />
                    <Text>{customerDetails.address}</Text>
                    <br />
                    <Text>{customerDetails.city}, {customerDetails.postalCode}</Text>
                    <br />
                    <Text>{customerDetails.country}</Text>
                    <br />
                    <Text>{customerDetails.phoneNumber}</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CheckoutPage; 