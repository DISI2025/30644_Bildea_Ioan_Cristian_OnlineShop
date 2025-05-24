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
import { useCreatePaymentIntentMutation } from '../../store/api';
import { CustomerDetails } from './CustomerDetailsForm';
import { CartItem } from '../../store/slices/cart-slice';

const { Title, Text } = Typography;

const stripePromise = loadStripe(import.meta.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51RRHph67CPFfX2OAVwXUOmyAlJT7PZF03GbpguCLWIAzHU2DfdvEthR68NSBn2lXVqvhkpZGj3YVmcq1OovyT7Tz00utnDbtmR');

interface CardFormProps {
  onSuccess: (paymentId: string) => void;
  onError?: (error: string) => void;
  amount: number;
  customerEmail: string;
  customerPhone: string;
  customerDetails: CustomerDetails;
  cartItems: CartItem[];
}

const CardForm: React.FC<CardFormProps> = ({
  onSuccess, 
  onError,
  amount, 
  customerEmail, 
  customerPhone, 
  customerDetails,
  cartItems
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const generatePaymentReference = () => {
    return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Generate a temporary payment reference instead of using order ID
      const paymentReference = generatePaymentReference();
      
      const paymentIntentRequest = {
        amount,
        currency: 'usd',
        customerEmail,
        customerPhone,
        orderId: paymentReference, // Use payment reference instead of actual order ID
        customerDetails: {
          fullName: customerDetails.fullName,
          address: customerDetails.address,
          city: customerDetails.city,
          postalCode: customerDetails.postalCode,
          country: customerDetails.country,
          phoneNumber: customerPhone,
          email: customerEmail
        }
      };

      const paymentIntentResponse = await createPaymentIntent(paymentIntentRequest).unwrap();
      
      if (!paymentIntentResponse.payload) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = paymentIntentResponse.payload;
      
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
        card: cardElement,
        billing_details: {
          email: customerEmail,
          phone: customerPhone,
          },
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment was not successful');
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      onError?.(error instanceof Error ? error.message : 'An unexpected error occurred');
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
          <Text>Items: {cartItems.length}</Text>
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
  amount: number;
  customerEmail: string;
  customerPhone: string;
  customerDetails: CustomerDetails;
  cartItems: CartItem[];
  onSuccess: (paymentId: string) => void;
  onError?: (error: string) => void;
}

const SimplePaymentForm: React.FC<SimplePaymentFormProps> = ({
  amount, 
  customerEmail, 
  customerPhone, 
  customerDetails,
  cartItems,
  onSuccess, 
  onError
}) => {
  return (
    <Card title={<Title level={4}>Payment Details</Title>}>
      <Elements stripe={stripePromise}>
        <CardForm
          amount={amount}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          customerDetails={customerDetails}
          cartItems={cartItems}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </Card>
  );
};

export default SimplePaymentForm; 