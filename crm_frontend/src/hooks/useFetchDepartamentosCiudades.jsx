// src/hooks/useFetchDepartamentosCiudades.js
import { useState, useEffect } from "react";
import { getDepartamentos, getCiudadesPorDepartamento } from "../api/fijaApi.js";

const useFetchDepartamentosCiudades = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await getDepartamentos();
        setDepartamentos(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching departamentos:", err);
      }
    };

    fetchDepartamentos();
  }, []);

  useEffect(() => {
    const fetchCiudades = async () => {
      if (selectedDepartamento) {
        try {
          const data = await getCiudadesPorDepartamento(selectedDepartamento);
          setCiudades(data);
        } catch (err) {
          console.error("Error fetching ciudades:", err);
          setCiudades([]);
        }
      } else {
        setCiudades([]);
      }
    };

    fetchCiudades();
  }, [selectedDepartamento]);

  const handleDepartamentoChange = (event) => {
    setSelectedDepartamento(event.target.value);
  };

  return {
    departamentos,
    ciudades,
    selectedDepartamento,
    handleDepartamentoChange,
    loading,
    error,
  };
};

export default useFetchDepartamentosCiudades;