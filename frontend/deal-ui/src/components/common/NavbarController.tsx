import React from 'react';
import {Button, Space, Switch, theme} from 'antd';
import {ROUTES} from "../../routes/AppRouter.tsx";

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
        </Space>
    );
}; 