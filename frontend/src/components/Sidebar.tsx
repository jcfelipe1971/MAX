import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Package,
  FolderOpen,
  FileText,
  Users,
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  Calculator,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

// Definimos la estructura del menú
interface MenuItem {
  label: string;
  icon: any;
  children?: { label: string; to: string; icon: any }[];
  to?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Almacenes",
    icon: Package,
    children: [
      { label: "Familias", to: "/familias", icon: FolderOpen },
      { label: "Artículos", to: "/articulos", icon: FileText },
      { label: "Tarifas", to: "/tarifas", icon: FileText },
      { label: "Tipos cálculos", to: "/tipos-calculos", icon: Calculator },
    ],
  },
  {
    label: "Terceros",
    icon: Users,
    children: [{ label: "Clientes", to: "/clientes", icon: User }],
  },
  { label: "Ventas", icon: ShoppingCart, to: "/ventas" },
  { label: "Compras", icon: CreditCard, to: "/compras" },
  { label: "VeriFactu", icon: ShieldCheck, to: "/verifactu" },
];

export default function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
}: SidebarProps) {
  // Estado para controlar qué grupo está abierto (acordeón)
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (label: string) => {
    // Si ya está abierto, lo cerramos. Si no, abrimos este y cerramos los demás
    setOpenGroup(openGroup === label ? null : label);
  };

  return (
    <>
      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""} ${isCollapsed ? "sidebar-collapsed" : ""}`}
        style={{
          width: isCollapsed ? "0px" : "280px",
          backgroundColor: "#f8fafc",
          borderRight: isCollapsed ? "none" : "1px solid #e2e8f0",
          padding: "0",
          overflowY: "auto",
          overflowX: "hidden",
          position: "fixed",
          top: "64px",
          left: 0,
          bottom: "48px",
          zIndex: 50,
          transform: "translateX(-100%)",
          transition: "all 0.3s ease-in-out",
          whiteSpace: "nowrap",
        }}
      >
        {!isCollapsed && (
          <>
            <div
              style={{
                padding: "16px 20px",
                fontSize: "11px",
                fontWeight: "700",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Menú Principal
            </div>

            {menuItems.map((item, idx) => (
              <div key={idx}>
                {item.children ? (
                  <>
                    {/* Grupo con submenú (acordeón) */}
                    <button
                      onClick={() => toggleGroup(item.label)}
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        fontWeight: "600",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        color: "#475569",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <item.icon size={18} strokeWidth={2} />
                        <span>{item.label}</span>
                      </div>
                      {openGroup === item.label ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {/* Submenú que se muestra/oculta */}
                    {openGroup === item.label && (
                      <div style={{ paddingLeft: "20px", overflow: "hidden" }}>
                        {item.children.map((child, cidx) => (
                          <NavLink
                            key={cidx}
                            to={child.to}
                            onClick={onClose}
                            style={({ isActive }) => ({
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 20px",
                              fontSize: "13px",
                              color: isActive ? "#1e40af" : "#64748b",
                              backgroundColor: isActive
                                ? "#eff6ff"
                                : "transparent",
                              borderRight: isActive
                                ? "3px solid #1e40af"
                                : "3px solid transparent",
                              textDecoration: "none",
                              fontWeight: isActive ? "600" : "500",
                              cursor: "pointer",
                            })}
                          >
                            <child.icon size={16} strokeWidth={2} />
                            <span>{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Item sin submenú
                  <NavLink
                    to={item.to!}
                    onClick={onClose}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 20px",
                      fontSize: "14px",
                      color: isActive ? "#1e40af" : "#475569",
                      backgroundColor: isActive ? "#eff6ff" : "transparent",
                      borderRight: isActive
                        ? "3px solid #1e40af"
                        : "3px solid transparent",
                      textDecoration: "none",
                      fontWeight: isActive ? "600" : "500",
                      cursor: "pointer",
                    })}
                  >
                    <item.icon size={18} strokeWidth={2} />
                    <span>{item.label}</span>
                  </NavLink>
                )}
              </div>
            ))}

            <div
              style={{
                margin: "24px 16px",
                padding: "16px",
                backgroundColor: "#eff6ff",
                borderRadius: "12px",
                border: "1px solid #bfdbfe",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "13px",
                  marginBottom: "6px",
                  color: "#1e40af",
                }}
              >
                Estado de API
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#1e40af",
                  marginBottom: "8px",
                }}
              >
                REST Service: Conectado
              </div>
              <div
                style={{
                  height: "4px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    height: "100%",
                    backgroundColor: "#1e40af",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontStyle: "italic",
                  marginTop: "6px",
                }}
              >
                Sincronización activa
              </div>
            </div>
          </>
        )}
      </aside>

      <style>{`
        @media (min-width: 1024px) {
          .sidebar {
            position: relative !important;
            top: 0 !important;
            bottom: 0 !important;
            transform: translateX(0) !important;
          }
          .sidebar-collapsed {
            width: 0 !important;
            border: none !important;
            padding: 0 !important;
          }
        }
        @media (max-width: 1023px) {
          .sidebar-open {
            transform: translateX(0) !important;
            width: 280px !important;
          }
        }
      `}</style>
    </>
  );
}
