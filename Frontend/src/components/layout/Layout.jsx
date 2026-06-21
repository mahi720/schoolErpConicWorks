import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useApp } from "../../context/AppContext";

const Layout = ({ children }) => {
  const { sidebarOpen, sidebarWidth } = useApp();

  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <Sidebar />

        <main
          className="flex-1 transition-all duration-300 overflow-y-auto overflow-x-auto custom-scrollbar min-w-0 bg-gray-900"
          style={{
            marginLeft: sidebarOpen ? `${sidebarWidth}px` : "80px",
            width: sidebarOpen
              ? `calc(100% - ${sidebarWidth}px)`
              : "calc(100% - 80px)",
          }}
        >
          <div className="p-6 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
