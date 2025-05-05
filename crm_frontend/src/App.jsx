import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HistoricoPage from "./pages/HistoricoPage";
import VerVenta from "./pages/VerVenta";
import CrearVenta from "./pages/CrearVenta";
import Layout from "./components/Layout";
import VerVentaAsesor from "./pages/VerVentaAsesor"; 
import TotalVentasAsesorPage from "./pages/TotalVentasAsesorPage";
import { useAuth } from "./context/AuthContext"; // Ajusta según tu estructura

function App() {
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const permisos = user?.permisos || [];

  const isAdmin = permisos.includes("administrador");
  const puedeVerHistorico = isAdmin || 
                            permisos.includes("backoficce fija") || 
                            permisos.includes("supervisor fija");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {token && (
          <Route path="/" element={<Layout />}>
            <Route path="crear-venta" element={<CrearVenta />} />
            
            {puedeVerHistorico && (
              <Route path="ventas" element={<HistoricoPage />} />
            )}

            <Route path="ver-venta/:idVenta" element={<VerVenta />} />
            <Route path="ver-ventas-asesor" element={<TotalVentasAsesorPage />} />
            <Route path="ver-ventas/:asesorId" element={<VerVentaAsesor />} />
          </Route>
        )}

        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
