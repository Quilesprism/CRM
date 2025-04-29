import React from "react";
import { Link } from "react-router-dom";
import { exportVentaExcel } from "../services/ventasService";

const VentasTabla = ({ ventas }) => {
  
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

  return (
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
                  <td>{venta.tipo_contrato === "DIGITAL" ? "DIGITAL" : "GRABADA"}</td>
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
  );
};

export default VentasTabla;
