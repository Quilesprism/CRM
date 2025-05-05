import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HistoricoPage from "./pages/HistoricoPage";
import VerVenta from "./pages/VerVenta";
import CrearVenta from "./pages/CrearVenta";
import Layout from "./components/Layout";
import VerVentaAsesor from "./pages/VerVentaAsesor";
import TotalVentasAsesorPage from "./pages/TotalVentasAsesorPage";
<<<<<<< HEAD
import { useAuth } from "./context/AuthContext"; // Ajusta según tu estructura

=======
import VentasHoy from './pages/VentasHoy';;
import VentasDeAsesor from './pages/VentasDeAsesor';
import ListaAsesores from "./components/ListaAsesores";
import './App.css'; // Importa el archivo CSS
import EditarVenta from "./pages/EditarVentas";
import GenerarReporteFecha from "./pages/GenerarReporteFecha";
>>>>>>> 01249b98a90d50067d73f8314b069b5e09bf63f7
function App() {
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const permisos = user?.permisos || [];

  const isAdmin = permisos.includes("administrador");
  const puedeVerHistorico = isAdmin || 
                            permisos.includes("backoficce fija") || 
                            permisos.includes("supervisor fija");

  return (
    <Router className="app-background">
      <Routes>
<<<<<<< HEAD
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
=======


        <Route path="/login" element={<LoginPage />} />


        {token && (
          <Route path="/" element={<Layout />}>
            <Route path="crear-venta" element={<CrearVenta />} />
            <Route path="ventas" element={<HistoricoPage />} />
            <Route path="ventas-hoy" element={<VentasHoy />} />
            <Route path="/asesores" element={<ListaAsesores />} />
            <Route path="/ventas-asesor/:nombreAsesor" element={<VentasDeAsesor />} />
            <Route path="ver-venta/:idVenta" element={<VerVenta />} />
            <Route path="ver-ventas-asesor" element={<TotalVentasAsesorPage />} />
            <Route path="editar-venta/:idVenta" element={<EditarVenta />} />
            <Route path="ver-ventas/:asesorId" element={<VerVentaAsesor />} />
            <Route path="/reporte-excel-por-fecha" element={<GenerarReporteFecha />} />


>>>>>>> 01249b98a90d50067d73f8314b069b5e09bf63f7
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
