export default function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 24px",
        backgroundColor: "#fff",
        borderTop: "1px solid #e2e8f0",
        fontSize: "12px",
        color: "#64748b",
        flexShrink: 0,
        height: "48px",
      }}
    >
      <div style={{ fontWeight: "500" }}>BUILD v2.4.0 PROFESSIONAL</div>
      <div style={{ display: "flex", gap: "24px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#22c55e",
              borderRadius: "50%",
              display: "inline-block",
            }}
          ></span>
          Online: Server Principal
        </span>
        <span>Base de Datos: Firebird / Node-API</span>
      </div>
      <div>
        {new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </div>
    </footer>
  );
}
