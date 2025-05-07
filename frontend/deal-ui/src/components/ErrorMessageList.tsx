import { Typography } from 'antd';

const { Text } = Typography;

export default function ErrorMessageList({ messages }: { messages: string[] }) {
    if (messages.length === 0) return null;

    return (
        <div style={{ textAlign: 'left', marginBottom: '5px' }}>
            {messages.length === 1 ? (
                <Text type="danger">{messages[0]}</Text>
            ) : (
                <>
                    <Text type="danger">{messages[0]}</Text>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {messages.slice(1).map((message, index) => (
                            <li key={index}>{message}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
