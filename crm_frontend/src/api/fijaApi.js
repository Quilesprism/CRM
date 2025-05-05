const API_URL = "http://127.0.0.1:8000";
import axios from "axios";

function getToken() {
  return localStorage.getItem("token");
}

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
  },
});

export async function fetchHistoricoFija() {
  try {
    const response = await axios.get(`${API_URL}/api/historico_fija/`, getAuthHeaders());
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

export const getVentasByAsesorId = async (asesorCedula) => { // Cambia el nombre del parámetro para claridad
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