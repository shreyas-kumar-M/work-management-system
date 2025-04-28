import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import logo from '../public/logo.jpg'

const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarWidth, setSidebarWidth] = useState(0);

  // Check if sidebar is open by looking at the body margin
  useEffect(() => {
    // Function to calculate and set sidebar width
    const updateSidebarOffset = () => {
      const bodyMargin = parseInt(document.body.style.marginLeft || "0");
      setSidebarWidth(bodyMargin);
    };

    // Initial check
    updateSidebarOffset();

    // Set up a mutation observer to watch for changes to body style
    const observer = new MutationObserver(updateSidebarOffset);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Clean up observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="fixed top-0 z-30 p-1 shadow-md backdrop-blur-md "
      style={{
        backgroundColor:
          theme === "dark" ? "var(--bg-color)" : "var(--bg-color)",
        color: "var(--text-color)",
        left: `${sidebarWidth}px`,
        right: "0",
        transition: "left 0.3s ease-in-out",
      }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto ">
        <div className="flex items-center space-x-4 ml-16">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="text-xl font-bold hover:opacity-80 transition-opacity text-[var(--text-color)]"
          >
            <img src={logo} alt="" width="50" height="50" className=" rounded-2xl" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="bg-red-700 text-amber-50 p-2 rounded-md hover:scale-95"
            onClick={() => {
              // Remove specific items (tokens) from localStorage
              localStorage.removeItem("role");
              localStorage.removeItem("theme");
              localStorage.removeItem("token");

              navigate("/login");
            }}
          >
            Logout
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all"
            style={{
              backgroundColor: "var(--text-color)",
              color: "var(--button-text)",
            }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
