import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd/es/config-provider/context';
import { customTokens } from './customTokens';

export const lightTheme: ThemeConfig = {
    token: {
        colorPrimary: '#ad26f0',
        colorPrimaryHover: '#b742f2',
        colorPrimaryActive: '#9a1fd5',
        colorPrimaryBg: '#f9f0fe',
        colorPrimaryBorder: '#d9a6f8',

        colorLink: '#ad26f0',
        colorLinkHover: '#b742f2',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#f5222d',
        colorInfo: '#1890ff',

        colorBgContainer: '#ffffff',
        colorBgLayout: '#f0f2f5',
        colorText: 'rgba(0, 0, 0, 0.85)',
        colorTextSecondary: 'rgba(0, 0, 0, 0.45)',

        fontFamily: 'Roboto, sans-serif',
        fontSize: 14,
        controlHeight: 36,
        motionDurationMid: '0.2s',
        motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    },
    components: {
        Button: {
            controlHeight: 40,
        },
        Input: {
            controlHeight: 40,
        }
    },
    algorithm: antdTheme.defaultAlgorithm
};

export const darkTheme: ThemeConfig = {
    token: {
        colorPrimary: '#ad26f0',
        colorPrimaryHover: '#b742f2',
        colorPrimaryActive: '#9a1fd5',
        colorPrimaryBg: '#2a1f3d',
        colorPrimaryBorder: '#6b46c1',

        colorLink: '#c165f5',
        colorLinkHover: '#d28df7',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        colorInfo: '#40a9ff',

        colorBgContainer: '#141414',
        colorBgLayout: '#0a0a0a',
        colorBgElevated: '#1a1a1a',
        colorBgMask: 'rgba(0, 0, 0, 0.8)',
        
        colorFillQuaternary: '#1a1a1a',
        colorFillTertiary: '#242424',
        colorFillSecondary: '#2f2f2f',
        colorFill: '#3a3a3a',

        colorText: 'rgba(255, 255, 255, 0.92)',
        colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
        colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
        colorTextQuaternary: 'rgba(255, 255, 255, 0.25)',
        
        colorBorder: '#2a2a2a',
        colorBorderSecondary: '#1f1f1f',

        colorSuccessBg: '#162312',
        colorSuccessBorder: '#274916',
        colorWarningBg: '#2b1d11',
        colorWarningBorder: '#594214',
        colorErrorBg: '#2c1618',
        colorErrorBorder: '#58181c',
        colorInfoBg: '#111a2c',
        colorInfoBorder: '#153450',

        fontFamily: 'Roboto, sans-serif',
        fontSize: 14,
        controlHeight: 36,
        motionDurationMid: '0.2s',
        motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    },
    components: {
        Button: {
            controlHeight: 40,
        },
        Input: {
            controlHeight: 40,
        },
        Card: {
            colorBgContainer: '#141414',
            colorBorderSecondary: '#2a2a2a',
        },
        Menu: {
            colorBgContainer: '#141414',
            colorItemBg: 'transparent',
            colorItemBgHover: '#1a1a1a',
            colorItemBgSelected: '#2a1f3d',
        },
        Layout: {
            colorBgHeader: '#0a0a0a',
            colorBgBody: '#0f0f0f',
            colorBgTrigger: '#1a1a1a',
        }
    },
    algorithm: antdTheme.darkAlgorithm,
};

// Add custom tokens to both themes
[lightTheme, darkTheme].forEach(theme => {
    theme.token = {
        ...theme.token,
        ...customTokens,
    };
});