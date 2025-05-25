import React, { useState } from 'react';
import { 
    Typography, 
    Card, 
    Row, 
    Col, 
    Form, 
    Input, 
    Button, 
    Space, 
    Divider,
    message,
    theme
} from 'antd';
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    SendOutlined,
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    InstagramOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { useToken } = theme;

const ContactPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { token } = useToken();

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        message.success('Thank you for your message! We\'ll get back to you soon.');
        form.resetFields();
    };

    const contactInfo = [
        {
            icon: <MailOutlined />,
            title: 'Email Us',
            info: 'support@dealshop.com',
            description: 'Send us an email anytime'
        },
        {
            icon: <PhoneOutlined />,
            title: 'Call Us',
            info: '+40 123 456 789',
            description: 'Mon-Fri from 8am to 6pm'
        },
        {
            icon: <EnvironmentOutlined />,
            title: 'Visit Us',
            info: 'Bucharest, Romania',
            description: 'Technology Hub, Downtown'
        },
        {
            icon: <ClockCircleOutlined />,
            title: 'Working Hours',
            info: 'Mon - Fri: 8:00 - 18:00',
            description: 'Weekend: 10:00 - 16:00'
        }
    ];

    const officeLocations = [
        {
            city: 'Bucharest',
            country: 'Romania',
            address: 'Str. Victoriei nr. 15, Sector 1',
            phone: '+40 123 456 789',
            email: 'bucharest@dealshop.com'
        },
        {
            city: 'Cluj-Napoca',
            country: 'Romania',
            address: 'Str. Memorandumului nr. 28',
            phone: '+40 264 123 456',
            email: 'cluj@dealshop.com'
        },
        {
            city: 'Timișoara',
            country: 'Romania',
            address: 'Bulevardul Revoluției nr. 5',
            phone: '+40 256 123 456',
            email: 'timisoara@dealshop.com'
        }
    ];

    const socialLinks = [
        { icon: <FacebookOutlined />, name: 'Facebook', color: '#1877F2' },
        { icon: <TwitterOutlined />, name: 'Twitter', color: '#1DA1F2' },
        { icon: <LinkedinOutlined />, name: 'LinkedIn', color: '#0A66C2' },
        { icon: <InstagramOutlined />, name: 'Instagram', color: '#E4405F' }
    ];

    return (
        <div style={{ 
            paddingTop: `calc(64px + ${token.paddingMD}px)`,
            paddingLeft: token.paddingLG,
            paddingRight: token.paddingLG,
            paddingBottom: token.paddingMD,
            height: '100%',
            overflow: 'auto'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <Title level={1} style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        Get In Touch
                    </Title>
                    <Title level={4} type="secondary" style={{ fontWeight: 'normal' }}>
                        We'd love to hear from you
                    </Title>
                    <Paragraph style={{ fontSize: '1.2rem', maxWidth: 600, margin: '2rem auto' }}>
                        Have a question, suggestion, or just want to say hello? 
                        Our team is here to help and would love to hear from you.
                    </Paragraph>
                </div>

                {/* Contact Info Cards */}
                <Row gutter={[24, 24]} style={{ marginBottom: '4rem' }}>
                    {contactInfo.map((info, index) => (
                        <Col xs={24} sm={12} md={6} key={index}>
                            <Card 
                                hoverable
                                style={{ 
                                    textAlign: 'center',
                                    height: '100%',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                                bodyStyle={{ padding: '2rem 1rem' }}
                            >
                                <div style={{ 
                                    fontSize: '2.5rem', 
                                    color: '#1890ff', 
                                    marginBottom: '1rem' 
                                }}>
                                    {info.icon}
                                </div>
                                <Title level={4} style={{ marginBottom: '0.5rem' }}>
                                    {info.title}
                                </Title>
                                <Text strong style={{ 
                                    display: 'block', 
                                    marginBottom: '0.5rem',
                                    fontSize: '1.1rem'
                                }}>
                                    {info.info}
                                </Text>
                                <Text type="secondary">
                                    {info.description}
                                </Text>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Contact Form and Map Section */}
                <Row gutter={[32, 32]} style={{ marginBottom: '4rem' }}>
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <SendOutlined />
                                    <span>Send us a Message</span>
                                </Space>
                            }
                            style={{ 
                                height: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                size="large"
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label="First Name"
                                            name="firstName"
                                            rules={[{ required: true, message: 'Please enter your first name' }]}
                                        >
                                            <Input placeholder="Enter your first name" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label="Last Name"
                                            name="lastName"
                                            rules={[{ required: true, message: 'Please enter your last name' }]}
                                        >
                                            <Input placeholder="Enter your last name" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                                </Form.Item>

                                <Form.Item
                                    label="Phone Number"
                                    name="phone"
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
                                </Form.Item>

                                <Form.Item
                                    label="Subject"
                                    name="subject"
                                    rules={[{ required: true, message: 'Please enter a subject' }]}
                                >
                                    <Input placeholder="What is this about?" />
                                </Form.Item>

                                <Form.Item
                                    label="Message"
                                    name="message"
                                    rules={[{ required: true, message: 'Please enter your message' }]}
                                >
                                    <TextArea 
                                        rows={6} 
                                        placeholder="Tell us how we can help you..."
                                        showCount
                                        maxLength={500}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        size="large" 
                                        loading={loading}
                                        block
                                        icon={<SendOutlined />}
                                    >
                                        Send Message
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <EnvironmentOutlined />
                                    <span>Our Locations</span>
                                </Space>
                            }
                            style={{ 
                                height: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                {officeLocations.map((location, index) => (
                                    <div key={index}>
                                        <Title level={5} style={{ marginBottom: '0.5rem' }}>
                                            {location.city}, {location.country}
                                        </Title>
                                        <Paragraph style={{ marginBottom: '0.5rem' }}>
                                            <EnvironmentOutlined style={{ marginRight: '0.5rem' }} />
                                            {location.address}
                                        </Paragraph>
                                        <Paragraph style={{ marginBottom: '0.5rem' }}>
                                            <PhoneOutlined style={{ marginRight: '0.5rem' }} />
                                            {location.phone}
                                        </Paragraph>
                                        <Paragraph>
                                            <MailOutlined style={{ marginRight: '0.5rem' }} />
                                            {location.email}
                                        </Paragraph>
                                        {index < officeLocations.length - 1 && <Divider />}
                                    </div>
                                ))}
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* FAQ Section */}
                <Card 
                    title={
                        <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
                            Frequently Asked Questions
                        </Title>
                    }
                    style={{ 
                        marginBottom: '3rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <Row gutter={[32, 24]}>
                        <Col xs={24} md={12}>
                            <Title level={5}>How can I track my order?</Title>
                            <Text type="secondary">
                                You can track your order by logging into your account and visiting the 
                                "Order History" section. You'll receive tracking updates via email as well.
                            </Text>
                        </Col>
                        <Col xs={24} md={12}>
                            <Title level={5}>What payment methods do you accept?</Title>
                            <Text type="secondary">
                                We accept all major credit cards, PayPal, and bank transfers. 
                                All payments are processed securely through our encrypted system.
                            </Text>
                        </Col>
                        <Col xs={24} md={12}>
                            <Title level={5}>How long does shipping take?</Title>
                            <Text type="secondary">
                                Standard shipping typically takes 3-5 business days. Express shipping 
                                options are available for faster delivery within 1-2 business days.
                            </Text>
                        </Col>
                        <Col xs={24} md={12}>
                            <Title level={5}>Do you offer international shipping?</Title>
                            <Text type="secondary">
                                Currently, we ship within Romania and to most European countries. 
                                International shipping rates and times vary by destination.
                            </Text>
                        </Col>
                    </Row>
                </Card>

                {/* Social Media and Footer */}
                <Card 
                    style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}
                    bodyStyle={{ color: 'white', padding: '3rem' }}
                >
                    <Title level={3} style={{ color: 'white', marginBottom: '1rem' }}>
                        Follow Us
                    </Title>
                    <Paragraph style={{ color: 'white', marginBottom: '2rem' }}>
                        Stay connected with us on social media for the latest updates and deals
                    </Paragraph>
                    <Space size="large">
                        {socialLinks.map((social, index) => (
                            <Button
                                key={index}
                                type="text"
                                icon={social.icon}
                                size="large"
                                style={{ 
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = social.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            />
                        ))}
                    </Space>
                </Card>
            </div>
        </div>
    );
};

export default ContactPage; 