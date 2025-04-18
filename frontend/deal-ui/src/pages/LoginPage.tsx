import { Form, Input, Button, Checkbox, Typography, Divider } from "antd";
import { GoogleOutlined, AppleOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import InputFormErrorText from "../components/InputFormErrorText.tsx";
import InputFormErrorList from "../components/InputFormErrorList.tsx";
import {useSnackbar} from "../context/SnackbarContext.tsx";
import {useNavigate} from "react-router-dom";

const { Title, Text, Link } = Typography;

export default function LoginPage () {

    const {showSuccess, showInfo, showError} = useSnackbar();
    const navigate = useNavigate();

    const onFinish: FormProps['onFinish'] = (values) => {
        console.log("Received values:", values);
        showSuccess('Login Successful', 'You have been logged in successfully.');
        navigate('/');
    };

    const onFinishFailed = () => {
        showError("Oops!", "Please fix the highlighted errors.");
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f7f8fa"
        }}>
            <div style={{
                width: 400,
                padding: 30,
                backgroundColor: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
                <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>DEAL</Title>
                <Text style={{ display: "block", textAlign: "center", marginBottom: 30 }}>Sign in to your account</Text>

                <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label="Email address"
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: <InputFormErrorText message={'Please enter a valid email'} />
                            },
                            {
                                required: true,
                                message: <InputFormErrorText message={'Please write your email'} />
                            }
                        ]}>
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: <InputFormErrorText message={'Please write your password'} />
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: (
                                    <InputFormErrorList
                                        messages={[
                                            'At least 8 characters long',
                                            'At least one uppercase letter',
                                            'At least one lowercase letter',
                                            'At least one number',
                                            'At least one special character (e.g., @$!%*?&)'
                                        ]}
                                    />
                                )
                            },
                        ]}>
                        <Input.Password placeholder="Enter your password"/>
                    </Form.Item>

                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: 16}}>
                        <Checkbox>Remember me</Checkbox>
                        <Link href="#">Forgot password?</Link>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                        >
                            Sign in
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>Or continue with</Divider>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <Button
                        icon={<GoogleOutlined/>}
                        onClick={() => showInfo('FYI', 'Google authentication coming soon.')}
                        block
                    >
                        Google
                    </Button>
                    <Button
                        icon={<AppleOutlined />}
                        onClick={() => showInfo('FYI', 'Apple authentication coming soon.')}
                        block
                    >
                        Apple
                    </Button>
                </div>

                <div style={{ marginTop: 20, textAlign: "center" }}>
                    <Text>Don't have an account? </Text>
                    <Link href="#">Sign up</Link>
                </div>
            </div>
        </div>
    );
};
