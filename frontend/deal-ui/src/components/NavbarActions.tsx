import React from 'react';
import { Button, Space, Switch, theme } from 'antd';

const { useToken } = theme;

interface NavbarActionsProps {
  onThemeChange: () => void;
  isDarkMode: boolean;
  onNavigate: (path: string) => void;
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({
  onThemeChange,
  isDarkMode,
  onNavigate,
}) => {
  const { token } = useToken();

  return (
    <Space size="middle" align="center">
      <Switch
        checked={isDarkMode}
        onChange={onThemeChange}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
        style={{
          background: token.colorPrimary,
        }}
      />

      <Space size="small">
        <Button 
          type="link" 
          onClick={() => onNavigate('/login')}
          style={{
            color: token.colorText,
            fontWeight: 500,
            fontSize: '15px',
          }}
        >
          Sign In
        </Button>
        <Button 
          type="primary"
          onClick={() => onNavigate('/register')}
          style={{
            fontWeight: 500,
            height: '36px',
            padding: '4px 20px',
            fontSize: '15px',
          }}
        >
          Sign Up
        </Button>
      </Space>
    </Space>
  );
}; 