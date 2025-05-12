import React, { useEffect, useState } from "react";
import { getVentasTotales, exportVentaExcel } from "../services/ventasService";
import { useNavigate } from "react-router-dom";
import "../assets/styles/historicopage.css";

// Función para aplicar color según el estado
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

function HistoricoPage() {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const ITEMS_POR_PAGINA = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const data = await getVentasTotales();
        setVentas(data);
      } catch (error) {
        console.error("Error cargando ventas:", error);
        navigate("/login");
      }
    };

    fetchVentas();
  }, [navigate]);

  const handleExport = (idVenta) => {
    exportVentaExcel(idVenta);
  };

  const handleVerVenta = (idVenta) => {
    navigate(`/editar-venta/${idVenta}`); 
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value.toLowerCase());
    setPagina(1);
  };

  const ventasFiltradas = ventas.filter((venta) => {
    const asesor = venta.nombre_asesor?.toLowerCase() || "";
    const nombre = venta.nombres_apellidos_cliente?.toLowerCase() || "";
    const cedula = venta.cedula_cliente?.toString() || "";
    const telefono = venta.telefono_grabacion_contrato?.toString() || "";
    return (
      asesor.includes(busqueda) ||
      nombre.includes(busqueda) ||
      cedula.includes(busqueda) ||
      telefono.includes(busqueda)
    );
  });

  const contadorContratos = ventasFiltradas.reduce(
    (acc, venta) => {
      const tipo = venta.venta?.toLowerCase();
      if (tipo === "grabada") acc.grabada += 1;
      else if (tipo === "digital") acc.digital += 1;
      return acc;
    },
    { grabada: 0, digital: 0 }
  );

  const totalPaginas = Math.ceil(ventasFiltradas.length / ITEMS_POR_PAGINA);
  const ventasPaginadas = ventasFiltradas.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  return (
    <div className="historico-container">
      <div className="buscador-container">

        <h1>Ventas Totales</h1>
        <input
          type="text"
          placeholder="Buscar por nombre asesor, nombre, cédula o teléfono"
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador"
        />
        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          <span>Grabadas: {contadorContratos.grabada}</span> |{" "}
          <span>Digitales: {contadorContratos.digital}</span>
        </div>
      </div>

      <main>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Asesor</th>
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
                <td data-title="Asesor">{venta.nombre_asesor}</td>
                <td data-title="Cliente">{venta.nombres_apellidos_cliente}</td>
                <td data-title="Cédula">{venta.cedula_cliente}</td>
                <td data-title="MIN">{venta.telefono_grabacion_contrato}</td>
                <td data-title="Estado">
                  <span className={`estado-celda ${obtenerColorEstado(venta.estado)}`}>
                    {venta.estado}
                  </span>
                </td>
                <td data-title="Contrato">{venta.venta}</td>
                <td className="select">
                  <button className="button" onClick={() => handleVerVenta(venta.id_venta)}>Ver</button>
                  <button className="button" onClick={() => handleExport(venta.id_venta)}>Exportar</button>
                </td>
              </tr>
            ))}
            {ventasPaginadas.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No se encontraron resultados.
                </td>
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
          <button
            onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </main>
    </div>
  );
}

export default HistoricoPage;
