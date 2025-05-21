import {createContext, ReactNode, useContext, useState} from 'react';

interface StripeContextType {
    processing: boolean;
    setProcessing: (processing: boolean) => void;
    paymentSuccess: boolean;
    setPaymentSuccess: (success: boolean) => void;
    paymentError: string | null;
    setPaymentError: (error: string | null) => void;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const useStripe = () => {
    const context = useContext(StripeContext);
    if (!context) {
        throw new Error('useStripe must be used within a StripeProvider');
    }
    return context;
};

interface StripeProviderProps {
    children: ReactNode;
}

export const StripeProvider = ({children}: StripeProviderProps) => {
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    return (
        <StripeContext.Provider
            value={{
                processing,
                setProcessing,
                paymentSuccess,
                setPaymentSuccess,
                paymentError,
                setPaymentError
            }}
        >
            {children}
        </StripeContext.Provider>
    );
}; 