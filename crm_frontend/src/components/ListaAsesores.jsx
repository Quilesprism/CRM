import React, { useEffect, useState } from "react";
import { getVentasTotales, exportVentasAsesorExcel } from "../services/ventasService";
import { useNavigate } from "react-router-dom";
import "../assets/styles/historicopage.css";

function ListaAsesores() {
  const [asesores, setAsesores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const ITEMS_POR_PAGINA = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsesores = async () => {
      try {
        const data = await getVentasTotales();
        const mapaAsesores = new Map();
        data.forEach((venta) => {
          const nombre = venta.nombre_asesor;
          const cedula = venta.cedula_asesor;
          if (nombre && cedula && !mapaAsesores.has(cedula)) {
            mapaAsesores.set(cedula, { nombre, cedula });
          }
        });
        setAsesores(Array.from(mapaAsesores.values()));
      } catch (error) {
        console.error("Error al cargar asesores:", error);
      }
    };

    fetchAsesores();
  }, []);

  const handleVerVentas = (asesor) => {
    const nombreCodificado = encodeURIComponent(asesor.nombre);
    navigate(`/ventas-asesor/${nombreCodificado}`);
  };

  const handleExportar = async (asesor) => {
    try {
      await exportVentasAsesorExcel(asesor.nombre);
    } catch (error) {
      console.error("Error al exportar ventas del asesor:", error);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value.toLowerCase());
    setPagina(1);
  };

  const asesoresFiltrados = asesores.filter((asesor) => {
    const nombre = asesor.nombre?.toLowerCase() || "";
    const cedula = asesor.cedula?.toString() || "";
    return (
      nombre.includes(busqueda) ||
      cedula.includes(busqueda)
    );
  });

  const totalPaginas = Math.ceil(asesoresFiltrados.length / ITEMS_POR_PAGINA);
  const asesoresPaginados = asesoresFiltrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  return (
    <div className="historico-container">
      <div className="buscador-container">
        <h1>Lista de Asesores</h1>
        <input
          type="text"
          placeholder="Buscar por nombre o cédula"
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Asesor</th>
            <th>Cédula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asesoresPaginados.map((asesor, index) => (
            <tr key={index}>
              <td>{asesor.nombre}</td>
              <td>{asesor.cedula}</td>
              <td className="select">
                <button className="button" onClick={() => handleVerVentas(asesor)}>Ver</button>
                <button className="button" onClick={() => handleExportar(asesor)}>Exportar</button>
              </td>
            </tr>
          ))}
          {asesoresPaginados.length === 0 && asesores.length > 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No se encontraron resultados para tu búsqueda.
              </td>
            </tr>
          )}
          {asesores.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No hay asesores registrados.
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

export default ListaAsesores;