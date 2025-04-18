import { Typography } from 'antd';

const { Text } = Typography;

interface InputFormErrorListProps {
    messages: string[];
}

export default function InputFormErrorList ({ messages }: InputFormErrorListProps) {
    return (
        <div style={{ textAlign: 'left', marginBottom: '5px' }}>
            <Text type="danger">Password must meet the following criteria:</Text>
            <ul style={{ margin: 0, paddingLeft: '20px', textAlign: 'left' }}>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
};

