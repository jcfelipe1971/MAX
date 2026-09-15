export default function Terceros() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        backgroundColor: "#1e293b",
        borderRadius: "12px",
        color: "#fff",
        minHeight: "400px",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          backgroundColor: "#334155",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          marginBottom: "16px",
        }}
      >
        👥
      </div>
      <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "8px" }}>
        Vista en construcción
      </h2>
      <p style={{ color: "#94a3b8", fontSize: "14px" }}>
        La pantalla de Terceros estará disponible próximamente.
      </p>
    </div>
  );
}
