import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVentasByAsesorId } from "../api/fijaApi";
import "../assets/styles/historicopage.css"; 
import { exportVentaExcel } from "../services/ventasService";

const obtenerColorEstado = (estado) => {
  switch (estado) {
    case "CANTADA":
    case "AUDITADA":
    case "ENVIADA AL ABD":
    case "DIGITAL":
      return "table-warning";
    case "PENDIENTE":
    case "RECUPERADA":
      return "table-info";
    case "RECHAZADA":
    case "DEVUELTA ABD":
    case "DESACTIVA":
      return "table-danger";
    case "ACTIVA":
    case "LEGALIZADA":
    case "EXITOSA":
      return "table-success";
    default:
      return "";
  }
};

function VentasAsesorPage() {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const ITEMS_POR_PAGINA = 10;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userString = localStorage.getItem('user');
  const asesorCedula = userString ? JSON.parse(userString)?.cedula : null;

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      setError(null);
      try {
        if (asesorCedula) {
          const data = await getVentasByAsesorId(asesorCedula);
          console.log("Ventas del asesor:", data);
          setVentas(data);
        } else {
          setError("No se encontró la cédula del usuario en el almacenamiento local.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error cargando ventas del asesor:", error);
        setError("Error al cargar las ventas.");
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [navigate, asesorCedula]);

  const handleExport = (idVenta) => {
    exportVentaExcel(idVenta);
  };

  const handleVerVenta = (idVenta) => {
    navigate(`/ver-ventas/${idVenta}`); // Asegúrate de tener esta ruta definida
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value.toLowerCase());
    setPagina(1);
  };

  const ventasFiltradas = ventas.filter((venta) => {
    const nombre = venta.nombres_apellidos_cliente?.toLowerCase() || "";
    const cedula = venta.cedula_cliente?.toString() || "";
    const telefono = venta.telefono_grabacion_contrato?.toString() || "";
    return (
      nombre.includes(busqueda) ||
      cedula.includes(busqueda) ||
      telefono.includes(busqueda)
    );
  });

  const totalPaginas = Math.ceil(ventasFiltradas.length / ITEMS_POR_PAGINA);
  const ventasPaginadas = ventasFiltradas.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  if (loading) {
    return <div className="historico-container">Cargando tus ventas...</div>;
  }

  if (error) {
    return <div className="historico-container">Error al cargar las ventas: {error}</div>;
  }

  return (
    <div className="historico-container">
      <div className="buscador-container">
        <h1>Tus Ventas</h1>
        <input
          type="text"
          placeholder="Buscar por nombre, cédula o teléfono"
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador"
        />
      </div>
      <p>(Haz clic en "Ver" para más detalles)</p>

      <main>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Cédula Cliente</th>
              <th>MIN</th>
              <th>Estado</th>
              <th>Tipo Contrato</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasPaginadas.map((venta) => (
              <tr key={venta.id_venta}>
                <td data-title="Fecha">{venta.fecha_grabacion_contrato}</td>
                <td data-title="Cliente">{venta.nombres_apellidos_cliente}</td>
                <td data-title="Cédula">{venta.cedula_cliente}</td>
                <td data-title="MIN">{venta.telefono_grabacion_contrato}</td>
                <td data-title="Estado">
                <span className={`estado-celda ${obtenerColorEstado(venta.estado)}`}>{venta.estado}</span>
                </td>
                <td data-title="Contrato">{venta.venta === "DIGITAL" ? "DIGITAL" : "GRABADA"}</td>
                <td className="select">
                  <button className="button" onClick={() => handleVerVenta(venta.id_venta)}>Ver</button>
                  <button className="button" onClick={() => handleExport(venta.id_venta)}>Exportar</button>
                </td>
              </tr>
            ))}
            {ventasPaginadas.length === 0 && ventas.length > 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No se encontraron resultados para tu búsqueda.</td>
              </tr>
            )}
            {ventas.length === 0 && !loading && !error && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No tienes ventas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => setPagina(p => Math.max(p - 1, 1))} disabled={pagina === 1}>
            Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={pagina === i + 1 ? "active" : ""}
              onClick={() => setPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))} disabled={pagina === totalPaginas || totalPaginas === 0}>
            Siguiente
          </button>
        </div>
      </main>
    </div>
  );
}

export default VentasAsesorPage;