import React from "react";

const VentasResumen = ({ datos }) => {
  return (
    <table className="tipoContrato">
      <thead>
        <tr>
          <th>N° VENTAS DIGITALES</th>
          <th>N° VENTAS GRABADAS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{datos.ventas}</td>
          <td>{datos.ventas}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default VentasResumen;
