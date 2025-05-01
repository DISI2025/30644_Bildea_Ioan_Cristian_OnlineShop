import { Form, Input, Button, Checkbox, Typography } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { usernameRules, emailRules, passwordRules, confirmPasswordRules, fullNameRules } from "../../utils/validators.ts";
import { fontSize, spacing } from "../../theme/tokens.ts";
import { ROUTES } from "../../routes/AppRouters.tsx";
import { RegisterFormData } from "../../types/api.ts";
import { useState } from "react";
import { theme } from 'antd';

const { Text, Link } = Typography;
const { useToken } = theme;

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onRegisterError: (message: string) => void;
}

export const RegisterForm = ({ onRegisterSuccess, onRegisterError }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterFormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useToken();

  const handleRegisterSuccess = (values: RegisterFormData) => {
    console.log('Registration Success:', {
      formData: values
    });
    onRegisterSuccess();
    navigate(ROUTES.LOGIN);
  };

  const handleRegisterError = (error: unknown, values: RegisterFormData) => {
    console.error('Registration Error:', {
      error,
      formData: values
    });
    onRegisterError('An unexpected error occurred. Please try again.');
  };

  const handleValidationError = () => {
    console.log('Form Validation Failed:', {
      formErrors: form.getFieldsError(),
      formData: form.getFieldsValue()
    });
    onRegisterError("Please fix the highlighted errors.");
  };

  const onFinish: FormProps<RegisterFormData>['onFinish'] = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      handleRegisterSuccess(values);
    } catch (error) {
      handleRegisterError(error, values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<RegisterFormData> 
      form={form}
      layout="vertical" 
      onFinish={onFinish} 
      onFinishFailed={handleValidationError}
      scrollToFirstError
      style={{ width: "100%" }}
      size="large"
    >
      <Form.Item
        label={<span style={{
          fontSize: fontSize.sm,
          color: token.colorText
        }}>Full Name</span>}
        name="fullName"
        rules={fullNameRules}
        hasFeedback
        style={{ marginBottom: spacing.sm }}
      >
        <Input placeholder="Enter your full name" />
      </Form.Item>

      <Form.Item
        label={<span style={{
          fontSize: fontSize.sm,
          color: token.colorText
        }}>Username</span>}
        name="username"
        rules={usernameRules}
        hasFeedback
        style={{ marginBottom: spacing.sm }}
      >
        <Input placeholder="Choose a username" />
      </Form.Item>

      <Form.Item
        label={<span style={{
          fontSize: fontSize.sm,
          color: token.colorText
        }}>Email address</span>}
        name="email"
        rules={emailRules}
        hasFeedback
        style={{ marginBottom: spacing.sm }}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label={<span style={{
          fontSize: fontSize.sm,
          color: token.colorText
        }}>Password</span>}
        name="password"
        rules={passwordRules}
        hasFeedback
        style={{ marginBottom: spacing.sm }}
      >
        <Input.Password placeholder="Create a password" />
      </Form.Item>

      <Form.Item
        label={<span style={{
          fontSize: fontSize.sm,
          color: token.colorText
        }}>Confirm Password</span>}
        name="confirmPassword"
        dependencies={['password']}
        rules={confirmPasswordRules()}
        hasFeedback
        style={{ marginBottom: spacing.sm }}
      >
        <Input.Password placeholder="Confirm your password" />
      </Form.Item>

      <Form.Item
        name="agreeToTerms"
        valuePropName="checked"
        rules={[{ required: true, message: 'Please agree to the terms and conditions' }]}
        style={{ marginBottom: spacing.md }}
      >
        <Checkbox>
          <Text style={{
            fontSize: fontSize.xs,
            color: token.colorTextSecondary
          }}>
            I agree to the <Link href="#terms">Terms of Service</Link> and <Link href="#privacy">Privacy Policy</Link>
          </Text>
        </Checkbox>
      </Form.Item>

      <Form.Item style={{ marginBottom: spacing.none }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
        >
          Create Account
        </Button>
      </Form.Item>

      <div style={{
        textAlign: "center",
        fontSize: fontSize.sm,
        color: token.colorTextSecondary
      }}>
        <Text>Already have an account? </Text>
        <Link onClick={() => navigate(ROUTES.LOGIN)}>Sign in</Link>
      </div>
    </Form>
  );
}; 