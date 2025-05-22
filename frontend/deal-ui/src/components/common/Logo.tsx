import React from 'react';
import {theme} from 'antd';
import logoImage from '../../assets/logo.png';

const {useToken} = theme;

interface LogoProps {
    onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({onClick}) => {
    const {token} = useToken();

    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginRight: token.spacing.xl,
            }}
        >
            <img 
                src={logoImage} 
                alt="Deal Logo" 
                style={{ 
                    height: '64px'
                }} 
            />
        </div>
    );
}; 