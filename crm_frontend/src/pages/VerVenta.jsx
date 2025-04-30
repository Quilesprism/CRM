// src/pages/VerVenta.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVentaById } from "../api/fijaApi"; // Importa la nueva función
import Input from "../components/forms/Input";
import Select from "../components/forms/Select";
import Textarea from "../components/forms/Textarea";
import FileInput from "../components/forms/FileInput";
import Checkbox from "../components/forms/Checkbox";
import Card from "../components/ui/Card";

function VerVenta() {
  const { idVenta } = useParams();
  const [ventaData, setVentaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenta = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getVentaById(idVenta);
        setVentaData(data);
      } catch (err) {
        setError(err.message || "Error al cargar los detalles de la venta.");
        console.error("Error al obtener la venta por ID:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [idVenta]);

  if (loading) {
    return <div>Cargando detalles de la venta...</div>;
  }

  if (error) {
    return <div>Error al cargar los detalles de la venta: {error}</div>;
  }

  if (!ventaData) {
    return <div>No se encontraron detalles para esta venta.</div>;
  }

  return (
    <div className="container my-4">
      <h1>Detalles de la Venta {idVenta}</h1>

      <Card title="Información del Cliente">
        <Input label="Nombres y apellidos del cliente" value={ventaData.nombres_apellidos_cliente} readOnly />
        <Input label="Tipo de Documento" value={ventaData.tipo_cedula} readOnly />
        <Input label="Número de documento" value={ventaData.cedula_cliente} readOnly />
        <Input label="Fecha de expedición" value={ventaData.fecha_expedicion} readOnly />
        <Input label="Lugar de expedición" value={ventaData.lugar_expedicion} readOnly />
        <Input label="Correo Electrónico" value={ventaData.correo_electronico} readOnly />
        <Input label="Correspondencia Electrónica" value={ventaData.correspondencia_electronica ? "SI" : "NO"} readOnly />
        <Input label="Teléfono de contacto 1" value={ventaData.telefono_1} readOnly />
        <Input label="Teléfono de contacto 2" value={ventaData.telefono_2} readOnly />
        <Input label="Teléfono grabación de contrato" value={ventaData.telefono_grabacion_contrato} readOnly />
      </Card>

      <Card title="Dirección del Cliente">
        <Input label="Dirección RR" value={ventaData.direccion_rr} readOnly />
        <Input label="Nombre Conjunto" value={ventaData.nombre_conjunto} readOnly />
        <Input label="Barrio" value={ventaData.barrio} readOnly />
        <Input label="Ciudad" value={ventaData.ciudad} readOnly />
        <Input label="Departamento" value={ventaData.departamento} readOnly />
        <Input label="Comunidad" value={ventaData.comunidad} readOnly />
        <Input label="Nodo" value={ventaData.nodo} readOnly />
        <Input label="Estrato" value={ventaData.estrato} readOnly />
      </Card>

      <Card title="Detalles de la Venta">
        <Input label="Venta" value={ventaData.venta} readOnly />
        <Input label="Tipo de Gestión" value={ventaData.tipo_gestion} readOnly />
        <Input label="Servicio" value={ventaData.servicio} readOnly />
        {ventaData.servicios_adicionales && ventaData.servicios_adicionales.length > 0 && (
          <p>
            <strong>Servicios Adicionales:</strong> {ventaData.servicios_adicionales.join(", ")}
          </p>
        )}
        <Input label="Deco Adicional" value={ventaData.deco_adicional} readOnly />
        {ventaData.deco_adicional === "SI" && (
          <Input label="Cantidad Decos" value={ventaData.cantidad_decos} readOnly />
        )}
        <Input label="Campaña" value={ventaData.campana} readOnly />
        <Input label="Adicionales" value={ventaData.adicionales} readOnly />
        <Input label="Código Tarifa" value={ventaData.codigo_tarifa} readOnly />
        <Input label="Ptar" value={ventaData.ptar} readOnly />
        <Input label="Nombre Paquete Adquirido" value={ventaData.nombre_paquete_adquirido} readOnly />
        <Input label="Renta Mensual" value={ventaData.renta_mensual} readOnly />
        <Input label="Todo Claro" value={ventaData.todo_claro ? "SI" : "NO"} readOnly />
        <Input label="Persona recibe instalación" value={ventaData.persona_recibe_instalacion} readOnly />
        <Input label="Fecha instalación" value={ventaData.fecha_instalacion} readOnly />
        <Input label="Franja instalación" value={ventaData.franja_instalacion} readOnly />
        <Textarea label="Observación" value={ventaData.observacion} readOnly />
        <Textarea label="Detalles" value={ventaData.detalles} readOnly />
        {ventaData.link && (
          <div className="form-group">
            <label className="form-label-separated">Validación de Identidad</label>
            <img
              src={ventaData.link}
              alt="Validación de Identidad"
              className="img-fluid" // Añade clases para hacerlo responsivo si es necesario
              style={{ maxWidth: '300px', maxHeight: '300px', display: 'block' }}
              onError={(e) => {
                e.target.onerror = null; // Evita bucles infinitos de error
                e.target.src = "https://via.placeholder.com/150?text=Imagen+No+Disponible"; // Muestra una imagen de reemplazo
              }}
            />
            
          </div>
        )}

        {ventaData.link2 && (
          <div className="form-group">
            <label className="form-label-separated">Validación de Créditos</label>
            <img
              src={ventaData.link2}
              alt="Validación de Créditos"
              className="img-fluid"
              style={{ maxWidth: '300px', maxHeight: '300px', display: 'block' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150?text=Imagen+No+Disponible";
              }}
            />
            
          </div>
        )}

        {ventaData.link3 && ventaData.link3 !== "N/A" && (
          <div className="form-group">
            <label className="form-label-separated">Motivo no venta digital</label>
            <img
              src={ventaData.link3}
              alt="Motivo no venta digital"
              className="img-fluid"
              style={{ maxWidth: '300px', maxHeight: '300px', display: 'block' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150?text=Imagen+No+Disponible";
              }}
            />
            
          </div>
        )}
        {ventaData.link3 === "N/A" && (
          <div className="form-group">
            <label className="form-label-separated">Motivo no venta digital</label>
            <p>N/A</p>
          </div>
        )}


        {ventaData.fecha_grabacion_contrato && (
          <Input label="Fecha Grabación Contrato" value={new Date(ventaData.fecha_grabacion_contrato).toLocaleString()} readOnly />
        )}
        {ventaData.cedula_asesor && <Input label="Cédula del Asesor" value={ventaData.cedula_asesor} readOnly />}
        {ventaData.nombre_asesor && <Input label="Nombre del Asesor" value={ventaData.nombre_asesor} readOnly />}
      </Card>
    </div>
  );
}

export default VerVenta;