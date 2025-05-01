import {Form, Input, Button, Typography, FormProps} from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "../context/SnackbarContext.tsx";
import {emailRules} from "../utlis/Validators.tsx";

const { Title, Text, Link } = Typography;

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const {showSuccess, showError} = useSnackbar();

    const onFinish: FormProps['onFinish'] = () => {
        //TODO backend call
        showSuccess('Reset Link Sent Successful', 'The reset link was sent successfully.');
        navigate('/');
    };

    const onFinishFailed = () => {
        showError("Oops!", "Please fix the highlighted errors.");
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f7f8fa'
        }}>
            <div style={{
                width: 400,
                padding: 30,
                backgroundColor: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <LockOutlined style={{ fontSize: 32, marginBottom: 16 }} />
                <Title level={3}>DEAL</Title>
                <Title level={5}>Forgot your password?</Title>
                <Text>Enter your email address and we’ll send you a link to reset your password.</Text>

                <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} style={{ marginTop: 24 }}>
                    <Form.Item
                        label="Email address"
                        name="email"
                        rules={emailRules}>
                        <Input placeholder="Email address" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Send reset link
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ margin: '16px 0' }}>
                    <Text type="secondary">Or</Text>
                </div>

                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/login')}>
                    Back to login
                </Button>

                <div style={{ marginTop: 24 }}>
                    <Text type="secondary">
                        Need help? <Link href="#">Contact Support</Link>
                    </Text>
                </div>
            </div>
        </div>
    );
};

