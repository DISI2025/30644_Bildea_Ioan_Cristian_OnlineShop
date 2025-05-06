import { Rule } from 'antd/es/form';

export const emailRules: Rule[] = [
    { required: true, message: 'Please enter your email' },
    { type: 'email', message: 'Please enter a valid email address' },
    { max: 100, message: 'Email cannot exceed 100 characters' }
];