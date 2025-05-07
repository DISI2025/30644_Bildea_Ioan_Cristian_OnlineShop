import React from 'react';
import {Button, Space, Switch, theme, Dropdown, Avatar} from 'antd';
import {ROUTES} from "../../routes/AppRouter.tsx";
import {useSelector} from "react-redux";
import {selectAuthState} from "../../store/slices/auth-slice";
import {useDispatch} from "react-redux";
import {endSession} from "../../store/slices/auth-slice";
import {UserOutlined, LogoutOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';

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
    const dispatch = useDispatch();
    const {loggedIn, user} = useSelector(selectAuthState);

    const handleLogout = () => {
        dispatch(endSession());
        onNavigate(ROUTES.HOME);
    };

    const profileItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => onNavigate('/profile'),
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Space size="middle" align="center">
            <Switch
                onChange={onThemeChange}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
                style={{
                    background: token.colorPrimary,
                }}
            />

            {loggedIn ? (
                <Dropdown menu={{ items: profileItems }} placement="bottomRight">
                    <Space style={{ cursor: 'pointer' }}>
                        <Avatar 
                            style={{ 
                                backgroundColor: token.colorPrimary,
                                verticalAlign: 'middle',
                            }}
                        >
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <span style={{ color: token.colorText }}>{user?.username}</span>
                    </Space>
                </Dropdown>
            ) : (
                <Space size="small">
                    <Button
                        type="primary"
                        onClick={() => onNavigate(ROUTES.LOGIN)}
                        style={{
                            height: token.controlHeight,
                            padding: token.paddingMD,
                            borderRadius: token.borderRadius.md,
                        }}
                        className="hover-lift"
                    >
                        Sign In
                    </Button>
                    <Button
                        onClick={() => onNavigate(ROUTES.REGISTER)}
                        style={{
                            height: token.controlHeight,
                            padding: token.paddingMD,
                            borderRadius: token.borderRadius.md,
                            borderColor: token.colorBorder,
                        }}
                        className="hover-lift"
                    >
                        Sign Up
                    </Button>
                </Space>
            )}
        </Space>
    );
}; 