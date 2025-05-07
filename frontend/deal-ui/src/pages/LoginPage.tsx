import {Form, Input, Button, Checkbox, Typography, Divider} from "antd";
import {GoogleOutlined, AppleOutlined} from "@ant-design/icons";
import type {FormProps} from "antd";
import {useSnackbar} from "../context/SnackbarContext.tsx";
import {useNavigate} from "react-router-dom";
import {usernameRules, passwordRules} from "../utlis/Validators.tsx";
import {AuthData, AuthRequest, BaseResponse, DealResponse} from "../types/transfer.ts";
import {useLoginMutation} from "../store/api.ts";

const {Title, Text, Link} = Typography;
export default function LoginPage() {
    const {showSuccess, showInfo, showError, showErrors} = useSnackbar();
    const navigate = useNavigate();
    const [login] = useLoginMutation();

    const onFinish: FormProps['onFinish'] = (data: AuthRequest) => {
        login(data).unwrap().then((response: DealResponse<AuthData>) => {
            // TODO: Handle the response and store the auth data in the state
            console.log(response);
            // dispatch(startSession(response.data));
            showSuccess('Login Successful', 'You have been logged in successfully.');
            navigate('/');
        }).catch((response: BaseResponse) => {
            showErrors(response?.errors);
        });
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
                <Title level={3} style={{textAlign: "center", marginBottom: 0}}>DEAL</Title>
                <Text style={{display: "block", textAlign: "center", marginBottom: 30}}>Sign in to your
                    account</Text>

                <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={usernameRules}>
                        <Input placeholder="Enter your username"/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={passwordRules}>
                        <Input.Password placeholder="Enter your password"/>
                    </Form.Item>

                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: 16}}>
                        <Checkbox>Remember me</Checkbox>
                        <Link onClick={() => navigate('/forgot-password')}>Forgot password?</Link>
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

                <div style={{display: "flex", justifyContent: "space-between", gap: 10}}>
                    <Button
                        icon={<GoogleOutlined/>}
                        onClick={() => showInfo('FYI', 'Google authentication coming soon.')}
                        block
                    >
                        Google
                    </Button>
                    <Button
                        icon={<AppleOutlined/>}
                        onClick={() => showInfo('FYI', 'Apple authentication coming soon.')}
                        block
                    >
                        Apple
                    </Button>
                </div>

                <div style={{marginTop: 20, textAlign: "center"}}>
                    <Text>Don't have an account? </Text>
                    <Link onClick={() => navigate('/signup')}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};