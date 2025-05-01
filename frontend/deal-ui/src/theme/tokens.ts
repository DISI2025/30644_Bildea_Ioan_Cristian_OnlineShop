import { ThemeConfig } from 'antd';

export const spacing = {
  none: '0',
  xxs: '0.25rem',  // 4px
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.25rem',   // 20px
  xl: '1.5rem',    // 24px
  xxl: '2rem',     // 32px
} as const;

export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  md: '1.125rem',   // 18px
  lg: '1.25rem',    // 20px
  xl: '1.5rem',     // 24px
  xxl: '1.75rem',   // 28px
} as const;

export const colors = {
  primary: {
    light: '#1677ff',
    dark: '#4096ff',
  },
  success: {
    light: '#52c41a',
    dark: '#49aa19',
  },
  warning: {
    light: '#faad14',
    dark: '#d89614',
  },
  error: {
    light: '#ff4d4f',
    dark: '#d32029',
  },
  text: {
    light: {
      primary: 'rgba(0, 0, 0, 0.88)',
      secondary: 'rgba(0, 0, 0, 0.65)',
      disabled: 'rgba(0, 0, 0, 0.25)',
    },
    dark: {
      primary: 'rgba(255, 255, 255, 0.85)',
      secondary: 'rgba(255, 255, 255, 0.65)',
      disabled: 'rgba(255, 255, 255, 0.25)',
    },
  },
  background: {
    light: {
      primary: '#ffffff',
      secondary: '#f7f8fa',
      tertiary: '#f0f2f5',
    },
    dark: {
      primary: '#141414',
      secondary: '#1f1f1f',
      tertiary: '#262626',
    },
  },
  border: {
    light: {
      light: '#d9d9d9',
      dark: '#8c8c8c',
    },
    dark: {
      light: '#434343',
      dark: '#595959',
    },
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
} as const;

export const shadows = {
  light: {
    sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    md: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
    lg: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
  },
  dark: {
    sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.3)',
    md: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.4)',
    lg: '0 0.5rem 1rem rgba(0, 0, 0, 0.5)',
  },
} as const;

export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
} as const;

export const layout = {
  maxWidth: {
    xs: '100%',
    sm: '24rem',    // 384px
    md: '28rem',    // 448px
    lg: '32rem',    // 512px
    xl: '48rem',    // 768px
    xxl: '64rem',   // 1024px
  },
  containerPadding: {
    xs: spacing.sm,
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
  },
  headerHeight: '64px',
  footerHeight: '70px',
} as const;

// Ant Design theme configuration
export const getThemeConfig = (isDark: boolean): ThemeConfig => ({
  token: {
    colorPrimary: isDark ? colors.primary.dark : colors.primary.light,
    colorSuccess: isDark ? colors.success.dark : colors.success.light,
    colorWarning: isDark ? colors.warning.dark : colors.warning.light,
    colorError: isDark ? colors.error.dark : colors.error.light,
    colorText: isDark ? colors.text.dark.primary : colors.text.light.primary,
    colorTextSecondary: isDark ? colors.text.dark.secondary : colors.text.light.secondary,
    colorBgContainer: isDark ? colors.background.dark.primary : colors.background.light.primary,
    colorBgLayout: isDark ? colors.background.dark.secondary : colors.background.light.secondary,
    colorBorder: isDark ? colors.border.dark.light : colors.border.light.light,
    borderRadius: parseInt(borderRadius.md),
    fontSize: parseInt(fontSize.base),
  },
  components: {
    Button: {
      controlHeight: 40,
      paddingContentHorizontal: parseInt(spacing.lg),
      colorBgContainer: isDark ? colors.background.dark.primary : colors.background.light.primary,
      colorText: isDark ? colors.text.dark.primary : colors.text.light.primary,
    },
    Form: {
      marginLG: parseInt(spacing.md),
    },
    Input: {
      controlHeight: 40,
      paddingLG: parseInt(spacing.md),
      colorBgContainer: isDark ? colors.background.dark.primary : colors.background.light.primary,
      colorText: isDark ? colors.text.dark.primary : colors.text.light.primary,
    },
    Card: {
      colorBgContainer: isDark ? colors.background.dark.primary : colors.background.light.primary,
      colorText: isDark ? colors.text.dark.primary : colors.text.light.primary,
    },
    Menu: {
      colorItemBg: isDark ? colors.background.dark.primary : colors.background.light.primary,
      colorItemText: isDark ? colors.text.dark.primary : colors.text.light.primary,
    },
    Layout: {
      colorBgHeader: isDark ? colors.background.dark.primary : colors.background.light.primary,
      colorBgBody: isDark ? colors.background.dark.secondary : colors.background.light.secondary,
    },
  },
}); 