import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import feather from "feather-icons";
import "../assets/styles/layout.css";
import { useAuth } from "../context/AuthContext"; 

function Layout() {
  const navigate = useNavigate();
  const { user } = useAuth();  
  
  const permisos = user?.permisos || [];  
  
  const isAdmin = permisos.includes("administrador");
  const puedeVerHistorico = isAdmin || permisos.includes("backoficce fija") || permisos.includes("supervisor fija");

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

          <li className="navbar__item">
            <Link to="/ver-ventas-asesor" className="navbar__link">
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
