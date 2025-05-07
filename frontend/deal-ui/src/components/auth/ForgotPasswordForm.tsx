import type {FormProps} from "antd";
import {Button, Form, Input, theme, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {emailRules} from "../../utils/validators";
import {ROUTES} from "../../routes/AppRouter";
import {ForgotPasswordRequest} from "../../types/transfer";
import {useState} from "react";
import {useSnackbar} from "../../context/SnackbarContext";

const {Text, Link} = Typography;
const {useToken} = theme;

interface ForgotPasswordFormProps {
    onForgotPasswordSuccess: (data: ForgotPasswordRequest) => void;
    onForgotPasswordError: (message: string) => void;
}

export const ForgotPasswordForm = ({onForgotPasswordSuccess, onForgotPasswordError}: ForgotPasswordFormProps) => {
    const [form] = Form.useForm<ForgotPasswordRequest>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {token} = useToken();
    const {showErrors} = useSnackbar();

    const onFinish: FormProps<ForgotPasswordRequest>['onFinish'] = async (values) => {
        try {
            setLoading(true);
            onForgotPasswordSuccess(values);
        } catch (error) {
            onForgotPasswordError(error instanceof Error ? error.message : 'An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };

    const handleValidationError: FormProps<ForgotPasswordRequest>['onFinishFailed'] = (errorInfo) => {
        errorInfo.errorFields.forEach(e => showErrors(e.errors));
    };

    return (
        <Form<ForgotPasswordRequest>
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
                }}>Email address</span>}
                name="email"
                rules={emailRules}
                hasFeedback
                style={{marginBottom: token.spacing.sm}}
            >
                <Input placeholder="Enter your email address"/>
            </Form.Item>

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
                    Send reset link
                </Button>
            </Form.Item>

            <div style={{
                textAlign: "center",
                fontSize: token.customFontSize.sm,
                color: token.colorTextSecondary
            }}>
                <Text>Remember your password? </Text>
                <Link onClick={() => navigate(ROUTES.LOGIN)}>Sign in</Link>
            </div>
        </Form>
    );
};
