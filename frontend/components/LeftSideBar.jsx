// Updated LeftSidebar.jsx with CSS variables
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";

const LeftSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get theme state for any conditional logic
  const { theme } = useTheme();

  // Navigation items matching your DashboardCard options
  const navItems = [
    { title: "Home", route: "/admin-dashboard", icon: "🏠" },
    { title: "Create Employee", route: "/employee-creation", icon: "👤" },
    { title: "Create Client", route: "/client", icon: "🤝" },
    { title: "Create Project", route: "/project-creation", icon: "📋" },
    { title: "Create Module", route: "/module-creation", icon: "📦" },
    { title: "Assign Work", route: "/workAssign", icon: "📝" },
  ];

  // Check if the screen is mobile size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);

    // If we're toggling the sidebar open and not on mobile,
    // adjust the main content area
    if (!isOpen && !isMobile) {
      document.body.style.marginLeft = "256px";
    } else {
      document.body.style.marginLeft = "0";
    }
  };

  // Set initial margin on component mount
  useEffect(() => {
    if (isOpen && !isMobile) {
      document.body.style.marginLeft = "256px";
    } else {
      document.body.style.marginLeft = "0";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.marginLeft = "0";
    };
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Collapsed state - just show the toggle button */}
      {!isOpen && (
        <div className="fixed left-4 top-2 z-40">
          <button
            onClick={toggleSidebar}
            className="bg-[var(--text-color)] text-[var(--bg-color)] p-2 rounded-full shadow-lg hover:bg-[var(--button-bg-hover)] transition-colors"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Expanded sidebar - now using CSS variables */}
      {isOpen && (
        <div
          className="fixed left-0 top-0 h-full w-64 shadow-xl z-40 transition-all duration-300 ease-in-out border-r border-[var(--text-color)]/10"
          style={{
            background: "var(--background-gradient)",
            color: "var(--text-color)",
          }}
        >
          <div className="px-6 py-2 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-color)]">
                Menu
              </h2>
              <button
                onClick={toggleSidebar}
                className="bg-[var(--text-color)] text-[var(--bg-color)] p-2 rounded-full shadow-lg hover:bg-[var(--button-bg-hover)] transition-colors"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.route}>
                    <button
                      onClick={() => {
                        navigate(item.route);
                        // On mobile, close the sidebar after navigation
                        if (isMobile) {
                          setIsOpen(false);
                          document.body.style.marginLeft = "0";
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200
                                ${
                                  location.pathname === item.route
                                    ? "bg-[var(--button-bg)] text-[var(--button-text)]"
                                    : "text-[var(--text-color)] hover:bg-[var(--button-bg)]/20"
                                }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default LeftSidebar;
