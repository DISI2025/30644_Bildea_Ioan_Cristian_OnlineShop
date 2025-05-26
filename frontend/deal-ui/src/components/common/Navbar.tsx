import React, {useMemo, useState, useEffect} from 'react';
import {Flex, Layout, Menu, theme, Drawer, Button, Space} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTheme} from '../../context/ThemeContext.tsx';
import {ROUTES} from '../../routes/AppRouter.tsx';
import {HomeOutlined, ProductOutlined, ShoppingOutlined, InfoCircleOutlined, ContactsOutlined, MenuOutlined, CloseOutlined, StarOutlined} from '@ant-design/icons';
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
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            setIsMobile(screenWidth < 1024);
            // Close mobile menu if screen becomes large
            if (screenWidth >= 1024) {
                setMobileMenuVisible(false);
            }
        };

        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            key: ROUTES.RECOMMENDATIONS,
            label: (
                <div style={{display: 'flex', alignItems: 'center', gap: token.spacing.xs}}>
                    <StarOutlined style={{fontSize: token.customFontSize.md}}/>
                    <span>Recommendations</span>
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
                className="navbar-header"
                style={{
                    background: token.colorBgContainer,
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    height: '64px',
                    borderBottom: `1px solid ${token.colorBorder}`,
                    backdropFilter: 'blur(8px)',
                }}
            >
                <Flex align="center" gap="16px" style={{ flex: 1, minWidth: 0 }}>
                    {isMobile && (
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={toggleMobileMenu}
                            className="mobile-menu-trigger"
                            style={{
                                fontSize: '18px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                color: token.colorText,
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            aria-label="Open navigation menu"
                        />
                    )}
                    
                    <Logo onClick={() => navigate(ROUTES.HOME)}/>
                    
                    {!isMobile && (
                        <Menu
                            mode="horizontal"
                            selectedKeys={[location.pathname]}
                            items={currentMenuItems}
                            onClick={handleMenuClick}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                flex: 1,
                                minWidth: 0,
                            }}
                            className="desktop-menu"
                        />
                    )}
                </Flex>

                <div style={{ flexShrink: 0 }}>
                    <NavbarController
                        onThemeChange={toggleTheme}
                        onNavigate={navigate}
                    />
                </div>
            </Header>

            <Drawer
                title={
                    <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space align="center">
                            <MenuOutlined style={{ color: token.colorPrimary }} />
                            <span style={{ 
                                color: token.colorText, 
                                fontSize: '16px', 
                                fontWeight: 600 
                            }}>
                                Navigation
                            </span>
                        </Space>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => setMobileMenuVisible(false)}
                            style={{
                                color: token.colorTextSecondary,
                                fontSize: '14px',
                                width: '32px',
                                height: '32px',
                            }}
                            aria-label="Close navigation menu"
                        />
                    </Space>
                }
                placement="left"
                closable={false}
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                bodyStyle={{ 
                    padding: 0,
                    background: token.colorBgContainer
                }}
                headerStyle={{ 
                    borderBottom: `1px solid ${token.colorBorder}`,
                    background: token.colorBgContainer,
                    padding: '16px 24px',
                }}
                width={Math.min(320, window.innerWidth * 0.85)}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                destroyOnClose={false}
                forceRender={true}
            >
                <div style={{ 
                    padding: '24px 0',
                    minHeight: 'calc(100vh - 80px)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Menu
                        mode="vertical"
                        selectedKeys={[location.pathname]}
                        items={currentMenuItems}
                        onClick={handleMenuClick}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '15px',
                            flex: 1,
                        }}
                        inlineIndent={24}
                    />
                    
                    <div style={{
                        padding: '24px',
                        borderTop: `1px solid ${token.colorBorder}`,
                        background: token.colorFillQuaternary,
                        borderRadius: '12px',
                        margin: '16px',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px'
                        }}>
                            <span style={{ 
                                color: token.colorText, 
                                fontSize: '14px',
                                fontWeight: 500
                            }}>
                                Appearance
                            </span>
                        </div>
                        <NavbarController
                            onThemeChange={toggleTheme}
                            onNavigate={navigate}
                        />
                    </div>
                </div>
            </Drawer>
        </>
    );
};