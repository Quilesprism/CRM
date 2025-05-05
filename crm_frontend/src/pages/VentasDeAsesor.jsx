import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVentasTotales, exportVentaExcel } from "../services/ventasService";
import "../assets/styles/historicopage.css";

// Función para determinar el color de clase según el estado
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

function VentasDeAsesor() {
  const { nombreAsesor } = useParams();
  const [ventas, setVentas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const ITEMS_POR_PAGINA = 10;

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const data = await getVentasTotales();
        const ventasAsesor = data.filter(
          (venta) => venta.nombre_asesor === decodeURIComponent(nombreAsesor)
        );
        setVentas(ventasAsesor);
      } catch (error) {
        console.error("Error cargando ventas del asesor:", error);
      }
    };

    fetchVentas();
  }, [nombreAsesor]);

  const ventasPaginadas = ventas.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  const totalPaginas = Math.ceil(ventas.length / ITEMS_POR_PAGINA);

  const handleExport = (idVenta) => {
    exportVentaExcel(idVenta);
  };

  return (
    <div className="historico-container">
      <h1>Ventas de: {decodeURIComponent(nombreAsesor)}</h1>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Cédula</th>
            <th>MIN</th>
            <th>Estado</th>
            <th>Tipo Contrado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.map((venta) => (
            <tr key={venta.id_venta}>
              <td>{venta.fecha_grabacion_contrato}</td>
              <td>{venta.nombres_apellidos_cliente}</td>
              <td>{venta.cedula_cliente}</td>
              <td>{venta.telefono_grabacion_contrato}</td>
              <td>
                <span className={`estado-celda ${obtenerColorEstado(venta.estado)}`}>
                  {venta.estado}
                </span>
              </td>
              <td>{venta.venta === "DIGITAL" ? "DIGITAL" : "GRABADA"}</td>
              <td>
                <button className="button" onClick={() => handleExport(venta.id_venta)}>
                  Exportar
                </button>
              </td>
            </tr>
          ))}
          {ventasPaginadas.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No hay ventas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPagina((p) => Math.max(p - 1, 1))} disabled={pagina === 1}>
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
          onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
          disabled={pagina === totalPaginas || totalPaginas === 0}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default VentasDeAsesor;
