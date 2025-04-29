import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VentasResumen from "../components/VentasResumen";
import VentasTabla from "../components/VentasTabla";
import { getVentasTotales } from "../services/ventasService";

const VentasTotales = () => {
  const [datosResumen, setDatosResumen] = useState({ ventas_digitales: 0, ventas_grabadas: 0 });
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { resumen, listaVentas } = await getVentasTotales();
      setDatosResumen(resumen);
      setVentas(listaVentas);
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="h3 mb-2 text-gray-800">Ventas Totales</h1>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/exportartodas" className="btn btn-primary">Generar Todas las ventas</Link>
        <VentasResumen datos={datosResumen} />
      </div>

      <VentasTabla ventas={ventas} />
    </div>
  );
};

export default VentasTotales;
