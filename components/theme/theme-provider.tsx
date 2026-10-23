
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'levo-theme';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({
                                children,
                              }: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const hasSavedPreference = stored === 'dark' || stored === 'light';

    const updateFromSystem = () => {
      if (hasSavedPreference) return;

      const systemTheme = getSystemTheme();
      setThemeState(systemTheme);
      applyTheme(systemTheme);
    };

    const initialTheme: Theme = hasSavedPreference
        ? (stored as Theme)
        : getSystemTheme();

    setThemeState(initialTheme);
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)',
    );

    mediaQuery.addEventListener('change', updateFromSystem);

    return () => {
      mediaQuery.removeEventListener('change', updateFromSystem);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(
      () => ({ theme, toggleTheme, setTheme }),
      [theme, toggleTheme, setTheme],
  );

  return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return value;
}
