// src/components/ModificarEntorno.jsx
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function ModificarEntorno({ onClose }) {
  const { entorno, updateEntorno, user } = useContext(AuthContext);

  // Estado local del formulario, inicializado con el entorno actual
  const [formData, setFormData] = useState({
    empresa: entorno.empresa || "",
    ejercicio: entorno.ejercicio || "",
    canal: entorno.canal || "",
    serie: entorno.serie || "",
    fechaTrabajo:
      entorno.fechaTrabajo || new Date().toISOString().split("T")[0],
  });

  const [listas, setListas] = useState({
    empresas: [],
    ejercicios: [],
    canales: [],
    series: [],
  });
  const [loading, setLoading] = useState(false);

  // Cargar listas desplegables desde la API al montar el componente
  useEffect(() => {
    const cargarListas = async () => {
      try {
        // Debes crear estos endpoints en tu backend que hagan SELECT a SYS_EMPRESAS, EMP_EJERCICIOS, etc.
        const [emp, eje, can, ser] = await Promise.all([
          axios.get("http://tu-api-url/api/empresas"),
          axios.get(
            `http://tu-api-url/api/ejercicios?empresa=${formData.empresa}`,
          ),
          axios.get(
            `http://tu-api-url/api/canales?empresa=${formData.empresa}&ejercicio=${formData.ejercicio}`,
          ),
          axios.get(
            `http://tu-api-url/api/series?empresa=${formData.empresa}&ejercicio=${formData.ejercicio}&canal=${formData.canal}`,
          ),
        ]);
        setListas({
          empresas: emp.data,
          ejercicios: eje.data,
          canales: can.data,
          series: ser.data,
        });
      } catch (error) {
        console.error("Error cargando listas", error);
      } // <-- El punto sobrante ha sido eliminado aquí
    };
    cargarListas();
  }, [formData.empresa, formData.ejercicio, formData.canal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "empresa" || name === "ejercicio" || name === "canal"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await updateEntorno(formData);
    if (success) {
      onClose();
    } else {
      alert("Error al guardar la configuración");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <h3 className="mb-4 text-xl font-bold">Modificar Entorno de Trabajo</h3>
        <p className="mb-4 text-sm text-gray-600">
          Usuario: <strong>{user?.nombre}</strong>. Estos cambios se guardarán
          como tu configuración predeterminada.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Empresa
            </label>
            <select
              name="empresa"
              value={formData.empresa ?? ""}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md"
              required
            >
              <option value="">Seleccione...</option>
              {listas.empresas.map((e) => (
                <option key={e.EMPRESA} value={e.EMPRESA}>
                  {e.TITULO}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ejercicio
            </label>
            <select
              name="ejercicio"
              value={formData.ejercicio ?? ""}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md"
              required
            >
              <option value="">Seleccione...</option>
              {listas.ejercicios.map((e) => (
                <option key={e.EJERCICIO} value={e.EJERCICIO}>
                  {e.EJERCICIO}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Canal
              </label>
              <select
                name="canal"
                value={formData.canal ?? ""}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md"
                required
              >
                <option value="">Seleccione...</option>
                {listas.canales.map((c) => (
                  <option key={c.CANAL} value={c.CANAL}>
                    Canal {c.CANAL}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Serie
              </label>
              <select
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md"
              >
                <option value="">Todas / Ninguna</option>
                {listas.series.map((s) => (
                  <option key={s.SERIE} value={s.SERIE}>
                    {s.SERIE} - {s.TITULO}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Trabajo
            </label>
            <input
              type="date"
              name="fechaTrabajo"
              value={formData.fechaTrabajo}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
