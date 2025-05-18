import React, {useMemo} from 'react';
import {Layout, Menu, theme, Flex} from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import {useTheme} from '../../context/ThemeContext.tsx';
import {ROUTES} from '../../routes/AppRouter.tsx';
import {HomeOutlined} from '@ant-design/icons';
import {Logo} from './Logo.tsx';
import {NavbarController} from './NavbarController.tsx';

const {Header} = Layout;
const {useToken} = theme;

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {toggleTheme} = useTheme();
    const {token} = useToken();

    const menuItems = useMemo(() => [
        {
            key: ROUTES.HOME,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <HomeOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Home</span>
                </div>
            ),
        },
    ], [token]);

    const handleMenuClick = ({key}: { key: string }) => {
        navigate(key);
    };

    return (
        <Header
            style={{
                background: token.colorBgContainer,
                padding: `0 ${token.spacing.lg}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: token.shadows.light.md,
                position: 'sticky',
                top: 0,
                zIndex: token.layout.headerHeight,
                height: token.layout.headerHeight,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
            }}
        >
            <Flex align="center" gap={token.spacing.lg}>
                <Logo onClick={() => navigate(ROUTES.HOME)}/>
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{
                        background: 'transparent',
                        color: token.colorText,
                        fontSize: token.customFontSize.base,
                        minWidth: token.layout.maxWidth.sm,
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