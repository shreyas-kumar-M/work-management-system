import React from "react";
import useTheme from "../hooks/useTheme";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";

const DashboardLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "dark" : ""}`}>
      <LeftSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
