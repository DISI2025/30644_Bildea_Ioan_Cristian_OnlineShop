import type {FormProps} from "antd";
import {Button, Form, Input, theme, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {confirmPasswordRules, passwordRules} from "../../utils/validators";
import {ROUTES} from "../../routes/AppRouter";
import {ResetPasswordRequest} from "../../types/transfer";
import {useState} from "react";
import {useSnackbar} from "../../context/SnackbarContext";

const {Text, Link} = Typography;
const {useToken} = theme;

interface ResetPasswordFormProps {
    token: string;
    onResetPasswordSuccess: (data: ResetPasswordRequest) => void;
    onResetPasswordError: (message: string) => void;
}

export const ResetPasswordForm = ({token, onResetPasswordSuccess, onResetPasswordError}: ResetPasswordFormProps) => {
    const [form] = Form.useForm<ResetPasswordRequest>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {token: themeToken} = useToken();
    const {showErrors} = useSnackbar();

    const onFinish: FormProps<ResetPasswordRequest>['onFinish'] = async (values) => {
        try {
            setLoading(true);
            onResetPasswordSuccess({
                ...values,
                token
            });
        } catch (error) {
            onResetPasswordError(error instanceof Error ? error.message : 'An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };

    const handleValidationError: FormProps<ResetPasswordRequest>['onFinishFailed'] = (errorInfo) => {
        errorInfo.errorFields.forEach(e => showErrors(e.errors));
    };

    return (
        <Form<ResetPasswordRequest>
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
                    fontSize: themeToken.customFontSize.sm,
                    color: themeToken.colorText
                }}>New Password</span>}
                name="newPassword"
                rules={passwordRules}
                hasFeedback
                style={{marginBottom: themeToken.spacing.sm}}
            >
                <Input.Password placeholder="Enter your new password"/>
            </Form.Item>

            <Form.Item
                label={<span style={{
                    fontSize: themeToken.customFontSize.sm,
                    color: themeToken.colorText
                }}>Confirm Password</span>}
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={confirmPasswordRules()}
                hasFeedback
                style={{marginBottom: themeToken.spacing.sm}}
            >
                <Input.Password placeholder="Confirm your new password"/>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                    style={{
                        borderRadius: themeToken.borderRadius.sm,
                        height: themeToken.controlHeight
                    }}
                >
                    Reset Password
                </Button>
            </Form.Item>

            <div style={{
                textAlign: "center",
                fontSize: themeToken.customFontSize.sm,
                color: themeToken.colorTextSecondary
            }}>
                <Text>Remember your password? </Text>
                <Link onClick={() => navigate(ROUTES.LOGIN)}>Sign in</Link>
            </div>
        </Form>
    );
}; 