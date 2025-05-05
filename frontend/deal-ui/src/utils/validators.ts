import { Rule } from 'antd/es/form';

// Basic Info validation rules
export const basicInfoRules = {
  username: [
    { required: true, message: 'Please enter your username' },
    { min: 3, message: 'Username must be at least 3 characters' },
    { max: 50, message: 'Username cannot exceed 50 characters' }
  ] as Rule[],
  email: [
    { required: true, message: 'Please enter your email' },
    { type: 'email', message: 'Please enter a valid email' }
  ] as Rule[]
};

// Seller Info validation rules
export const sellerInfoRules = {
  preferredLocations: [
    { max: 200, message: 'Preferred locations cannot exceed 200 characters' }
  ] as Rule[],
  preferredCourier: [
    { max: 100, message: 'Preferred courier cannot exceed 100 characters' }
  ] as Rule[],
  productCategories: [
    { type: 'array', message: 'Please select valid product categories' }
  ] as Rule[]
};

// Buyer Info validation rules (for future implementation)
export const buyerInfoRules = {
  shippingAddress: [
    { required: true, message: 'Please enter your shipping address' },
    { max: 300, message: 'Shipping address cannot exceed 300 characters' }
  ] as Rule[],
  paymentMethod: [
    { required: true, message: 'Please select a payment method' }
  ] as Rule[]
};

// Admin Info validation rules (for future implementation)
export const adminInfoRules = {
  accessLevel: [
    { required: true, message: 'Please select an access level' }
  ] as Rule[],
  permissions: [
    { type: 'array', message: 'Please select valid permissions' }
  ] as Rule[]
}; 