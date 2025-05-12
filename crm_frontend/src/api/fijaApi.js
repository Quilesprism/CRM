const API_URL = "https://1cc3rjkx-8000.use2.devtunnels.ms";
import axios from "axios";



const getAuthHeaders = () => ({
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
  },
});

export async function fetchHistoricoFija() {
  try {
    const response = await axios.get(`${API_URL}/api/venta_fija/`, getAuthHeaders()); 
    return response.data;
  } catch (error) {
    console.error("Error en fetchHistoricoFija:", error);
    throw error;
  }
}

export function crearVentaFija(data) {
  return axios.post(
    `${API_URL}/api/venta_fija/`,
    data,
    getAuthHeaders()
  );
}

export const getDepartamentos = async () => {
  try {
    const response = await axios.get(`${API_URL}/ubicaciones/departamentos/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener departamentos", error);
    return [];
  }
};

export const getCiudadesPorDepartamento = async (departamento) => {
  try {
    const response = await axios.get(`${API_URL}/ubicaciones/departamentos/${departamento}/ciudades/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener ciudades", error);
    return [];
  }
};

export const getVentaById = async (idVenta) => {
  try {
    const res = await axios.get(`${API_URL}/api/venta_fija/${idVenta}/`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error(`Error al obtener la venta con ID ${idVenta}:`, error);
    throw error;
  }
};

export const updateVenta = async (idVenta, data) => {
  try {
    console.log(data)
    const response = await axios.patch( 
      `${API_URL}/api/venta_fija/${idVenta}/`,
      data,
      getAuthHeaders()
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la venta con ID ${idVenta}:`, error);
    throw error;
  }
};

export const getVentasByAsesorId = async (asesorCedula) => { 
  try {
    const response = await axios.get(`${API_URL}/api/venta_fija/asesor/`, {
      ...getAuthHeaders(),
      params: { asesor: asesorCedula }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las ventas del asesor:", error);
    throw error;
  }
};
export const generarReporteExcel = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/historico_fija/reporte_excel/`, 
      {
        ...getAuthHeaders(),
        params: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        },
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_ventas_${fechaInicio}_a_${fechaFin}.xlsx`); 
    document.body.appendChild(link);
    link.click();
    link.remove(); 
  } catch (error) {
    console.error("Error al generar el reporte de Excel:", error);
    throw error;
  }
};
