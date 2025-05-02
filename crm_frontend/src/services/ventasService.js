import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = "http://127.0.0.1:8000/api"; 

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
  },
});

export const getVentasTotales = async () => {
  const res = await axios.get(`${API_URL}/venta_fija/`, getAuthHeaders());

  return res.data;
};

export const exportVentaExcel = async (idVenta) => {
  const res = await axios.get(`${API_URL}/venta_fija/${idVenta}/`, getAuthHeaders());
  const venta = res.data;

  const worksheet = XLSX.utils.json_to_sheet([venta]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Venta");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, `Venta_${idVenta}.xlsx`);
};

export const exportVentasAsesorExcel = async (nombreAsesor) => {
  const res = await axios.get(`${API_URL}/venta_fija/`, getAuthHeaders());
  const ventas = res.data.filter((venta) => venta.nombre_asesor === nombreAsesor);

  const worksheet = XLSX.utils.json_to_sheet(ventas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas Asesor");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, `Ventas_Asesor_${nombreAsesor}.xlsx`);
};

