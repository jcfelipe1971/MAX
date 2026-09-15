// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, ReactNode } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Familias from "./pages/Familias";
import Articulos from "./pages/Articulos";
import Tarifas from "./pages/Tarifas";
import TiposCalculos from "./pages/TiposCalculos";
import Clientes from "./pages/Clientes";
import Terceros from "./pages/Terceros";
import Ventas from "./pages/Ventas";
import Compras from "./pages/Compras";
import VeriFactu from "./pages/VeriFactu";
import Login from "./pages/Login";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import "./App.css";

const basename = import.meta.env.PROD ? "/max/frontend" : "";

// Componente para rutas protegidas
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Componente para rutas públicas (como login)
function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="familias" element={<Familias />} />
        <Route path="articulos" element={<Articulos />} />
        <Route path="tarifas" element={<Tarifas />} />
        <Route path="tipos-calculos" element={<TiposCalculos />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="terceros" element={<Terceros />} />
        <Route path="ventas" element={<Ventas />} />
        <Route path="compras" element={<Compras />} />
        <Route path="verifactu" element={<VeriFactu />} />
      </Route>

      {/* Ruta catch-all: redirige al login si no hay usuario, o al dashboard si lo hay */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
