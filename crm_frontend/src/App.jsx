import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HistoricoPage from "./pages/HistoricoPage";
import VerVenta from "./pages/VerVenta";
import CrearVenta from "./pages/CrearVenta";
import Layout from "./components/Layout";
import VerVentaAsesor from "./pages/VerVentaAsesor";
import TotalVentasAsesorPage from "./pages/TotalVentasAsesorPage";
import VentasHoy from './pages/VentasHoy';;
import VentasDeAsesor from './pages/VentasDeAsesor';
import ListaAsesores from "./components/ListaAsesores";
import './App.css'; // Importa el archivo CSS
import EditarVenta from "./pages/EditarVentas";
function App() {
  const token = localStorage.getItem("token");

  return (
    <Router className="app-background">
      <Routes>


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


          </Route>
        )}

        <Route
          path="*"
          element={<Navigate to={token ? "/ventas" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;