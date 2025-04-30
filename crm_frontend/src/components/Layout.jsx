import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import feather from "feather-icons";
import "../assets/styles/layout.css";

function Layout() {
  const navigate = useNavigate();
  
  // Obtener id del asesor logueado (esto depende de tu implementación)
  const asesorId = localStorage.getItem("asesorId"); // Asumiendo que guardas el id del asesor en localStorage

  useEffect(() => {
    feather.replace();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // o sessionStorage si usas sessionStorage
    localStorage.removeItem("asesorId"); // Limpiar también el id del asesor
    navigate("/login"); 
  };

  return (
    <div className="layout-wrapper">
      <nav className="navbar">
        <ul className="navbar__menu">
          <li className="navbar__item">
            <Link to="/ventas" className="navbar__link">
              <i data-feather="shopping-cart"></i><span>Ventas</span>
            </Link>
          </li>
          <li className="navbar__item">
            <Link to="/crear-venta" className="navbar__link">
              <i data-feather="plus-circle"></i><span>Crear Venta</span>
            </Link>
          </li>
          <li className="navbar__item">
            <Link to={`/ver-ventas-asesor`} className="navbar__link">
              <i data-feather="file-text"></i><span>Ver Ventas</span>
            </Link>
          </li>
          <li className="navbar__item">
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
