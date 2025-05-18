import React from 'react';
import {theme} from 'antd';

const {useToken} = theme;

interface LogoProps {
    onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({onClick}) => {
    const {token} = useToken();

    return (
        <span
            onClick={onClick}
            style={{
                color: token.colorPrimary,
                cursor: 'pointer',
                fontSize: token.customFontSize.xl,
                fontWeight: token.fontWeightStrong,
                marginRight: token.spacing.xl,
            }}
        >
      DEAL
    </span>
    );
}; 