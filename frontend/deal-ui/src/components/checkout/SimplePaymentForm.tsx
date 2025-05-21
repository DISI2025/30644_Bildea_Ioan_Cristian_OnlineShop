import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button, Card, Typography, Alert, Spin, Space } from 'antd';
import {TEST_CARDS } from '../../utils/stripe';

const { Title, Text } = Typography;

const stripePromise = loadStripe(import.meta.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51RRHph67CPFfX2OAVwXUOmyAlJT7PZF03GbpguCLWIAzHU2DfdvEthR68NSBn2lXVqvhkpZGj3YVmcq1OovyT7Tz00utnDbtmR');

interface CardFormProps {
  onSuccess: (paymentId: string) => void;
  orderId: string;
  amount: number;
  customerEmail: string;
  customerPhone: string;
}

const CardForm: React.FC<CardFormProps> = ({
  onSuccess, 
  orderId, 
  amount, 
  customerEmail, 
  customerPhone 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      //TODO Call backend
      // Create simulated payment intent
      // In a real app, you would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const clientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
      const tempPaymentId = `pi_${Math.random().toString(36).substring(7)}`;
      
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const paymentMethodResult = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: customerEmail,
          phone: customerPhone,
        },
      });

      if (paymentMethodResult.error) {
        throw new Error(paymentMethodResult.error.message);
      }

      onSuccess(tempPaymentId);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    setError(event.error ? event.error.message : null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Card Information</Text>
        <div style={{ 
          padding: '10px 14px', 
          border: '1px solid #d9d9d9', 
          borderRadius: '6px',
          backgroundColor: '#fff'
        }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  fontFamily: 'Arial, sans-serif',
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
            onChange={handleCardChange}
          />
        </div>
      </div>

      {error && (
        <Alert
          message="Payment Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Space>
          <Text>Order ID: {orderId}</Text>
          <Text strong>Total: ${amount.toFixed(2)}</Text>
        </Space>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        disabled={!stripe || processing || !cardComplete}
      >
        {processing ? <Spin size="small" /> : 'Proceed to Confirmation'}
      </Button>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Text type="secondary">
          Test Card: {TEST_CARDS.SMS_3DS} | Exp: Any future date | CVC: Any 3 digits
        </Text>
      </div>
    </form>
  );
};

interface SimplePaymentFormProps {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentId: string) => void;
}

const SimplePaymentForm: React.FC<SimplePaymentFormProps> = ({
  orderId, 
  amount, 
  customerEmail, 
  customerPhone, 
  onSuccess 
}) => {
  return (
    <Card title={<Title level={4}>Payment Details</Title>}>
      <Elements stripe={stripePromise}>
        <CardForm
          orderId={orderId}
          amount={amount}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          onSuccess={onSuccess}
        />
      </Elements>
    </Card>
  );
};

export default SimplePaymentForm; 