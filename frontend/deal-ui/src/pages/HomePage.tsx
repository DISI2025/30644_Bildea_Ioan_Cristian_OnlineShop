import React from 'react';
import {Layout, theme} from 'antd';
import {Navbar} from "../components/common/Navbar";

const {Content, Footer} = Layout;
const {useToken} = theme;

export const HomePage: React.FC = () => {
    const {token} = useToken();

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Navbar/>

            <Content style={{
                padding: token.spacing.lg,
                backgroundColor: token.colorBgLayout,
                minHeight: `calc(100vh - ${token.layout.headerHeight}px - ${token.layout.footerHeight}px)`,
                marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
            }}>
            </Content>

            <Footer style={{
                textAlign: 'center',
                backgroundColor: token.colorBgContainer,
                color: token.colorTextSecondary,
                padding: token.spacing.md,
                borderTop: `${token.colorBorder}`,
            }}>
                DEAL E-Commerce ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
};