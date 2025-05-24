import React from 'react';
import {Avatar, Card, Col, Divider, Row, Space, Tag, Typography, theme} from 'antd';
import {HeartOutlined, RocketOutlined, ShoppingOutlined, TeamOutlined, TrophyOutlined} from '@ant-design/icons';

// Import avatar images
import CristiAvatar from '../assets/Cristi.png';
import AndreiAvatar from '../assets/Andrei.png';
import CornelAvatar from '../assets/Cornel.png';
import GabrielAvatar from '../assets/Gabriel.png';
import HunorAvatar from '../assets/Hunor.png';

const { Title, Paragraph, Text } = Typography;
const { useToken } = theme;

const AboutPage: React.FC = () => {
    const { token } = useToken();

    const teamMembers = [
        {
            name: 'Cristi',
            position: 'Scrum Master & FE Tech Lead',
            avatar: CristiAvatar,
            skills: ['React', 'TypeScript', 'Scrum', 'Leadership']
        },
        {
            name: 'Andrei',
            position: 'BE Tech Lead',
            avatar: AndreiAvatar,
            skills: ['Java', 'Spring Boot', 'Microservices', 'Architecture']
        },
        {
            name: 'Cornel',
            position: 'FE Developer',
            avatar: CornelAvatar,
            skills: ['React', 'JavaScript', 'CSS', 'UI/UX']
        },
        {
            name: 'Gabriel',
            position: 'BE Developer',
            avatar: GabrielAvatar,
            skills: ['Java', 'Spring', 'REST APIs', 'Database']
        },
        {
            name: 'Hunor',
            position: 'QA Developer',
            avatar: HunorAvatar,
            skills: ['Testing', 'Automation', 'Quality Assurance', 'Bug Tracking']
        }
    ];

    const companyValues = [
        {
            icon: <ShoppingOutlined />,
            title: 'Customer First',
            description: 'We prioritize our customers\' needs and satisfaction above everything else.'
        },
        {
            icon: <RocketOutlined />,
            title: 'Innovation',
            description: 'We constantly push boundaries to deliver cutting-edge e-commerce solutions.'
        },
        {
            icon: <TeamOutlined />,
            title: 'Collaboration',
            description: 'We believe in the power of teamwork and collective intelligence.'
        },
        {
            icon: <TrophyOutlined />,
            title: 'Excellence',
            description: 'We strive for excellence in every product we build and every service we provide.'
        }
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
                        About Deal Shop
                    </Title>
                    <Title level={4} type="secondary" style={{ fontWeight: 'normal' }}>
                        Revolutionizing Online Shopping Experience
                    </Title>
                    <Paragraph style={{ fontSize: '1.2rem', maxWidth: 800, margin: '2rem auto' }}>
                        Welcome to Deal Shop, where innovation meets convenience. We're dedicated to providing 
                        the best online shopping experience with cutting-edge technology and exceptional service.
                    </Paragraph>
                </div>

                {/* Mission & Vision */}
                <Row gutter={[32, 32]} style={{ marginBottom: '4rem' }}>
                    <Col xs={24} md={12}>
                        <Card 
                            style={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            bodyStyle={{ color: 'white' }}
                        >
                            <Space direction="vertical" size="large">
                                <RocketOutlined style={{ fontSize: '2rem', color: 'white' }} />
                                <Title level={3} style={{ color: 'white', marginBottom: 0 }}>Our Mission</Title>
                                <Text style={{ color: 'white', fontSize: '1.1rem' }}>
                                    To create the most intuitive, secure, and efficient e-commerce platform 
                                    that connects buyers and sellers in a seamless digital marketplace.
                                </Text>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card 
                            style={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                            bodyStyle={{ color: 'white' }}
                        >
                            <Space direction="vertical" size="large">
                                <HeartOutlined style={{ fontSize: '2rem', color: 'white' }} />
                                <Title level={3} style={{ color: 'white', marginBottom: 0 }}>Our Vision</Title>
                                <Text style={{ color: 'white', fontSize: '1.1rem' }}>
                                    To become the global leader in innovative e-commerce solutions, 
                                    empowering businesses and delighting customers worldwide.
                                </Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Company Values */}
                <div style={{ marginBottom: '4rem' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        Our Values
                    </Title>
                    <Row gutter={[24, 24]}>
                        {companyValues.map((value, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <Card 
                                    hoverable
                                    style={{ 
                                        textAlign: 'center', 
                                        height: '100%',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div style={{ fontSize: '2.5rem', color: '#1890ff', marginBottom: '1rem' }}>
                                        {value.icon}
                                    </div>
                                    <Title level={4}>{value.title}</Title>
                                    <Paragraph type="secondary">
                                        {value.description}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                <Divider />

                {/* Team Section */}
                <div style={{ marginBottom: '3rem' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        Meet Our Team
                    </Title>
                    <Title level={4} type="secondary" style={{ textAlign: 'center', fontWeight: 'normal', marginBottom: '3rem' }}>
                        Team Horia Brenchu
                    </Title>
                    
                    <Row gutter={[32, 32]} justify="center">
                        {teamMembers.map((member, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                <Card 
                                    hoverable
                                    style={{ 
                                        textAlign: 'center',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                                    }}
                                    bodyStyle={{ padding: '2rem 1rem' }}
                                >
                                    <Avatar 
                                        size={120} 
                                        src={member.avatar}
                                        style={{ 
                                            marginBottom: '1rem',
                                            border: '4px solid #f0f0f0'
                                        }} 
                                    />
                                    <Title level={4} style={{ marginBottom: '0.5rem' }}>
                                        {member.name}
                                    </Title>
                                    <Text type="secondary" style={{ 
                                        fontSize: '1rem', 
                                        display: 'block', 
                                        marginBottom: '1rem' 
                                    }}>
                                        {member.position}
                                    </Text>
                                    <div>
                                        {member.skills.map((skill, skillIndex) => (
                                            <Tag 
                                                key={skillIndex} 
                                                color="blue" 
                                                style={{ margin: '2px' }}
                                            >
                                                {skill}
                                            </Tag>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Company Info */}
                <Card 
                    style={{ 
                        marginTop: '3rem',
                        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                        borderRadius: '16px'
                    }}
                    bodyStyle={{ color: 'white', textAlign: 'center', padding: '3rem' }}
                >
                    <Title level={2} style={{ color: 'white', marginBottom: '1rem' }}>
                        Why Choose Deal Shop?
                    </Title>
                    <Row gutter={[32, 16]} style={{ marginTop: '2rem' }}>
                        <Col xs={24} md={8}>
                            <Title level={4} style={{ color: 'white' }}>Secure Payments</Title>
                            <Text style={{ color: 'white' }}>
                                Industry-leading security with encrypted transactions
                            </Text>
                        </Col>
                        <Col xs={24} md={8}>
                            <Title level={4} style={{ color: 'white' }}>Fast Delivery</Title>
                            <Text style={{ color: 'white' }}>
                                Lightning-fast order processing and delivery
                            </Text>
                        </Col>
                        <Col xs={24} md={8}>
                            <Title level={4} style={{ color: 'white' }}>24/7 Support</Title>
                            <Text style={{ color: 'white' }}>
                                Round-the-clock customer support for all your needs
                            </Text>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default AboutPage; 