import React, {useMemo, useState} from 'react';
import {Flex, Layout, Menu, theme, Drawer, Button} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTheme} from '../../context/ThemeContext.tsx';
import {ROUTES} from '../../routes/AppRouter.tsx';
import {HomeOutlined, ProductOutlined, ShoppingOutlined, InfoCircleOutlined, ContactsOutlined, MenuOutlined} from '@ant-design/icons';
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
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

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
        {
            key: ROUTES.ABOUT,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <InfoCircleOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>About</span>
                </div>
            ),
        },
        {
            key: ROUTES.CONTACT,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <ContactsOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Contact</span>
                </div>
            ),
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
        {
            key: ROUTES.ABOUT,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <InfoCircleOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>About</span>
                </div>
            ),
        },
        {
            key: ROUTES.CONTACT,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <ContactsOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Contact</span>
                </div>
            ),
        },
    ], [token]);

    const handleMenuClick = ({key}: { key: string }) => {
        navigate(key);
        setMobileMenuVisible(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuVisible(!mobileMenuVisible);
    };

    const currentMenuItems = authState.user?.role === UserRole.ADMIN ? adminMenuItems : userMenuItems;

    return (
        <>
            <Header
                style={{
                    background: token.colorBgContainer,
                    padding: `0 max(${token.spacing.lg}px, 5vw)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: token.shadows.light.md,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    height: token.layout.headerHeight,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    borderBottom: `1px solid ${token.colorBorder}`,
                }}
            >
                <Flex align="center" gap={token.spacing.lg} style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <Logo onClick={() => navigate(ROUTES.HOME)}/>
                    
                    {/* Desktop Menu */}
                    <Menu
                        mode="horizontal"
                        selectedKeys={[location.pathname]}
                        items={currentMenuItems}
                        onClick={handleMenuClick}
                        style={{
                            background: 'transparent',
                            color: token.colorText,
                            fontSize: token.customFontSize.base,
                            borderBottom: 'none',
                            flex: '1 1 auto',
                            justifyContent: 'flex-start',
                            minWidth: 0,
                        }}
                        className="desktop-menu"
                    />
                    
                    {/* Mobile Menu Trigger */}
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={toggleMobileMenu}
                        className="mobile-menu-trigger"
                        style={{
                            fontSize: '18px',
                            padding: '4px 8px',
                            height: 'auto',
                            display: 'none',
                        }}
                    />
                </Flex>

                <NavbarController
                    onThemeChange={toggleTheme}
                    onNavigate={navigate}
                />
            </Header>

            {/* Mobile Drawer Menu */}
            <Drawer
                title="Menu"
                placement="left"
                closable={true}
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                bodyStyle={{ padding: 0 }}
                headerStyle={{ borderBottom: `1px solid ${token.colorBorder}` }}
            >
                <Menu
                    mode="vertical"
                    selectedKeys={[location.pathname]}
                    items={currentMenuItems}
                    onClick={handleMenuClick}
                    style={{
                        background: 'transparent',
                        border: 'none',
                    }}
                />
            </Drawer>
        </>
    );
};