import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVentasByAsesorId } from "../api/fijaApi";
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

const VentasAsesorTabla = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userString = localStorage.getItem('user');
  const asesorCedula = userString ? JSON.parse(userString)?.cedula : null;

  useEffect(() => {
    const fetchVentasAsesor = async () => {
      setLoading(true);
      setError(null);
      try {
        if (asesorCedula) {
          const data = await getVentasByAsesorId(asesorCedula);
          setVentas(data);
        } else {
          setError("No se encontró la cédula del usuario en el almacenamiento local.");
        }
      } catch (err) {
        setError(err.message || "Error al cargar las ventas del asesor.");
        console.error("Error al obtener las ventas del asesor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVentasAsesor();
  }, [asesorCedula]);

  if (loading) {
    return <p>Cargando tus ventas...</p>;
  }

  if (error) {
    return <p>Error al cargar tus ventas: {error}</p>;
  }

  if (!ventas || ventas.length === 0) {
    return <p>No tienes ventas registradas.</p>;
  }

  return (
    <div className="container my-4">
      <h1>Tus Ventas</h1>
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Asesor</th>
                  <th>Cliente</th>
                  <th>Cédula Cliente</th>
                  <th>MIN</th>
                  <th>Estado</th>
                  <th>Tipo de Contrato</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id_venta}>
                    <td>{venta.fecha_grabacion_contrato}</td>
                    <td>{venta.nombre_asesor}</td>
                    <td>{venta.nombres_apellidos_cliente}</td>
                    <td>{venta.cedula_cliente}</td>
                    <td>{venta.telefono_grabacion_contrato}</td>
                    <td className={obtenerColorEstado(venta.estado)}>{venta.estado}</td>
                    <td>{venta.venta === "DIGITAL" ? "DIGITAL" : "GRABADA"}</td>
                    <td>
                      <Link to={`/ver-venta/${venta.id_venta}`} className="btn btn-primary mr-2">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <button onClick={() => exportVentaExcel(venta.id_venta)} className="btn btn-success">
                        <i className="fas fa-download"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentasAsesorTabla;