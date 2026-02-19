import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize from localStorage
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved !== null) {
      return saved === "dark";
    }
    return true; // Default to dark
  });
  const [currency, setCurrency] = useState("INR");

  const toggleTheme = () => {
    setDark(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    
    // Apply theme to html tag (documentElement) to match :root selectors
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Background and color are handled by CSS variables now
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, currency, setCurrency }}>
      <div className={dark ? "dark" : "light"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
