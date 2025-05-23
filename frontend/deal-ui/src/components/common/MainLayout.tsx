import React, { ReactNode } from 'react';
import { Layout, theme } from 'antd';
import { Navbar } from './Navbar';

const { Content } = Layout;
const { useToken } = theme;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { token } = useToken();
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content
        style={{
          padding: `${parseInt(token.layout.headerHeight) + parseInt(token.spacing.md)}px ${token.spacing.lg} ${token.spacing.lg}`,
          marginTop: 0,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}; 