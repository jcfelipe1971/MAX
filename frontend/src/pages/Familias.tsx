import { useState, useEffect } from "react";
import { api, type BackendResponse } from "../services/api";

interface Familia {
  EMPRESA: number;
  FAMILIA: string;
  TITULO: string;
  ID_FAMILIA: number;
  SECCION: string;
  WEB: number;
  TITULO_WEB: string;
  MARGEN: number;
  DISPONIBILIDAD: number;
  ORDEN: number;
  ACT_TAR_AUTOM: number;
}

export default function Familias() {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res: BackendResponse<Familia[]> = await api.get("familias.php", {
          empresa: 1,
        });
        if (res.success && res.data) setFamilias(res.data);
        else setError(res.error || "Error desconocido");
      } catch (err: any) {
        setError("No se pudo conectar: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Familias de Artículos
      </h1>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "#dc2626" }}>❌ {error}</p>}

      {!loading && !error && (
        <>
          <p style={{ color: "#16a34a", marginBottom: "16px" }}>
            ✅ Se cargaron {familias.length} familias correctamente.
          </p>
          <div style={{ display: "grid", gap: "8px" }}>
            {familias.map((fam) => (
              <div
                key={fam.FAMILIA}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ fontWeight: "500" }}>
                  <strong>{fam.FAMILIA}</strong> - {fam.TITULO}
                </div>
                <span style={{ color: "#6b7280", fontSize: "13px" }}>
                  Sección: {fam.SECCION}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 767px) {
          h1 {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
