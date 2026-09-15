import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e2e8f0",
        height: "64px",
        position: "relative",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Botón para toggle del sidebar */}
        <button
          onClick={onToggleSidebar}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#475569",
          }}
          title="Mostrar/ocultar menú"
        >
          <Menu size={24} strokeWidth={2} />
        </button>

        <div
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#1e40af",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "18px",
            cursor: "pointer",
          }}
          onClick={onToggleSidebar}
        >
          D
        </div>
        <div>
          <div
            style={{ fontWeight: "bold", fontSize: "16px", color: "#1e293b" }}
          >
            MaxFactu
          </div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            ERP Gestión Comercial | v2.4.0
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          style={{
            padding: "6px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            backgroundColor: "#f8fafc",
            cursor: "pointer",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          ⚙️ Entorno
        </button>
        <input
          type="text"
          placeholder="Buscar en el sistema..."
          style={{
            padding: "8px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            width: "240px",
            fontSize: "13px",
            outline: "none",
          }}
        />
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            color: "#64748b",
          }}
        >
          <Bell size={20} strokeWidth={2} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontWeight: "600", fontSize: "13px", color: "#1e293b" }}
            >
              Admin Sistema
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>
              CONECTADO: API_MAIN_PROD
            </div>
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#1e40af",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
