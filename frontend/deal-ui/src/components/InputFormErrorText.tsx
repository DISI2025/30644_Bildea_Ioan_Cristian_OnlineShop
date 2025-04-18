import { Typography } from 'antd';

const { Text } = Typography;

interface InputFormErrorTextProps {
    message: string;
}

export default function InputFormErrorText({ message }: InputFormErrorTextProps) {
    return <Text type="danger" style={{ display: 'block', textAlign: 'left' }}>{message}</Text>;
}
