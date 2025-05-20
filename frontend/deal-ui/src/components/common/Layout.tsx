import React, {ReactNode} from 'react';
import {Layout as AntLayout, theme} from 'antd';
import {Navbar} from './Navbar';
import {AuthState, selectAuthState} from "../../store/slices/auth-slice.ts";
import {useSelector} from "react-redux";
import {SimpleHeader} from "./SimpleHeader.tsx";

const { Content } = AntLayout;
const { useToken } = theme;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { token } = useToken();
  const authState: AuthState = useSelector(selectAuthState);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {authState.loggedIn ? <Navbar /> : <SimpleHeader/>}
      <Content
        style={{
          padding: `${parseInt(token.layout.headerHeight) + parseInt(token.spacing.md)}px ${token.spacing.lg} ${token.spacing.lg}`,
          marginTop: 0,
        }}
      >
        {children}
      </Content>
    </AntLayout>
  );
}; 