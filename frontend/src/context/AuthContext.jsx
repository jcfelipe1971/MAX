// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [entorno, setEntorno] = useState({
    empresa: null,
    ejercicio: null,
    canal: null,
    serie: "",
    fechaTrabajo: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión desde localStorage al iniciar la app
  useEffect(() => {
    const savedUser = localStorage.getItem("max_user");
    const savedEntorno = localStorage.getItem("max_entorno");

    if (savedUser && savedEntorno) {
      try {
        setUser(JSON.parse(savedUser));
        setEntorno(JSON.parse(savedEntorno));
      } catch (error) {
        console.error("Error cargando sesión:", error);
        localStorage.removeItem("max_user");
        localStorage.removeItem("max_entorno");
      }
    }

    // Importante: siempre establecer isLoading en false
    setIsLoading(false);
  }, []);

  const login = async (usuario, password) => {
    try {
      const response = await axios.post("http://tu-api-url/api/login", {
        usuario,
        password,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setEntorno(response.data.entorno);

        // Guardar en localStorage para persistencia
        localStorage.setItem("max_user", JSON.stringify(response.data.user));
        localStorage.setItem(
          "max_entorno",
          JSON.stringify(response.data.entorno),
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error de login:", error);
      return false;
    }
  };

  const updateEntorno = async (nuevoEntorno) => {
    try {
      await axios.put("http://tu-api-url/api/usuario/entorno", {
        usuarioId: user?.id,
        ...nuevoEntorno,
        memorizarFecha: true,
      });

      setEntorno(nuevoEntorno);
      localStorage.setItem("max_entorno", JSON.stringify(nuevoEntorno));
      return true;
    } catch (error) {
      console.error("Error actualizando entorno:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setEntorno({
      empresa: null,
      ejercicio: null,
      canal: null,
      serie: "",
      fechaTrabajo: new Date().toISOString().split("T")[0],
    });
    localStorage.removeItem("max_user");
    localStorage.removeItem("max_entorno");
  };

  return (
    <AuthContext.Provider
      value={{ user, entorno, isLoading, login, updateEntorno, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
