import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes (only if no saved theme)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    
    // Animate theme transition
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    setTimeout(() => {
      document.body.style.transition = "";
    }, 300);
  };

  return (
    <button
      id="themeToggle"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Chuyển sang chế độ ${theme === "dark" ? "sáng" : "tối"}`}
      type="button"
    >
      <i
        id="themeIcon"
        className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}
        aria-hidden="true"
      ></i>
    </button>
  );
}

