import { Rule } from 'antd/es/form';

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

export const usernameRules: Rule[] = [
  { required: true, message: 'Please enter your username' },
  { min: 3, message: 'Username must be at least 3 characters' },
  { max: 50, message: 'Username cannot exceed 50 characters' },
  { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers and underscores' }
];

export const emailRules: Rule[] = [
  { required: true, message: 'Please enter your email' },
  { type: 'email', message: 'Please enter a valid email address' },
  { max: 100, message: 'Email cannot exceed 100 characters' }
];

export const passwordRules: Rule[] = [
  { required: true, message: 'Please enter your password' },
    { min: 8, message: 'Password must be at least 8 characters' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
];

export const buyerInfoRules = {
  shippingAddress: [
    { required: true, message: 'Please enter your shipping address' },
    { max: 300, message: 'Shipping address cannot exceed 300 characters' }
  ] as Rule[],
  paymentMethod: [
    { required: true, message: 'Please select a payment method' }
  ] as Rule[]
};

export const confirmPasswordRules = (fieldName: string = "password"): Rule[] => [
  { required: true, message: 'Please confirm your password' },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue(fieldName) === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords do not match'));
    },
  }),
];

export const fullNameRules: Rule[] = [
  { required: true, message: 'Please enter your full name' },
  { min: 2, message: 'Full name must be at least 2 characters' },
  { max: 100, message: 'Full name cannot exceed 100 characters' },
  { pattern: /^[a-zA-Z\s'-]+$/, message: 'Full name can only contain letters, spaces, hyphens and apostrophes' }
];

export const adminInfoRules = {
  accessLevel: [
    { required: true, message: 'Please select an access level' }
  ] as Rule[],
  permissions: [
    { type: 'array', message: 'Please select valid permissions' }
  ] as Rule[]
};

// Product validation rules
export const productTitleRules: Rule[] = [
  { required: true, message: 'Please enter a product name' },
  { min: 3, message: 'Product name must be at least 3 characters' },
  { max: 100, message: 'Product name cannot exceed 100 characters' },
  { whitespace: true, message: 'Product name cannot be empty spaces' }
];

export const productDescriptionRules: Rule[] = [
  { required: true, message: 'Please enter a product description' },
  { min: 10, message: 'Description must be at least 10 characters' },
  { max: 1000, message: 'Description cannot exceed 1000 characters' },
  { whitespace: true, message: 'Description cannot be empty spaces' }
];

export const productPriceRules: Rule[] = [
  { required: true, message: 'Please enter a product price' },
  {
    validator: (_, value) => {
      if (value === undefined || value === null) {
        return Promise.reject(new Error('Please enter a price'));
      }
      if (isNaN(value) || value <= 0) {
        return Promise.reject(new Error('Price must be greater than zero'));
      }
      if (value > 99999.99) {
        return Promise.reject(new Error('Price cannot exceed 99,999.99'));
      }
      return Promise.resolve();
    }
  }
];

export const productStockRules: Rule[] = [
  { required: true, message: 'Please enter product stock quantity' },
  {
    validator: (_, value) => {
      if (value === undefined || value === null) {
        return Promise.reject(new Error('Please enter stock quantity'));
      }
      if (isNaN(value) || value < 0 || !Number.isInteger(Number(value))) {
        return Promise.reject(new Error('Stock must be a non-negative whole number'));
      }
      if (value > 999999) {
        return Promise.reject(new Error('Stock cannot exceed 999,999 units'));
      }
      return Promise.resolve();
    }
  }
];

export const productCategoryRules: Rule[] = [
  { required: true, message: 'Please select at least one product category' },
  {
    validator: (_, value) => {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return Promise.reject(new Error('Please select at least one category'));
      }
      return Promise.resolve();
    }
  }
];

export const imageUrlRules: Rule[] = [
  { required: true, message: 'Please upload a product image or enter an image URL' },
  { type: 'url', message: 'Please enter a valid URL' },
  { max: 1000, message: 'URL cannot exceed 1000 characters' }
];
