import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HistoricoPage from "./pages/HistoricoPage";
import VerVenta from "./pages/VerVenta";
import CrearVenta from "./pages/CrearVenta";
import Layout from "./components/Layout";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con layout */}
        {token && (
          <Route path="/" element={<Layout />}>
            <Route path="crear-venta" element={<CrearVenta />} />
            <Route path="ventas" element={<HistoricoPage />} />
            <Route path="ver-venta/:idVenta" element={<VerVenta />} />
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
