import React, { useMemo } from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../routes/AppRouters';
import { spacing } from '../theme/tokens';
import { HomeOutlined, AppstoreOutlined, ShopOutlined } from '@ant-design/icons';
import { Logo } from './Logo';
import { NavbarController } from './NavbarController.tsx';

const { Header } = Layout;
const { useToken } = theme;

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleTheme, isDark } = useTheme();
    const { token } = useToken();

    const navbarStyle = useMemo(() => ({
        background: token.colorBgContainer,
        padding: `0 ${spacing.xl}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: `0 4px 20px ${token.colorBgElevated}`,
        position: 'sticky' as const,
        top: 0,
        zIndex: 1000,
        height: '64px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        backgroundColor: isDark
            ? 'rgba(0, 0, 0, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
    }), [token, isDark]);

    const menuContainerStyle = useMemo(() => ({
        display: 'flex',
        alignItems: 'center',
        gap: spacing.lg,
    }), []);

    const menuStyle = useMemo(() => ({
        background: 'transparent',
        color: token.colorText,
        fontSize: '15px',
        minWidth: '400px',
        borderBottom: 'none',
    }), [token.colorText]);

    const menuItems = useMemo(() => [
        {
            key: ROUTES.HOME,
            label: (
                <div className="nav-item-content">
                    <HomeOutlined />
                    <span>Home</span>
                </div>
            ),
        },
        {
            key: ROUTES.PRODUCTS,
            label: (
                <div className="nav-item-content">
                    <ShopOutlined />
                    <span>Products</span>
                </div>
            ),
        },
        {
            key: ROUTES.CATEGORIES,
            label: (
                <div className="nav-item-content">
                    <AppstoreOutlined />
                    <span>Categories</span>
                </div>
            ),
        },
    ], []);

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    return (
        <Header style={navbarStyle}>
            <div style={menuContainerStyle}>
                <Logo onClick={() => navigate(ROUTES.HOME)} />
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={menuStyle}
                    onClick={handleMenuClick}
                    className="navbar-menu"
                />
            </div>

            <NavbarController
                onThemeChange={toggleTheme}
                isDarkMode={isDark}
                onNavigate={navigate}
            />
        </Header>
    );
};