import React from 'react';
import {
    Alert,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    Divider,
    Input,
    Layout,
    Menu,
    Radio,
    Select,
    Space,
    Switch,
    Tag,
    Typography
} from 'antd';
import {useSnackbar} from "../context/SnackbarContext.tsx";
import {useTheme} from "../context/ThemeContext.tsx";

const {Title, Paragraph, Text} = Typography;
const {Header, Content, Footer} = Layout;
const {Option} = Select;

export const Home: React.FC = () => {
    const {showError, showSuccess, showInfo, showWarning} = useSnackbar();
    const { themeType, toggleTheme } = useTheme();

    return (
        <Layout>
            <Header style={{background: '#fff', padding: '0 20px'}}>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={[
                        { key: '1', label: 'Home' },
                        { key: '2', label: 'Products' },
                        { key: '3', label: 'Categories' },
                        { key: '4', label: 'Cart'  }
                    ]}
                    style={{lineHeight: '64px'}}
                />
                <Switch
                    checked={themeType === 'dark'}
                    onChange={toggleTheme}
                    checkedChildren="Dark"
                    unCheckedChildren="Light"
                />
            </Header>

            <Content style={{padding: '20px', backgroundColor: '#fafafa'}}>
                <Breadcrumb
                    items={[
                        { title: 'Home' },
                        { title: 'Dashboard' }
                    ]}
                    style={{ margin: '16px 0' }}
                />

                <Title>Welcome to Our E-Commerce Platform</Title>
                <Paragraph>
                    This is a demo page showcasing Ant Design components using the custom theme.
                </Paragraph>

                <Alert message="Sale ends today! 20% off all products" type="success" showIcon
                       style={{marginBottom: '20px'}}/>

                <Divider orientation="left">Button Variants</Divider>
                <Space>
                    <Button type="primary">Primary Button</Button>
                    <Button>Default Button</Button>
                    <Button type="dashed">Dashed Button</Button>
                    <Button type="link">Link Button</Button>
                    <Button type="primary" danger>Danger Button</Button>
                </Space>

                <Divider orientation="left">Form Elements</Divider>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Input placeholder="Basic input"/>
                    <Input.Password placeholder="Password input"/>
                    <Select defaultValue="option1" style={{width: 200}}>
                        <Option value="option1">Option 1</Option>
                        <Option value="option2">Option 2</Option>
                    </Select>
                    <Space>
                        <Checkbox>Checkbox</Checkbox>
                        <Switch defaultChecked/>
                        <Radio>Radio</Radio>
                    </Space>
                </Space>

                <Divider orientation="left">Featured Products</Divider>
                <Space size="large" wrap>
                    <Card title="Product 1" style={{width: 300}}>
                        <p>Product description goes here</p>
                        <Tag color="purple">New</Tag>
                        <div style={{marginTop: 16}}>
                            <Text type="secondary" delete>$99.99</Text>
                            <Text strong style={{marginLeft: 8}}>$79.99</Text>
                            <Button type="primary" size="small" style={{marginLeft: 8}}>Add to Cart</Button>
                        </div>
                    </Card>

                    <Card title="Product 2" style={{width: 300}}>
                        <p>Product description goes here</p>
                        <Tag color="orange">Sale</Tag>
                        <div style={{marginTop: 16}}>
                            <Text strong>$59.99</Text>
                            <Button type="primary" size="small" style={{marginLeft: 8}}>Add to Cart</Button>
                        </div>
                    </Card>
                </Space>
                <Content style={{padding: '20px', backgroundColor: '#fafafa'}}>
                    <Title>Global Snackbar Demo</Title>
                    <Paragraph>
                        Click a button below to display a global notification using Ant Design's notification API.
                    </Paragraph>
                    <Button type="primary"
                            onClick={() => showSuccess('Operation Successful', 'The operation completed without issues.')}>
                        Show Success
                    </Button>{' '}
                    <Button danger
                            onClick={() => showError('An Error Occurred', 'There was a problem processing your request.')}>
                        Show Error
                    </Button>{' '}
                    <Button onClick={() => showInfo('FYI', 'This is some information for you.')}>
                        Show Info
                    </Button>{' '}
                    <Button onClick={() => showWarning('Warning', 'Please be cautious!')}>
                        Show Warning
                    </Button>
                </Content>
            </Content>

            <Footer style={{textAlign: 'center'}}>
                E-Commerce Demo ©{new Date().getFullYear()} Created with Ant Design
            </Footer>
        </Layout>
    );
};