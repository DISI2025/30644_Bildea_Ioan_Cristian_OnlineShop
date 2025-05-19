import {Form, Input, Button, Checkbox, Typography, theme} from "antd";
import type {FormProps} from "antd";
import {useNavigate} from "react-router-dom";
import {usernameRules, passwordRules} from "../../utils/validators";
import {ROUTES} from "../../routes/AppRouter";
import {AuthRequest} from "../../types/transfer";
import {useState} from "react";
import {useSnackbar} from "../../context/SnackbarContext";

const {Text, Link} = Typography;
const {useToken} = theme;

interface LoginFormProps {
    onLoginSuccess: (data: AuthRequest) => void;
    onLoginError: (message: string) => void;
}

export const LoginForm = ({onLoginSuccess, onLoginError}: LoginFormProps) => {
    const [form] = Form.useForm<AuthRequest>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {token} = useToken();
    const {showErrors} = useSnackbar();

    const onFinish: FormProps<AuthRequest>['onFinish'] = async (values) => {
        try {
            setLoading(true);
            onLoginSuccess(values);
        } catch (error) {
            onLoginError(error instanceof Error ? error.message : 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleValidationError: FormProps<AuthRequest>['onFinishFailed'] = (errorInfo) => {
        errorInfo.errorFields.forEach(e => showErrors(e.errors));
    };

    return (
        <Form<AuthRequest>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={handleValidationError}
            scrollToFirstError
            style={{width: "100%"}}
            size="large"
        >
            <Form.Item
                label={<span style={{
                    fontSize: token.customFontSize.sm,
                    color: token.colorText
                }}>Username</span>}
                name="username"
                rules={usernameRules}
                hasFeedback
                style={{marginBottom: token.spacing.sm}}
            >
                <Input placeholder="Enter your username"/>
            </Form.Item>

            <Form.Item
                label={<span style={{
                    fontSize: token.customFontSize.sm,
                    color: token.colorText
                }}>Password</span>}
                name="password"
                rules={passwordRules}
                hasFeedback
                style={{marginBottom: token.spacing.sm}}
            >
                <Input.Password placeholder="Enter your password"/>
            </Form.Item>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: token.spacing.md
            }}>
                <Checkbox>
                    <Text style={{
                        fontSize: token.customFontSize.xs,
                        color: token.colorTextSecondary
                    }}>Remember me</Text>
                </Checkbox>
                <Link onClick={() => navigate('/forgot-password')} style={{
                    fontSize: token.customFontSize.xs
                }}>Forgot password?</Link>
            </div>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                    style={{
                        borderRadius: token.borderRadius.sm,
                        height: token.controlHeight
                    }}
                >
                    Sign in
                </Button>
            </Form.Item>

            <div style={{
                textAlign: "center",
                fontSize: token.customFontSize.sm,
                color: token.colorTextSecondary
            }}>
                <Text>Don't have an account? </Text>
                <Link onClick={() => navigate(ROUTES.REGISTER)}>Sign up</Link>
            </div>
        </Form>
    );
}; 