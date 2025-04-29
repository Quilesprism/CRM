// src/pages/VerVenta.jsx
import React from "react";
import { useParams } from "react-router-dom";

function VerVenta() {
  const { idVenta } = useParams();

  return (
    <div>
      <h1>Detalles de la Venta {idVenta}</h1>
      {/* Aquí puedes hacer un GET por ID para traer datos si quieres */}
      <p>Próximamente editar venta...</p>
    </div>
  );
}

export default VerVenta;
