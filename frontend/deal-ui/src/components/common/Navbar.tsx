import React, { useMemo } from 'react';
import { Layout, Menu, theme, Flex } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.tsx';
import { ROUTES } from '../../routes/AppRouters.tsx';
import { HomeOutlined, AppstoreOutlined, ShopOutlined } from '@ant-design/icons';
import { Logo } from './Logo.tsx';
import { NavbarController } from './NavbarController.tsx';

const { Header } = Layout;
const { useToken } = theme;

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleTheme } = useTheme();
    const { token } = useToken();

    const menuItems = useMemo(() => [
        {
            key: ROUTES.HOME,
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HomeOutlined style={{ fontSize: '18px' }} />
                    <span>Home</span>
                </div>
            ),
        },
    ], []);

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    return (
        <Header
            style={{
                background: token.colorBgContainer,
                padding: `0 ${token.paddingLG}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: `0 4px 20px ${token.colorBgElevated}`,
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                height: '64px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
            }}
        >
            <Flex align="center" gap={token.marginLG}>
                <Logo onClick={() => navigate(ROUTES.HOME)} />
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{
                        background: 'transparent',
                        color: token.colorText,
                        fontSize: '15px',
                        minWidth: '400px',
                        borderBottom: 'none',
                    }}
                />
            </Flex>

            <NavbarController
                onThemeChange={toggleTheme}
                onNavigate={navigate}
            />
        </Header>
    );
};