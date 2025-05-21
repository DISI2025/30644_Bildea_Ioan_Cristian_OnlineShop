import React from 'react';
import {Form, Input, Button, Card, Typography, Space, Divider} from 'antd';
import {UserOutlined, HomeOutlined, PhoneOutlined, MailOutlined} from '@ant-design/icons';

const {Title} = Typography;

export interface CustomerDetails {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    email: string;
}

interface CustomerDetailsFormProps {
    onSubmit: (values: CustomerDetails) => void;
    loading?: boolean;
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({onSubmit, loading = false}) => {
    const [form] = Form.useForm();

    return (
        <Card title={<Title level={4}>Customer Information</Title>}>
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => onSubmit(values as CustomerDetails)}
            >
                <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[{required: true, message: 'Please enter your full name'}]}
                >
                    <Input prefix={<UserOutlined/>} placeholder="John Doe"/>
                </Form.Item>

                <Divider orientation="left">Shipping Address</Divider>

                <Space direction="vertical" size="middle" style={{width: '100%'}}>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{required: true, message: 'Please enter your address'}]}
                    >
                        <Input prefix={<HomeOutlined/>} placeholder="123 Main St"/>
                    </Form.Item>

                    <Space style={{width: '100%'}} size="middle">
                        <Form.Item
                            name="city"
                            label="City"
                            style={{flex: 1}}
                            rules={[{required: true, message: 'Please enter your city'}]}
                        >
                            <Input placeholder="City"/>
                        </Form.Item>

                        <Form.Item
                            name="postalCode"
                            label="Postal Code"
                            style={{flex: 1}}
                            rules={[{required: true, message: 'Please enter your postal code'}]}
                        >
                            <Input placeholder="12345"/>
                        </Form.Item>
                    </Space>

                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[{required: true, message: 'Please enter your country'}]}
                    >
                        <Input placeholder="Country"/>
                    </Form.Item>
                </Space>

                <Divider orientation="left">Contact Information</Divider>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                        {required: true, message: 'Please enter your phone number'},
                        {pattern: /^\+?[0-9]{10,15}$/, message: 'Please enter a valid phone number'}
                    ]}
                >
                    <Input prefix={<PhoneOutlined/>} placeholder="+1234567890"/>
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {required: true, message: 'Please enter your email'},
                        {type: 'email', message: 'Please enter a valid email'}
                    ]}
                >
                    <Input prefix={<MailOutlined/>} placeholder="email@example.com"/>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        size="large"
                    >
                        Continue to Payment
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CustomerDetailsForm; 