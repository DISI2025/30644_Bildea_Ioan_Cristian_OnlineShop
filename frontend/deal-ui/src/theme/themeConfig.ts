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
        colorPrimaryBg: '#1f1b22',
        colorPrimaryBorder: '#531a70',

        colorLink: '#c165f5',
        colorLinkHover: '#d28df7',
        colorSuccess: '#49aa19',
        colorWarning: '#d89614',
        colorError: '#d32029',
        colorInfo: '#177ddc',

        colorBgContainer: '#141414',
        colorBgLayout: '#101010',
        colorText: 'rgba(255, 255, 255, 0.85)',
        colorTextSecondary: 'rgba(255, 255, 255, 0.45)',

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
    algorithm: antdTheme.darkAlgorithm,
};

// Add custom tokens to both themes
[lightTheme, darkTheme].forEach(theme => {
    theme.token = {
        ...theme.token,
        ...customTokens,
    };
});