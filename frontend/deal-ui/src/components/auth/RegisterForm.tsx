import {Form, Input, Button, Checkbox, Typography, theme} from "antd";
import type {FormProps} from "antd";
import {useNavigate} from "react-router-dom";
import {usernameRules, emailRules, passwordRules, confirmPasswordRules, fullNameRules} from "../../utils/validators";
import {ROUTES} from "../../routes/AppRouter";
import {RegisterFormData} from "../../types/api";
import {useState} from "react";

const {Text, Link} = Typography;
const {useToken} = theme;

interface RegisterFormProps {
    onRegisterSuccess: () => void;
    onRegisterError: (message: string) => void;
}

export const RegisterForm = ({onRegisterSuccess, onRegisterError}: RegisterFormProps) => {
    const [form] = Form.useForm<RegisterFormData>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {token} = useToken();

    // TODO: Implement integrated register endpoind and fix type errors
    const onFinish: FormProps<RegisterFormData>['onFinish'] = async (values) => {
        try {
            setLoading(true);
            console.log(values)
            // TODO: Implement registration logic
            onRegisterSuccess();
        } catch (error) {
            onRegisterError(error instanceof Error ? error.message : 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const handleValidationError: FormProps<RegisterFormData>['onFinishFailed'] = (errorInfo) => {
        console.error('Validation failed:', errorInfo);
    };

    return (
        <Form<RegisterFormData>
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
                }}>Full Name</span>}
                name="fullName"
                rules={fullNameRules}
                hasFeedback
                style={{marginBottom: token.spacing.sm}}
            >
                <Input placeholder="Enter your full name"/>
            </Form.Item>

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
                <Input placeholder="Choose a username"/>
            </Form.Item>

            <Form.Item
                label={<span style={{
                    fontSize: token.customFontSize.sm,
                    color: token.colorText
                }}>Email address</span>}
                name="email"
                rules={emailRules}
                hasFeedback
                style={{marginBottom: token.spacing.sm}}
            >
                <Input placeholder="Enter your email"/>
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
                <Input.Password placeholder="Create a password"/>
            </Form.Item>

            <Form.Item
                label={<span style={{
                    fontSize: token.customFontSize.sm,
                    color: token.colorText
                }}>Confirm Password</span>}
                name="confirmPassword"
                dependencies={['password']}
                rules={confirmPasswordRules()}
                hasFeedback
                style={{marginBottom: token.spacing.sm}}
            >
                <Input.Password placeholder="Confirm your password"/>
            </Form.Item>

            <Form.Item
                name="agreeToTerms"
                valuePropName="checked"
                rules={[{required: true, message: 'Please agree to the terms and conditions'}]}
                style={{marginBottom: token.spacing.md}}
            >
                <Checkbox>
                    <Text style={{
                        fontSize: token.customFontSize.xs,
                        color: token.colorTextSecondary
                    }}>
                        I agree to the <Link href="#terms">Terms of Service</Link> and <Link href="#privacy">Privacy
                        Policy</Link>
                    </Text>
                </Checkbox>
            </Form.Item>

            <Form.Item style={{marginBottom: token.spacing.none}}>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                    style={{borderRadius: token.borderRadius.sm}}
                >
                    Create Account
                </Button>
            </Form.Item>

            <div style={{
                textAlign: "center",
                fontSize: token.customFontSize.sm,
                color: token.colorTextSecondary
            }}>
                <Text>Already have an account? </Text>
                <Link onClick={() => navigate(ROUTES.LOGIN)}>Sign in</Link>
            </div>
        </Form>
    );
}; 