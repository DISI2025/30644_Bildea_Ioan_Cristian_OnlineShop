import React from 'react';
import {Button, Space, Switch, theme, Dropdown, Avatar, Badge} from 'antd';
import {ROUTES} from "../../routes/AppRouter.tsx";
import {useSelector} from "react-redux";
import {selectAuthState} from "../../store/slices/auth-slice";
import {useDispatch} from "react-redux";
import {endSession} from "../../store/slices/auth-slice";
import {UserOutlined, LogoutOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {selectCartTotalItems} from "../../store/slices/cart-slice";
import {UserRole} from "../../types/entities";
import { useGetUserProfileQuery } from '../../store/api';
import { useTheme } from "../../context/ThemeContext";

const {useToken} = theme;

interface NavbarActionsProps {
   onThemeChange: () => void;
   onNavigate: (path: string) => void;
}

export const NavbarController: React.FC<NavbarActionsProps> = ({
    onThemeChange,
    onNavigate,
}) => {
    const {token} = useToken();
    const { themeType } = useTheme();
    const dispatch = useDispatch();
    const {loggedIn, user} = useSelector(selectAuthState);
    const cartItemsCount = useSelector(selectCartTotalItems);

    const {
        data: profileResponse
    } = useGetUserProfileQuery(user?.id || '', {
        skip: !user?.id || !loggedIn
    });

    const userProfile = profileResponse?.payload;

   const handleLogout = () => {
      setTimeout(() => {
         dispatch(endSession());
         onNavigate(ROUTES.HOME);
      }, 500);
   };

   const profileItems: MenuProps['items'] = [
      {
         key: 'profile',
         label: 'Profile',
         icon: <UserOutlined/>,
         onClick: () => onNavigate(ROUTES.PROFILE.replace(':username', user?.username || '')),
      },
      {
         key: 'logout',
         label: 'Logout',
         icon: <LogoutOutlined/>,
         onClick: handleLogout,
      },
   ];

    const getAvatarSrc = () => {
        return userProfile?.profileUrl || null;
    };

    const getAvatarFallback = () => {
        return user?.username?.[0]?.toUpperCase() || 'U';
    };

    return (
        <Space 
            size="small" 
            align="center" 
            style={{ 
                height: '100%',
                flexWrap: 'nowrap',
            }}
        >
            {loggedIn && user?.role !== UserRole.ADMIN && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge count={cartItemsCount} size="small">
                        <ShoppingCartOutlined
                            style={{
                                fontSize: 20,
                                cursor: 'pointer',
                                color: token.colorText,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={() => onNavigate(ROUTES.CART)}
                        />
                    </Badge>
                </div>
            )}

            {loggedIn ? (
                <Dropdown menu={{ items: profileItems }} placement="bottomRight">
                    <Space style={{ cursor: 'pointer' }} size="small">
                        <Avatar 
                            src={getAvatarSrc()}
                            size="small"
                            style={{ 
                                backgroundColor: !getAvatarSrc() ? token.colorPrimary : undefined,
                                verticalAlign: 'middle',
                                border: getAvatarSrc() ? `2px solid ${token.colorBorder}` : 'none'
                            }}
                            icon={!getAvatarSrc() ? <UserOutlined /> : undefined}
                        >
                            {!getAvatarSrc() ? getAvatarFallback() : null}
                        </Avatar>
                        <span 
                            style={{ 
                                color: token.colorText,
                            }}
                            className="navbar-username"
                        >
                            {user?.username}
                        </span>
                    </Space>
                </Dropdown>
            ) : (
                <Space size="small" style={{ flexWrap: 'nowrap' }}>
                    <Button
                        type="primary"
                        onClick={() => onNavigate(ROUTES.LOGIN)}
                        size="small"
                        style={{
                            borderRadius: token.borderRadius.md,
                        }}
                        className="hover-lift navbar-auth-btn"
                    >
                        <span className="auth-btn-text">Sign In</span>
                        <span className="auth-btn-text-mobile">In</span>
                    </Button>
                    <Button
                        onClick={() => onNavigate(ROUTES.REGISTER)}
                        size="small"
                        style={{
                            borderRadius: token.borderRadius.md,
                            borderColor: token.colorBorder,
                        }}
                        className="hover-lift navbar-auth-btn"
                    >
                        <span className="auth-btn-text">Sign Up</span>
                        <span className="auth-btn-text-mobile">Up</span>
                    </Button>
                </Space>
            )}

            <Switch
                checked={themeType === 'dark'}
                onChange={onThemeChange}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
                size="small"
                style={{
                    background: token.colorPrimary,
                }}
            />
        </Space>
    );
}; 