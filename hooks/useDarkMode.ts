import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage dark mode
 * إدارة الوضع الداكن
 */
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark'
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggle = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return { isDarkMode, setIsDarkMode, toggle };
};
