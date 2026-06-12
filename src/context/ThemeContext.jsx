import { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark'); // Default to dark as requested implicitly by the design tone

  useEffect(() => {
    // Sync class on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = (e) => {
    const isDark = theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    // Fallback if browser doesn't support view transitions
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Get click coordinates
    const x = e.clientX;
    const y = e.clientY;

    // Set custom properties for the clip-path origin
    document.documentElement.style.setProperty('--click-x', `${x}px`);
    document.documentElement.style.setProperty('--click-y', `${y}px`);

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
