import React from 'react';
import {
    Alert,
    Breadcrumb,
    Button,
    Card,
    Divider,
    Layout,
    Space,
    Typography,
    theme
} from 'antd';
import { useSnackbar } from "../context/SnackbarContext";
import { Navbar } from "../components/common/Navbar.tsx";
import { spacing, layout } from "../theme/tokens";

const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;
const { useToken } = theme;

export const Home: React.FC = () => {
    const { showError, showSuccess, showInfo, showWarning } = useSnackbar();
    const { token } = useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            
            <Content style={{ 
                padding: spacing.lg,
                backgroundColor: token.colorBgLayout,
                minHeight: `calc(100vh - ${layout.headerHeight} - ${layout.footerHeight})`
            }}>
                <div style={{ 
                    maxWidth: layout.maxWidth.lg,
                    margin: '0 auto',
                    width: '100%'
                }}>
                    <Breadcrumb
                        items={[
                            { title: 'Home' },
                            { title: 'Dashboard' }
                        ]}
                        style={{ 
                            marginBottom: spacing.md,
                            color: token.colorTextSecondary
                        }}
                    />

                    <Title style={{ 
                        color: token.colorText
                    }}>
                        Welcome to Our E-Commerce Platform
                    </Title>
                    <Paragraph style={{ 
                        color: token.colorTextSecondary
                    }}>
                        This is a demo page showcasing Ant Design components using the custom theme.
                    </Paragraph>

                    <Alert 
                        message="Sale ends today! 20% off all products" 
                        type="success" 
                        showIcon
                        style={{ marginBottom: spacing.lg }}
                    />

                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card
                            title="Test Snackbar Notifications"
                            style={{ 
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                width: '100%'
                            }}
                        >
                            <Space wrap>
                                <Button type="primary" onClick={() => showSuccess('Success', 'This is a success message')}>
                                    Show Success
                                </Button>
                                <Button onClick={() => showError('Error', 'This is an error message')}>
                                    Show Error
                                </Button>
                                <Button onClick={() => showInfo('Info', 'This is an info message')}>
                                    Show Info
                                </Button>
                                <Button onClick={() => showWarning('Warning', 'This is a warning message')}>
                                    Show Warning
                                </Button>
                            </Space>
                        </Card>

                        <Card
                            title="Theme Demo"
                            style={{ 
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                width: '100%'
                            }}
                        >
                            <Space wrap>
                                <Button type="primary">Primary Button</Button>
                                <Button>Default Button</Button>
                                <Button type="dashed">Dashed Button</Button>
                                <Button type="text">Text Button</Button>
                                <Button type="link">Link Button</Button>
                            </Space>
                        </Card>
                    </Space>
                </div>
            </Content>

            <Footer style={{ 
                textAlign: 'center',
                backgroundColor: token.colorBgContainer,
                color: token.colorTextSecondary,
                padding: spacing.md,
                borderTop: `1px solid ${token.colorBorder}`,
            }}>
                DEAL E-Commerce ©{new Date().getFullYear()} Created with Ant Design
            </Footer>
        </Layout>
    );
};