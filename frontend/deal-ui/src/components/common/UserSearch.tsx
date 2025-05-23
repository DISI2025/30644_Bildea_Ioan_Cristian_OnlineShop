import React from 'react';
import { Input, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface UserSearchProps {
    onSearch: (value: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSearch }) => {
    return (
        <Card style={{ marginBottom: '16px' }}>
            <Input
                placeholder="Search users by name or username..."
                prefix={<SearchOutlined />}
                onChange={(e) => onSearch(e.target.value)}
                allowClear
                size="large"
            />
        </Card>
    );
};

export default UserSearch; 