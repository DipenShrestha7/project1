import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Admin from "./pages/Admin.tsx";
import Home from "./pages/Home.tsx";

function App() {
  const [hasUserThemePreference, setHasUserThemePreference] = useState(() => {
    return localStorage.getItem("darkMode") !== null;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === null) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return saved === "true";
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    if (hasUserThemePreference) {
      localStorage.setItem("darkMode", darkMode.toString());
    }
  }, [darkMode, hasUserThemePreference]);

  useEffect(() => {
    if (hasUserThemePreference) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [hasUserThemePreference]);

  const toggleTheme = () => {
    setHasUserThemePreference(true);
    setDarkMode((prev) => !prev);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Home darkMode={darkMode} onToggleTheme={toggleTheme} />}
      />
      <Route path="/login" element={<Navigate to="/?auth=login" replace />} />
      <Route path="/signup" element={<Navigate to="/?auth=signup" replace />} />
      <Route
        path="/dashboard"
        element={<Dashboard darkMode={darkMode} onToggleTheme={toggleTheme} />}
      />
      {/* <Route path="/admin" element={<Admin />} /> */}
    </Routes>
  );
}

export default App;
