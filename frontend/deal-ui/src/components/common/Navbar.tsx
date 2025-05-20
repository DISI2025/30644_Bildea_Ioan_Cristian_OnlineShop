import React, {useMemo} from 'react';
import {Flex, Layout, Menu, theme} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTheme} from '../../context/ThemeContext.tsx';
import {ROUTES} from '../../routes/AppRouter.tsx';
import {HomeOutlined, ProductOutlined, ShoppingOutlined} from '@ant-design/icons';
import {Logo} from './Logo.tsx';
import {NavbarController} from './NavbarController.tsx';
import {AuthState, selectAuthState} from "../../store/slices/auth-slice.ts";
import {useSelector} from "react-redux";
import {UserRole} from "../../types/entities.ts";

const {Header} = Layout;
const {useToken} = theme;

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {toggleTheme} = useTheme();
    const {token} = useToken();
    const authState: AuthState = useSelector(selectAuthState);

    const userMenuItems = useMemo(() => [
        {
            key: ROUTES.HOME,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <HomeOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Home</span>
                </div>
            ),
        },
        {
            key: ROUTES.PRODUCTS,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <ShoppingOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Products Manager</span>
                </div>
            ),
        },
    ], [token]);

    const adminMenuItems = useMemo(() => [
        {
            key: ROUTES.HOME,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <HomeOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Home</span>
                </div>
            ),
        },
        {
            key: ROUTES.PRODUCT_CATEGORIES,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <ProductOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Product Category Manager</span>
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
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                height: token.layout.headerHeight,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                backgroundColor: `rgba(${token.colorBgContainer.replace(/[^\d,]/g, '')}, 0.95)`,
            }}
        >
            <Flex align="center" gap={token.spacing.lg}>
                <Logo onClick={() => navigate(ROUTES.HOME)}/>
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={authState.user?.role === UserRole.ADMIN ? adminMenuItems : userMenuItems}
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