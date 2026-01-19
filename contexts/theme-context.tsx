import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useRNColorScheme();
  const [theme, setThemeState] = useState<Theme>('auto');

  useEffect(() => {
    if (isLocalStorageAvailable()) {
      try {
        const savedTheme = window.localStorage.getItem('bht-theme') as Theme | null;
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setThemeState(savedTheme);
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Erro ao ler tema salvo:', error);
        }
      }
    }
  }, []);

  const actualTheme = theme === 'auto' 
    ? (systemTheme ?? 'light')
    : theme;

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem('bht-theme', newTheme);
      } catch (error) {
        if (__DEV__) {
          console.error('Erro ao salvar tema:', error);
        }
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

