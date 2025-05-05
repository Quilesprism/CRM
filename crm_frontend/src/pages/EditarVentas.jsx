import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateVenta } from "../api/fijaApi"; // Importa solo updateVenta
import Input from "../components/forms/Input";
import Select from "../components/forms/Select";
import Textarea from "../components/forms/Textarea";
import FileInput from "../components/forms/FileInput";
import Checkbox from "../components/forms/Checkbox";
import Card from "../components/ui/Card";
import { getVentaById } from "../api/fijaApi"; // Esta línea debe ser eliminada

function EditarVenta() {
  const { idVenta } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenta = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getVentaById(idVenta); // Ya está importada en otro lugar, o debería estarlo
        setFormData(data);
      } catch (err) {
        setError(err.message || "Error al cargar los detalles de la venta para editar.");
        console.error("Error al obtener la venta por ID para editar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [idVenta]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateVenta(idVenta, formData);
      alert("Venta actualizada exitosamente.");
      navigate("/ventas"); // Redirigir al histórico después de la actualización
    } catch (err) {
      setError(err.message || "Error al actualizar la venta.");
      console.error("Error al actualizar la venta:", err);
      alert(`Error al actualizar la venta: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando detalles de la venta para editar...</div>;
  }

  if (error) {
    return <div>Error al cargar los detalles de la venta: {error}</div>;
  }

  if (!formData) {
    return <div>No se encontraron detalles para esta venta.</div>;
  }

  return (
    <div className="container my-4">
      <h1>Editar Venta {idVenta}</h1>
      <form onSubmit={handleSubmit}>
        <Card title="Información del Cliente">
          <Input label="Nombres y apellidos del cliente" name="nombres_apellidos_cliente" value={formData.nombres_apellidos_cliente} onChange={handleInputChange} />
          <Input label="Tipo de Documento" name="tipo_cedula" value={formData.tipo_cedula} onChange={handleInputChange} />
          <Input label="Número de documento" name="cedula_cliente" value={formData.cedula_cliente} onChange={handleInputChange} />
          <Input label="Fecha de expedición" name="fecha_expedicion" value={formData.fecha_expedicion} onChange={handleInputChange} />
          <Input label="Lugar de expedición" name="lugar_expedicion" value={formData.lugar_expedicion} onChange={handleInputChange} />
          <Input label="Correo Electrónico" name="correo_electronico" value={formData.correo_electronico} onChange={handleInputChange} />
          <Checkbox label="Correspondencia Electrónica" name="correspondencia_electronica" checked={formData.correspondencia_electronica} onChange={handleInputChange} />
          <Input label="Teléfono de contacto 1" name="telefono_1" value={formData.telefono_1} onChange={handleInputChange} />
          <Input label="Teléfono de contacto 2" name="telefono_2" value={formData.telefono_2} onChange={handleInputChange} />
          <Input label="Teléfono grabación de contrato" name="telefono_grabacion_contrato" value={formData.telefono_grabacion_contrato} onChange={handleInputChange} />
        </Card>

        <Card title="Dirección del Cliente">
          <Input label="Dirección RR" name="direccion_rr" value={formData.direccion_rr} onChange={handleInputChange} />
          <Input label="Nombre Conjunto" name="nombre_conjunto" value={formData.nombre_conjunto} onChange={handleInputChange} />
          <Input label="Barrio" name="barrio" value={formData.barrio} onChange={handleInputChange} />
          <Input label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
          <Input label="Departamento" name="departamento" value={formData.departamento} onChange={handleInputChange} />
          <Input label="Comunidad" name="comunidad" value={formData.comunidad} onChange={handleInputChange} />
          <Input label="Nodo" name="nodo" value={formData.nodo} onChange={handleInputChange} />
          <Input label="Estrato" name="estrato" value={formData.estrato} onChange={handleInputChange} />
        </Card>

        <Card title="Detalles de la Venta">
          <Input label="Venta" name="venta" value={formData.venta} onChange={handleInputChange} />
          <Input label="Tipo de Gestión" name="tipo_gestion" value={formData.tipo_gestion} onChange={handleInputChange} />
          <Input label="Servicio" name="servicio" value={formData.servicio} onChange={handleInputChange} />
          {formData.servicio === 'TV' && (
            <Select
              label="Servicios Adicionales"
              name="servicios_adicionales"
              value={formData.servicios_adicionales}
              onChange={(e) => setFormData({...formData, servicios_adicionales: Array.isArray(e.target.value) ? e.target.value : [e.target.value]})}
              options={[
                { value: "HBO", label: "HBO" },
                { value: "FOX PREMIUM", label: "FOX PREMIUM" },
                // ... más opciones
              ]}
              multiple
            />
          )}
          <Select
            label="Deco Adicional"
            name="deco_adicional"
            value={formData.deco_adicional}
            onChange={handleInputChange}
            options={[
              { value: "NO", label: "NO" },
              { value: "SI", label: "SI" },
            ]}
          />
          {formData.deco_adicional === "SI" && (
            <Input label="Cantidad Decos" name="cantidad_decos" value={formData.cantidad_decos} onChange={handleInputChange} type="number" />
          )}
          <Input label="Campaña" name="campana" value={formData.campana} onChange={handleInputChange} />
          <Input label="Adicionales" name="adicionales" value={formData.adicionales} onChange={handleInputChange} />
          <Input label="Código Tarifa" name="codigo_tarifa" value={formData.codigo_tarifa} onChange={handleInputChange} />
          <Input label="Ptar" name="ptar" value={formData.ptar} onChange={handleInputChange} />
          <Input label="Nombre Paquete Adquirido" name="nombre_paquete_adquirido" value={formData.nombre_paquete_adquirido} onChange={handleInputChange} />
          <Input label="Renta Mensual" name="renta_mensual" value={formData.renta_mensual} onChange={handleInputChange} type="number" />
          <Checkbox label="Todo Claro" name="todo_claro" checked={formData.todo_claro} onChange={handleInputChange} />
          <Input label="Persona recibe instalación" name="persona_recibe_instalacion" value={formData.persona_recibe_instalacion} onChange={handleInputChange} />
          <Input label="Fecha instalación" name="fecha_instalacion" value={formData.fecha_instalacion} onChange={handleInputChange} type="date" />
          <Select
            label="Franja instalación"
            name="franja_instalacion"
            value={formData.franja_instalacion}
            onChange={handleInputChange}
            options={[
              { value: "AM", label: "AM" },
              { value: "PM", label: "PM" },
            ]}
          />
          <Textarea label="Observación" name="observacion" value={formData.observacion} onChange={handleInputChange} />
          <Textarea label="Detalles" name="detalles" value={formData.detalles} onChange={handleInputChange} />
          {formData.link && (
            <div className="form-group">
              <label className="form-label-separated">Validación de Identidad</label>
              <img
                src={formData.link}
                alt="Validación de Identidad"
                className="img-fluid"
                style={{ maxWidth: '300px', maxHeight: '300px', display: 'block' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=Imagen+No+Disponible";
                }}
              />
              {/* Opcional: Permitir cambiar la imagen */}
              {/* <FileInput label="Reemplazar Validación de Identidad" name="link" onChange={handleInputChange} /> */}
            </div>
          )}

          {formData.link2 && (
            <div className="form-group">
              <label className="form-label-separated">Validación de Créditos</label>
              <img
                src={formData.link2}
                alt="Validación de Créditos"
                className="img-fluid"
                style={{ maxWidth: '300px', maxHeight: '300px', display: 'block' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=Imagen+No+Disponible";
                }}
              />
              {/* Opcional: Permitir cambiar la imagen */}
              {/* <FileInput label="Reemplazar Validación de Créditos" name="link2" onChange={handleInputChange} /> */}
            </div>
          )}

          {formData.link3 && formData.link3 !== "N/A" && (
            <div className="form-group">
              <label className="form-label-separated">Motivo no venta digital</label>
              <img
                src={formData.link3}
                alt="Motivo no venta digital"
                className="img-fluid"
                style={{ maxWidth: '300px', maxHeightdisplay: 'block' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=Imagen+No+Disponible";
                }}
              />
            </div>
          )}
          {formData.link3 === "N/A" && (
            <div className="form-group">
              <label className="form-label-separated">Motivo no venta digital</label>
              <p>N/A</p>
            </div>
          )}


          {formData.fecha_grabacion_contrato && (
            <Input label="Fecha Grabación Contrato" value={new Date(formData.fecha_grabacion_contrato).toLocaleString()} readOnly />
          )}
          {formData.cedula_asesor && <Input label="Cédula del Asesor" value={formData.cedula_asesor} readOnly />}
          {formData.nombre_asesor && <Input label="Nombre del Asesor" value={formData.nombre_asesor} readOnly />}
        </Card>

        <button type="submit" className="button primary">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditarVenta;