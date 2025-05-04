import React from 'react';
import {Layout, Switch, theme} from 'antd';
import {useTheme} from '../../context/ThemeContext.tsx';

const {Header} = Layout;
const {useToken} = theme;

export const SimpleHeader: React.FC = () => {
    const {toggleTheme} = useTheme();
    const {token} = useToken();

    return (
        <Header style={{
            background: 'transparent',
            padding: `${token.spacing.sm} ${token.spacing.lg}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'auto',
            height: 'auto',
            zIndex: token.layout.headerHeight,
        }}>
            <Switch
                onChange={toggleTheme}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
                style={{
                    background: token.colorPrimary,
                }}
            />
        </Header>
    );
}; 