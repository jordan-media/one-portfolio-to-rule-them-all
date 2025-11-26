import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center w-full p-0.5 rounded-lg dark:rounded-none bg-white/5 dark:bg-white/5 border border-white/10 transition-all duration-300"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Light Mode Side (Left) */}
      <div className={`relative flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 transition-all duration-300 ${
        !isDark
          ? 'bg-white/10 dark:bg-white/10 rounded-md dark:rounded-none'
          : 'bg-transparent'
      }`}>
        {/* Glow effect when active - light mode only */}
        {!isDark && (
          <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg blur-md opacity-50 transition duration-500 dark:hidden"></div>
        )}

        <Sun className={`relative w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
          !isDark
            ? 'text-slate-900 dark:text-white scale-100'
            : 'text-slate-500 dark:text-white/50 scale-90'
        }`} />
        <span className={`relative text-xs font-medium transition-all duration-300 ${
          !isDark
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-500 dark:text-white/50'
        }`}>
          Light
        </span>
      </div>

      {/* Dark Mode Side (Right) */}
      <div className={`relative flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 transition-all duration-300 ${
        isDark
          ? 'bg-white/10 dark:bg-white/10 rounded-md dark:rounded-none'
          : 'bg-transparent'
      }`}>
        {/* Glow effect when active - light mode only */}
        {isDark && (
          <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg blur-md opacity-50 dark:hidden"></div>
        )}

        <Moon className={`relative w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
          isDark
            ? 'text-slate-900 dark:text-white scale-100'
            : 'text-slate-500 dark:text-white/50 scale-90'
        }`} />
        <span className={`relative text-xs font-medium transition-all duration-300 ${
          isDark
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-500 dark:text-white/50'
        }`}>
          Dark
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
