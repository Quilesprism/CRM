const API_URL = "http://127.0.0.1:8000/api";
import axios from "axios";

function getToken() {
  return localStorage.getItem("token");
}

export async function fetchHistoricoFija() {
  try {
    const response = await fetch(`${API_URL}/historico_fija/`, {
      headers: {
        "Authorization": `Token ${getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error("Error al obtener el histórico fija");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en fetchHistoricoFija:", error);
    throw error;
  }
}

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
    // No pongas aquí Content-Type, que lo infiere axios con FormData
  },
});

export function crearVentaFija(data) {
  // Ya no agregas “/api” otra vez
  return axios.post(
    `${API_URL}/venta_fija/`,
    data,
    getAuthHeaders()
  );
}