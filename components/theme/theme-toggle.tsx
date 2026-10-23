'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Включить ${nextTheme === 'dark' ? 'тёмную' : 'светлую'} тему`}
      title={`Переключить на ${nextTheme === 'dark' ? 'тёмную' : 'светлую'} тему`}
    >
      {theme === 'dark' ? <Sun size={25} aria-hidden="true" /> : <Moon size={25} aria-hidden="true" />}
    </button>
  );
}

