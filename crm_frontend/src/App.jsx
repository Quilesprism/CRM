import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import HistoricoPage from "./pages/HistoricoPage";
import VerVenta from "./pages/VerVenta";
import CrearVenta from "./pages/CrearVenta";
import Layout from "./components/Layout";
import VerVentaAsesor from "./pages/VerVentaAsesor";
import TotalVentasAsesorPage from "./pages/TotalVentasAsesorPage";
import VentasHoy from './pages/VentasHoy';
import VentasDeAsesor from './pages/VentasDeAsesor';
import ListaAsesores from "./components/ListaAsesores";
import EditarVenta from "./pages/EditarVentas";
import GenerarReporteFecha from "./pages/GenerarReporteFecha";
import RegistrarUsuario from "./pages/RegistrarUsuarios";
import './App.css';

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const PermissionRoute = ({ requiredPermissions }) => {
  const { user } = useAuth();
  const permisos = user?.permisos || [];

  const hasPermission = requiredPermissions.some(permission =>
    permission === "admin"
      ? permisos.includes("administrador")
      : permisos.includes(permission)
  );

  if (!hasPermission) return <Navigate to="/" replace />;
  return <Outlet />;
};

function App() {
  const { user } = useAuth();

  // Si el usuario aún no está cargado, no renderices nada (evita el bucle infinito)
  if (!user) return null;

  const token = localStorage.getItem("token");
  const permisos = user?.permisos || [];
  const isAdmin = permisos.includes("administrador");
  const isBackoffice = permisos.includes("backoficce fija");
  const isSupervisor = permisos.includes("supervisor fija");
  const isAsesor = permisos.includes("asesor fija");

  const getHomePage = () => {
    if (isAdmin) return "/ventas";
    if (isBackoffice || isSupervisor) return "/ventas-hoy";
    return "/crear-venta";
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!token ? <LoginPage /> : user ? <Navigate to={getHomePage()} replace /> : null}
        />

        {/* Solo admin puede registrar usuarios */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to={getHomePage()} />} />

            {/* Acceso para todos los autenticados */}
            <Route path="crear-venta" element={<CrearVenta />} />
            <Route path="ver-venta/:idVenta" element={<VerVenta />} />
            <Route path="editar-venta/:idVenta" element={<EditarVenta />} />

            {/* Asesor fija ve solo sus ventas */}
            {isAsesor && (
              <>
                <Route path="ver-ventas-asesor" element={<TotalVentasAsesorPage />} />
              </>
            )}

            {isAdmin && (
              <>
                <Route path="registrar-usuario" element={<RegistrarUsuario />} />
              </>
            )}

            {/* Supervisor, Backoffice y Admin ven todo */}
            {(isSupervisor || isBackoffice || isAdmin) && (
              <>
                <Route path="ventas" element={<HistoricoPage />} />
                <Route path="ventas-hoy" element={<VentasHoy />} />
                <Route path="asesores" element={<ListaAsesores />} />
                <Route path="ventas-asesor/:nombreAsesor" element={<VentasDeAsesor />} />
                <Route path="reporte-excel-por-fecha" element={<GenerarReporteFecha />} />
                <Route path="ver-ventas/:asesorId" element={<VerVentaAsesor />} />
              </>
            )}
          </Route>
        </Route>

        {/* Ruta por defecto */}
        <Route
          path="*"
          element={
            token ? (user ? <Navigate to={getHomePage()} replace /> : null) : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
