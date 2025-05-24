export const customTokens = {
  // Spacing
  spacing: {
    none: '0',
    xxs: '0.25rem',  // 4px
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.25rem',   // 20px
    xl: '1.5rem',    // 24px
    xxl: '2rem',     // 32px
  },

  // Font sizes
  customFontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    md: '1.125rem',   // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    xxl: '1.75rem',   // 28px
  },

  // Layout
  layout: {
    maxWidth: {
      xs: '100%',
      sm: '24rem',    // 384px
      md: '28rem',    // 448px
      lg: '32rem',    // 512px
      xl: '48rem',    // 768px
      xxl: '64rem',   // 1024px
    },
    headerHeight: '64px',
    footerHeight: '70px',
  },

  // Shadows
  shadows: {
    light: {
      sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
      md: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
      lg: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    },
    dark: {
      sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.5)',
      md: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.6)',
      lg: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.7)',
    },
  },

  // Colors
  colors: {
    primary: {
      light: '#1677ff',
      dark: '#40a9ff',
    },
    success: {
      light: '#52c41a',
      dark: '#52c41a',
    },
    warning: {
      light: '#faad14',
      dark: '#faad14',
    },
    error: {
      light: '#ff4d4f',
      dark: '#ff4d4f',
    },
    text: {
      light: {
        primary: 'rgba(0, 0, 0, 0.88)',
        secondary: 'rgba(0, 0, 0, 0.65)',
        disabled: 'rgba(0, 0, 0, 0.25)',
      },
      dark: {
        primary: 'rgba(255, 255, 255, 0.92)',
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
        secondary: '#1a1a1a',
        tertiary: '#1f1f1f',
      },
    },
    border: {
      light: {
        light: '#d9d9d9',
        dark: '#8c8c8c',
      },
      dark: {
        light: '#404040',
        dark: '#595959',
      },
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
} as const;

// Extend the theme token type
declare module 'antd/es/theme/interface' {
  interface AliasToken {
    spacing: typeof customTokens.spacing;
    customFontSize: typeof customTokens.customFontSize;
    layout: typeof customTokens.layout;
    shadows: typeof customTokens.shadows;
    colors: typeof customTokens.colors;
    breakpoints: typeof customTokens.breakpoints;
    borderRadius: typeof customTokens.borderRadius;
  }
}