import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import feather from "feather-icons";
import "../assets/styles/layout.css";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Verifica los permisos del usuario
  const permisos = user?.permisos || [];
  const isAdmin = permisos.includes("administrador");
  const puedeVerHistorico =
    isAdmin ||
    permisos.includes("backoficce fija") ||
    permisos.includes("supervisor fija");

  // Si el usuario no tiene permisos de administrador, redirige a la página de login
  useEffect(() => {
    if (!user?.permisos?.includes("administrador")) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    feather.replace();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("asesorId");
    navigate("/login");
  };

  return (
    <div className="layout-wrapper">
      <nav className="navbar">
        <ul className="navbar__menu">
          {puedeVerHistorico && (
            <>
              <li className="navbar__item">
                <Link to="/ventas-hoy" className="navbar__link">
                  <i data-feather="archive"></i><span>Ventas Hoy</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link to="/ventas" className="navbar__link">
                  <i data-feather="folder"></i><span>Histórico de Ventas</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link to="/asesores" className="navbar__link">
                  <i data-feather="user"></i><span>Asesores Fija</span>
                </Link>
              </li>
              <li className="navbar__item">
                <Link to="/reporte-excel-por-fecha" className="navbar__link">
                  <i data-feather="folder"></i><span>Generar Reportes Fija</span>
                </Link>
              </li>
            </>
          )}

          <li className="navbar__item">
            <Link to="/crear-venta" className="navbar__link">
              <i data-feather="plus-circle"></i><span>Crear Venta</span>
            </Link>
          </li>

          {(isAdmin || puedeVerHistorico) && (
            <li className="navbar__item">
              <Link to="/ventas" className="navbar__link">
                <i data-feather="shopping-cart"></i><span>Ventas</span>
              </Link>
            </li>
          )}

          {isAdmin && (
            <li className="navbar__item">
              <Link to="/registrar-usuario" className="navbar__link">
                <i data-feather="user-plus"></i><span>Registrar Usuario</span>
              </Link>
            </li>
          )}

          <li className="navbar__item">
            <Link to="/ver-ventas-asesor" className="navbar__link">
              <i data-feather="file-text"></i><span>Ver mis ventas</span>
            </Link>
          </li>

          <li className="navbar__item logout">
            <button onClick={handleLogout} className="navbar__link logout-button">
              <i data-feather="log-out"></i><span>Salir</span>
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
