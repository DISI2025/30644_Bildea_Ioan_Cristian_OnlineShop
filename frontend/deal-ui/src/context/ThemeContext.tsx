import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { lightTheme, darkTheme } from '../theme/themeConfig';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  themeType: ThemeType;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  clearThemePreference: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'dealshop-theme-preference';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return (savedTheme as ThemeType) || 'light';
    } catch (error) {
      console.warn('Failed to load theme preference from localStorage:', error);
      return 'light';
    }
  });

  const theme = themeType === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setThemeType((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (error) {
        console.warn('Failed to save theme preference to localStorage:', error);
      }
      return newTheme;
    });
  };

  const clearThemePreference = () => {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
      setThemeType('light');
    } catch (error) {
      console.warn('Failed to clear theme preference from localStorage:', error);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeType);
    } catch (error) {
      console.warn('Failed to save theme preference to localStorage:', error);
    }
  }, [themeType]);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        setThemeType('light');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
      <ThemeContext.Provider value={{ themeType, theme, toggleTheme, clearThemePreference }}>
        {children}
      </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};