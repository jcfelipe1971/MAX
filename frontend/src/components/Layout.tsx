import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Para móvil
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Para desktop

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      // Desktop: alternar colapsado
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      // Móvil: alternar abierto/cerrado
      setSidebarOpen(!sidebarOpen);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <Header onToggleSidebar={toggleSidebar} />

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            onClick={closeSidebar}
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              right: 0,
              bottom: "48px",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 40,
            }}
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={closeSidebar}
        />

        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
            backgroundColor: "#f8fafc",
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
