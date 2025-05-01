import React from 'react';
import { Button, Space, Switch, theme } from 'antd';

const { useToken } = theme;

interface NavbarActionsProps {
  onThemeChange: () => void;
  onNavigate: (path: string) => void;
}

export const NavbarController: React.FC<NavbarActionsProps> = ({
  onThemeChange,
  onNavigate,
}) => {
  const { token } = useToken();

  return (
    <Space size="middle" align="center">
      <Switch
        onChange={onThemeChange}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
        style={{
          background: token.colorPrimary,
        }}
      />

      <Space size="small">
        <Button 
          type="primary" 
          onClick={() => onNavigate('/login')}
          style={{
            height: '36px',
            padding: '0 24px',
            borderRadius: '8px',
            fontWeight: 500,
          }}
          className="hover-lift"
        >
          Sign In
        </Button>
        <Button 
          onClick={() => onNavigate('/register')}
          style={{
            height: '36px',
            padding: '0 24px',
            borderRadius: '8px',
            fontWeight: 500,
            borderColor: token.colorBorder,
          }}
          className="hover-lift"
        >
          Sign Up
        </Button>
      </Space>
    </Space>
  );
}; 