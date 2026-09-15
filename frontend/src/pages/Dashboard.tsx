// src/pages/Dashboard.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ModificarEntorno from "../components/ModificarEntorno";

export default function Dashboard() {
  const { user, entorno, logout, isLoading } = useContext(AuthContext);
  const [mostrarModalEntorno, setMostrarModalEntorno] = useState(false);
  const navigate = useNavigate();

  // Redirigir al login si no hay usuario y terminó de cargar
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, no renderizar nada (la redirección se encarga)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior con información del entorno */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <h1 className="text-xl font-bold">MaxFactu Web</h1>
        <div className="flex items-center gap-4">
          {/* Visualización del Entorno Actual */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Emp:</span> {entorno.empresa} |
            <span className="font-semibold"> Ej:</span> {entorno.ejercicio} |
            <span className="font-semibold"> Canal:</span> {entorno.canal} |
            <span className="font-semibold"> Fecha:</span>{" "}
            {entorno.fechaTrabajo}
          </div>
          <button
            onClick={() => setMostrarModalEntorno(true)}
            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Modificar Entorno
          </button>
          <button
            onClick={logout}
            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Salir
          </button>
        </div>
      </header>
      <main className="p-6">
        <h2 className="text-2xl font-semibold">Bienvenido, {user.nombre}</h2>
        {/* Aquí va el resto de tu aplicación React */}
      </main>
      {/* Modal de Modificación */}
      {mostrarModalEntorno && (
        <ModificarEntorno onClose={() => setMostrarModalEntorno(false)} />
      )}
    </div>
  );
}
