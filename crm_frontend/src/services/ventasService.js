import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = "https://1cc3rjkx-8000.use2.devtunnels.ms/api"; 

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

