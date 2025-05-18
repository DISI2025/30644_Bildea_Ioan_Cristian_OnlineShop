import { Rule } from 'antd/es/form';

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
/*
  { min: 8, message: 'Password must be at least 8 characters' },
*/
/*  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  }*/
];

export const confirmPasswordRules = (): Rule[] => [
  { required: true, message: 'Please confirm your password' },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('newPassword') === value) {
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
