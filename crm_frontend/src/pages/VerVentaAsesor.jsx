import React, { useState, useEffect } from "react";
import { getVentasByAsesorId } from "../api/fijaApi";
import Card from "../components/ui/Card";
import Input from "../components/forms/Input";
import Textarea from "../components/forms/Textarea";

function VerVentaAsesor() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userString = localStorage.getItem('user');
  const asesorCedula = userString ? JSON.parse(userString)?.cedula : null; 
  useEffect(() => {
    const fetchVentasAsesor = async () => {
      setLoading(true);
      setError(null);
      try {
        if (asesorCedula) {
          const data = await getVentasByAsesorId(asesorCedula);
          setVentas(data);
        } else {
          setError("No se encontró la cédula del usuario en el almacenamiento local.");
        }
      } catch (err) {
        setError(err.message || "Error al cargar las ventas del asesor.");
        console.error("Error al obtener las ventas del asesor:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVentasAsesor();
  }, [asesorCedula]);
  if (loading) {
    return <p>Cargando tus ventas...</p>;
  }

  if (error) {
    return <p>Error al cargar tus ventas: {error}</p>;
  }

  if (!ventas || ventas.length === 0) {
    return <p>No tienes ventas registradas.</p>;
  }

 
  return (
    <div className="container my-4">
      <h1>Tus Ventas</h1>
      {ventas.map((venta) => (
        <div key={venta.id_venta}>
          <h2>Venta ID: {venta.id_venta}</h2>
          <Card title="Información del Cliente">
            <Input label="Nombres y apellidos del cliente" value={venta.nombres_apellidos_cliente} readOnly />
            <Input label="Tipo de Documento" value={venta.tipo_cedula} readOnly />
            <Input label="Número de documento" value={venta.cedula_cliente} readOnly />
            <Input label="Fecha de expedición" value={venta.fecha_expedicion} readOnly />
            <Input label="Lugar de expedición" value={venta.lugar_expedicion} readOnly />
            <Input label="Correo Electrónico" value={venta.correo_electronico} readOnly />
            <Input label="Correspondencia Electrónica" value={venta.correspondencia_electronica ? "SI" : "NO"} readOnly />
            <Input label="Teléfono de contacto 1" value={venta.telefono_1} readOnly />
            <Input label="Teléfono de contacto 2" value={venta.telefono_2} readOnly />
            <Input label="Teléfono grabación de contrato" value={venta.telefono_grabacion_contrato} readOnly />
          </Card>
  
          <Card title="Dirección del Cliente">
            <Input label="Dirección RR" value={venta.direccion_rr} readOnly />
            <Input label="Nombre Conjunto" value={venta.nombre_conjunto} readOnly />
            <Input label="Barrio" value={venta.barrio} readOnly />
            <Input label="Ciudad" value={venta.ciudad} readOnly />
            <Input label="Departamento" value={venta.departamento} readOnly />
            <Input label="Comunidad" value={venta.comunidad} readOnly />
            <Input label="Nodo" value={venta.nodo} readOnly />
            <Input label="Estrato" value={venta.estrato} readOnly />
          </Card>
  
          <Card title="Detalles de la Venta">
            <Input label="Venta" value={venta.venta} readOnly />
            <Input label="Tipo de Gestión" value={venta.tipo_gestion} readOnly />
            <Input label="Servicio" value={venta.servicio} readOnly />
            {venta.servicios_adicionales && venta.servicios_adicionales.length > 0 && (
              <p>
                <strong>Servicios Adicionales:</strong> {venta.servicios_adicionales.join(", ")}
              </p>
            )}
            <Input label="Deco Adicional" value={venta.deco_adicional} readOnly />
            {venta.deco_adicional === "SI" && (
              <Input label="Cantidad Decos" value={venta.cantidad_decos} readOnly />
            )}
            <Input label="Campaña" value={venta.campana} readOnly />
            <Input label="Adicionales" value={venta.adicionales} readOnly />
            <Input label="Código Tarifa" value={venta.codigo_tarifa} readOnly />
            <Input label="Ptar" value={venta.ptar} readOnly />
            <Input label="Nombre Paquete Adquirido" value={venta.nombre_paquete_adquirido} readOnly />
            <Input
              label="Renta Mensual"
              value={`$${venta.renta_mensual}`}
              readOnly
            />
  
            <Input label="Todo Claro" value={venta.todo_claro ? "SI" : "NO"} readOnly />
            <Input label="Persona recibe instalación" value={venta.persona_recibe_instalacion} readOnly />
            <Input label="Fecha instalación" value={venta.fecha_instalacion} readOnly />
            <Input label="Franja instalación" value={venta.franja_instalacion} readOnly />
            <Textarea label="Observación" value={venta.observacion} readOnly />
            <Textarea label="Detalles" value={venta.detalles} readOnly />
            {venta.link && (
              <div className="form-group">
                <label className="form-label-separated">Validación de Identidad</label>
                <img
                  src={venta.link}
                  alt="Validación de Identidad"
                  className="img-fluid"
                  style={{ maxWidth: '300px', maxHeight: '300px', display: 'block' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Imagen+No+Disponible";
                  }}
                />
              </div>
            )}
  
            {venta.link2 && (
              <div className="form-group">
                <label className="form-label-separated">Validación de Créditos</label>
                <img
                  src={venta.link2}
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
  
            {venta.link3 && venta.link3 !== "N/A" && (
              <div className="form-group">
                <label className="form-label-separated">Motivo no venta digital</label>
                <img
                  src={venta.link3}
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
            {venta.link3 === "N/A" && (
              <div className="form-group">
                <label className="form-label-separated">Motivo no venta digital</label>
                <p>N/A</p>
              </div>
            )}
  
   
            {venta.fecha_grabacion_contrato && (
              <Input label="Fecha Grabación Contrato" value={new Date(venta.fecha_grabacion_contrato).toLocaleString()} readOnly />
            )}
            {venta.cedula_asesor && <Input label="Cédula del Asesor" value={venta.cedula_asesor} readOnly />}
            {venta.nombre_asesor && <Input label="Nombre del Asesor" value={venta.nombre_asesor} readOnly />}
          </Card>
        </div>
      ))}
    </div>
  );
}

export default VerVentaAsesor;