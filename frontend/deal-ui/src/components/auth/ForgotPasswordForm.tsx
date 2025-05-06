import { Form, Input, Button } from 'antd';
import {emailRules} from "../../utlis/Validators.tsx";
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

interface ForgotPasswordFormProps {
    onFinish: (values: { email: string }) => void;
    onFinishFailed: (errorInfo: ValidateErrorEntity) => void;
}

export default function ForgotPasswordForm ({onFinish, onFinishFailed}: ForgotPasswordFormProps) {
    return (
        <div>

            <Form
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ marginTop: 24 }}
            >
                <Form.Item
                    label="Email address"
                    name="email"
                    rules={emailRules}
                    hasFeedback
                >
                    <Input placeholder="Email address" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Send reset link
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
