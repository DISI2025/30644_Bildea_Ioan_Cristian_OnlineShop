import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Avatar, Button, Card, Col, Divider, Layout, List, Row, Space, Steps, Typography} from 'antd';
import {CartItem, clearCart} from '../store/slices/cart-slice';
import SimplePaymentForm from '../components/checkout/SimplePaymentForm';
import PaymentStatus from '../components/checkout/PaymentStatus';
import CustomerDetailsForm, {CustomerDetails} from '../components/checkout/CustomerDetailsForm';
import {useStripe} from '../context/StripeContext';
import {ROUTES} from '../routes/AppRouter';
import {CheckCircleOutlined, DollarCircleOutlined, UserOutlined} from '@ant-design/icons';
import {TEST_OTP} from '../utils/stripe';
import {useCreateOrderMutation} from '../store/api';
import {useDispatch, useSelector} from 'react-redux';
import {selectAuthState} from '../store/slices/auth-slice';
import {transformCartToOrderRequest} from '../utils/orderUtils';
import {useSnackbar} from '../context/SnackbarContext';

const {Content} = Layout;
const {Title, Text} = Typography;
const {Step} = Steps;

interface LocationState {
  cartItems: CartItem[];
  totalPrice: number;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {processing, paymentSuccess, paymentError, setPaymentSuccess} = useStripe();
  const [currentStep, setCurrentStep] = useState(0); // Start with customer details step
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [detailsSubmitting, setDetailsSubmitting] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  
  const {cartItems, totalPrice} = (location.state as LocationState) || {
    cartItems: [], 
    totalPrice: 0
  };

  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);
  const [createOrder, {isLoading: isCreatingOrder}] = useCreateOrderMutation();
  const {showError, showSuccess} = useSnackbar();

  useEffect(() => {
    if (!cartItems.length) {
      navigate(ROUTES.CART);
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (processing) {
      setCurrentStep(2);
    }
  }, [processing]);

  const handleCustomerDetailsSubmit = async (details: CustomerDetails) => {
    setDetailsSubmitting(true);
    
    try {
      // Store customer details and proceed to payment without creating order
      setCustomerDetails(details);
      setCurrentStep(1); // Move to payment step
      showSuccess('Details saved! Proceeding to payment...');
    } catch (error) {
      showError('Failed to save details. Please try again.');
    } finally {
      setDetailsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (pid: string) => {
    setPaymentId(pid);
    setCurrentStep(2); // Move to confirmation step
  };

  const handlePaymentError = async (_errorMessage: string) => {
    setCurrentStep(0); // Go back to customer details
  };

  const handleOtpVerify = async (otp: string) => {
    setVerifyingOtp(true);
    setOtpError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otp === TEST_OTP) {
        // Create order only after successful payment verification
        if (!authState.user) {
          throw new Error('User not authenticated');
        }

        const orderRequest = transformCartToOrderRequest(cartItems, authState.user.id);
        const response = await createOrder(orderRequest).unwrap();

        if (response.payload) {
          setCreatedOrderId(response.payload.id);
          dispatch(clearCart());
          setPaymentSuccess(true);
          showSuccess('Payment confirmed and order created successfully!');
        } else {
          throw new Error('Failed to create order after payment');
        }
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : 'An unexpected error occurred');
      showError('Verification failed. Please try again.');
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
          return <PaymentStatus status="error" error={paymentError} onRetry={() => setCurrentStep(0)}/>;
        }
        
        if (processing) {
          return <PaymentStatus status="processing"/>;
        }
        
        return customerDetails ? (
          <SimplePaymentForm 
            amount={totalPrice} 
            customerEmail={customerDetails.email}
            customerPhone={customerDetails.phoneNumber}
            customerDetails={customerDetails}
            cartItems={cartItems}
            onSuccess={handlePaymentSuccess} 
            onError={handlePaymentError}
          />
        ) : (
          <Button type="primary" onClick={() => setCurrentStep(0)}>
            Enter Customer Details First
          </Button>
        );
      
      case 2:
        if (paymentSuccess) {
          return <PaymentStatus 
            status="success" 
            orderId={createdOrderId || ''} 
            paymentId={paymentId || ''}
          />;
        }
        
        return (
          <PaymentStatus 
            status="confirmation" 
            paymentId={paymentId || ''}
            onVerifyOtp={handleOtpVerify}
            verificationLoading={verifyingOtp || isCreatingOrder}
            error={otpError || undefined}
          />
        );
      
      default:
        return null;
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <Layout>
      <Content style={{
        padding: isMobile ? '1rem' : '2rem', 
        marginTop: isMobile ? '80px' : '80px', 
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{maxWidth: 1200, margin: '0 auto'}}>
          <Title level={2} style={{ textAlign: isMobile ? 'center' : 'left' }}>
            Checkout
          </Title>
          
          <Steps 
            current={currentStep} 
            style={{marginBottom: 32}}
            direction={isMobile ? 'vertical' : 'horizontal'}
            size={isMobile ? 'small' : 'default'}
          >
            <Step title="Customer Details" icon={<UserOutlined/>}/>
            <Step title="Payment" icon={<DollarCircleOutlined/>}/>
            <Step title="Confirmation" icon={<CheckCircleOutlined/>}/>
          </Steps>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16} order={isMobile ? 2 : 1}>
              {renderCurrentStep()}
            </Col>
            
            <Col xs={24} lg={8} order={isMobile ? 1 : 2}>
              <Card title={<Title level={4}>Order Summary</Title>}>
                <List
                  dataSource={cartItems}
                  size={isMobile ? 'small' : 'default'}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            src={item.product.imageUrl} 
                            size={isMobile ? 40 : 64}
                            shape="square" 
                          />
                        }
                        title={
                          <Text strong style={{ fontSize: isMobile ? 14 : 16 }}>
                            {item.product.title}
                          </Text>
                        }
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">
                              Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                            </Text>
                            <Text strong style={{ color: '#1890ff' }}>
                              ${(item.quantity * item.product.price).toFixed(2)}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
                
                <Divider />
                
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: isMobile ? 14 : 16 
                  }}>
                    <Text>Subtotal:</Text>
                    <Text>${totalPrice.toFixed(2)}</Text>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: isMobile ? 14 : 16 
                  }}>
                    <Text>Shipping:</Text>
                    <Text>Free</Text>
                  </div>
                  
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: isMobile ? 16 : 18,
                    fontWeight: 'bold'
                  }}>
                    <Text strong>Total:</Text>
                    <Text strong style={{ color: '#1890ff' }}>
                      ${totalPrice.toFixed(2)}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CheckoutPage; 