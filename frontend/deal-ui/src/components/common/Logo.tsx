import React from 'react';
import { theme } from 'antd';

const { useToken } = theme;

interface LogoProps {
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ onClick }) => {
  const { token } = useToken();

  return (
    <span 
      onClick={onClick}
      style={{
        color: token.colorPrimary,
        cursor: 'pointer',
        fontSize: '24px',
        fontWeight: 600,
      }}
    >
      DEAL
    </span>
  );
}; 