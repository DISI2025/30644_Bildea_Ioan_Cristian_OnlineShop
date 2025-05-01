import React from 'react';
import { Layout, Switch, theme } from 'antd';
import { useTheme } from '../../context/ThemeContext.tsx';
import { spacing } from '../../theme/tokens.ts';

const { Header } = Layout;
const { useToken } = theme;

export const SimpleHeader: React.FC = () => {
  const { toggleTheme } = useTheme();
  const { token } = useToken();

  return (
    <Header style={{
      background: 'transparent',
      padding: `${spacing.sm} ${spacing.lg}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 'auto',
      height: 'auto',
      zIndex: 1000,
    }}>
      <Switch
        checked={token.colorBgContainer === '#141414'}
        onChange={toggleTheme}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
      />
    </Header>
  );
}; 