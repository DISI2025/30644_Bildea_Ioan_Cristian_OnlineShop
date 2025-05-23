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

    const userMenuItems = useMemo(() => {
        const allUserItems = [
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
                requiresSeller: true,
            },
        ];

        return allUserItems.filter(item => {
            if (item.requiresSeller) {
                return authState.isSeller;
            }
            return true;
        });
    }, [token, authState.isSeller]);

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
        {
            key: ROUTES.ASSIGN_PRODUCT_CATEGORIES,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <ProductOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Product Category Assign Manager</span>
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
                zIndex: 100,
                height: token.layout.headerHeight,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                overflow: 'visible',
            }}
        >
            <Flex align="center" gap={token.spacing.lg} style={{ flex: '1 1 auto', overflow: 'visible' }}>
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
                        borderBottom: 'none',
                        flex: '1 1 auto',
                        overflow: 'visible',
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