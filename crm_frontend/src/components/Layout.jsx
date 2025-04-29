import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import feather from "feather-icons";
import "../assets/styles/layout.css";

function Layout() {
  useEffect(() => {
    feather.replace();
  }, []);

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
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
