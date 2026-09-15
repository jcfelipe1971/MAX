import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Familias from "./pages/Familias";
import Articulos from "./pages/Articulos";
import Tarifas from "./pages/Tarifas";
import TiposCalculos from "./pages/TiposCalculos";
import Clientes from "./pages/Clientes"; // ← Agregar esta línea
import Terceros from "./pages/Terceros";
import Ventas from "./pages/Ventas";
import Compras from "./pages/Compras";
import VeriFactu from "./pages/VeriFactu";
import "./App.css";

const basename = import.meta.env.PROD ? "/max/frontend" : "";

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="familias" element={<Familias />} />
          <Route path="articulos" element={<Articulos />} />
          <Route path="tarifas" element={<Tarifas />} />
          <Route path="tipos-calculos" element={<TiposCalculos />} />
          <Route path="clientes" element={<Clientes />} />{" "}
          {/* ← Agregar esta línea */}
          <Route path="terceros" element={<Terceros />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="compras" element={<Compras />} />
          <Route path="verifactu" element={<VeriFactu />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
